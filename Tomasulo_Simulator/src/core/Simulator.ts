

import type {
    Instruction,
    SimulatorSnapshot,
    Opcode,
} from "./types";
import { RS } from "./RS";
import { ROB } from "./ROB";
import { RegisterFile } from "./RegisterFile";
import { Memory } from "./Memory";
import { FU_CONFIG } from "./FunctionalUnit";

export class Simulator {
    program: Instruction[];
    pcToIndex: Map<number, number>;
    mem: Memory;
    rf: RegisterFile;
    rs: RS;
    rob: ROB;
    cycle: number;
    nextIssueIndex: number;
    completedCount: number;
    branchCount: number;
    mispredicts: number;
    regTag: Array<number | null>;
    instrStats: Map<number, {
        robIdx: number;
        instr: Instruction;
        issue: number | null;
        startExec: number | null;
        finishExec: number | null;
        write: number | null;
        commit: number | null;
    }>;
    latency: Record<string, number>;

    constructor(
        program: Instruction[],
        memoryInit: Record<number, number> = {},
        regsInit: number[] | null = null,
        robSize = 8
    ) {
        this.program = program.slice();
        this.pcToIndex = new Map<number, number>();
        this.program.forEach((ins, idx) => this.pcToIndex.set(ins.pc, idx));

        this.mem = new Memory(memoryInit);
        this.rf = new RegisterFile(regsInit ?? undefined);
        this.rs = new RS();
        this.rob = new ROB(robSize);

        this.cycle = 0;
        this.nextIssueIndex = 0;
        this.completedCount = 0;
        this.branchCount = 0;
        this.mispredicts = 0;

        this.regTag = new Array(8).fill(null);
        this.instrStats = new Map();

        this.latency = {};
        for (const k of Object.keys(FU_CONFIG)) {
            this.latency[k] = FU_CONFIG[k as Opcode].latency;
        }
    }

    private peekNextInstr(): Instruction | null {
        if (this.nextIssueIndex < 0 || this.nextIssueIndex >= this.program.length) return null;
        return this.program[this.nextIssueIndex];
    }


    private makeInstrStat(robIdx: number, instr: Instruction) {
        const stat = {
            robIdx,
            instr,
            issue: this.cycle + 1,
            startExec: null,
            finishExec: null,
            write: null,
            commit: null,
        };
        this.instrStats.set(instr.pc, stat);
        return stat;
    }


    issue(): void {
        const instr = this.peekNextInstr();
        if (!instr) return;

        const type = instr.type as Opcode;
        const rsType = type;

        const rsEntry = this.rs.findFreeFor(rsType);
        if (!rsEntry) return;

        if (this.rob.isFull()) return;

        let destReg: number | null = null;
        if (type === "STORE" || type === "BEQ" || type === "RET") destReg = null;
        else if (type === "CALL") destReg = 1;
        else destReg = (instr as any).rd ?? null;

        const robIdx = this.rob.allocate(instr, destReg, type, instr.pc);
        if (robIdx < 0) return;

        const robEntry = this.rob.get(robIdx);
        robEntry.timings.issue = this.cycle + 1;

        rsEntry.busy = true;
        rsEntry.instr = instr;
        rsEntry.dest = robIdx;
        rsEntry.issueCycle = this.cycle + 1;

        switch (type) {
            case "LOAD": {
                const base = (instr as any).rs as number;
                const offset = (instr as any).offset as number;

                if (this.regTag[base] !== null) {
                    rsEntry.Qj = this.regTag[base];
                    rsEntry.Vj = null;
                } else {
                    rsEntry.Vj = this.rf.read(base);
                    rsEntry.Qj = null;
                }
                rsEntry.Vk = offset;
                rsEntry.Qk = null;

                if (destReg !== null) this.regTag[destReg] = robIdx;
                this.makeInstrStat(robIdx, instr);
                break;
            }

            case "STORE": {
                const valReg = (instr as any).rsVal as number;
                const base = (instr as any).rb as number;
                const offset = (instr as any).offset as number;

                if (this.regTag[valReg] !== null) {
                    rsEntry.Qj = this.regTag[valReg];
                    rsEntry.Vj = null;
                } else {
                    rsEntry.Vj = this.rf.read(valReg);
                    rsEntry.Qj = null;
                }

                if (this.regTag[base] !== null) {
                    rsEntry.Qk = this.regTag[base];
                    rsEntry.Vk = null;
                } else {
                    rsEntry.Vk = this.rf.read(base);
                    rsEntry.Qk = null;
                }

                rsEntry.address = offset;
                this.makeInstrStat(robIdx, instr);
                break;
            }

            case "BEQ": {
                const ra = (instr as any).ra as number;
                const rb = (instr as any).rb as number;
                const offset = (instr as any).offset as number;

                if (this.regTag[ra] !== null) { rsEntry.Qj = this.regTag[ra]; rsEntry.Vj = null; }
                else { rsEntry.Vj = this.rf.read(ra); rsEntry.Qj = null; }

                if (this.regTag[rb] !== null) { rsEntry.Qk = this.regTag[rb]; rsEntry.Vk = null; }
                else { rsEntry.Vk = this.rf.read(rb); rsEntry.Qk = null; }

                rsEntry.address = offset;
                this.branchCount++;
                this.makeInstrStat(robIdx, instr);
                break;
            }

            case "CALL": {
                if (destReg !== null) this.regTag[destReg] = robIdx;
                this.makeInstrStat(robIdx, instr);
                break;
            }

            case "RET": {
                const base = 1;
                if (this.regTag[base] !== null) { rsEntry.Qj = this.regTag[base]; rsEntry.Vj = null; }
                else { rsEntry.Vj = this.rf.read(base); rsEntry.Qj = null; }
                this.makeInstrStat(robIdx, instr);
                break;
            }

            case "ADD":
            case "SUB":
            case "NAND":
            case "MUL": {
                const rb = (instr as any).rb as number;
                const rc = (instr as any).rc as number;

                if (this.regTag[rb] !== null) { rsEntry.Qj = this.regTag[rb]; rsEntry.Vj = null; }
                else { rsEntry.Vj = this.rf.read(rb); rsEntry.Qj = null; }

                if (this.regTag[rc] !== null) { rsEntry.Qk = this.regTag[rc]; rsEntry.Vk = null; }
                else { rsEntry.Vk = this.rf.read(rc); rsEntry.Qk = null; }

                if (destReg !== null) this.regTag[destReg] = robIdx;
                this.makeInstrStat(robIdx, instr);
                break;
            }

            default:
                throw new Error(`Unsupported opcode at issue: ${type}`);
        }

        this.nextIssueIndex++;
    }

    /* ------------------------
       EXECUTE stage
       ------------------------ */
    execute(): void {
        for (const e of this.rs.all()) {
            if (!e.busy) continue;
            if (e.execStarted && e.remaining <= 0) continue;

            const readyForStart = (() => {
                switch (e.type) {
                    case "LOAD":
                        return e.Qj === null;
                    case "STORE":
                        return e.Qj === null && e.Qk === null;
                    case "BEQ":
                        return e.Qj === null && e.Qk === null;
                    case "RET":
                        return e.Qj === null;
                    default:
                        return e.Qj === null && e.Qk === null;
                }
            })();

            if (!e.execStarted && readyForStart) {
                const lt = this.latency[e.type] ?? 1;
                e.remaining = lt;
                e.execStarted = true;
                e.startExecCycle = this.cycle + 1;

                const robEnt = this.rob.get(e.dest as number);
                if (robEnt) robEnt.timings.startExec = e.startExecCycle;

                if (e.type === "LOAD") {
                    const base = e.Vj ?? 0;
                    const offset = e.Vk ?? 0;
                    e.address = (base + offset) & 0xffff;
                } else if (e.type === "STORE") {
                    const base = e.Vk ?? 0;
                    const offset = e.address ?? 0;
                    e.address = (base + offset) & 0xffff;
                }
            }

            if (e.execStarted && e.remaining > 0) {
                e.remaining -= 1;
                if (e.remaining === 0) {
                    e.endExecCycle = this.cycle + 1;
                    const robEnt = this.rob.get(e.dest as number);
                    if (robEnt) robEnt.timings.finishExec = e.endExecCycle;
                }
            }
        }
    }

    /* ------------------------
       WRITE stage
       ------------------------ */
    write(): void {
        for (const e of this.rs.all()) {
            if (!e.busy) continue;
            if (!e.execStarted) continue;
            if (e.remaining !== 0) continue;
            if (e.wrote) continue;

            const instr = e.instr!;
            const robIdx = e.dest as number;

            let result: number | null = null;

            switch (e.type) {
                case "LOAD": {
                    const addr = e.address ?? 0;
                    result = this.mem.read(addr);
                    this.rob.markAddr(robIdx, addr);
                    break;
                }
                case "STORE": {
                    result = e.Vj ?? 0;
                    this.rob.markAddr(robIdx, e.address ?? 0);
                    break;
                }
                case "BEQ": {
                    const vj = (e.Vj ?? 0) & 0xffff;
                    const vk = (e.Vk ?? 0) & 0xffff;
                    result = vj === vk ? 1 : 0;
                    break;
                }
                case "CALL": {
                    result = ((instr.pc ?? 0) + 1) & 0xffff;
                    break;
                }
                case "RET": {
                    result = e.Vj ?? 0;
                    break;
                }
                case "ADD": {
                    result = ((e.Vj ?? 0) + (e.Vk ?? 0)) & 0xffff;
                    break;
                }
                case "SUB": {
                    result = ((e.Vj ?? 0) - (e.Vk ?? 0)) & 0xffff;
                    break;
                }
                case "NAND": {
                    result = (~((e.Vj ?? 0) & (e.Vk ?? 0))) & 0xffff;
                    break;
                }
                case "MUL": {
                    result = (((e.Vj ?? 0) & 0xffff) * ((e.Vk ?? 0) & 0xffff)) & 0xffff;
                    break;
                }
                default:
                    result = 0;
            }

            this.rob.setValue(robIdx, result as number);
            const robEnt = this.rob.get(robIdx);
            if (robEnt) robEnt.timings.write = this.cycle + 1;

            const s = this.instrStats.get(instr.pc);
            if (s) {
                s.startExec = e.startExecCycle;
                s.finishExec = e.endExecCycle;
                s.write = this.cycle + 1;
            }

            for (const other of this.rs.all()) {
                if (!other.busy) continue;
                if (other.Qj === robIdx) {
                    other.Vj = result;
                    other.Qj = null;
                }
                if (other.Qk === robIdx) {
                    other.Vk = result;
                    other.Qk = null;
                }
            }

            e.wrote = true;
            e.writeCycle = this.cycle + 1;

            // Free RS entry
            const originalType = e.type;
            Object.assign(e, {
                busy: false,
                type: originalType,
                instr: null,
                Vj: null,
                Vk: null,
                Qj: null,
                Qk: null,
                dest: null,
                address: null,
                remaining: 0,
                execStarted: false,
                wrote: false,
                issueCycle: null,
                startExecCycle: null,
                endExecCycle: null,
                writeCycle: null,
                commitCycle: null,
            });
        }
    }

    /* ------------------------
       COMMIT stage (with MISPREDICTION RECOVERY)
       ------------------------ */
    commit(): void {
        if (!this.rob.canCommit()) return;

        const headIdx = this.rob.head;
        const headEntry = this.rob.get(headIdx);

        const commitType = headEntry.type;
        const commitValue = headEntry.value;
        const commitDest = headEntry.destReg;
        const commitAddr = headEntry.addr;
        const commitInstr = headEntry.instr!;

        headEntry.timings.commit = this.cycle + 1;
        const stat = this.instrStats.get(commitInstr.pc);
        if (stat) stat.commit = this.cycle + 1;


        if (commitType === "BEQ") {

            const predictedPC = commitInstr.pc + 1;


            const offset = (commitInstr as any).offset as number;
            const actualPC = commitValue === 1
                ? commitInstr.pc + 1 + offset  // Taken
                : commitInstr.pc + 1;          // Not taken


            if (predictedPC !== actualPC) {
                // MISPREDICTION DETECTED!
                this.mispredicts++;

                // FLUSH PIPELINE:
                // 1. Flush all ROB entries after the branch (speculative instructions)
                this.flushROBAfterHead();

                // 2. Flush all RS entries (speculative instructions)
                this.flushAllRS();

                // 3. Redirect PC to correct path
                const targetIdx = this.pcToIndex.get(actualPC);
                this.nextIssueIndex = targetIdx ?? this.program.length;
            }
            // If prediction was correct, continue normally
        }

        else if (commitType === "STORE") {
            if (commitAddr !== null && commitValue !== null) {
                this.mem.write(commitAddr, commitValue);
            }
        } else if (commitType === "CALL") {
            if (commitDest !== null && commitValue !== null) {
                this.rf.write(commitDest, commitValue);
            }
            const label = (commitInstr as any).label as number;
            const idx = this.pcToIndex.get(label);
            if (idx !== undefined) this.nextIssueIndex = idx;
            else this.nextIssueIndex = this.program.length;
        } else if (commitType === "RET") {
            const targetPC = commitValue ?? 0;
            const idx = this.pcToIndex.get(targetPC);
            if (idx !== undefined) this.nextIssueIndex = idx;
            else this.nextIssueIndex = this.program.length;
        } else {
            // ALU/LOAD: write to register
            if (commitDest !== null && commitValue !== null) {
                this.rf.write(commitDest, commitValue);
            }
        }

        // Clear regTag entries pointing to this ROB index
        for (let r = 0; r < this.regTag.length; r++) {
            if (this.regTag[r] === headIdx) {
                this.regTag[r] = null;
            }
        }

        this.rob.commitOne();
        this.completedCount++;
    }


    private flushROBAfterHead(): void {
        // Clear all ROB entries after head (but not head itself)
        let idx = (this.rob.head + 1) % this.rob.size;
        const initialTail = this.rob.tail;

        while (idx !== initialTail) {
            const entry = this.rob.get(idx);
            if (entry.busy) {
                // Clear register tags for flushed instructions
                for (let r = 0; r < this.regTag.length; r++) {
                    if (this.regTag[r] === idx) {
                        this.regTag[r] = null;
                    }
                }

                // Clear the ROB entry
                entry.busy = false;
                entry.instr = null;
                entry.destReg = null;
                entry.value = null;
                entry.ready = false;
                entry.type = null;
                entry.pc = null;
                entry.addr = null;
                entry.timings = {
                    issue: null,
                    startExec: null,
                    finishExec: null,
                    write: null,
                    commit: null,
                };
            }
            idx = (idx + 1) % this.rob.size;
        }

        // Update tail to be right after head (all speculative entries flushed)
        this.rob.tail = (this.rob.head + 1) % this.rob.size;
        this.rob.count = 1; // Only head remains
    }

    private flushAllRS(): void {
        // Clear all reservation stations
        for (const e of this.rs.all()) {
            if (e.busy) {
                const originalType = e.type;
                Object.assign(e, {
                    busy: false,
                    type: originalType,
                    instr: null,
                    Vj: null,
                    Vk: null,
                    Qj: null,
                    Qk: null,
                    dest: null,
                    address: null,
                    remaining: 0,
                    execStarted: false,
                    wrote: false,
                    issueCycle: null,
                    startExecCycle: null,
                    endExecCycle: null,
                    writeCycle: null,
                    commitCycle: null,
                });
            }
        }
    }


    stepOneCycle(): void {
        this.issue();
        this.execute();
        this.write();
        this.commit();
        this.cycle++;
    }


    snapshot(): SimulatorSnapshot {
        return {
            cycle: this.cycle,
            registers: this.rf.dump(),
            memory: this.mem.dumpRelevant(),
            rob: this.rob.snapshot(),
            rs: this.rs.all().map((e) => ({ ...e })),
            nextIssueIndex: this.nextIssueIndex,
            completedCount: this.completedCount,
            branchCount: this.branchCount,
            mispredicts: this.mispredicts,
            instrStats: Array.from(this.instrStats.entries()).map(([pc, s]) => ({ pc, ...s })),
        };
    }
}
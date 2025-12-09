import type { ROBEntry, Instruction, ROBTiming, Opcode } from "./types";

export class ROB {
    entries: ROBEntry[];
    head = 0;
    tail = 0;
    count = 0;
    size: number;

    constructor(size = 8) {
        this.size = size;
        this.entries = Array.from({ length: size }, () => this.emptyEntry());
    }

    private emptyEntry(): ROBEntry {
        return {
            busy: false,
            instr: null,
            destReg: null,
            value: null,
            ready: false,
            type: null,
            pc: null,
            addr: null,
            timings: {
                issue: null,
                startExec: null,
                finishExec: null,
                write: null,
                commit: null,
            },
        };
    }

    isFull() {
        return this.count >= this.size;
    }

    allocate(instr: Instruction, destReg: number | null, type: Opcode, pc: number): number {
        if (this.isFull()) return -1;

        const idx = this.tail;
        const e = this.entries[idx];

        e.busy = true;
        e.instr = instr;
        e.destReg = destReg;
        e.value = null;
        e.ready = false;
        e.type = type;
        e.pc = pc;

        e.timings = {
            issue: null,
            startExec: null,
            finishExec: null,
            write: null,
            commit: null,
        };

        this.tail = (this.tail + 1) % this.size;
        this.count++;

        return idx;
    }

    get(i: number): ROBEntry {
        return this.entries[i];
    }

    setValue(i: number, v: number) {
        const e = this.entries[i];
        e.value = v & 0xffff;
        e.ready = true;
    }

    markAddr(i: number, a: number) {
        this.entries[i].addr = a;
    }

    canCommit(): boolean {
        const e = this.entries[this.head];
        return e.busy && e.ready;
    }

    commitOne(): ROBEntry | null {
        if (!this.canCommit()) return null;

        const idx = this.head;
        const e = this.entries[idx];
        const out = { ...e };

        this.entries[idx] = this.emptyEntry();

        this.head = (this.head + 1) % this.size;
        this.count--;

        return out;
    }

    snapshot(): ROBEntry[] {
        return this.entries.map((e) => ({ ...e }));
    }
}

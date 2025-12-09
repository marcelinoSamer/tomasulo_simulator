export type Opcode =
    | "LOAD"
    | "STORE"
    | "BEQ"
    | "CALL"
    | "RET"
    | "ADD"
    | "SUB"
    | "NAND"
    | "MUL";

export interface Instruction {
    pc: number;
    raw: string;
    type: Opcode;

    rd?: number;   // dest
    rs?: number;   // source 1
    rt?: number;   // source 2

    // for BEQ, LOAD, STORE
    offset?: number;

    // CALL
    label?: number;

    // STORE special fields
    rsVal?: number;
    rb?: number;
}

export interface ROBTiming {
    issue: number | null;
    startExec: number | null;
    finishExec: number | null;
    write: number | null;
    commit: number | null;
}

export interface ROBEntry {
    busy: boolean;
    instr: Instruction | null;
    destReg: number | null;
    value: number | null;
    ready: boolean;
    type: Opcode | null;
    pc: number | null;
    addr: number | null;
    timings: ROBTiming;
}

export interface RSEntry {
    busy: boolean;
    type: Opcode;
    instr: Instruction | null;

    Vj: number | null;
    Vk: number | null;
    Qj: number | null;
    Qk: number | null;

    dest: number | null;
    address: number | null;

    remaining: number;
    execStarted: boolean;
    wrote: boolean;
    pendingWrite: boolean;

    issueCycle: number | null;
    startExecCycle: number | null;
    endExecCycle: number | null;
    writeCycle: number | null;
    commitCycle: number | null;
}

export interface SimulatorSnapshot {
    cycle: number;
    registers: number[];
    memory: Record<number, number>;
    rob: ROBEntry[];
    rs: RSEntry[];
    nextIssueIndex: number;
    completedCount: number;
    branchCount: number;
    mispredicts: number;
    instrStats: any[];
}

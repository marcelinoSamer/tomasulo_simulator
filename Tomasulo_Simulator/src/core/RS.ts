import type { RSEntry, Opcode } from "./types";
import { FU_CONFIG } from "./FunctionalUnit";

export class RS {
    entries: RSEntry[] = [];

    constructor() {
        Object.keys(FU_CONFIG).forEach((type) => {
            const count = FU_CONFIG[type as Opcode].rsCount;
            for (let i = 0; i < count; i++) {
                this.entries.push(this.newEntry(type as Opcode));
            }
        });
    }

    private newEntry(type: Opcode): RSEntry {
        return {
            busy: false,
            type,
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
            pendingWrite: false,

            issueCycle: null,
            startExecCycle: null,
            endExecCycle: null,
            writeCycle: null,
            commitCycle: null,
        };
    }

    findFreeFor(type: Opcode): RSEntry | undefined {
        // Entry is free if not busy and has no pending write
        return this.entries.find((e) => !e.busy && !e.pendingWrite && e.type === type);
    }

    all(): RSEntry[] {
        return this.entries;
    }
}

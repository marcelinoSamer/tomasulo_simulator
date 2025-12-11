
export class Memory {
    static readonly MAX_SIZE = 128 * 1024; // 128KB
    mem: Map<number, number>;

    constructor(init: Record<number, number> = {}) {
        this.mem = new Map();
        for (const [k, v] of Object.entries(init)) {
            const addr = parseInt(k);
            if (!Memory.isValidAddress(addr)) throw new Error(`Memory address out of bounds: ${addr}`);
            this.mem.set(addr, v & 0xffff);
        }
    }

    static isValidAddress(addr: number): boolean {
        return addr >= 0 && addr < Memory.MAX_SIZE;
    }

    read(addr: number): number {
        if (!Memory.isValidAddress(addr)) throw new Error(`Read out of bounds: ${addr}`);
        return this.mem.get(addr) ?? 0;
    }

    write(addr: number, value: number) {
        if (!Memory.isValidAddress(addr)) throw new Error(`Write out of bounds: ${addr}`);
        this.mem.set(addr, value & 0xffff);
    }

    delete(addr: number) {
        if (!Memory.isValidAddress(addr)) throw new Error(`Delete out of bounds: ${addr}`);
        this.mem.delete(addr);
    }

    clear() {
        this.mem.clear();
    }

    dumpRelevant(): Record<number, number> {
        const out: Record<number, number> = {};
        for (const [k, v] of this.mem.entries()) out[k] = v;
        return out;
    }
}
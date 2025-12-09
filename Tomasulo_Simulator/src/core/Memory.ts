export class Memory {
    mem: Map<number, number>;

    constructor(init: Record<number, number> = {}) {
        this.mem = new Map();
        for (const [k, v] of Object.entries(init)) {
            this.mem.set(parseInt(k), v & 0xffff);
        }
    }

    read(addr: number): number {
        return this.mem.get(addr) ?? 0;
    }

    write(addr: number, value: number) {
        this.mem.set(addr, value & 0xffff);
    }

    delete(addr: number) {
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

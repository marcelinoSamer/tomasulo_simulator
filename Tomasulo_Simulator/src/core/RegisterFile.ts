export class RegisterFile {
    regs: number[];

    constructor(init?: number[]) {
        this.regs = new Array(8).fill(0);
        if (init) {
            for (let i = 0; i < 8; i++) this.regs[i] = init[i] ?? 0;
        }
    }

    read(r: number): number {
        return this.regs[r] & 0xffff;
    }

    write(r: number, v: number) {
        if (r === 0) return; // R0 is constant 0
        this.regs[r] = v & 0xffff;
    }

    dump() {
        return [...this.regs];
    }
}

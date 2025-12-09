import type { Instruction } from "./types";

export function parseAssembly(lines: string[], startPC = 0): Instruction[] {
    const insts: Instruction[] = [];
    let pc = startPC;

    const clean = (s: string) => s.trim().replace(/\s+/g, " ");
    const reg = (r: string) => parseInt(r.toLowerCase().replace("r", ""));

    for (const rawLine of lines) {
        const line = rawLine.split("//")[0].trim();
        if (!line) continue;

        const txt = clean(line);
        const tok = txt.split(/[ ,()]+/).filter(Boolean);
        const op = tok[0].toUpperCase();

        let instr: Instruction = { pc, raw: txt, type: op as any };

        switch (op) {
            case "LOAD": {
                instr = {
                    ...instr,
                    rd: reg(tok[1]),
                    offset: parseInt(tok[2]),
                    rs: reg(tok[3]),
                };
                break;
            }
            case "STORE": {
                instr = {
                    ...instr,
                    rsVal: reg(tok[1]),
                    offset: parseInt(tok[2]),
                    rb: reg(tok[3]),
                };
                break;
            }
            case "BEQ": {
                instr = {
                    ...instr,
                    ra: reg(tok[1]),
                    rb: reg(tok[2]),
                    offset: parseInt(tok[3]),
                } as any;
                break;
            }
            case "CALL": {
                instr = { ...instr, label: parseInt(tok[1]) };
                break;
            }
            case "RET": {
                break;
            }
            case "ADD":
            case "SUB":
            case "NAND":
            case "MUL": {
                instr = {
                    ...instr,
                    rd: reg(tok[1]),
                    rb: reg(tok[2]),
                    rc: reg(tok[3]),
                } as any;
                break;
            }
            default:
                throw new Error(`Unknown opcode: ${op}`);
        }

        insts.push(instr);
        pc++;
    }

    return insts;
}

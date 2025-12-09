import type { Instruction } from "./types";

export function parseAssembly(lines: string[], startPC = 0): Instruction[] {
    const insts: Instruction[] = [];
    const labels: Map<string, number> = new Map();
    let pc = startPC;

    const clean = (s: string) => s.trim().replace(/\s+/g, " ");
    const reg = (r: string) => parseInt(r.toLowerCase().replace("r", ""));

    // First pass: collect all labels and their PC addresses
    pc = startPC;
    const cleanedLines: { line: string; originalLine: string }[] = [];
    
    for (const rawLine of lines) {
        let line = rawLine.split("//")[0].trim();
        if (!line) continue;

        // Check for label definition (ends with colon)
        const labelMatch = line.match(/^(\w+):\s*(.*)/);
        if (labelMatch) {
            const labelName = labelMatch[1];
            labels.set(labelName, pc);
            line = labelMatch[2].trim(); // Rest of line after label
            if (!line) continue; // Label on its own line
        }

        if (line) {
            cleanedLines.push({ line: clean(line), originalLine: rawLine });
            pc++;
        }
    }

    // Second pass: parse instructions with label resolution
    pc = startPC;
    for (const { line: txt } of cleanedLines) {
        const tok = txt.split(/[ ,()]+/).filter(Boolean);
        const op = tok[0].toUpperCase();

        let instr: Instruction = { pc, raw: txt, type: op as any };

        switch (op) {
            case "LOAD": {
                // LOAD Rd, offset(Rs)
                instr = {
                    ...instr,
                    rd: reg(tok[1]),
                    offset: parseInt(tok[2]),
                    rs: reg(tok[3]),
                };
                break;
            }
            case "STORE": {
                // STORE Rs, offset(Rb)
                instr = {
                    ...instr,
                    rsVal: reg(tok[1]),
                    offset: parseInt(tok[2]),
                    rb: reg(tok[3]),
                };
                break;
            }
            case "BEQ": {
                // BEQ Ra, Rb, offset_or_label
                const target = tok[3];
                let offset: number;
                
                // Check if target is a label
                if (labels.has(target)) {
                    // Calculate relative offset from current PC
                    offset = labels.get(target)! - pc;
                } else {
                    // It's a numeric offset
                    offset = parseInt(target);
                }
                
                instr = {
                    ...instr,
                    ra: reg(tok[1]),
                    rb: reg(tok[2]),
                    offset: offset,
                } as any;
                break;
            }
            case "CALL": {
                // CALL label_or_address
                const target = tok[1];
                let address: number;
                
                if (labels.has(target)) {
                    address = labels.get(target)!;
                } else {
                    address = parseInt(target);
                }
                
                instr = { ...instr, label: address };
                break;
            }
            case "RET": {
                break;
            }
            case "ADD":
            case "SUB":
            case "NAND":
            case "MUL": {
                // OP Rd, Rb, Rc
                instr = {
                    ...instr,
                    rd: reg(tok[1]),
                    rb: reg(tok[2]),
                    rc: reg(tok[3]),
                } as any;
                break;
            }
            case "ADDI": {
                // ADDI Rd, Rs, immediate - Add immediate value
                instr = {
                    ...instr,
                    type: "ADD" as any,
                    rd: reg(tok[1]),
                    rb: reg(tok[2]),
                    rc: parseInt(tok[3]), // Immediate value stored in rc
                } as any;
                break;
            }
            case "NOP": {
                // NOP - No operation, skip this instruction
                pc++;
                continue;
            }
            case "J":
            case "JMP":
            case "JUMP": {
                // Unconditional jump - implement as BEQ R0, R0, target
                const target = tok[1];
                let offset: number;
                
                if (labels.has(target)) {
                    offset = labels.get(target)! - pc;
                } else {
                    offset = parseInt(target);
                }
                
                instr = {
                    pc,
                    raw: txt,
                    type: "BEQ" as any,
                    ra: 0,
                    rb: 0,
                    offset: offset,
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

/**
 * Parse assembly from a single string (file contents or textarea)
 */
export function parseAssemblyFromText(text: string, startPC = 0): Instruction[] {
    const lines = text.split(/\r?\n/);
    return parseAssembly(lines, startPC);
}

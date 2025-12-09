import * as fs from 'fs';
import * as path from 'path';
import { Simulator } from '../../src/core/Simulator';
import { parseAssembly } from '../../src/core/parseAssembly';
import type { Instruction, SimulatorSnapshot } from '../../src/core/types';

/**
 * Load an assembly file from the fixtures directory
 */
export function loadAssemblyFile(filename: string): string[] {
    const fixturePath = path.join(__dirname, '../fixtures', filename);
    const content = fs.readFileSync(fixturePath, 'utf-8');
    return content.split('\n');
}

/**
 * Initialize a simulator from an assembly file with optional memory/register init
 */
export function initSimulatorFromFile(
    filename: string,
    memoryInit: Record<number, number> = {},
    regsInit: number[] | null = null,
    robSize = 8
): { sim: Simulator; program: Instruction[] } {
    const lines = loadAssemblyFile(filename);
    const program = parseAssembly(lines);
    const sim = new Simulator(program, memoryInit, regsInit, robSize);
    return { sim, program };
}

/**
 * Run simulator to a specific cycle, collecting snapshots along the way
 */
export function runToCycle(
    sim: Simulator,
    targetCycle: number
): SimulatorSnapshot[] {
    const snapshots: SimulatorSnapshot[] = [];
    while (sim.cycle < targetCycle && !sim.isFinished()) {
        sim.stepOneCycle();
        snapshots.push(sim.snapshot());
    }
    return snapshots;
}

/**
 * Run simulator until completion, return all snapshots and final state
 */
export function runToEnd(
    sim: Simulator,
    maxCycles = 1000
): { snapshots: SimulatorSnapshot[]; finalSnapshot: SimulatorSnapshot } {
    const snapshots: SimulatorSnapshot[] = [];
    while (!sim.isFinished() && sim.cycle < maxCycles) {
        sim.stepOneCycle();
        snapshots.push(sim.snapshot());
    }
    return {
        snapshots,
        finalSnapshot: sim.snapshot(),
    };
}

/**
 * Get instruction stats from snapshot (for timeline verification)
 */
export function getInstrStats(snapshot: SimulatorSnapshot) {
    return snapshot.instrStats;
}

/**
 * Check if all instructions have completed all pipeline stages
 */
export function allInstructionsCommitted(snapshot: SimulatorSnapshot): boolean {
    return snapshot.instrStats.every(
        (stat) => stat.commit !== null
    );
}

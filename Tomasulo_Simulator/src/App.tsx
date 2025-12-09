import { useState } from "react";
import { Simulator } from "./core/Simulator";
import { parseAssembly } from "./core/parseAssembly";

import InstructionEditor from "./components/InstructionEditor";
import MemoryEditor from "./components/MemoryEditor";
import CycleControls from "./components/CycleControls";
import ROBTable from "./components/ROBTable";
import RSTable from "./components/RSTable";
import RegisterFileTable from "./components/RegisterFileTable";
import MemoryTable from "./components/MemoryTable";
import InstructionTimeline from "./components/InstructionTimeline";

export default function App() {
  const [sim, setSim] = useState<Simulator | null>(null);
  const [snapshot, setSnapshot] = useState<any>(null);

  function loadProgram(text: string) {
    const program = parseAssembly(text.split("\n"));  // ← FIXED
    const newSim = new Simulator(program);
    setSim(newSim);
    setSnapshot(newSim.snapshot());
  }


  function loadMemory(obj: Record<number, number>) {
    if (!sim) return;
    Object.entries(obj).forEach(([addr, val]) => {
      sim.mem.write(Number(addr), Number(val));
    });
    setSnapshot(sim.snapshot());
  }

  function step() {
    if (!sim) return;
    sim.stepOneCycle();
    setSnapshot(sim.snapshot());
  }

  function reset() {
    if (!sim) return;

    const text = sim.program.map(i => i.raw).join("\n");

    // FIX: split into lines
    const newSim = new Simulator(parseAssembly(text.split("\n")));

    setSim(newSim);
    setSnapshot(newSim.snapshot());
  }


  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-400 text-center mb-8">
          Tomasulo Simulator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InstructionEditor onLoad={loadProgram} />
          <MemoryEditor onAdd={loadMemory} />
        </div>

        <CycleControls onStep={step} onReset={reset} />

        {snapshot && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ROBTable snapshot={snapshot} />
              <RSTable snapshot={snapshot} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegisterFileTable snapshot={snapshot} />
              <MemoryTable snapshot={snapshot} />
            </div>
            <InstructionTimeline snapshot={snapshot} />
          </div>
        )}
      </div>
    </div>
  );
}

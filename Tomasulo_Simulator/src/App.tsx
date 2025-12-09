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
    <div style={{ padding: "20px" }}>
      <h1>Tomasulo Simulator</h1>

      <InstructionEditor onLoad={loadProgram} />
      <MemoryEditor onAdd={loadMemory} />
      <CycleControls onStep={step} onReset={reset} />

      {snapshot && (
        <>
          <ROBTable snapshot={snapshot} />
          <RSTable snapshot={snapshot} />
          <RegisterFileTable snapshot={snapshot} />
          <MemoryTable snapshot={snapshot} />
          <InstructionTimeline snapshot={snapshot} />
        </>
      )}
    </div>
  );
}

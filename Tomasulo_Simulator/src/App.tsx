import { useState, useRef, useCallback, useEffect } from "react";
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
import PerformanceMetrics from "./components/PerformanceMetrics";

export default function App() {
  const [sim, setSim] = useState<Simulator | null>(null);
  const [snapshot, setSnapshot] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  function loadProgram(text: string) {
    const program = parseAssembly(text.split("\n"));
    const newSim = new Simulator(program);
    setSim(newSim);
    setSnapshot(newSim.snapshot());
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function loadMemory(obj: Record<number, number>) {
    if (!sim) return;
    Object.entries(obj).forEach(([addr, val]) => {
      sim.mem.write(Number(addr), Number(val));
    });
    setSnapshot(sim.snapshot());
  }

  function step() {
    if (!sim || sim.isFinished()) return;
    sim.stepOneCycle();
    setSnapshot(sim.snapshot());
  }

  function reset() {
    if (!sim) return;
    stopAutoRun();
    const text = sim.program.map(i => i.raw).join("\n");
    const newSim = new Simulator(parseAssembly(text.split("\n")));
    setSim(newSim);
    setSnapshot(newSim.snapshot());
  }

  function runToEnd() {
    if (!sim) return;
    // Run up to 10000 cycles to prevent infinite loops
    let maxCycles = 10000;
    while (!sim.isFinished() && maxCycles > 0) {
      sim.stepOneCycle();
      maxCycles--;
    }
    setSnapshot(sim.snapshot());
  }

  const startAutoRun = useCallback(() => {
    if (!sim || sim.isFinished()) return;
    setIsRunning(true);
    intervalRef.current = window.setInterval(() => {
      if (sim.isFinished()) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
        setSnapshot(sim.snapshot());
        return;
      }
      sim.stepOneCycle();
      setSnapshot(sim.snapshot());
    }, 1000); // 1 second per cycle
  }, [sim]);

  const stopAutoRun = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const isFinished = sim?.isFinished() ?? false;


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

        <CycleControls 
          onStep={step} 
          onReset={reset} 
          onRunToEnd={runToEnd}
          isFinished={isFinished}
          isRunning={isRunning}
          onStartAutoRun={startAutoRun}
          onStopAutoRun={stopAutoRun}
        />

        {snapshot && (
          <div className="mt-8 space-y-6">
            <PerformanceMetrics snapshot={snapshot} />
            
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

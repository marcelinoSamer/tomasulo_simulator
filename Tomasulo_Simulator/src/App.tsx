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
  const [memoryError, setMemoryError] = useState<string | null>(null);
  const [simError, setSimError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  function loadProgram(text: string) {
    const program = parseAssembly(text.split("\n"));
    // Preserve memory when loading a new program
    const memorySnapshot = sim ? sim.mem.dumpRelevant() : {};
    const newSim = new Simulator(program, memorySnapshot);
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
    try {
      Object.entries(obj).forEach(([addr, val]) => {
        sim.mem.write(Number(addr), Number(val));
      });
      setSnapshot(sim.snapshot());
      setMemoryError(null);
    } catch (e: any) {
      setMemoryError(e.message || "Memory operation failed");
    }
  }

  function deleteMemory(addr: number) {
    if (!sim) return;
    sim.mem.delete(addr);
    setSnapshot(sim.snapshot());
  }

  function clearMemory() {
    if (!sim) return;
    sim.mem.clear();
    setSnapshot(sim.snapshot());
  }

  function step() {
    if (!sim || sim.isFinished()) return;
    try {
      sim.stepOneCycle();
      setSnapshot(sim.snapshot());
      setSimError(null);
    } catch (e: any) {
      setSimError(e.message || "Simulation error");
      stopAutoRun();
    }
  }

  function reset() {
    if (!sim) return;
    stopAutoRun();
    const text = sim.program.map(i => i.raw).join("\n");
    // Preserve memory across reset
    const memorySnapshot = sim.mem.dumpRelevant();
    const newSim = new Simulator(parseAssembly(text.split("\n")), memorySnapshot);
    setSim(newSim);
    setSnapshot(newSim.snapshot());
    setSimError(null);
    setMemoryError(null);
  }

  function runToEnd() {
    if (!sim) return;
    try {
      // Run up to 10000 cycles to prevent infinite loops
      let maxCycles = 10000;
      while (!sim.isFinished() && maxCycles > 0) {
        sim.stepOneCycle();
        maxCycles--;
      }
      setSnapshot(sim.snapshot());
      setSimError(null);
    } catch (e: any) {
      setSimError(e.message || "Simulation error");
      setSnapshot(sim.snapshot());
    }
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
          <MemoryEditor
            onAdd={loadMemory}
            error={memoryError}
            clearError={() => setMemoryError(null)}
          />
        </div>

        {simError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm font-medium">⚠ Simulation Error: {simError}</p>
          </div>
        )}

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
            <InstructionTimeline snapshot={snapshot} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ROBTable snapshot={snapshot} />
              <RSTable snapshot={snapshot} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegisterFileTable snapshot={snapshot} />
              <MemoryTable snapshot={snapshot} onDelete={deleteMemory} onDeleteAll={clearMemory} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

import { Card } from "./Card";
import type { SimulatorSnapshot } from "../core/types";

interface MetricItemProps {
    label: string;
    value: string | number;
    color?: string;
}

function MetricItem({ label, value, color = "text-yellow-400" }: MetricItemProps) {
    return (
        <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg">
            <span className="text-gray-400 text-sm mb-1">{label}</span>
            <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
        </div>
    );
}

export default function PerformanceMetrics({ snapshot }: { snapshot: SimulatorSnapshot }) {
    const { cycle, completedCount, branchCount, mispredicts } = snapshot;
    
    // Calculate metrics
    const totalCycles = cycle;
    const ipc = totalCycles > 0 ? (completedCount / totalCycles).toFixed(3) : "0.000";
    const avgCyclesPerInstr = completedCount > 0 ? (totalCycles / completedCount).toFixed(3) : "—";
    
    // Branch prediction metrics
    const correctPredictions = branchCount - mispredicts;
    const branchAccuracy = branchCount > 0 
        ? ((correctPredictions / branchCount) * 100).toFixed(1) + "%" 
        : "—";
    const mispredictionRate = branchCount > 0 
        ? ((mispredicts / branchCount) * 100).toFixed(1) + "%" 
        : "—";

    return (
        <Card title="Performance Metrics">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricItem 
                    label="Total Cycles" 
                    value={totalCycles} 
                    color="text-purple-400" 
                />
                <MetricItem 
                    label="Instructions Completed" 
                    value={completedCount} 
                    color="text-green-400" 
                />
                <MetricItem 
                    label="IPC" 
                    value={ipc} 
                    color="text-blue-400" 
                />
                <MetricItem 
                    label="Avg Cycles/Instr" 
                    value={avgCyclesPerInstr} 
                    color="text-orange-400" 
                />
                <MetricItem 
                    label="Branch Accuracy" 
                    value={branchAccuracy} 
                    color="text-green-400" 
                />
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-600 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Total Branches:</span>
                    <span className="text-gray-200 font-mono">{branchCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Correct Predictions:</span>
                    <span className="text-green-400 font-mono">{correctPredictions}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Mispredictions:</span>
                    <span className="text-red-400 font-mono">{mispredicts}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Misprediction Rate:</span>
                    <span className="text-red-400 font-mono">{mispredictionRate}</span>
                </div>
            </div>
        </Card>
    );
}

import type { SimulatorSnapshot } from "../core/types";
import { Card } from "./Card";

interface MemoryTableProps {
    snapshot: SimulatorSnapshot;
    onDelete?: (addr: number) => void;
    onDeleteAll?: () => void;
}

export default function MemoryTable({ snapshot, onDelete, onDeleteAll }: MemoryTableProps) {
    const entries = Object.entries(snapshot.memory);
    
    return (
        <Card title="Memory">
            <div className="overflow-x-auto">
                {entries.length === 0 ? (
                    <p className="text-gray-500 italic">No memory values set</p>
                ) : (
                    <>
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">Address</th>
                                    <th className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">Value</th>
                                    {onDelete && (
                                        <th className="border border-gray-600 px-3 py-2 text-center font-medium text-gray-300 w-16">Delete</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {entries.map(([addr, val]) => (
                                    <tr key={addr} className="odd:bg-gray-800 even:bg-gray-750 hover:bg-gray-700 transition-colors">
                                        <td className="border border-gray-600 px-3 py-2 text-blue-400 font-mono">{addr}</td>
                                        <td className="border border-gray-600 px-3 py-2 text-yellow-400 font-mono">{val as number}</td>
                                        {onDelete && (
                                            <td className="border border-gray-600 px-3 py-2 text-center">
                                                <button
                                                    onClick={() => onDelete(Number(addr))}
                                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                                    title="Delete this memory entry"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {onDeleteAll && (
                            <button
                                onClick={onDeleteAll}
                                className="mt-3 w-full px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                🗑 Clear All Memory
                            </button>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
}

import type { SimulatorSnapshot } from "../core/types";
import { Card } from "./Card";

export default function MemoryTable({ snapshot }: { snapshot: SimulatorSnapshot }) {
    const entries = Object.entries(snapshot.memory);
    
    return (
        <Card title="Memory">
            <div className="overflow-x-auto">
                {entries.length === 0 ? (
                    <p className="text-gray-500 italic">No memory values set</p>
                ) : (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">Address</th>
                                <th className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">Value</th>
                            </tr>
                        </thead>

                        <tbody>
                            {entries.map(([addr, val]) => (
                                <tr key={addr} className="odd:bg-gray-800 even:bg-gray-750 hover:bg-gray-700 transition-colors">
                                    <td className="border border-gray-600 px-3 py-2 text-blue-400 font-mono">{addr}</td>
                                    <td className="border border-gray-600 px-3 py-2 text-yellow-400 font-mono">{val as number}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}

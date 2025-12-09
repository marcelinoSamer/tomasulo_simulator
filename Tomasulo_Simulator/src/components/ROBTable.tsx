import { Card } from "./Card";
import type { SimulatorSnapshot } from "../core/types";

export default function ROBTable({ snapshot }: { snapshot: SimulatorSnapshot }) {
    return (
        <Card title="Reorder Buffer (ROB)">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-700">
                            {["#", "Busy", "Type", "Dest", "Value", "Ready", "Addr"]
                                .map(h => (
                                    <th key={h} className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">{h}</th>
                                ))}
                        </tr>
                    </thead>

                    <tbody>
                        {snapshot.rob.map((e, i) => (
                            <tr key={i} className="odd:bg-gray-800 even:bg-gray-750 hover:bg-gray-700 transition-colors">
                                <td className="border border-gray-600 px-3 py-2 text-purple-400 font-mono">{i}</td>
                                <td className="border border-gray-600 px-3 py-2">{e.busy ? <span className="text-green-400">✔</span> : <span className="text-gray-500">—</span>}</td>
                                <td className="border border-gray-600 px-3 py-2 font-mono">{e.type}</td>
                                <td className="border border-gray-600 px-3 py-2 text-blue-400">{e.destReg ?? "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-yellow-400 font-mono">{e.value ?? "-"}</td>
                                <td className="border border-gray-600 px-3 py-2">{e.ready ? <span className="text-green-400">✔</span> : <span className="text-gray-500">—</span>}</td>
                                <td className="border border-gray-600 px-3 py-2 font-mono">{e.addr ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

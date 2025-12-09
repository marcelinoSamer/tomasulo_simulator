import type { SimulatorSnapshot } from "../core/types";
import { Card } from "./Card";

export default function RSTable({ snapshot }: { snapshot: SimulatorSnapshot }) {
    return (
        <Card title="Reservation Stations">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-700">
                            {["Type", "Busy", "Vj", "Vk", "Qj", "Qk", "Dest", "Rem"].map(h => (
                                <th key={h} className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">{h}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {snapshot.rs.map((e, i) => (
                            <tr key={i} className="odd:bg-gray-800 even:bg-gray-750 hover:bg-gray-700 transition-colors">
                                <td className="border border-gray-600 px-3 py-2 font-mono text-purple-400">{e.type}</td>
                                <td className="border border-gray-600 px-3 py-2">{e.busy ? <span className="text-green-400">✔</span> : <span className="text-gray-500">—</span>}</td>
                                <td className="border border-gray-600 px-3 py-2 text-yellow-400 font-mono">{e.Vj ?? "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-yellow-400 font-mono">{e.Vk ?? "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-blue-400 font-mono">{e.Qj !== null ? e.Qj + 1 : "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-blue-400 font-mono">{e.Qk !== null ? e.Qk + 1 : "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-blue-400 font-mono">{e.dest !== null ? e.dest + 1 : "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-orange-400 font-mono">{e.remaining ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

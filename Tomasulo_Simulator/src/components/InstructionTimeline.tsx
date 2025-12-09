import { Card } from "./Card";

export default function InstructionTimeline({ snapshot }: any) {
    return (
        <Card title="Instruction Timeline">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-700">
                            {["PC", "Instruction", "Issue", "Execute", "ExecEnd", "Write", "Commit"].map(h => (
                                <th key={h} className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">{h}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {snapshot.instrStats.map((s: any, i: number) => (
                            <tr key={i} className="odd:bg-gray-800 even:bg-gray-750 hover:bg-gray-700 transition-colors">
                                <td className="border border-gray-600 px-3 py-2 text-purple-400 font-mono">{s.pc}</td>
                                <td className="border border-gray-600 px-3 py-2 text-gray-200 font-mono text-xs">{s.raw || s.instr?.type || "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-green-400 font-mono">{s.issue ?? "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-blue-400 font-mono">{s.startExec ?? "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-blue-400 font-mono">{s.finishExec ?? "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-yellow-400 font-mono">{s.write ?? "-"}</td>
                                <td className="border border-gray-600 px-3 py-2 text-orange-400 font-mono">{s.commit ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

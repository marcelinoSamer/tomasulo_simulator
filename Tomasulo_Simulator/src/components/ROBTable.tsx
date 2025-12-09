import { Card } from "./Card";
import type { SimulatorSnapshot } from "../core/types";

export default function ROBTable({ snapshot }: { snapshot: SimulatorSnapshot }) {
    return (
        <Card title="Reorder Buffer (ROB)">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-150">
                    <tr>
                        {["#", "Busy", "Type", "Dest", "Value", "Ready", "Addr"]
                            .map(h => (
                                <th key={h} className="border px-3 py-2 text-left font-medium">{h}</th>
                            ))}
                    </tr>
                </thead>

                <tbody>
                    {snapshot.rob.map((e, i) => (
                        <tr key={i} className="odd:bg-dark even:bg-gray-150">
                            <td className="border px-3 py-2">{i}</td>
                            <td className="border px-3 py-2">{e.busy ? "✔" : "—"}</td>
                            <td className="border px-3 py-2">{e.type}</td>
                            <td className="border px-3 py-2">{e.destReg ?? "-"}</td>
                            <td className="border px-3 py-2">{e.value ?? "-"}</td>
                            <td className="border px-3 py-2">{e.ready ? "✔" : "—"}</td>
                            <td className="border px-3 py-2">{e.addr ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}

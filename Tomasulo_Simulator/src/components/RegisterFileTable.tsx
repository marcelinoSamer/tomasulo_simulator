import { Card } from "./Card";

export default function RegisterFileTable({ snapshot }: any) {
    return (
        <Card title="Register File">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">Reg</th>
                            <th className="border border-gray-600 px-3 py-2 text-left font-medium text-gray-300">Value</th>
                        </tr>
                    </thead>

                    <tbody>
                        {snapshot.registers.map((v: number, i: number) => (
                            <tr key={i} className="odd:bg-gray-800 even:bg-gray-750 hover:bg-gray-700 transition-colors">
                                <td className="border border-gray-600 px-3 py-2 text-blue-400 font-mono">{`R${i}`}</td>
                                <td className="border border-gray-600 px-3 py-2 text-yellow-400 font-mono">{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

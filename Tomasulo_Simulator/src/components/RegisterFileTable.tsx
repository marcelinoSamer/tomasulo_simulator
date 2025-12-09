import { Card } from "./Card";

export default function RegisterFileTable({ snapshot }: any) {
    return (
        <Card title="Register File">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-150">
                    <tr>
                        <th className="border px-3 py-2">Reg</th>
                        <th className="border px-3 py-2">Value</th>
                    </tr>
                </thead>

                <tbody>
                    {snapshot.registers.map((v: number, i: number) => (
                        <tr key={i} className="odd:bg-dark even:bg-gray-150">
                            <td className="border px-3 py-2">{`R${i}`}</td>
                            <td className="border px-3 py-2">{v}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}

import { useState } from "react";
import { Card } from "./Card";

export default function MemoryEditor({ onAdd }: {
    onAdd: (obj: Record<number, number>) => void;
}) {
    const [addr, setAddr] = useState("");
    const [value, setValue] = useState("");

    return (
        <Card title="Memory Initialization">
            <div className="flex gap-3 items-center">
                <input
                    placeholder="Address"
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-32"
                />

                <input
                    placeholder="Value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-32"
                />

                <button
                    onClick={() => onAdd({ [Number(addr)]: Number(value) })}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                >
                    Add
                </button>
            </div>
        </Card>
    );
}

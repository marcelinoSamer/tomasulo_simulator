import { useState } from "react";
import { Card } from "./Card";

export default function MemoryEditor({ onAdd }: {
    onAdd: (obj: Record<number, number>) => void;
}) {
    const [addr, setAddr] = useState("");
    const [value, setValue] = useState("");

    return (
        <Card title="Memory Initialization">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                    placeholder="Address"
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)}
                    className="bg-gray-700 text-gray-100 border border-gray-600 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <input
                    placeholder="Value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="bg-gray-700 text-gray-100 border border-gray-600 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                    onClick={() => {
                        onAdd({ [Number(addr)]: Number(value) });
                        setAddr("");
                        setValue("");
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors font-medium"
                >
                    Add
                </button>
            </div>
        </Card>
    );
}

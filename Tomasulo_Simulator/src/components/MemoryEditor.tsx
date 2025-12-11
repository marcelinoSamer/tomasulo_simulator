import { useState } from "react";
import { Card } from "./Card";
import { Memory } from "../core/Memory";

export default function MemoryEditor({ onAdd, error, clearError }: {
    onAdd: (obj: Record<number, number>) => void;
    error?: string | null;
    clearError?: () => void;
}) {
    const [addr, setAddr] = useState("");
    const [value, setValue] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const handleAdd = () => {
        const addrNum = Number(addr);
        const valNum = Number(value);

        // Validate address before adding
        if (isNaN(addrNum)) {
            setLocalError("Invalid address");
            return;
        }
        if (isNaN(valNum)) {
            setLocalError("Invalid value");
            return;
        }
        if (!Memory.isValidAddress(addrNum)) {
            setLocalError(`Address exceeds memory size (max: ${Memory.MAX_SIZE - 1})`);
            return;
        }

        setLocalError(null);
        if (clearError) clearError();
        onAdd({ [addrNum]: valNum });
        setAddr("");
        setValue("");
    };

    const displayError = localError || error;

    return (
        <Card title="Memory Initialization">
            <div className="space-y-3">
                <div className="flex gap-3">
                    <input
                        placeholder="Address"
                        value={addr}
                        onChange={(e) => {
                            setAddr(e.target.value);
                            setLocalError(null);
                            if (clearError) clearError();
                        }}
                        className="bg-gray-700 text-gray-100 border border-gray-600 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <input
                        placeholder="Value"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setLocalError(null);
                            if (clearError) clearError();
                        }}
                        className="bg-gray-700 text-gray-100 border border-gray-600 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {displayError && (
                    <p className="text-red-500 text-sm font-medium">{displayError}</p>
                )}

                <button
                    onClick={handleAdd}
                    className="w-full px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors font-medium"
                >
                    Add Memory Value
                </button>
            </div>
        </Card>
    );
}

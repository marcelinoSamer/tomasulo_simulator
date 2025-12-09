import { useState } from "react";
import { Card } from "./Card";

export default function InstructionEditor({ onLoad }: {
    onLoad: (text: string) => void;
}) {
    const [text, setText] = useState("");

    return (
        <Card title="Program">
            <textarea
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter assembly code here...&#10;e.g., LOAD R1, 0(R0)&#10;      ADD R2, R1, R1"
                className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />

            <button
                onClick={() => onLoad(text)}
                className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors font-medium"
            >
                Load Program
            </button>
        </Card>
    );
}

import { useState, useRef } from "react";
import { Card } from "./Card";

export default function InstructionEditor({ onLoad }: {
    onLoad: (text: string) => void;
}) {
    const [text, setText] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setText(content);
        };
        reader.readAsText(file);
        
        // Reset input so same file can be re-uploaded
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Card title="Program">
            <textarea
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Enter assembly code here (supports labels):
e.g., LOOP: LOAD R1, 0(R2)
            ADD R2, R2, R3
            BEQ R2, R4, LOOP
      
      CALL FUNC
      ...
      FUNC: ADD R1, R2, R3
            RET`}
                className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />

            <div className="mt-4 flex gap-3">
                <button
                    onClick={() => onLoad(text)}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors font-medium"
                >
                    Load Program
                </button>
                
                <label className="flex-1">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".asm,.s,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <span className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-500 transition-colors font-medium text-center cursor-pointer">
                        Upload File
                    </span>
                </label>
            </div>
        </Card>
    );
}

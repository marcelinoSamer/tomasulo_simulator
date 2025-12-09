import { useState } from "react";

export default function InstructionEditor({ onLoad }: {
    onLoad: (text: string) => void;
}) {
    const [text, setText] = useState("");

    return (
        <div>
            <h2>Program</h2>

            <textarea
                rows={8}
                cols={50}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <br />

            <button onClick={() => onLoad(text)}>Load Program</button>
        </div>
    );
}

import React from "react";

export default function InstructionTimeline({ snapshot }: any) {
    return (
        <div>
            <h2>Timeline</h2>

            <table>
                <thead>
                    <tr>
                        <th>PC</th>
                        <th>Issue</th>
                        <th>Start</th>
                        <th>Finish</th>
                        <th>Write</th>
                        <th>Commit</th>
                    </tr>
                </thead>

                <tbody>
                    {snapshot.instrStats.map((s: any, i: number) => (
                        <tr key={i}>
                            <td>{s.pc}</td>
                            <td>{s.issue ?? "-"}</td>
                            <td>{s.startExec ?? "-"}</td>
                            <td>{s.finishExec ?? "-"}</td>
                            <td>{s.write ?? "-"}</td>
                            <td>{s.commit ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

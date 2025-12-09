import React from "react";
import type { SimulatorSnapshot } from "../core/types";

export default function MemoryTable({ snapshot }: { snapshot: SimulatorSnapshot }) {
    return (
        <div>
            <h2>Memory</h2>

            <table>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Value</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(snapshot.memory).map(([addr, val]) => (
                        <tr key={addr}>
                            <td>{addr}</td>
                            <td>{val as number}</td>   {/* FIX */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

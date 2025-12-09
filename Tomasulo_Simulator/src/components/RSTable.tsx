import React from "react";
import type { SimulatorSnapshot } from "../core/types";

export default function RSTable({ snapshot }: { snapshot: SimulatorSnapshot }) {
    return (
        <div>
            <h2>Reservation Stations</h2>

            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Busy</th>
                        <th>Vj</th>
                        <th>Vk</th>
                        <th>Qj</th>
                        <th>Qk</th>
                        <th>Dest</th>
                        <th>Rem</th>
                    </tr>
                </thead>

                <tbody>
                    {snapshot.rs.map((e, i) => (
                        <tr key={i}>
                            <td>{e.type}</td>
                            <td>{e.busy ? 1 : 0}</td>
                            <td>{e.Vj ?? "-"}</td>
                            <td>{e.Vk ?? "-"}</td>
                            <td>{e.Qj ?? "-"}</td>
                            <td>{e.Qk ?? "-"}</td>
                            <td>{e.dest ?? "-"}</td>
                            <td>{e.remaining ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

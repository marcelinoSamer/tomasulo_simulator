// components/Card.tsx
import type { ReactNode } from "react";

interface CardProps {
    title: string;
    children: ReactNode;
}

export function Card({ title, children }: CardProps) {
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">{title}</h2>
            {children}
        </div>
    );
}

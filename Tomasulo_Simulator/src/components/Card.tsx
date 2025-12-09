// components/Card.tsx
import React from "react";

interface CardProps {
    title: string;
    children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
    return (
        <div className="bg-dark rounded-xl shadow p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    );
}

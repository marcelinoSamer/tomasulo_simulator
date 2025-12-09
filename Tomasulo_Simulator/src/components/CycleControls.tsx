import { useState, useEffect, useRef } from "react";

interface CycleControlsProps {
    onStep: () => void;
    onReset: () => void;
    onRunToEnd: () => void;
    isFinished: boolean;
    isRunning: boolean;
    onStartAutoRun: () => void;
    onStopAutoRun: () => void;
}

export default function CycleControls({ 
    onStep, 
    onReset, 
    onRunToEnd, 
    isFinished,
    isRunning,
    onStartAutoRun,
    onStopAutoRun
}: CycleControlsProps) {
    return (
        <div className="flex flex-wrap justify-center gap-4">
            <button
                onClick={onStep}
                disabled={isFinished || isRunning}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ▶ Next Cycle
            </button>

            <button
                onClick={onRunToEnd}
                disabled={isFinished || isRunning}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ⏩ Run to End
            </button>

            {!isRunning ? (
                <button
                    onClick={onStartAutoRun}
                    disabled={isFinished}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ⏯ Auto Run (1 Hz)
                </button>
            ) : (
                <button
                    onClick={onStopAutoRun}
                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700 transition-colors font-semibold animate-pulse"
                >
                    ⏸ Pause
                </button>
            )}

            <button
                onClick={() => {
                    onStopAutoRun();
                    onReset();
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors font-semibold"
            >
                ↺ Reset
            </button>

            {isFinished && (
                <span className="flex items-center px-4 py-2 bg-gray-700 text-green-400 rounded-lg font-semibold">
                    ✓ Complete
                </span>
            )}
        </div>
    );
}

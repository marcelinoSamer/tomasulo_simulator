export default function CycleControls({ onStep, onReset }: {
    onStep: () => void;
    onReset: () => void;
}) {
    return (
        <div className="flex justify-center gap-4">
            <button
                onClick={onStep}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
                ▶ Next Cycle
            </button>

            <button
                onClick={onReset}
                className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors font-semibold text-lg"
            >
                ↺ Reset
            </button>
        </div>
    );
}

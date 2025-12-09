export default function CycleControls({ onStep, onReset }: {
    onStep: () => void;
    onReset: () => void;
}) {
    return (
        <div className="mt-6 flex gap-4">
            <button
                onClick={onStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
                Next Cycle
            </button>

            <button
                onClick={onReset}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            >
                Reset
            </button>
        </div>
    );
}

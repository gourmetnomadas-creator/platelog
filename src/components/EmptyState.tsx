interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-6 py-12 text-center">
      <div className="mb-3 text-4xl">🍽️</div>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 active:bg-indigo-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

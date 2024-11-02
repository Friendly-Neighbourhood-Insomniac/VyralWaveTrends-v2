interface ErrorDisplayProps {
  error: string;
  className?: string;
}

export function ErrorDisplay({ error, className = '' }: ErrorDisplayProps) {
  return (
    <div className={`bg-dark-charcoal border border-red-900 text-red-400 px-6 py-4 rounded-lg ${className}`}>
      {error}
    </div>
  );
}
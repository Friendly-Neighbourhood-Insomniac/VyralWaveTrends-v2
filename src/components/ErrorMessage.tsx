interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="bg-dark-charcoal border border-red-900 text-red-400 px-6 py-4 rounded-lg">
      {message}
    </div>
  );
}
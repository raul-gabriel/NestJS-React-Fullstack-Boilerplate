type ErrorMessageProps = {
  message: string;
  className?: string;
};

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  return (
    <div
      className={`
        w-full rounded-xl
        border border-red-300
        bg-red-50
        px-5 py-4
        ${className}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="7" x2="12" y2="13" />
            <circle cx="12" cy="17" r="1" />
          </svg>
        </div>

        {/* Content */}
        <div>
          <p className="text-sm font-semibold text-red-800">
            Ocurrió un error
          </p>
          <p className="mt-1 text-sm text-red-700 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md text-center space-y-4 p-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Something went wrong
        </h1>

        <p className="text-sm text-gray-600">{error.message}</p>

        <button
          onClick={resetErrorBoundary}
          className="btn btn-secondary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

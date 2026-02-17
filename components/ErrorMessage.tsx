interface ErrorMessageProps {
  error: string;
  retry?: () => void;
}

export default function ErrorMessage({ error, retry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md w-full bg-red-500/10 border-2 border-red-500/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-300 mb-6">{error}</p>
        {retry && (
          <button
            onClick={retry}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

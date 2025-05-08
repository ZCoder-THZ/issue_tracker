export default function GlobalLoading() {
    return (
        <div
            role="status" // Added for accessibility
            aria-label="Loading content" // Added for accessibility
            className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <div className="flex flex-col items-center">

                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 dark:border-blue-400">

                </div>

                <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                    Loading...
                </p>
            </div>
        </div>
    );
}
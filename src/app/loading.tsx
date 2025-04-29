
export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}
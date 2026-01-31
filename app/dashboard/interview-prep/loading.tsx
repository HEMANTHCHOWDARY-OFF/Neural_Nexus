export default function InterviewPrepLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-4">
                    <div className="h-10 w-64 bg-muted/50 rounded-lg animate-pulse" />
                    <div className="h-6 w-96 bg-muted/30 rounded-lg animate-pulse" />
                </div>
                <div className="h-10 w-48 bg-muted/50 rounded-full animate-pulse" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-6 animate-pulse">
                        <div className="flex justify-between items-start">
                            <div className="h-12 w-12 rounded-xl bg-muted/50" />
                            <div className="h-6 w-20 rounded-full bg-muted/50" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-6 w-3/4 bg-muted/50 rounded" />
                            <div className="h-6 w-1/2 bg-muted/50 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-muted/30 rounded" />
                            <div className="h-4 w-full bg-muted/30 rounded" />
                            <div className="h-4 w-2/3 bg-muted/30 rounded" />
                        </div>
                        <div className="h-10 w-full bg-muted/50 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}

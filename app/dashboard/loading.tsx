export default function DashboardLoading() {
    return (
        <div className="flex h-full w-full items-center justify-center min-h-[500px]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-t-primary animate-spin" />
                </div>
                <p className="text-muted-foreground animate-pulse font-medium">Loading Dashboard...</p>
            </div>
        </div>
    );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section Skeleton */}
            <div className="relative h-screen w-full bg-gradient-to-b from-amber-900/20 to-amber-800/10 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="h-16 w-64 mx-auto bg-amber-200/30 rounded-lg" />
                        <div className="h-8 w-48 mx-auto bg-amber-200/20 rounded-lg" />
                    </div>
                </div>
                {/* Bottom buttons skeleton */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6">
                    <div className="flex space-x-4">
                        <div className="h-12 w-32 bg-white/20 rounded-lg" />
                        <div className="h-12 w-36 bg-amber-600/30 rounded-lg" />
                    </div>
                    <div className="flex space-x-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-6 w-6 bg-white/30 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

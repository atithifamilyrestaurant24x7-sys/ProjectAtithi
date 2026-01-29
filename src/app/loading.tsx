import Image from 'next/image';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500">
            <div className="relative flex flex-col items-center justify-center">
                {/* Spinning External Ring */}
                <div className="absolute h-40 w-40 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-amber-500/30 border-l-transparent animate-[spin_3s_linear_infinite]" />

                {/* Inner Spinning Ring (Reverse) */}
                <div className="absolute h-32 w-32 rounded-full border-2 border-b-amber-300 border-t-transparent border-l-transparent border-r-transparent animate-[spin_2s_linear_infinite_reverse]" />

                {/* Logo/Icon with Pulse */}
                <div className="relative h-20 w-20 animate-in fade-in zoom-in duration-1000">
                    <Image
                        src="/icons/icon-192x192.png"
                        alt="Atithi Loading"
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                        priority
                    />
                </div>

                {/* Text Fade In */}
                <div className="mt-12 text-center space-y-2 animate-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-forwards opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <h2 className="text-2xl font-bold text-amber-500 tracking-[0.2em] font-serif">ATITHI</h2>
                    <p className="text-xs text-amber-200/60 uppercase tracking-widest">Premium Dining</p>
                </div>
            </div>
        </div>
    );
}

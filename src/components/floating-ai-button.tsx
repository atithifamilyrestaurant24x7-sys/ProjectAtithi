"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileAISheet from "@/components/mobile-ai-sheet";

import { type MenuItem } from "@/lib/menu";

interface FloatingAIButtonProps {
    onAddToCart?: (items: MenuItem[]) => void;
}

export default function FloatingAIButton({ onAddToCart }: FloatingAIButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "md:hidden fixed z-50 right-4 bottom-20",
                    "w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-amber-500 to-orange-600",
                    "flex items-center justify-center",
                    "shadow-lg shadow-amber-500/30",
                    "transition-all duration-300",
                    "hover:scale-110 active:scale-95"
                )}
                aria-label="AI Assistant"
            >
                <Sparkles className="w-6 h-6 text-white" />
            </button>

            {/* AI Sheet */}
            <MobileAISheet isOpen={isOpen} onClose={() => setIsOpen(false)} onAddToCart={onAddToCart} />
        </>
    );
}

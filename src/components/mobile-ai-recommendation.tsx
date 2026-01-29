"use client";

import { useState, useEffect } from "react";
import { recommendDish, RecommendDishOutput } from "@/ai/flows/recommend-dish";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, ChefHat, RotateCcw, ArrowRight } from "lucide-react";

const questions = [
    {
        name: "occasion",
        question: "আজকের occasion কি? 🎉",
        options: [
            { label: "Quick bite", value: "A quick bite", emoji: "⚡" },
            { label: "Casual meal", value: "A casual meal", emoji: "🍽️" },
            { label: "Special celebration", value: "A special celebration", emoji: "🎊" },
        ],
    },
    {
        name: "mood",
        question: "আপনার mood কেমন? 😊",
        options: [
            { label: "Light & healthy", value: "Light & healthy", emoji: "🥗" },
            { label: "Comfortable", value: "Comfortable & classic", emoji: "😌" },
            { label: "Indulgent", value: "Indulgent & celebratory", emoji: "🤩" },
        ],
    },
    {
        name: "flavor",
        question: "কোন ধরনের flavor পছন্দ? 🌶️",
        options: [
            { label: "Spicy & bold", value: "Spicy & bold", emoji: "🔥" },
            { label: "Rich & creamy", value: "Rich & creamy", emoji: "🧈" },
            { label: "Simple & authentic", value: "Simple & authentic", emoji: "✨" },
        ],
    },
];

function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            <div className="flex gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
        </div>
    );
}

function ChatBubble({ isAI, children, animate = false }: { isAI: boolean; children: React.ReactNode; animate?: boolean }) {
    return (
        <div
            className={cn(
                "max-w-[85%] px-4 py-3 rounded-2xl",
                isAI
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 self-start rounded-tl-sm"
                    : "bg-primary text-primary-foreground self-end rounded-tr-sm",
                animate && "animate-in slide-in-from-bottom-2 duration-300"
            )}
        >
            {children}
        </div>
    );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex justify-center gap-2 py-4">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        i < current
                            ? "bg-amber-500 scale-100"
                            : i === current
                                ? "bg-amber-500/50 scale-125 animate-pulse"
                                : "bg-muted-foreground/30 scale-100"
                    )}
                />
            ))}
        </div>
    );
}

export default function MobileAIRecommendation() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RecommendDishOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showQuestion, setShowQuestion] = useState(true);

    const currentQuestion = questions[step];
    const isComplete = step >= questions.length;

    const handleSelect = async (value: string) => {
        const newAnswers = { ...answers, [currentQuestion.name]: value };
        setAnswers(newAnswers);
        setShowQuestion(false);

        setTimeout(() => {
            if (step < questions.length - 1) {
                setStep(step + 1);
                setShowQuestion(true);
            } else {
                // Last question - get recommendation
                getRecommendation(newAnswers);
            }
        }, 400);
    };

    const getRecommendation = async (finalAnswers: Record<string, string>) => {
        setIsLoading(true);
        setError(null);

        try {
            const output = await recommendDish({
                occasion: finalAnswers.occasion,
                mood: finalAnswers.mood,
                flavor: finalAnswers.flavor,
            });
            setResult(output);
        } catch (e: any) {
            setError(e.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setStep(0);
        setAnswers({});
        setResult(null);
        setError(null);
        setShowQuestion(true);
    };

    return (
        <section className="md:hidden py-8 px-4">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-600">AI Powered</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">কী খাবেন বুঝতে পারছেন না?</h2>
                <p className="text-sm text-muted-foreground mt-1">আমাদের AI আপনার জন্য perfect dish খুঁজে দেবে!</p>
            </div>

            {/* Chat Container */}
            <div className="bg-gradient-to-br from-background to-muted/30 rounded-3xl border border-border/50 p-4 min-h-[320px] flex flex-col">
                {/* Progress */}
                {!isComplete && !isLoading && !result && (
                    <ProgressDots current={step} total={questions.length} />
                )}

                {/* Chat Messages */}
                <div className="flex-1 flex flex-col gap-3">
                    {/* Show answered questions */}
                    {Object.entries(answers).map(([key, value], idx) => {
                        const q = questions.find((q) => q.name === key);
                        const selectedOption = q?.options.find((o) => o.value === value);
                        return (
                            <div key={key} className="flex flex-col gap-2">
                                <ChatBubble isAI>{q?.question}</ChatBubble>
                                <ChatBubble isAI={false}>
                                    {selectedOption?.emoji} {selectedOption?.label}
                                </ChatBubble>
                            </div>
                        );
                    })}

                    {/* Current Question */}
                    {!isComplete && !isLoading && showQuestion && (
                        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <ChatBubble isAI animate>
                                <div className="flex items-center gap-2">
                                    <ChefHat className="w-5 h-5 text-amber-500" />
                                    <span className="font-medium">{currentQuestion.question}</span>
                                </div>
                            </ChatBubble>

                            {/* Options */}
                            <div className="grid gap-2 mt-2">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-accent border border-border rounded-xl transition-all duration-200 active:scale-[0.98] text-left"
                                    >
                                        <span className="text-xl">{option.emoji}</span>
                                        <span className="font-medium">{option.label}</span>
                                        <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col gap-2">
                            <ChatBubble isAI>
                                <TypingIndicator />
                            </ChatBubble>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="flex flex-col gap-3">
                            <ChatBubble isAI>
                                <div className="text-destructive">
                                    <p className="font-medium">Oops! কিছু সমস্যা হয়েছে 😔</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                            </ChatBubble>
                            <Button onClick={handleReset} variant="outline" className="self-center">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                আবার চেষ্টা করুন
                            </Button>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-500">
                            <ChatBubble isAI>
                                <div className="flex items-center gap-2 mb-2">
                                    <ChefHat className="w-5 h-5 text-amber-500" />
                                    <span className="font-medium">আপনার জন্য আমার সুপারিশ:</span>
                                </div>
                            </ChatBubble>

                            {/* Recommendation Card */}
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                                        🍛
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold">{result.dishName}</h3>
                                        <p className="text-white/90 text-sm mt-1">{result.reason}</p>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleReset} variant="outline" className="mt-2">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                নতুন করে শুরু করুন
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

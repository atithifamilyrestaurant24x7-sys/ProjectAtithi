"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X, Sparkles, Send, RotateCcw, Loader2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chat, ChatOutput } from "@/ai/flows/chat";
import { type MenuItem, menuData } from "@/lib/menu";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import placeholderImagesData from "@/lib/placeholder-images.json";

type MobileAISheetProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddToCart?: (items: MenuItem[]) => void;
};

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    suggestedDish?: string;
    suggestedItems?: string[];
    recommendedDishes?: {
        name: string;
        price: number;
        description?: string;
        rating?: number;
        ratingsCount?: number;
        image?: string;
    }[];
    cartItems?: { name: string; price: number; quantity: number }[];
    totalPrice?: number;
    actionType?: string;
};

// Helper: Get image for chip text
const getChipImage = (text: string): string | undefined => {
    const t = text.toLowerCase();
    const images = placeholderImagesData.placeholderImages;

    // 1. Exact or close dish name match
    const exactMatch = images.find(img => t.includes(img.id.toLowerCase()) || img.id.toLowerCase().includes(t));
    if (exactMatch) return exactMatch.imageUrl;

    // 2. Category Fallbacks
    if (t.includes('chicken') || t.includes('চিকেন')) return images.find(i => i.id === 'Butter Chicken')?.imageUrl;
    if (t.includes('mutton') || t.includes('মাটন')) return images.find(i => i.id === 'Mutton Rogan Josh')?.imageUrl;
    if (t.includes('paneer') || t.includes('পনির')) return images.find(i => i.id === 'Paneer Butter Masala')?.imageUrl;
    if (t.includes('veg') || t.includes('ভেজ')) return images.find(i => i.id === 'Mixed Veg')?.imageUrl;
    if (t.includes('fish') || t.includes('মাছ')) return images.find(i => i.id === 'Fish Kalia')?.imageUrl;
    if (t.includes('biryani') || t.includes('বিরিয়ানি')) return images.find(i => i.id === 'bestseller-chicken-biryani')?.imageUrl;
    if (t.includes('rice') || t.includes('রাইস') || t.includes('ভাত')) return images.find(i => i.id === 'Jeera Rice')?.imageUrl;
    if (t.includes('naan') || t.includes('nan') || t.includes('নান')) return images.find(i => i.id === 'Butter Naan')?.imageUrl;
    if (t.includes('roll') || t.includes('রোল')) return images.find(i => i.id === 'Chicken Roll')?.imageUrl;
    if (t.includes('chow') || t.includes('noodles') || t.includes('নুডলস')) return images.find(i => i.id === 'Chicken Chowmein')?.imageUrl;

    return undefined;
};

// Quick category chips with specific images
const categoryChips = [
    { label: "🍗 চিকেন", prompt: "চিকেন ডিশ দেখাও", image: getChipImage('Butter Chicken') },
    { label: "🥬 ভেজ", prompt: "ভেজ ডিশ দেখাও", image: getChipImage('Mixed Veg') },
    { label: "🍚 ভাত", prompt: "রাইস আইটেম দেখাও", image: getChipImage('Jeera Rice') },
    { label: "🍜 নুডলস", prompt: "নুডলস দেখাও", image: getChipImage('Chicken Chowmein') },
    { label: "🥖 রুটি", prompt: "রুটি নান দেখাও", image: getChipImage('Butter Naan') },
    { label: "🥟 রোল", prompt: "রোল দেখাও", image: getChipImage('Chicken Roll') },
    { label: "🥩 মাটন", prompt: "মাটন ডিশ দেখাও", image: getChipImage('Mutton Rogan Josh') },
    { label: "🐠 মাছ", prompt: "মাছের পদ দেখাও", image: getChipImage('Fish Kalia') },
    { label: "🥘 পনির", prompt: "পনিরের ডিশ দেখাও", image: getChipImage('Paneer Butter Masala') },
];

// Smart suggestions based on context
const getSmartSuggestions = (lastMessage: Message | undefined, messages: Message[]): { label: string; prompt: string; image?: string }[] => {
    let suggestions: { label: string; prompt: string; image?: string }[] = [];

    if (!lastMessage || lastMessage.role !== "ai") {
        // Default suggestions at start
        suggestions = [
            { label: "🏆 জনপ্রিয়", prompt: "সবচেয়ে জনপ্রিয় খাবার দেখাও", image: getChipImage('bestseller-chicken-biryani') },
            { label: "💰 সস্তা", prompt: "সস্তা খাবার দেখাও", image: getChipImage('Veg Tarka') },
            { label: "⚡ তাড়াতাড়ি", prompt: "তাড়াতাড়ি পাওয়া যায় কি?", image: getChipImage('Chicken Roll') },
            { label: "📍 Location", prompt: "তোমাদের restaurant কোথায়?" },
        ];
    } else {
        const actionType = lastMessage.actionType;

        // After item is added - suggest add-ons and actions
        if (actionType === "item_added") {
            // Check what was just added to suggest pairings
            if (lastMessage.cartItems?.some(item =>
                item.name.toLowerCase().includes("chicken") ||
                item.name.toLowerCase().includes("butter") ||
                item.name.toLowerCase().includes("paneer"))) {
                suggestions.push({ label: "🍞 নান", prompt: "Butter Naan দাও", image: getChipImage('Butter Naan') });
                suggestions.push({ label: "🍚 রাইস", prompt: "Jeera Rice দাও", image: getChipImage('Jeera Rice') });
            }

            if (lastMessage.cartItems?.some(item =>
                item.name.toLowerCase().includes("biryani"))) {
                suggestions.push({ label: "🥗 Raita", prompt: "Raita দাও" }); // No image for raita yet
                suggestions.push({ label: "🍗 Chicken Chap", prompt: "Chicken Chap দাও", image: getChipImage('Chicken Kasa') });
            }

            if (lastMessage.cartItems?.some(item =>
                item.name.toLowerCase().includes("noodles") ||
                item.name.toLowerCase().includes("chowmein"))) {
                suggestions.push({ label: "🍗 Manchurian", prompt: "Chicken Manchurian দাও", image: getChipImage('Chicken Manchurian') });
            }

            // Always add these options
            suggestions.push({ label: "✅ এটুকুই বাস", prompt: "Total দেখাও" });
            suggestions.push({ label: "🍰 Dessert", prompt: "কি dessert আছে?" });
        }

        // After showing total - confirm or modify
        else if (actionType === "show_total") {
            suggestions = [
                { label: "✅ হ্যাঁ, ঠিক আছে", prompt: "হ্যাঁ checkout করো" },
                { label: "➕ আরো যোগ করো", prompt: "আরো কিছু যোগ করতে চাই" },
                { label: "❌ বাদ দাও", prompt: "order বাতিল করো" },
            ];
        }

        // After checkout - new order options
        else if (actionType === "add_to_cart") {
            suggestions = [
                { label: "🆕 নতুন অর্ডার", prompt: "নতুন কিছু খাব" },
                { label: "🏆 বেস্ট সেলার", prompt: "বেস্ট সেলার দেখাও", image: getChipImage('bestseller-butter-chicken') },
            ];
        }

        // Food recommendation shown - let them pick or explore
        else if (actionType === "food_recommendation" || lastMessage.recommendedDishes?.length) {
            suggestions = [
                { label: "🔄 অন্য কিছু", prompt: "অন্য কিছু দেখাও" },
                { label: "💰 সস্তায়", prompt: "১০০ টাকার নিচে কি আছে?", image: getChipImage('Veg Chowmein') },
                { label: "🌶️ ঝাল", prompt: "ঝাল খাবার দেখাও", image: getChipImage('Chicken Jhal Fry') },
                { label: "🧈 মাইল্ড", prompt: "কম ঝাল খাবার দেখাও", image: getChipImage('Chicken Korma') },
            ];
        }

        // Location/Hours/Contact response - suggest food
        else if (actionType === "location" || actionType === "hours" || actionType === "contact") {
            suggestions = [
                { label: "🍛 মেনু দেখাও", prompt: "মেনু দেখাও", image: getChipImage('menu-card-1') },
                { label: "🏆 জনপ্রিয়", prompt: "জনপ্রিয় খাবার দেখাও", image: getChipImage('bestseller-butter-chicken') },
                { label: "💰 বাজেট", prompt: "সস্তা খাবার দেখাও", image: getChipImage('Veg Tarka') },
            ];
        }

        // Default smart suggestions fallback
        if (suggestions.length === 0) {
            suggestions = [
                { label: "🍛 কি খাব?", prompt: "আজ কি খাব বলো", image: getChipImage('Mixed Fried Rice') },
                { label: "🏆 বেস্ট সেলার", prompt: "সবচেয়ে বেশি বিক্রি হয় কি?", image: getChipImage('bestseller-butter-chicken') },
                { label: "💰 ১০০ টাকায়", prompt: "১০০ টাকার মধ্যে কি পাবো?" },
                { label: "🍗 চিকেন", prompt: "চিকেন আইটেম দেখাও", image: getChipImage('Butter Chicken') },
            ];
        }
    }

    return suggestions.slice(0, 5);
};

// Get popular dish chips
const getPopularDishChips = (): { label: string; prompt: string }[] => {
    const popularItems = menuData
        .flatMap(cat => cat.items)
        .sort((a, b) => b.ratingsCount - a.ratingsCount)
        .slice(0, 6);

    return popularItems.map(item => ({
        label: `${item.name.length > 12 ? item.name.slice(0, 12) + '...' : item.name} ₹${item.price}`,
        prompt: `${item.name} দাও`
    }));
};

export default function MobileAISheet({ isOpen, onClose, onAddToCart }: MobileAISheetProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const router = useRouter();

    const getUserLocale = () => {
        if (typeof navigator !== "undefined") {
            return navigator.language || "en-US";
        }
        return "en-US";
    };

    // Computed smart suggestions based on last message
    const smartSuggestions = useMemo(() => {
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
        return getSmartSuggestions(lastMessage, messages);
    }, [messages]);

    // Popular dish chips
    const popularDishChips = useMemo(() => getPopularDishChips(), []);

    const [viewportHeight, setViewportHeight] = useState<number>(
        typeof window !== 'undefined' ? (window.visualViewport?.height || window.innerHeight) : 800
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            if (window.visualViewport) {
                const vh = window.visualViewport.height;
                setViewportHeight(vh);

                const keyboardH = window.innerHeight - vh;
                const isOpen = keyboardH > 100;
                setKeyboardHeight(isOpen ? keyboardH : 0);
                setIsKeyboardOpen(isOpen);

                if (isOpen && messagesEndRef.current) {
                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                }
            } else {
                setViewportHeight(window.innerHeight);
            }
        };

        handleResize();

        window.visualViewport?.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("scroll", handleResize);
        window.addEventListener("resize", handleResize);

        return () => {
            window.visualViewport?.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("scroll", handleResize);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    // Don't focus input - we want zero typing!
    // useEffect(() => {
    //     if (isOpen && inputRef.current) {
    //         setTimeout(() => inputRef.current?.focus(), 300);
    //     }
    // }, [isOpen]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const locale = getUserLocale();
            const welcomeMsg = locale.startsWith("bn")
                ? "নমস্কার! 🙏 আমি Atithi AI। নিচের বাটন থেকে বেছে নিন অথবা জিজ্ঞেস করুন!"
                : locale.startsWith("hi")
                    ? "नमस्ते! 🙏 मैं Atithi AI हूं। नीचे से चुनें या पूछें!"
                    : "Hello! 🙏 I'm Atithi AI. Pick from below or ask anything!";

            setMessages([{ id: "welcome", role: "ai", content: welcomeMsg }]);
        }
    }, [isOpen, messages.length]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
                content: m.content
            }));

            const response: ChatOutput = await chat({
                message: text.trim(),
                userLocale: getUserLocale(),
                history: history
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: response.response,
                suggestedDish: response.suggestedDish,
                suggestedItems: response.suggestedItems,
                recommendedDishes: response.recommendedDishes,
                cartItems: response.cartItems,
                totalPrice: response.totalPrice,
                actionType: response.actionType,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error: any) {
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: "দুঃখিত, সমস্যা হচ্ছে। আবার চেষ্টা করুন! 🔄"
            };

            if (error?.message?.includes('API key') || error?.message?.includes('400')) {
                errorMsg.content = "API সমস্যা। দয়া করে পরে চেষ্টা করুন।";
            }

            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    const handleReset = () => {
        setMessages([]);
        setInput("");
        setShowCategories(false);
    };

    const handleOrder = (dishName: string) => {
        if (onAddToCart) {
            let foundItem: MenuItem | undefined;
            for (const category of menuData) {
                const item = category.items.find(i => i.name.toLowerCase() === dishName.toLowerCase().trim());
                if (item) {
                    foundItem = item;
                    break;
                }
            }

            if (foundItem) {
                onAddToCart([foundItem]);
                onClose();
                return;
            }
        }

        onClose();
        const url = new URL(window.location.href);
        url.searchParams.set("search", dishName);
        window.history.pushState({}, "", url);
        window.dispatchEvent(new Event("popstate"));

        setTimeout(() => {
            const menuElement = document.getElementById("menu");
            if (menuElement) {
                menuElement.scrollIntoView({ behavior: "smooth" });
            }
            toast({
                title: "Found in Menu",
                description: `Now showing: ${dishName}`,
            });
        }, 300);
    };

    const handleAddToCartAction = (items: { name: string; quantity: number }[]) => {
        if (!onAddToCart) return;

        const menuItemsToAdd: MenuItem[] = [];
        const missingItems: string[] = [];

        items.forEach(cartItem => {
            let foundItem: MenuItem | undefined;
            for (const category of menuData) {
                const item = category.items.find(i => i.name.toLowerCase() === cartItem.name.toLowerCase().trim());
                if (item) {
                    foundItem = item;
                    break;
                }
            }

            if (foundItem) {
                for (let i = 0; i < cartItem.quantity; i++) {
                    menuItemsToAdd.push(foundItem);
                }
            } else {
                missingItems.push(cartItem.name);
            }
        });

        if (menuItemsToAdd.length > 0) {
            onAddToCart(menuItemsToAdd);
            onClose();
        }

        if (missingItems.length > 0) {
            toast({
                variant: "destructive",
                title: "Some items not found",
                description: `Could not find: ${missingItems.join(", ")}`,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed z-[60] flex flex-col md:hidden"
            style={{
                height: `${viewportHeight}px`,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 z-[-1]"
                onClick={onClose}
            />

            {/* Sheet Container */}
            <div
                ref={sheetRef}
                className="relative w-full h-full bg-slate-50 rounded-t-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-300"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-slate-800">Atithi AI</h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full text-slate-400 hover:text-slate-600">
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-slate-400 hover:text-red-500">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-muted/10 overscroll-contain">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "max-w-[85%] px-4 py-3 rounded-2xl shadow-sm animate-in slide-in-from-bottom-2 duration-300",
                                msg.role === "ai"
                                    ? "bg-white border text-foreground self-start rounded-tl-sm"
                                    : "bg-amber-600 text-white self-end rounded-tr-sm ml-auto"
                            )}
                        >
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                            {/* Suggested Dish */}
                            {msg.suggestedDish && !msg.cartItems && msg.actionType === 'food_recommendation' && !msg.recommendedDishes && (
                                <div className="mt-3 flex flex-col gap-2">
                                    <div className="px-3 py-2 bg-amber-50 rounded-lg text-amber-800 text-xs font-semibold border border-amber-100 flex items-center gap-2">
                                        <span>🍛</span>
                                        <span>Try: {msg.suggestedDish}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-95 transition-all text-xs h-8"
                                        onClick={() => handleSend(`${msg.suggestedDish} দাও`)}
                                    >
                                        এটা নেব 👍
                                    </Button>
                                </div>
                            )}

                            {/* RICH CARDS: Recommended Dishes */}
                            {msg.recommendedDishes && msg.recommendedDishes.length > 0 && (
                                <div className="mt-3 -mx-2 px-2 overflow-x-auto pb-3 flex gap-3 snap-x hide-scrollbar">
                                    {msg.recommendedDishes.map((dish, idx) => (
                                        <div
                                            key={idx}
                                            className="min-w-[180px] max-w-[180px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm snap-center flex flex-col"
                                        >
                                            {dish.image && (
                                                <div className="w-full h-24 overflow-hidden bg-slate-100">
                                                    <img
                                                        src={dish.image}
                                                        alt={dish.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-2.5 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{dish.name}</h4>
                                                    <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1">
                                                        ₹{dish.price}
                                                    </span>
                                                </div>

                                                {dish.rating && (
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <span className="text-amber-500 text-xs">★</span>
                                                        <span className="text-[10px] text-slate-600 font-medium">{dish.rating} ({(dish.ratingsCount || 0) > 100 ? '100+' : dish.ratingsCount})</span>
                                                    </div>
                                                )}

                                                <div className="mt-auto pt-1">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="w-full h-7 text-xs bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                                                        onClick={() => handleSend(`${dish.name} দাও`)}
                                                    >
                                                        + এটা নেব
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Item Added - Show suggestions */}
                            {msg.actionType === 'item_added' && (
                                <div className="mt-3 flex flex-col gap-3">
                                    {msg.cartItems && msg.cartItems.length > 0 && (
                                        <div className="bg-green-50 p-2 rounded-lg border border-green-100 text-xs text-green-700">
                                            ✅ {msg.cartItems.map(i => `${i.quantity}x ${i.name}`).join(', ')} added
                                        </div>
                                    )}

                                    {msg.suggestedItems && msg.suggestedItems.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {msg.suggestedItems.map((item, idx) => (
                                                <Button
                                                    key={idx}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs h-8 border-amber-300 text-amber-700 hover:bg-amber-50 bg-amber-50"
                                                    onClick={() => handleSend(`${item} দাও`)}
                                                >
                                                    + {item}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-xs h-9 border-blue-200 text-blue-700 hover:bg-blue-50"
                                            onClick={() => handleSend("আরো সাজেশন দাও")}
                                        >
                                            🔄 আরো দেখাও
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 text-xs h-9 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleSend("Total দেখাও")}
                                        >
                                            ✅ এটুকুই
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Show Total */}
                            {msg.actionType === 'show_total' && msg.cartItems && msg.cartItems.length > 0 && (
                                <div className="mt-3 flex flex-col gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                    <div className="text-xs font-semibold text-amber-800 mb-1">
                                        📋 আপনার অর্ডার:
                                    </div>
                                    {msg.cartItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs text-amber-700">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-amber-300 my-1"></div>
                                    <div className="flex justify-between font-bold text-sm text-amber-900">
                                        <span>Total</span>
                                        <span>₹{msg.totalPrice}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-xs h-9 border-gray-300"
                                            onClick={() => handleSend("আরো কিছু যোগ করো")}
                                        >
                                            ➕ আরো
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 text-xs h-9 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleSend("হ্যাঁ, checkout করো")}
                                        >
                                            ✓ Confirm
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            {msg.actionType === 'add_to_cart' && msg.cartItems && msg.cartItems.length > 0 && (
                                <div className="mt-3 flex flex-col gap-2 bg-green-50 p-3 rounded-lg border border-green-100">
                                    <div className="text-xs font-semibold text-green-800 mb-1">
                                        ✅ Order Confirmed:
                                    </div>
                                    {msg.cartItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs text-green-700">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-green-200 my-1"></div>
                                    <div className="flex justify-between font-bold text-sm text-green-900">
                                        <span>Total</span>
                                        <span>₹{msg.totalPrice}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white shadow-md active:scale-95 transition-all"
                                        onClick={() => handleAddToCartAction(msg.cartItems!)}
                                    >
                                        🛒 Cart এ যোগ করুন
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm px-4">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Atithi ভাবছে...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>


                {/* Smart Quick Reply Chips - Always visible at bottom of messages */}
                {!isLoading && (
                    <div className="px-3 py-3 bg-white/95 border-t border-slate-100 backdrop-blur-sm flex items-center gap-3 relative z-20 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                        {/* Categories Toggle */}
                        <button
                            onClick={() => setShowCategories(!showCategories)}
                            className={cn(
                                "shrink-0 w-11 h-11 rounded-full flex items-center justify-center border transition-all active:scale-95 shadow-sm bg-slate-50",
                                showCategories
                                    ? "bg-amber-100 border-amber-300 text-amber-700 rotate-90 ring-2 ring-amber-100 ring-offset-1"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {showCategories ? <X className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                        </button>

                        {/* Smart Chips (Scrollable) */}
                        <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] touch-pan-x">
                            <div className="flex gap-2.5 pr-2">
                                {smartSuggestions.map((chip, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(chip.prompt)}
                                        className="shrink-0 pl-1.5 pr-4 py-2 bg-white border border-slate-100 rounded-full text-[13px] font-medium text-slate-700 active:scale-95 transition-all shadow-sm hover:border-amber-300 hover:text-amber-700 hover:shadow-md whitespace-nowrap flex items-center gap-2.5"
                                    >
                                        {chip.image ? (
                                            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-sm">
                                                <img src={chip.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-7 h-7 flex items-center justify-center text-sm opacity-80 bg-slate-50 rounded-full">
                                                {chip.label.includes("✅") ? "✅" : chip.label.includes("💰") ? "💰" : "🍽️"}
                                            </div>
                                        )}
                                        <span>{chip.label.replace(/^[^\w\s\u0980-\u09FF]+/, "").trim()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Expandable Category Panel */}
                {showCategories && (
                    <div className="bg-slate-50/80 px-2 pb-3 pt-0 backdrop-blur-sm border-b border-slate-100 animate-in slide-in-from-top-2 duration-200 absolute bottom-full left-0 right-0 z-10 shadow-lg rounded-t-2xl">
                        <div className="flex items-center justify-between px-2 py-2 mb-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</span>
                            <button onClick={() => setShowCategories(false)} className="text-slate-400 p-1"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-1">
                            {categoryChips.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        handleSend(chip.prompt);
                                        setShowCategories(false);
                                    }}
                                    className="relative flex flex-col items-center justify-center p-2.5 bg-white border border-slate-100 rounded-xl active:scale-95 transition-all hover:bg-amber-50 hover:border-amber-200 shadow-sm overflow-hidden group"
                                >
                                    {/* Background Image with Overlay */}
                                    {chip.image && (
                                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">
                                            <img src={chip.image} alt="" className="w-full h-full object-cover grayscale" />
                                        </div>
                                    )}

                                    {/* Icon/Image */}
                                    <div className="w-10 h-10 mb-1.5 rounded-full bg-slate-50 border border-slate-200 p-0.5 z-10 shadow-sm overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                        {chip.image ? (
                                            <img src={chip.image} alt="" className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span className="w-full h-full flex items-center justify-center text-lg">{chip.label.split(' ')[0]}</span>
                                        )}
                                    </div>

                                    <span className="text-[11px] font-semibold text-slate-700 z-10">{chip.label.split(' ')[1] || chip.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Dishes Hint (only if categories closed & low context) */}
                {messages.length <= 2 && !showCategories && (
                    <div className="mt-2.5 flex items-center gap-2 overflow-x-auto hide-scrollbar px-1 py-0.5">
                        <span className="shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trending:</span>
                        {popularDishChips.slice(0, 3).map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(chip.prompt)}
                                className="shrink-0 text-[11px] font-medium text-amber-600 hover:underline hover:text-amber-700 whitespace-nowrap px-1"
                            >
                                {chip.label.split(' ₹')[0]}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area - Minimized for zero-typing */}
                <div className="p-3 bg-white border-t">
                    <div className="relative flex items-center gap-2">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="অথবা লিখুন..."
                                className="w-full pl-4 pr-4 py-2.5 bg-slate-100 border-0 rounded-full focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm placeholder:text-slate-400"
                            />
                        </div>
                        <Button
                            onClick={() => handleSend(input)}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className={cn(
                                "h-10 w-10 rounded-full shadow-md transition-all duration-300",
                                input.trim()
                                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:scale-105 active:scale-95"
                                    : "bg-slate-200 text-slate-400"
                            )}
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

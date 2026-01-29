'use server';

import { menuData, MenuItem, MenuCategory } from '@/lib/menu';
import placeholderImagesData from '@/lib/placeholder-images.json';

// Type for placeholder images
type PlaceholderImage = {
    id: string;
    imageUrl: string;
    description?: string;
    imageHint?: string;
};

// Create a map for fast lookup by dish name (id)
const imageMap = new Map<string, string>(
    (placeholderImagesData.placeholderImages as PlaceholderImage[]).map(img => [img.id.toLowerCase(), img.imageUrl])
);

// Restaurant Info (Static - No API needed)
const restaurantInfo = {
    name: "Atithi Family Restaurant",
    tagline: "অতিথি দেবো ভব - Guest is God",
    address: "National Highway 14, Near Gurukulpara, Tilai, Kutigram, Hattala, Rampurhat - 731224, West Bengal",
    phone: "7076445512",
    whatsapp: "7076445512",
    hours: {
        bn: "সকাল ৭টা থেকে রাত ১১টা পর্যন্ত খোলা থাকে।",
        en: "Open from 7 AM to 11 PM.",
    },
    upiId: "7076445512@ybl"
};

// Keyword patterns for intent detection (Bengali + English + Banglish)
const intentPatterns = {
    price: [
        'দাম', 'কত', 'price', 'koto', 'dam', 'টাকা', 'taka', '₹', 'rate', 'cost'
    ],
    category: {
        veg: ['veg', 'ভেজ', 'সবজি', 'sobji', 'vegetarian', 'paneer', 'পনির'],
        chicken: ['chicken', 'চিকেন', 'মুরগি', 'murgi', 'মাংস'],
        mutton: ['mutton', 'মাটন', 'খাসি', 'khasi', 'পাঁঠা'],
        rice: ['rice', 'ভাত', 'bhat', 'biryani', 'বিরিয়ানি', 'pulao', 'fried rice'],
        noodles: ['noodles', 'নুডলস', 'চাউমিন', 'chowmein', 'chow'],
        rolls: ['roll', 'রোল', 'wrap'],
        breakfast: ['breakfast', 'নাস্তা', 'nasta', 'সকালের', 'morning', 'tea', 'চা', 'coffee'],
        soup: ['soup', 'সুপ', 'স্যুপ'],
        tandoor: ['tandoor', 'তান্দুর', 'naan', 'নান', 'roti', 'রুটি', 'kulcha', 'kabab', 'কাবাব', 'tikka']
    },
    popular: [
        'popular', 'জনপ্রিয়', 'best', 'সেরা', 'ভালো', 'bhalo', 'recommend', 'সাজেস্ট',
        'suggest', 'top', 'famous', 'বিখ্যাত'
    ],
    cheap: [
        'cheap', 'সস্তা', 'sosta', 'budget', 'কম', 'kom', 'under', 'নিচে', 'affordable'
    ],
    location: [
        'location', 'address', 'কোথায়', 'kothay', 'ঠিকানা', 'thikana', 'where', 'direction',
        'map', 'রাস্তা', 'route'
    ],
    hours: [
        'time', 'সময়', 'somoy', 'open', 'খোলা', 'khola', 'close', 'বন্ধ', 'bondho',
        'কখন', 'kokhon', 'when', 'hours', 'timing'
    ],
    contact: [
        'contact', 'phone', 'call', 'ফোন', 'নম্বর', 'number', 'whatsapp', 'যোগাযোগ',
        'jogajog', 'reach'
    ],
    greeting: [
        'hi', 'hello', 'হ্যালো', 'নমস্কার', 'hey', 'হাই', 'namaskar'
    ]
};

// Fuzzy match item name
function findMenuItem(query: string): MenuItem | null {
    const q = query.toLowerCase().trim();
    const allItems = menuData.flatMap(cat => cat.items);

    // Exact match first
    let found = allItems.find(item => item.name.toLowerCase() === q);
    if (found) return found;

    // Partial match - BUT strict!
    // The query must be at least 4 chars long to avoid matching short common words
    if (q.length < 4) return null;

    // 1. Query checks if Item Name contains it (e.g. "biryani" -> matches "Chicken Biryani")
    found = allItems.find(item => item.name.toLowerCase().includes(q));
    if (found) return found;

    // 2. Item Name checks if Query contains it (e.g. "I want Chicken Biryani please" -> matches "Chicken Biryani")
    // But we need to be careful not to match small words like "Chicken" to "Butter Chicken" arbitrarily if there are many.
    // For now, let's allow it but rely on Gemini for complex queries via the `length <= 3` check in Case 9.
    found = allItems.find(item => q.includes(item.name.toLowerCase()));
    if (found) return found;

    // Removed word-by-word match to avoid false positives.
    // If it's not a strong match, let Gemini handle it.

    return null;
}

// Find category
function findCategory(query: string): MenuCategory | null {
    const q = query.toLowerCase();

    for (const [catKey, keywords] of Object.entries(intentPatterns.category)) {
        if (keywords.some(kw => q.includes(kw))) {
            // Map to actual category name
            const catNameMap: Record<string, string> = {
                veg: 'Veg Dishes',
                chicken: 'Chicken Dishes',
                mutton: 'Mutton Dishes',
                rice: 'Rice',
                noodles: 'Noodles',
                rolls: 'Rolls',
                breakfast: 'Breakfast',
                soup: 'Soups',
                tandoor: 'Tandoor & Breads'
            };
            return menuData.find(cat => cat.name === catNameMap[catKey]) || null;
        }
    }
    return null;
}

// Check if message contains any keyword from list
function hasKeyword(message: string, keywords: string[]): boolean {
    const m = message.toLowerCase();
    return keywords.some(kw => m.includes(kw.toLowerCase()));
}

// Get top items by ratings
function getTopItems(count: number = 5): MenuItem[] {
    return menuData.flatMap(cat => cat.items)
        .sort((a, b) => b.ratingsCount - a.ratingsCount)
        .slice(0, count);
}

// Get budget items
function getBudgetItems(maxPrice: number = 100): MenuItem[] {
    return menuData.flatMap(cat => cat.items)
        .filter(item => item.price <= maxPrice)
        .sort((a, b) => a.price - b.price)
        .slice(0, 10);
}

// Format price with discount info
function formatPrice(item: MenuItem): string {
    if (item.originalPrice && item.originalPrice > item.price) {
        const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
        return `₹${item.price} (ছিল ₹${item.originalPrice}, ${discount}% ছাড়!)`;
    }
    return `₹${item.price}`;
}

// Get image URL from placeholder-images.json (no AI - static lookup)
function getImageUrl(dishName: string): string | undefined {
    return imageMap.get(dishName.toLowerCase());
}

export type LocalAIResponse = {
    handled: boolean;
    response?: string;
    suggestedDish?: string;
    suggestedItems?: string[];
    recommendedDishes?: {
        name: string;
        price: number;
        description?: string;
        rating?: number;
        ratingsCount?: number;
        image?: string; // Dynamic food photo URL
    }[];
    actionType?: string;
};

// Main function: Try to handle locally
export async function tryLocalResponse(message: string): Promise<LocalAIResponse> {
    const m = message.toLowerCase().trim();

    // ORDERING KEYWORDS - Check FIRST! Route to Gemini for multi-step ordering
    const orderingKeywords = [
        'দাও', 'dao', 'নেব', 'nibo', 'neb', 'নেবো', 'order', 'add', 'লাগবে', 'lagbe',
        'চাই', 'chai', 'দিন', 'din', 'দে', 'de', 'নিব', 'nib',
        'total', 'টোটাল', 'checkout', 'cart', 'কার্ট', 'বিল', 'bill',
        'আরো', 'more', 'হ্যাঁ', 'yes', 'ok', 'confirm'
    ];

    if (hasKeyword(m, orderingKeywords)) {
        // Ordering intent detected → Route to Gemini
        return { handled: false };
    }

    // 1. Greeting (only if NO ordering keywords)
    if (hasKeyword(m, intentPatterns.greeting) && m.length < 20) {
        return {
            handled: true,
            response: "নমস্কার! 🙏 আমি Atithi AI। কি খাবেন আজ? নাকি কিছু জানতে চান?",
            actionType: 'general'
        };
    }

    // 2. Location query
    if (hasKeyword(m, intentPatterns.location)) {
        return {
            handled: true,
            response: `📍 আমাদের ঠিকানা:\n${restaurantInfo.address}\n\nGoogle Maps এ "Atithi Family Restaurant Rampurhat" সার্চ করুন!`,
            actionType: 'location'
        };
    }

    // 3. Hours query
    if (hasKeyword(m, intentPatterns.hours)) {
        return {
            handled: true,
            response: `🕐 ${restaurantInfo.hours.bn}\n\nসপ্তাহের সব দিন খোলা থাকে!`,
            actionType: 'hours'
        };
    }

    // 4. Contact query
    if (hasKeyword(m, intentPatterns.contact)) {
        return {
            handled: true,
            response: `📞 যোগাযোগ করুন:\nফোন: ${restaurantInfo.phone}\nWhatsApp: wa.me/${restaurantInfo.whatsapp}\n\nঅর্ডার বা রিজার্ভেশনের জন্য কল করুন!`,
            actionType: 'contact'
        };
    }

    // 5. Price lookup
    if (hasKeyword(m, intentPatterns.price)) {
        const item = findMenuItem(m);
        if (item) {
            return {
                handled: true,
                response: `🍛 ${item.name}\n💰 দাম: ${formatPrice(item)}\n⭐ ${item.rating}/5 (${item.ratingsCount} reviews)\n\n${item.description}`,
                suggestedDish: item.name,
                actionType: 'food_recommendation'
            };
        }
    }

    // 6. Category listing
    const category = findCategory(m);
    if (category && (hasKeyword(m, ['কি', 'ki', 'কী', 'show', 'দেখাও', 'list', 'menu', 'মেনু', 'আছে', 'ache']))) {
        const items = category.items.slice(0, 10);
        return {
            handled: true,
            response: `🍽️ ${category.name} এর কিছু আইটেম:`,
            recommendedDishes: items.map(i => ({
                name: i.name,
                price: i.price,
                description: i.description,
                rating: i.rating,
                ratingsCount: i.ratingsCount,
                image: getImageUrl(i.name)
            })),
            actionType: 'general'
        };
    }

    // 7. Popular/Best items
    if (hasKeyword(m, intentPatterns.popular)) {
        const topItems = getTopItems(6); // Increased to 6 for better scrolling
        return {
            handled: true,
            response: `🏆 আমাদের সবচেয়ে জনপ্রিয় খাবারগুলো নিচে দেওয়া হলো (Choose Option):`,
            recommendedDishes: topItems.map(i => ({
                name: i.name,
                price: i.price,
                description: i.description,
                rating: i.rating,
                ratingsCount: i.ratingsCount,
                image: getImageUrl(i.name)
            })),
            actionType: 'food_recommendation'
        };
    }

    // 8. Budget/Cheap items
    if (hasKeyword(m, intentPatterns.cheap)) {
        // Try to extract price from message
        const priceMatch = m.match(/(\d+)/);
        const maxPrice = priceMatch ? parseInt(priceMatch[1]) : 100;

        const cheapItems = getBudgetItems(maxPrice);
        if (cheapItems.length > 0) {
            return {
                handled: true,
                response: `💰 ₹${maxPrice} এর নিচে সস্তা খাবার:`,
                recommendedDishes: cheapItems.slice(0, 8).map(i => ({
                    name: i.name,
                    price: i.price,
                    description: i.description,
                    rating: i.rating,
                    ratingsCount: i.ratingsCount,
                    image: getImageUrl(i.name)
                })),
                actionType: 'food_recommendation'
            };
        }
    }

    // 9. Direct item name mention (ONLY for pure info, not ordering)
    // This is for when user just mentions an item name without ordering intent
    // e.g., "butter chicken" (just asking about it)
    const directItem = findMenuItem(m);
    if (directItem && m.split(/\s+/).length <= 3) {
        // Pure info query - show the card
        return {
            handled: true,
            response: `🍛 ${directItem.name}\n💰 ${formatPrice(directItem)}\n⭐ ${directItem.rating}/5\n\nঅর্ডার করতে চাইলে "এটা দাও" বলুন!`,
            recommendedDishes: [{
                name: directItem.name,
                price: directItem.price,
                description: directItem.description,
                rating: directItem.rating,
                ratingsCount: directItem.ratingsCount,
                image: getImageUrl(directItem.name)
            }],
            actionType: 'food_recommendation'
        };
    }

    // Not handled locally → fallback to Gemini
    return { handled: false };
}

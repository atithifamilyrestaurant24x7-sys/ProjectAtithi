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

// Keyword patterns for intent detection (Bengali + English + Banglish) - EXPANDED
const intentPatterns = {
    price: [
        'দাম', 'কত', 'price', 'koto', 'dam', 'টাকা', 'taka', '₹', 'rate', 'cost',
        'charge', 'খরচ', 'khoroch', 'মূল্য', 'mulyo'
    ],
    category: {
        veg: ['veg', 'ভেজ', 'সবজি', 'sobji', 'vegetarian', 'paneer', 'পনির', 'সাকাহারী', 'নিরামিষ'],
        chicken: ['chicken', 'চিকেন', 'মুরগি', 'murgi', 'মাংস', 'murga', 'kukur'],
        mutton: ['mutton', 'মাটন', 'খাসি', 'khasi', 'পাঁঠা', 'patha', 'goat', 'ছাগল'],
        rice: ['rice', 'ভাত', 'bhat', 'biryani', 'বিরিয়ানি', 'pulao', 'fried rice', 'পোলাও', 'jeera'],
        noodles: ['noodles', 'নুডলস', 'চাউমিন', 'chowmein', 'chow', 'noodle', 'চাওমিন'],
        rolls: ['roll', 'রোল', 'wrap', 'kathi', 'কাঠি'],
        breakfast: ['breakfast', 'নাস্তা', 'nasta', 'সকালের', 'morning', 'tea', 'চা', 'coffee', 'কফি', 'পুরি'],
        soup: ['soup', 'সুপ', 'স্যুপ', 'shorba'],
        tandoor: ['tandoor', 'তান্দুর', 'naan', 'নান', 'roti', 'রুটি', 'kulcha', 'kabab', 'কাবাব', 'tikka', 'টিক্কা', 'paratha', 'পরোটা']
    },
    popular: [
        'popular', 'জনপ্রিয়', 'best', 'সেরা', 'ভালো', 'bhalo', 'recommend', 'সাজেস্ট',
        'suggest', 'top', 'famous', 'বিখ্যাত', 'trending', 'hit', 'special', 'স্পেশাল'
    ],
    cheap: [
        'cheap', 'সস্তা', 'sosta', 'budget', 'কম', 'kom', 'under', 'নিচে', 'affordable',
        'pocket', 'econom', 'কম দামে', 'kam dame'
    ],
    expensive: [
        'premium', 'expensive', 'দামী', 'dami', 'high', 'luxury', 'লাক্সারি', 'best quality'
    ],
    spicy: [
        'spicy', 'ঝাল', 'jhal', 'hot', 'মশলা', 'moshla', 'তেখা', 'tekha', 'মিরচি', 'mirchi'
    ],
    mild: [
        'mild', 'হালকা', 'halka', 'কম ঝাল', 'less spicy', 'not spicy', 'ঝাল ছাড়া', 'light'
    ],
    quick: [
        'quick', 'fast', 'তাড়াতাড়ি', 'taratari', 'jaldi', 'জলদি', 'instant', 'ready', 'minutes'
    ],
    combo: [
        'combo', 'কম্বো', 'family', 'ফ্যামিলি', 'pack', 'প্যাক', 'meal', 'মিল', 'thali', 'থালি', 'set'
    ],
    location: [
        'location', 'address', 'কোথায়', 'kothay', 'ঠিকানা', 'thikana', 'where', 'direction',
        'map', 'রাস্তা', 'route', 'কিভাবে', 'kivabe', 'যাবো', 'jabo'
    ],
    hours: [
        'time', 'সময়', 'somoy', 'open', 'খোলা', 'khola', 'close', 'বন্ধ', 'bondho',
        'কখন', 'kokhon', 'when', 'hours', 'timing', 'এখন', 'ekhon'
    ],
    contact: [
        'contact', 'phone', 'call', 'ফোন', 'নম্বর', 'number', 'whatsapp', 'যোগাযোগ',
        'jogajog', 'reach', 'ডাকবো', 'dakbo'
    ],
    greeting: [
        'hi', 'hello', 'হ্যালো', 'নমস্কার', 'hey', 'হাই', 'namaskar', 'সুপ্রভাত', 'good morning'
    ],
    whatToEat: [
        'কি খাব', 'ki khabo', 'ki khabe', 'khabar', 'খাবার', 'hungry', 'খিদে', 'khide',
        'suggest koro', 'bolo ki khabo', 'recommend koro', 'কি দেবে', 'ki debe'
    ],
    todaySpecial: [
        'today', 'আজ', 'aaj', 'আজকে', 'ajke', 'special', 'নতুন', 'notun', 'new'
    ]
};

// Fuzzy match item name - IMPROVED
function findMenuItem(query: string): MenuItem | null {
    const q = query.toLowerCase().trim();
    const allItems = menuData.flatMap(cat => cat.items);

    // Exact match first
    let found = allItems.find(item => item.name.toLowerCase() === q);
    if (found) return found;

    // Partial match - BUT strict!
    if (q.length < 4) return null;

    // Query checks if Item Name contains it
    found = allItems.find(item => item.name.toLowerCase().includes(q));
    if (found) return found;

    // Item Name checks if Query contains it
    found = allItems.find(item => q.includes(item.name.toLowerCase()));
    if (found) return found;

    return null;
}

// Find category
function findCategory(query: string): MenuCategory | null {
    const q = query.toLowerCase();

    for (const [catKey, keywords] of Object.entries(intentPatterns.category)) {
        if (keywords.some(kw => q.includes(kw))) {
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

// Get top items by ratings - INCREASED TO 12
function getTopItems(count: number = 12): MenuItem[] {
    return menuData.flatMap(cat => cat.items)
        .sort((a, b) => b.ratingsCount - a.ratingsCount)
        .slice(0, count);
}

// Get budget items - INCREASED TO 15
function getBudgetItems(maxPrice: number = 100): MenuItem[] {
    return menuData.flatMap(cat => cat.items)
        .filter(item => item.price <= maxPrice)
        .sort((a, b) => a.price - b.price)
        .slice(0, 15);
}

// NEW: Get premium items
function getPremiumItems(minPrice: number = 200): MenuItem[] {
    return menuData.flatMap(cat => cat.items)
        .filter(item => item.price >= minPrice)
        .sort((a, b) => b.price - a.price)
        .slice(0, 12);
}

// NEW: Get quick serve items (rolls, breakfast, noodles)
function getQuickItems(): MenuItem[] {
    const quickCategories = ['Rolls', 'Breakfast', 'Noodles'];
    return menuData
        .filter(cat => quickCategories.includes(cat.name))
        .flatMap(cat => cat.items)
        .slice(0, 12);
}

// NEW: Get random suggestions for variety
function getRandomItems(count: number = 8): MenuItem[] {
    const allItems = menuData.flatMap(cat => cat.items);
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Format price with discount info - ENHANCED
function formatPrice(item: MenuItem): string {
    if (item.originalPrice && item.originalPrice > item.price) {
        const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
        return `₹${item.price} (ছিল ₹${item.originalPrice}, ${discount}% ছাড়! 🎉)`;
    }
    return `₹${item.price}`;
}

// Get image URL from placeholder-images.json
function getImageUrl(dishName: string): string | undefined {
    return imageMap.get(dishName.toLowerCase());
}

// NEW: Get spice level emoji
function getSpiceEmoji(name: string): string {
    const spicyItems = ['masala', 'kadai', 'kasa', 'tikka', 'chilli', 'hot'];
    const mildItems = ['butter', 'korma', 'malai', 'cream'];
    const nameLower = name.toLowerCase();

    if (spicyItems.some(s => nameLower.includes(s))) return '🌶️';
    if (mildItems.some(m => nameLower.includes(m))) return '🧈';
    return '';
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
        image?: string;
    }[];
    actionType?: string;
};

// Main function: Try to handle locally - SIGNIFICANTLY EXPANDED
export async function tryLocalResponse(message: string): Promise<LocalAIResponse> {
    const m = message.toLowerCase().trim();

    // ORDERING KEYWORDS - Check FIRST! Route to Gemini for multi-step ordering
    const orderingKeywords = [
        'দাও', 'dao', 'নেব', 'nibo', 'neb', 'নেবো', 'order', 'add', 'লাগবে', 'lagbe',
        'চাই', 'chai', 'দিন', 'din', 'দে', 'de', 'নিব', 'nib',
        'total', 'টোটাল', 'checkout', 'cart', 'কার্ট', 'বিল', 'bill',
        'আরো', 'more', 'হ্যাঁ', 'yes', 'ok', 'confirm', 'নিচ্ছি', 'nichhi'
    ];

    if (hasKeyword(m, orderingKeywords)) {
        return { handled: false };
    }

    // 1. Greeting (only if NO ordering keywords)
    if (hasKeyword(m, intentPatterns.greeting) && m.length < 25) {
        return {
            handled: true,
            response: "নমস্কার! 🙏 আমি Atithi AI। আজ কি খাবেন? 🍛\n\nনিচের অপশন থেকে বেছে নিন অথবা জিজ্ঞেস করুন!",
            suggestedItems: ['🏆 জনপ্রিয় খাবার', '💰 সস্তা খাবার', '🍗 চিকেন', '🥬 ভেজ'],
            actionType: 'general'
        };
    }

    // 2. "What to eat?" - Give varied suggestions
    if (hasKeyword(m, intentPatterns.whatToEat)) {
        const randomItems = getRandomItems(8);
        return {
            handled: true,
            response: "🤔 কি খাবেন বুঝতে পারছেন না? \n\n✨ আমাদের কিছু সুপারিশ দেখুন:",
            recommendedDishes: randomItems.map(i => ({
                name: i.name,
                price: i.price,
                description: i.description,
                rating: i.rating,
                ratingsCount: i.ratingsCount,
                image: getImageUrl(i.name)
            })),
            suggestedItems: ['🏆 সবচেয়ে বিক্রি হয়', '🍗 চিকেন ডিশ', '🥬 ভেজ ডিশ'],
            actionType: 'food_recommendation'
        };
    }

    // 3. Today's special / New items
    if (hasKeyword(m, intentPatterns.todaySpecial)) {
        const topItems = getTopItems(8);
        return {
            handled: true,
            response: "✨ আজকের স্পেশাল এবং জনপ্রিয় আইটেম:\n\n🔥 এগুলো সবচেয়ে বেশি অর্ডার হচ্ছে!",
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

    // 4. Location query
    if (hasKeyword(m, intentPatterns.location)) {
        return {
            handled: true,
            response: `📍 **আমাদের ঠিকানা:**\n${restaurantInfo.address}\n\n🗺️ Google Maps এ **"Atithi Family Restaurant Rampurhat"** সার্চ করুন!\n\n🚗 NH-14 এ Rampurhat যাওয়ার পথে, Gurukulpara এর কাছে।`,
            actionType: 'location'
        };
    }

    // 5. Hours query
    if (hasKeyword(m, intentPatterns.hours)) {
        return {
            handled: true,
            response: `🕐 **সময়সূচী:**\n${restaurantInfo.hours.bn}\n\n📅 সপ্তাহের ৭ দিনই খোলা!\n☕ সকালে চা-নাস্তা, দুপুরে-রাতে সব ধরনের খাবার পাবেন।`,
            actionType: 'hours'
        };
    }

    // 6. Contact query
    if (hasKeyword(m, intentPatterns.contact)) {
        return {
            handled: true,
            response: `📞 **যোগাযোগ করুন:**\n\n📱 ফোন: ${restaurantInfo.phone}\n💬 WhatsApp: wa.me/${restaurantInfo.whatsapp}\n\n🍽️ অর্ডার বা রিজার্ভেশনের জন্য কল করুন!`,
            actionType: 'contact'
        };
    }

    // 7. Quick food / Fast serve
    if (hasKeyword(m, intentPatterns.quick)) {
        const quickItems = getQuickItems();
        return {
            handled: true,
            response: "⚡ **তাড়াতাড়ি পেতে চান?**\n\nএই আইটেমগুলো দ্রুত সার্ভ করা হয়:",
            recommendedDishes: quickItems.map(i => ({
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

    // 8. Premium items
    if (hasKeyword(m, intentPatterns.expensive)) {
        const premiumItems = getPremiumItems(200);
        return {
            handled: true,
            response: "👑 **প্রিমিয়াম সেকশন:**\n\nআমাদের সেরা মানের এবং স্পেশাল ডিশ:",
            recommendedDishes: premiumItems.map(i => ({
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

    // 9. Price lookup
    if (hasKeyword(m, intentPatterns.price)) {
        const item = findMenuItem(m);
        if (item) {
            const spice = getSpiceEmoji(item.name);
            return {
                handled: true,
                response: `🍛 **${item.name}** ${spice}\n💰 দাম: ${formatPrice(item)}\n⭐ ${item.rating}/5 (${item.ratingsCount} জন পছন্দ করেছে)\n\n📝 ${item.description}\n\n👉 অর্ডার করতে **"এটা দাও"** বলুন!`,
                suggestedDish: item.name,
                recommendedDishes: [{
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    rating: item.rating,
                    ratingsCount: item.ratingsCount,
                    image: getImageUrl(item.name)
                }],
                actionType: 'food_recommendation'
            };
        }
    }

    // 10. Category listing - INCREASED TO 15 ITEMS
    const category = findCategory(m);
    if (category && (hasKeyword(m, ['কি', 'ki', 'কী', 'show', 'দেখাও', 'list', 'menu', 'মেনু', 'আছে', 'ache', 'দেখান', 'দিন']))) {
        const items = category.items.slice(0, 15);
        return {
            handled: true,
            response: `🍽️ **${category.name}** (${category.items.length}টি আইটেম):\n\nসব ${category.name} দেখুন নিচে 👇`,
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

    // 11. Popular/Best items - INCREASED TO 12
    if (hasKeyword(m, intentPatterns.popular)) {
        const topItems = getTopItems(12);
        return {
            handled: true,
            response: `🏆 **সবচেয়ে জনপ্রিয় খাবার!**\n\n🔥 এগুলো সবাই খায়, আপনিও ট্রাই করুন:`,
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

    // 12. Budget/Cheap items - INCREASED TO 15
    if (hasKeyword(m, intentPatterns.cheap)) {
        const priceMatch = m.match(/(\d+)/);
        const maxPrice = priceMatch ? parseInt(priceMatch[1]) : 100;

        const cheapItems = getBudgetItems(maxPrice);
        if (cheapItems.length > 0) {
            return {
                handled: true,
                response: `💰 **বাজেট মেনু (₹${maxPrice} এর নিচে):**\n\n🤑 সস্তায় মজা! কম খরচে ভালো খাবার:`,
                recommendedDishes: cheapItems.slice(0, 12).map(i => ({
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

    // 13. Direct item name mention (info only)
    const directItem = findMenuItem(m);
    if (directItem && m.split(/\s+/).length <= 3) {
        const spice = getSpiceEmoji(directItem.name);
        return {
            handled: true,
            response: `🍛 **${directItem.name}** ${spice}\n💰 ${formatPrice(directItem)}\n⭐ ${directItem.rating}/5 (${directItem.ratingsCount} reviews)\n\n📝 ${directItem.description}\n\n👉 অর্ডার করতে **"এটা দাও"** বলুন!`,
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

    // 14. Category name directly (e.g., just "chicken" or "veg")
    if (category) {
        const items = category.items.slice(0, 12);
        return {
            handled: true,
            response: `🍽️ **${category.name}:**\n\nবেছে নিন আপনার পছন্দের ${category.name}:`,
            recommendedDishes: items.map(i => ({
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

    // 15. "Something else" / "Other" / "Variety"
    // Captures: "onno kichu", "ar ki acche", "change koro", "something else", "boring"
    if (m.includes('other') || m.includes('onno') || m.includes('variety') || m.includes('change') || m.includes('different') || m.includes('আর কি') || m.includes('bad dao') || m.includes('অন্য')) {
        const randomItems = getRandomItems(8);
        return {
            handled: true,
            response: `আচ্ছা! 🤔 তাহলে, আপনি কি পছন্দ করেন এমন কিছু আলাদা খাবার দেখি!\n🔥`,
            recommendedDishes: randomItems.map(i => ({
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

    // Not handled locally → fallback to Gemini
    return { handled: false };
}

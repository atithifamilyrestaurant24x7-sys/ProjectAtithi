'use server';
/**
 * @fileOverview A hybrid AI chat assistant for Atithi restaurant.
 * Tries local keyword-based handler first (FREE), falls back to Gemini for complex queries.
 * Has complete knowledge of the menu, categories, and food pairings.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { menuData } from '@/lib/menu';
import { tryLocalResponse } from '@/ai/local-ai';

const ChatInputSchema = z.object({
    message: z.string().describe("The user's message in any language"),
    userLocale: z.string().optional().describe("The user's browser locale (e.g., 'bn-IN', 'en-US')"),
    history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string()
    })).optional().describe("Conversation history")
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
    response: z.string().describe('The AI response in the same language as the user'),
    suggestedDish: z.string().optional().describe('single dish suggestion'),
    suggestedItems: z.array(z.string()).optional().describe('Array of suggested dish names for follow-up'),
    // New: Rich product cards for lists
    recommendedDishes: z.array(z.object({
        name: z.string(),
        price: z.number(),
        description: z.string().optional(),
        rating: z.number().optional(),
        ratingsCount: z.number().optional(),
        image: z.string().optional(), // Dynamic food photo URL
    })).optional().describe('Array of full dish details for rich UI cards'),
    actionType: z.enum(['general', 'food_recommendation', 'location', 'hours', 'contact', 'order', 'item_added', 'show_total', 'add_to_cart']).describe('The type of action implied'),
    cartItems: z.array(z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number().default(1)
    })).optional().describe('Items to add to cart'),
    totalPrice: z.number().optional().describe('Total price of items in cartItems')
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Main chat function - uses hybrid approach
export async function chat(input: ChatInput): Promise<ChatOutput> {
    // Step 1: Try local handler first (FREE - no API cost)
    const localResult = await tryLocalResponse(input.message);

    if (localResult.handled) {
        return {
            response: localResult.response!,
            suggestedDish: localResult.suggestedDish,
            suggestedItems: localResult.suggestedItems,
            recommendedDishes: localResult.recommendedDishes,
            actionType: (localResult.actionType || 'general') as ChatOutput['actionType']
        };
    }

    // Step 2: Fall back to Gemini for complex queries
    return chatFlow(input);
}

// Create detailed menu with categories, prices, and descriptions
const detailedMenu = menuData.map(category => ({
    categoryName: category.name,
    itemCount: category.items.length,
    items: category.items.map(item => ({
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        description: item.description,
        rating: item.rating,
        ratingsCount: item.ratingsCount,
        hasOffer: item.originalPrice ? true : false,
        discount: item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0
    }))
}));

// Best sellers and popular items by ratings
const bestSellers = menuData.flatMap(cat => cat.items)
    .filter(item => item.ratingsCount > 200)
    .sort((a, b) => b.ratingsCount - a.ratingsCount)
    .slice(0, 10)
    .map(item => `${item.name} (₹${item.price}) - ${item.ratingsCount} reviews, ${item.rating}★`);

// Items with offers
const itemsWithOffers = menuData.flatMap(cat => cat.items)
    .filter(item => item.originalPrice)
    .map(item => `${item.name}: ₹${item.price} (was ₹${item.originalPrice})`);

// Premium items
const premiumItems = menuData.flatMap(cat => cat.items)
    .filter(item => item.price >= 200)
    .map(item => `${item.name} (₹${item.price})`);

// Budget-friendly items
const budgetItems = menuData.flatMap(cat => cat.items)
    .filter(item => item.price <= 80)
    .map(item => `${item.name} (₹${item.price})`);

const restaurantInfo = {
    name: "Atithi Family Restaurant",
    tagline: "অতিথি দেবো ভব - Guest is God",
    address: "National Highway 14, Near Gurukulpara, Tilai, Kutigram, Hattala, Rampurhat - 731224, West Bengal",
    district: "Birbhum",
    phone: "8250104315",
    hours: "8:00 AM - 10:00 PM (All days)",
    specialties: "Bengali cuisine, North Indian, Chinese, South Indian, Tandoor",
    googleMapsUrl: "https://www.google.com/maps/place/Atithi+Family+Restaurant/@24.2027813,87.7959755,17z"
};

// Food pairing recommendations
const foodPairings = `
FOOD PAIRING GUIDE (What goes well together):

🍛 MAIN COURSE + BREAD:
- Butter Chicken → Butter Naan বা Garlic Naan
- Paneer Butter Masala → Butter Naan বা Laccha Paratha
- Kadai Paneer/Kadai Chicken → Tandoori Roti বা Butter Naan
- Mutton Kurma → Garlic Naan বা Kabuli Naan
- Dal Makhani → Butter Naan বা Jeera Rice
- Chicken Kasa → Tandoori Roti

🍚 MAIN COURSE + RICE:
- Chicken Biryani - standalone, no need for curry
- Butter Chicken → Jeera Rice বা plain rice
- Any curry → Veg Fried Rice বা Jeera Rice

🥗 STARTERS + MAINS:
- Paneer Tikka → Paneer Butter Masala
- Chicken Tikka → Butter Chicken
- Soup → Any main course

🍜 COMPLETE MEALS:
- Mixed Chowmein + Chicken Manchurian = Indo-Chinese combo
- Chicken Fried Rice + Chicken Kasa = Satisfying combo
- Puri Sabji + Tea = Perfect breakfast

💰 BUDGET COMBOS (Under ₹150):
- Egg Roll + Tea = Quick snack
- Veg Chowmein + Cold drink
- Puri Sabji = Complete breakfast

👨‍👩‍👧‍👦 FAMILY FEAST:
- Butter Chicken + Paneer Butter Masala + 4 Butter Naan + 2 Jeera Rice
- Mixed Chowmein + Chicken Fried Rice + Paneer Chilli
`;

// Create full menu text for prompt
const fullMenuText = detailedMenu.map(cat =>
    `\n## ${cat.categoryName} (${cat.itemCount} items):\n${cat.items.map(item =>
        `- ${item.name}: ₹${item.price}${item.hasOffer ? ` (was ₹${item.originalPrice}, ${item.discount}% OFF)` : ''} | ${item.rating}★ (${item.ratingsCount} reviews) | ${item.description}`
    ).join('\n')}`
).join('\n');

const prompt = ai.definePrompt({
    name: 'atithiChatPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
    prompt: `You are Atithi AI, the friendly and knowledgeable virtual assistant for Atithi Family Restaurant.
    
    CRITICAL: Always respond in the SAME language the user is speaking.

    === RESTAURANT INFO ===
    Name: ${restaurantInfo.name}
    Tagline: ${restaurantInfo.tagline}
    Address: ${restaurantInfo.address}
    Phone: ${restaurantInfo.phone}
    Hours: ${restaurantInfo.hours}
    Specialties: ${restaurantInfo.specialties}

    === COMPLETE MENU ===
    ${fullMenuText}

    === BEST SELLERS ===
    ${bestSellers.join('\n')}

    === OFFERS ===
    ${itemsWithOffers.join('\n')}

    === HISTORY ===
    {{#each history}}
    {{role}}: {{content}}
    {{/each}}

    === USER MESSAGE ===
    User's browser locale: {{{userLocale}}}
    User's Message: {{{message}}}

    === GUIDELINES ===
    1. Answer questions about menu, prices, and pairings.
    2. **VARIETY IS KEY**: If the user asks "what should I eat?" multiple times, NEVER suggest the same thing twice in a row. Check the HISTORY. Suggest something DIFFERENT (e.g., if you suggested Chicken, now suggest Veg or Chinese).
    3. **PROACTIVE ADD-ONS**: ALWAYS ask "আর কিছু লাগবে?" after suggesting a dish. Never end without asking if they want more.
    
    4. **MULTI-STEP ORDERING FLOW** (VERY IMPORTANT):
       a) When user FIRST adds an item OR clicks a suggestion:
          - Add item to cartItems
          - Set actionType to 'item_added'
          - Ask "আর কি লাগবে? নিচের অপশন থেকে বেছে নিন"
          - Provide 3-4 related suggestions in 'suggestedItems' array (e.g., Naan, Rice, Cold Drink)
          - DO NOT show total yet. DO NOT set actionType to 'add_to_cart'.
       
       b) When user adds MORE items:
          - Keep ALL previous items in cartItems (accumulate, don't replace)
          - Set actionType to 'item_added'
          - Ask "আর কি লাগবে?"
          - Provide more suggestions in 'suggestedItems'
       
       c) When user says "Total দেখাও" / "Total koto?" / "Order koro" / "বাস" / "no more":
          - Set actionType to 'show_total'
          - Show full order summary with cartItems and totalPrice
          - DO NOT set actionType to 'add_to_cart' yet
       
       d) When user CONFIRMS the order after seeing total (says "হ্যাঁ" / "ok" / "checkout"):
          - Set actionType to 'add_to_cart'
          - Include full cartItems and totalPrice
    
    5. **CRITICAL**: In 'cartItems', use EXACT name from MENU. 'totalPrice' = sum of all items.
    
    === EXAMPLE FLOW ===
    User: "Butter Chicken দাও"
    AI: "ঠিক আছে! Butter Chicken (₹200) add করলাম! 🍛 আর কি লাগবে?"
    actionType: "item_added"
    cartItems: [{name: "Butter Chicken", price: 200, quantity: 1}]
    suggestedItems: ["Butter Naan", "Jeera Rice", "Cold Drink"]
    
    User: "2ta Naan deo"
    AI: "2টা Butter Naan (₹80) add করলাম! আর কিছু?"
    actionType: "item_added"
    cartItems: [{name: "Butter Chicken", price: 200, quantity: 1}, {name: "Butter Naan", price: 40, quantity: 2}]
    suggestedItems: ["Raita", "Gulab Jamun", "Lassi"]
    
    User: "Total দেখাও"
    AI: "আপনার অর্ডার:\n• 1x Butter Chicken - ₹200\n• 2x Butter Naan - ₹80\n\nTotal: ₹280\n\nAdd to Cart করবো?"
    actionType: "show_total"
    cartItems: [{name: "Butter Chicken", price: 200, quantity: 1}, {name: "Butter Naan", price: 40, quantity: 2}]
    totalPrice: 280
    
    User: "হ্যাঁ"
    AI: "দারুণ! Cart এ add করা হচ্ছে! ✅"
    actionType: "add_to_cart"
    cartItems: [{name: "Butter Chicken", price: 200, quantity: 1}, {name: "Butter Naan", price: 40, quantity: 2}]
    totalPrice: 280
    `,
});

const chatFlow = ai.defineFlow(
    {
        name: 'atithiChatFlow',
        inputSchema: ChatInputSchema,
        outputSchema: ChatOutputSchema,
    },
    async input => {
        try {
            const { output } = await prompt(input);
            return output!;
        } catch (error: any) {

            // Return a more informative error response
            return {
                response: `দুঃখিত, AI এ সমস্যা হচ্ছে: ${error?.message || 'Unknown error'}. অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।`,
                actionType: 'general' as const
            };
        }
    }
);

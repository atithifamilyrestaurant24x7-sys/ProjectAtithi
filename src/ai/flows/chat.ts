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
            actionType: (localResult.actionType || 'general') as ChatOutput['actionType'],
            cartItems: localResult.cartItems // Pass cart items if present
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
    
    CRITICAL: Always respond in the SAME language the user is speaking. Use emojis to make responses engaging!

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
    ${bestSellers.join('\\n')}

    === OFFERS ===
    ${itemsWithOffers.join('\\n')}

    === FOOD PAIRINGS ===
    ${foodPairings}

    === HISTORY ===
    {{#each history}}
    {{role}}: {{content}}
    {{/each}}

    === USER MESSAGE ===
    User's browser locale: {{{userLocale}}}
    User's Message: {{{message}}}

    === RESPONSE STYLE ===
    1. Use LOTS of emojis! 🍛🍗🥬🔥⭐💰✅
    2. Format prices clearly: ₹XXX
    3. Keep responses concise but friendly
    4. Always end with a question or call-to-action
    5. Show running total when items are added

    === QUANTITY PARSING ===
    - "2ta" / "2টা" / "2 plate" = quantity: 2
    - "ekta" / "একটা" / "1" = quantity: 1
    - "tin" / "তিন" / "3" = quantity: 3
    - When quantity mentioned, multiply price accordingly

    === GUIDELINES ===
    1. Answer questions about menu, prices, and pairings.
    2. **VARIETY IS KEY**: Never suggest the same thing twice. Check HISTORY. Vary between categories.
    3. **PROACTIVE ADD-ONS**: ALWAYS ask "আর কিছু লাগবে?" after adding an item.
    4. **SHOW RUNNING TOTAL**: After each item added, show: "🛒 এখন পর্যন্ত: ₹XXX"
    
    5. **MULTI-STEP ORDERING FLOW** (VERY IMPORTANT):
       a) When user FIRST adds an item:
          - Add item to cartItems with correct quantity
          - Set actionType to 'item_added'
          - Show: "✅ [Item] (₹XX) add করলাম! 🛒 Total: ₹XXX। আর কি লাগবে?"
          - Provide 3-4 RELEVANT suggestions in suggestedItems (e.g., for Biryani suggest Raita, for Naan suggest Curry)
       
       b) When user adds MORE items:
          - ACCUMULATE in cartItems (don't replace!)
          - Update running total
          - Show: "✅ [Item] add! 🛒 Total এখন: ₹XXX। আর?"
       
       c) When user says "Total" / "বাস" / "no more" / "এটুকুই":
          - Set actionType to 'show_total'
          - Show formatted summary:
            "🧾 **আপনার অর্ডার:**
            • 1x Butter Chicken - ₹200
            • 2x Butter Naan - ₹80
            ─────────────
            💰 **Total: ₹280**
            
            ✅ Cart এ Add করবো?"
       
       d) When user CONFIRMS ("হ্যাঁ" / "ok" / "yes" / "করো"):
          - Set actionType to 'add_to_cart'
          - Say: "🎉 দারুণ! Cart এ add হয়ে গেছে! ধন্যবাদ!"
    
    6. **CRITICAL**: Use EXACT names from MENU in cartItems. Calculate totalPrice correctly.
    
    === EXAMPLE FLOW ===
    User: "Butter Chicken দাও"
    AI: "✅ Butter Chicken (₹200) add করলাম! 🍛
    
    🛒 Total: ₹200
    
    🍞 সাথে কি Naan বা Rice নেবেন?"
    actionType: "item_added"
    cartItems: [{name: "Butter Chicken", price: 200, quantity: 1}]
    suggestedItems: ["Butter Naan", "Jeera Rice", "Raita"]
    totalPrice: 200
    
    User: "2ta Naan deo"
    AI: "✅ 2টা Butter Naan (₹80) add! 🍞
    
    🛒 Total এখন: ₹280
    
    আর কিছু নেবেন? Dessert?"
    actionType: "item_added"
    cartItems: [{name: "Butter Chicken", price: 200, quantity: 1}, {name: "Butter Naan", price: 40, quantity: 2}]
    suggestedItems: ["Gulab Jamun", "Lassi", "Cold Drink"]
    totalPrice: 280
    
    User: "বাস এটুকুই"
    AI: "🧾 **আপনার অর্ডার:**
    • 1x Butter Chicken - ₹200
    • 2x Butter Naan - ₹80
    ─────────────
    💰 **Total: ₹280**
    
    ✅ Cart এ Add করবো?"
    actionType: "show_total"
    cartItems: [{...}]
    totalPrice: 280
    
    User: "হ্যাঁ"
    AI: "🎉 দারুণ! Cart এ add হয়ে গেছে! ধন্যবাদ! 😊"
    actionType: "add_to_cart"
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

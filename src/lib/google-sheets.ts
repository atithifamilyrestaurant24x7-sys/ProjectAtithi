'use server';

import { type CartItem } from '@/app/page';

type OrderData = {
    name: string;
    phone: string;
    orderType: string;
    date: string;
    time: string;
    address?: string;
    paymentMethod: string;
    utr?: string;
    total: number;
    items: string;
};

export async function saveOrderToGoogleSheets(orderData: OrderData): Promise<{ success: boolean; error?: string }> {
    const googleSheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

    if (!googleSheetsUrl) {
        console.warn('Google Sheets URL not configured. Order will not be saved to sheets.');
        return { success: true }; // Return success to not block the order flow
    }

    try {
        const response = await fetch(googleSheetsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return { success: result.success };
    } catch (error) {
        console.error('Failed to save order to Google Sheets:', error);
        // Don't block the order - just log the error
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

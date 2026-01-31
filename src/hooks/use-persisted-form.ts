import { useEffect } from 'react';
import { UseFormReturn, Path, FieldValues } from 'react-hook-form';

export function usePersistedForm<T extends FieldValues>(
    form: UseFormReturn<T>,
    key: string
) {
    // Save data on change
    useEffect(() => {
        const subscription = form.watch((value) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [form, key]);

    // Load data on mount
    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Reset form with saved data
                // We iterate keys to ensure we only set relevant fields
                Object.keys(parsed).forEach((k) => {
                    form.setValue(k as Path<T>, parsed[k]);
                });
            } catch (e) {
                console.error('Failed to parse saved form data', e);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
}

import { useEffect, useState } from 'react';
import { Item } from '~/pages/list/ListItem';

export type Result = {
    name: string;
    comparisions: number;
    currentArray: Item[];
};

export const useGetResult = () => {
    const [result, setResult] = useState<Result>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const raw: string | null = localStorage.getItem('result');

            if (raw) {
                const parsedList: Result = JSON.parse(raw);
                setResult(parsedList);
            }
        } catch (e) {
            console.error('Storage error:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { result, setResult, isLoading };
};

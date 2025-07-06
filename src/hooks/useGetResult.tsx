import { useEffect, useState } from 'react';
import { z } from 'zod';
import { ResultSchema } from '../pages/list/zodSchema';
import { localDb } from '../storage/indexedDbStorage';

export type Result = z.infer<typeof ResultSchema>;
/**
 * If we go online, need to use this hook less since it refetching every time
 */
export const useLocalGetResult = (id: string) => {
    const [result, setResult] = useState<Result>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            const result = await localDb.getResult(id);
            setResult(result);
            setIsLoading(false);
        };
        run();
    }, [id]);

    return { result, setResult, isLoading };
};

/**
 * If we go online, need to use this hook less since it refetching every time
 */
export const useLocalGetResults = () => {
    const [results, setResults] = useState<Result[]>();
    const [isLoading, setIsLoading] = useState(true);

    const fetch = async () => {
        const results = await localDb.getResults();
        setResults(results);
        setIsLoading(false);
    };

    useEffect(() => {
        fetch();
    }, []);

    return { results, setResults, isLoading, fetch };
};

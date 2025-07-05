import { useEffect, useState } from 'react';
import { List } from '../pages/list/listCard';
import { localDb } from '../storage/indexedDbStorage';

/**
 * If we go online, need to use this hook less since it refetching every time
 */
export const useLocalGetList = (id: string) => {
    const [list, setList] = useState<List>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            const result = await localDb.getList(id);
            setList(result);
            setIsLoading(false);
        };
        run();
    }, [id]);

    return { list, setList, isLoading };
};

/**
 * If we go online, need to use this hook less since it refetching every time
 */
export const useLocalGetLists = () => {
    const [lists, setLists] = useState<List[]>();
    const [isLoading, setIsLoading] = useState(true);

    const fetch = async () => {
        const result = await localDb.getLists();
        setLists(result);
        setIsLoading(false);
    };

    useEffect(() => {
        fetch();
    }, []);

    return { lists, setLists, isLoading, fetch };
};

/**
 *  Get a single list --> This is for MVP
 */
export const useGetListForMVP = () => {
    const [list, setList] = useState<List>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const raw: string | null = localStorage.getItem('list');

            if (raw) {
                const parsedList: List = JSON.parse(raw);
                setList(parsedList);
            }
        } catch (e) {
            console.error('Storage error:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { list, setList, isLoading };
};

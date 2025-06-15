import { Dispatch, SetStateAction, useEffect } from 'react';
import { initialListMap } from '../common/constants';
import { List } from '../common/types';

export const useGetList = ({
    setLists,
}: {
    setLists: Dispatch<SetStateAction<Map<string, List>>>;
}) => {
    useEffect(() => {
        const raw: string | null = localStorage.getItem('lists');

        if (raw) {
            const parsedArray: List[] = JSON.parse(raw);
            const map: Map<string, List> = new Map(
                parsedArray.map((list) => [list.id, list])
            );
            setLists(map);
        } else {
            localStorage.setItem(
                'lists',
                JSON.stringify(Array.from(initialListMap.values()))
            );
            setLists(initialListMap);
        }
    }, []);
};

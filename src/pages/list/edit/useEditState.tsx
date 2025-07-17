import { useState } from 'react';
import { ListWithItems } from '../ListCard';
import { Item } from '../ListItem';

export const useEditState = () => {
    const [list, setList] = useState<ListWithItems>();

    const updateList = (
        updates:
            | Partial<ListWithItems>
            | ((prev: ListWithItems) => Partial<ListWithItems>)
    ) => {
        setList((prev) => {
            if (!prev) throw new Error('List not initialized');
            const resolvedUpdates =
                typeof updates === 'function' ? updates(prev) : updates;
            return { ...prev, ...resolvedUpdates };
        });
    };

    const setItems = (updater: (prev: Item[]) => Item[]) => {
        updateList((prev) => ({
            items: updater(prev.items),
        }));
    };

    return { list, setList, updateList, setItems };
};

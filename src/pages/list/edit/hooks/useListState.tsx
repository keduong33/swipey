import { useCallback, useState } from 'react';
import { ListWithItems } from '../../ListCard';
import { Item } from '../../ListItem';

export type UpdateListOpts =
    | Partial<ListWithItems>
    | ((prev: ListWithItems) => Partial<ListWithItems>);

export const useEditListState = () => {
    const [list, setList] = useState<ListWithItems>();

    const updateList = useCallback((updates: UpdateListOpts) => {
        setList((prev) => {
            if (!prev) throw new Error('List not initialized');
            const resolvedUpdates =
                typeof updates === 'function' ? updates(prev) : updates;
            return { ...prev, ...resolvedUpdates };
        });
    }, []);

    const setItems = useCallback(
        (updater: (prev: Item[]) => Item[]) => {
            updateList((prev) => ({
                items: updater(prev.items),
            }));
        },
        [updateList]
    );

    return { list, setList, updateList, setItems };
};

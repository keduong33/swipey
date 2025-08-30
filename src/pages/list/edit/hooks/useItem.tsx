import { Item } from '../../ListItem';
import { useOnlineItemEdit } from './useItemOnline';

export const useEditItem = ({
    isOnline,
    setItems,
    saveItemLocally,
    deleteItemLocally,
}: {
    isOnline: boolean;
    setItems: (updater: (prev: Item[]) => Item[]) => void;
    saveItemLocally: (item: Item) => void;
    deleteItemLocally: (id: string) => void;
}) => {
    const { updateItemNameMutation, removeItemMutation } = useOnlineItemEdit();

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));

        if (isOnline) {
            removeItemMutation.mutate({
                data: {
                    itemId: id,
                },
            });
        } else {
            deleteItemLocally(id);
        }
    };

    const updateItemName = (name: string, item: Item) => {
        if (name === item.name) return;

        const newItem = {
            ...item,
            name,
        } satisfies Item;

        setItems((prev) =>
            prev.map((currentItem) => {
                return currentItem.id === item.id
                    ? { ...currentItem, name }
                    : currentItem;
            })
        );

        if (isOnline) {
            updateItemNameMutation.mutate({
                data: {
                    itemId: item.id,
                    name,
                },
            });
        } else {
            saveItemLocally(newItem);
        }
    };

    const updateItemImage = (image: string, item: Item) => {
        const newItem = {
            ...item,
            imageUrl: image,
        } satisfies Item;

        setItems((prev) =>
            prev.map((currentItem) => {
                return currentItem.id === item.id
                    ? { ...currentItem, imageUrl: image }
                    : currentItem;
            })
        );

        if (isOnline) {
        } else {
            saveItemLocally(newItem);
        }
    };

    return { removeItem, updateItemName, updateItemImage };
};

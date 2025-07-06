import { Item, ListItem } from './ListItem';

export const ListItems = ({
    items,
    setItems,
    handleImageUpload,
    loadingImageIds,
}: {
    items: Item[];
    setItems: (updater: (prev: Item[]) => Item[]) => void;
    handleImageUpload: (id: string, file: File | undefined) => void;
    loadingImageIds: Set<string>;
}) => {
    const removeItem = (id: string) => {
        if (items.length >= 1) {
            setItems((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const updateItemName = (id: string, name: string) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, name } : item))
        );
    };

    return (
        <>
            {items.map((item) => (
                <ListItem
                    key={item.id}
                    item={item}
                    showDeleteItemButton={items.length >= 1}
                    handleImageUpload={handleImageUpload}
                    updateItemName={updateItemName}
                    removeItem={removeItem}
                    isLoading={loadingImageIds.has(item.id)}
                />
            ))}
        </>
    );
};

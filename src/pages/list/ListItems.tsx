import imageCompression from 'browser-image-compression';
import { ChangeEvent } from 'react';
import { Item, ListItem } from './ListItem';

export const ListItems = ({
    items,
    setItems,
}: {
    items: Item[];
    setItems: (items: Item[]) => void;
}) => {
    const removeItem = (id: string) => {
        if (items.length >= 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const updateItemName = (id: string, name: string) => {
        setItems(
            items.map((item) => (item.id === id ? { ...item, name } : item))
        );
    };

    const handleImageUpload = async (
        id: string,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.1,
                useWebWorker: true,
            });

            const compressedImageUrl =
                await imageCompression.getDataUrlFromFile(compressed);

            setItems(
                items.map((item) =>
                    item.id === id
                        ? { ...item, image: compressedImageUrl }
                        : item
                )
            );
        }
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
                />
            ))}
        </>
    );
};

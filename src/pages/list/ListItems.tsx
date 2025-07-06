import imageCompression from 'browser-image-compression';
import { ChangeEvent } from 'react';
import { Item, ListItem } from './ListItem';

export const ListItems = ({
    items,
    setItems,
}: {
    items: Item[];
    setItems: (updater: (prev: Item[]) => Item[]) => void;
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

    const updateItemImage = (id: string, image: string) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, image } : item))
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

            console.log(
                `image before compressed: ${file.size}`,
                `image after compressed: ${compressed.size}`
            );

            updateItemImage(id, compressedImageUrl);
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

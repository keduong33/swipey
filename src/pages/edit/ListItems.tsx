import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Item, ListItem } from './ListItem';

export const ListItems = ({
    items,
    setItems,
}: {
    items: Item[];
    setItems: Dispatch<SetStateAction<Item[]>>;
}) => {
    const removeItem = (id: number) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const updateItemName = (id: number, name: string) => {
        setItems(
            items.map((item) => (item.id === id ? { ...item, name } : item))
        );
    };

    const handleImageUpload = (
        id: number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setItems(
                items.map((item) =>
                    item.id === id ? { ...item, image: imageUrl } : item
                )
            );
        }
    };

    return (
        <>
            {items.map((item) => (
                <ListItem
                    item={item}
                    showDeleteItemButton={items.length > 1}
                    handleImageUpload={handleImageUpload}
                    updateItemName={updateItemName}
                    removeItem={removeItem}
                />
            ))}
        </>
    );
};

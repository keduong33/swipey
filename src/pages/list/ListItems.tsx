import { ImageUploadStatusMap } from './edit/hooks/useImageUpload';
import { useOfflineEdit } from './edit/hooks/useOffline';
import { ListWithItems } from './ListCard';
import { Item, ListItem } from './ListItem';

export const ListItems = ({
    list,
    setItems,
    handleImageUpload,
    imageUploadStatusMap,
    isOnline,
}: {
    list: ListWithItems;
    setItems: (updater: (prev: Item[]) => Item[]) => void;
    handleImageUpload: (item: Item, file: File | undefined) => void;
    imageUploadStatusMap: ImageUploadStatusMap;
    isOnline: boolean;
}) => {
    const { saveItemLocally, deleteItemLocally } = useOfflineEdit();
    return (
        <>
            {list.items.sort(byLatestUpdate).map((item) => (
                <ListItem
                    key={item.id}
                    item={item}
                    handleImageUpload={handleImageUpload}
                    imageUploadStatus={imageUploadStatusMap.get(item.id)}
                    saveItemLocally={saveItemLocally}
                    deleteItemLocally={deleteItemLocally}
                    isOnline={isOnline}
                    setItems={setItems}
                />
            ))}
        </>
    );
};

const byName = (a: Item, b: Item) => {
    return a.name.localeCompare(b.name);
};

const byLatestUpdate = (a: Item, b: Item) => {
    return new Date(b.editedAt).getTime() - new Date(a.editedAt).getTime();
};

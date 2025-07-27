import imageCompression from 'browser-image-compression';
import { useState } from 'react';
import { Item } from '../../ListItem';

export type ImageUploadStatus = 'uploading' | 'error';
export type ImageUploadStatusMap = Map<string, ImageUploadStatus>;
export const useImageUpload = ({
    isOnline,
    setItems,
    saveItemLocally,
}: {
    isOnline: boolean;
    setItems: (updater: (prev: Item[]) => Item[]) => void;
    saveItemLocally: (item: Item) => void;
}) => {
    const [imageUploadStatusMap, setImageUploadStatusMap] =
        useState<ImageUploadStatusMap>(new Map());

    const handleImageUpload = async (item: Item, file: File | undefined) => {
        if (!file) return;

        try {
            setImageUploadStatusMap((prev) => {
                const next = new Map(prev);
                next.set(item.id, 'uploading');
                return next;
            });
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.1,
                useWebWorker: true,
            });
            console.log(
                `image before compressed: ${file.size / 1024 / 1024} MB`,
                `image after compressed: ${compressed.size / 1024 / 1024} MB`
            );

            if (isOnline) {
            } else {
                const compressedImageUrl =
                    await imageCompression.getDataUrlFromFile(compressed);

                const updatedItem = {
                    ...item,
                    imageUrl: compressedImageUrl,
                } satisfies Item;

                setItems((prev) =>
                    prev.map((currentItem) =>
                        currentItem.id === item.id ? updatedItem : currentItem
                    )
                );

                saveItemLocally(updatedItem);
            }
            setImageUploadStatusMap((prev) => {
                const next = new Map(prev);
                next.delete(item.id);
                return next;
            });
        } catch (error) {
            alert('Failed to upload images');
            console.error('Error on uploading images:', error);
            setImageUploadStatusMap((prev) => {
                const next = new Map(prev);
                next.set(item.id, 'error');
                return next;
            });
        }
    };

    return { handleImageUpload, imageUploadStatusMap };
};

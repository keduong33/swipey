import { Upload } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { v4 } from 'uuid';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Item } from './ListItem';

export function MultipleUploads({
    handleImageUpload,
    setItems,
}: {
    handleImageUpload: (id: string, file: File | undefined) => void;
    setItems: (updater: (prev: Item[]) => Item[]) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleMultipleUploads = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const newItemsWithIds = files.map((file) => ({
            id: v4(),
            name: getDefaultName(file.name),
            image: null,
        }));

        setItems((prev) => [...prev, ...newItemsWithIds]);

        newItemsWithIds.map((item, index) => {
            handleImageUpload(item.id, files[index]);
        });
    };

    return (
        <>
            <Button
                variant="outline"
                onClick={() => {
                    inputRef.current?.click();
                }}
            >
                <Upload className="w-6 h-6 text-gray-400" />
                <p className="text-xs text-muted-foreground">Upload Image(s)</p>
            </Button>
            <Input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleMultipleUploads(e)}
                className="hidden"
                id={`multiple-upload`}
            />
        </>
    );
}

function getDefaultName(filename: string) {
    return filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
}

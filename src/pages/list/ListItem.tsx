import { ImageIcon, X } from 'lucide-react';
import { ChangeEvent } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export type Item = {
    id: number;
    name: string;
    image: string | null;
};

export const ListItem = ({
    item,
    showDeleteItemButton,
    handleImageUpload,
    updateItemName,
    removeItem,
}: {
    item: Item;
    showDeleteItemButton: boolean;
    handleImageUpload: (
        id: number,
        event: ChangeEvent<HTMLInputElement>
    ) => void;
    updateItemName: (id: number, name: string) => void;
    removeItem: (id: number) => void;
}) => (
    <div key={item.id} className="relative">
        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:border-gray-400 transition-colors">
            {item.image ? (
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                <label
                    htmlFor={`image-upload-${item.id}`}
                    className="text-center p-2 cursor-pointer"
                >
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(item.id, e)}
                        className="hidden"
                        id={`image-upload-${item.id}`}
                    />
                    <p className={`text-xs text-gray-500`}>Upload</p>
                </label>
            )}
        </div>
        <Input
            placeholder="Item name"
            value={item.name}
            onChange={(e) => updateItemName(item.id, e.target.value)}
        />
        {showDeleteItemButton && (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
                <X className="w-3 h-3" />
            </Button>
        )}
    </div>
);

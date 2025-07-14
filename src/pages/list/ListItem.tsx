import { ImageIcon, Loader2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Database } from '../../integrations/supabase/database.types';

export type Item = Database['public']['Tables']['Item']['Row'];

export const ListItem = ({
    item,
    showDeleteItemButton,
    handleImageUpload,
    updateItemName,
    removeItem,
    isLoading,
}: {
    item: Item;
    showDeleteItemButton: boolean;
    handleImageUpload: (id: string, file: File | undefined) => void;
    updateItemName: (id: string, name: string) => void;
    removeItem: (id: string) => void;
    isLoading?: boolean;
}) => {
    return (
        <div key={item.id} className="relative space-y-1">
            <div
                className={`aspect-square border ${item.imageUrl ?? 'border-dashed border-2'} rounded-lg flex flex-col items-center justify-center bg-card shadow-sm hover:border-border-hover transition-colors`}
            >
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : item.imageUrl ? (
                    <img
                        src={item.imageUrl}
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
                            onChange={(e) =>
                                handleImageUpload(item.id, e.target.files?.[0])
                            }
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
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-destructive hover:bg-destructive-hover dark:hover:bg-destructive-hover hover:text-white text-white rounded-full"
                >
                    <X className="w-3 h-3" />
                </Button>
            )}
        </div>
    );
};

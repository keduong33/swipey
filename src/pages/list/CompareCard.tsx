import { ImageIcon } from 'lucide-react';
import { Card, CardContent, CardTitle } from '~/components/ui/card';
import { Item } from './ListItem';

export const CompareCard = ({
    item,
    onClick,
}: {
    item: Item;
    onClick?: () => void;
}) => (
    <Card
        key={item.id}
        className="hover:shadow-lg transition-shadow cursor-pointer w-1/2"
        onClick={onClick}
    >
        <CardContent>
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
                    </label>
                )}
            </div>
        </CardContent>
        <CardTitle className="text-xl text-center select-none">
            {item.name}
        </CardTitle>
    </Card>
);

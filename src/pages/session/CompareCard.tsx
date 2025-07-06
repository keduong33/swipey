import { ImageIcon } from 'lucide-react';
import { motion, useAnimate } from 'motion/react';
import { useRef, useState } from 'react';
import { Card, CardContent, CardTitle } from '~/components/ui/card';
import { Item } from '../list/ListItem';

export const CompareCard = ({
    direction,
    item,
    onChoose,
}: {
    direction: 'left' | 'right';
    item: Item;
    onChoose?: (choice: 'left' | 'right') => void;
}) => {
    const dragOffset = useRef(0);

    const [scope, animate] = useAnimate();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSwipe = async (direction: 'left' | 'right') => {
        const x = direction === 'left' ? -200 : 200;
        setIsAnimating(true);
        await animate(scope.current, {
            x,
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeInOut' },
        });
        onChoose?.(direction);
        animate(scope.current, { x: 0, opacity: 1 });
        setIsAnimating(false);
    };
    return (
        <motion.div
            className={`transition-shadow ${isAnimating ? 'pointer-events-none' : 'cursor-pointer'} w-[275px] md:w-full`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            whileTap={{ scale: 0.95 }}
            ref={scope}
            onDrag={(_, info) => {
                dragOffset.current = info.offset.x;
            }}
            onDragEnd={() => {
                if (direction === 'left') {
                    handleSwipe(direction);
                } else if (direction === 'right') {
                    handleSwipe(direction);
                }
            }}
            onTap={() => {
                // Only count it as a click if drag was minimal
                if (Math.abs(dragOffset.current) < 10) {
                    handleSwipe(direction);
                }
                // Reset for next interaction
                dragOffset.current = 0;
            }}
        >
            <Card
                key={item.id}
                className={`hover:shadow-xl hover:bg-third-primary dark:hover:bg-third-primary ${isAnimating ? 'bg-third-primary' : ''} transition-colors`}
            >
                <CardContent className="pointer-events-none ">
                    <div className="w-full aspect-square border-2 rounded-lg flex flex-col items-center justify-center transition-colors bg-card dark:bg-gray-200">
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
                <CardTitle className="text-xl text-center select-none min-h-[2rem]">
                    {item.name}
                </CardTitle>
            </Card>
        </motion.div>
    );
};

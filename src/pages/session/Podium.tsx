import { ImageIcon } from 'lucide-react';
import { Item } from '../list/ListItem';

type PodiumConfig = {
    emoji: string;
    topGradient: string;
    bottomGradient: string;
    imageSize: string;
    podiumHeight: string;
    position: number;
    shadowIntensity: string;
};

const podiumConfigs: Record<1 | 2 | 3, PodiumConfig> = {
    1: {
        emoji: '👑',
        topGradient: 'from-amber-500 to-yellow-400',
        bottomGradient: 'from-amber-500 to-yellow-600',
        imageSize: 'w-32 h-32',
        podiumHeight: 'h-32',
        position: 1,
        shadowIntensity: 'shadow-xl',
    },
    2: {
        emoji: '🥈',
        topGradient: 'from-gray-400 to-gray-300',
        bottomGradient: 'from-gray-400 to-gray-500',
        imageSize: 'w-24 h-24',
        podiumHeight: 'h-24',
        position: 2,
        shadowIntensity: 'shadow-lg',
    },
    3: {
        emoji: '🥉',
        topGradient: 'from-orange-600 to-orange-400',
        bottomGradient: 'from-orange-600 to-red-500',
        imageSize: 'w-24 h-24',
        podiumHeight: 'h-16',
        position: 3,
        shadowIntensity: 'shadow-lg',
    },
};

export const Podium = ({ item, place }: { item: Item; place: 1 | 2 | 3 }) => {
    const config = podiumConfigs[place];

    return (
        <div className="flex flex-col items-center w-full">
            <div className="text-3xl mb-1">{config.emoji}</div>
            <div
                className={`bg-gradient-to-t ${config.topGradient} text-white p-3 rounded-t-lg ${config.shadowIntensity} w-full`}
            >
                {item?.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className={`${config.imageSize} object-cover rounded-lg mx-auto mb-3 border-2 border-white`}
                    />
                ) : (
                    <label
                        htmlFor={`image-upload-${item.id}`}
                        className="text-center p-2 cursor-pointer"
                    >
                        <ImageIcon
                            className={`${config.imageSize} text-gray-400 mx-auto mb-2 rounded-lg border border-gray-200 bg-white`}
                        />
                    </label>
                )}
                <div className="text-center">
                    <h3 className="font-bold text-sm leading-tight">
                        {item?.name}
                    </h3>
                </div>
            </div>
            <div
                className={`bg-gradient-to-b ${config.bottomGradient} w-full ${config.podiumHeight} rounded-b-lg flex items-center justify-center`}
            >
                <span className="text-white font-bold text-3xl">
                    {config.position}
                </span>
            </div>
        </div>
    );
};

export const FirstPlacePodium = ({ firstItem }: { firstItem: Item }) => (
    <div className="flex flex-col items-center w-full">
        <div className="text-3xl mb-1">👑</div>
        <div className="bg-gradient-to-t from-amber-500 to-yellow-400 text-white p-3 rounded-t-lg shadow-xl w-full">
            {firstItem?.image ? (
                <img
                    src={firstItem.image}
                    alt={firstItem.name}
                    className="w-32 h-32 object-cover rounded-lg mx-auto mb-3 border-2 border-white"
                />
            ) : (
                <label
                    htmlFor={`image-upload-${firstItem.id}`}
                    className="text-center p-2 cursor-pointer"
                >
                    <ImageIcon className="w-32 h-32 text-gray-400 mx-auto mb-2 rounded-lg border border-gray-200 bg-white" />
                </label>
            )}
            <div className="text-center">
                <h3 className="font-bold text-sm leading-tight">
                    {firstItem?.name}
                </h3>
            </div>
        </div>
        <div className="bg-gradient-to-b from-amber-500 to-yellow-600 w-full h-32 rounded-b-lg flex items-center justify-center">
            <span className="text-white font-bold text-3xl">1</span>
        </div>
    </div>
);

export const SecondPlacePodium = ({ secondItem }: { secondItem: Item }) => (
    <div className="flex flex-col items-center w-full">
        <div className="text-3xl mb-1">🥈</div>
        <div className="bg-gradient-to-t from-gray-400 to-gray-300 text-white p-3 rounded-t-lg shadow-lg w-full">
            {secondItem.image ? (
                <img
                    src={secondItem.image}
                    alt={secondItem.name}
                    className="w-24 h-24 object-cover rounded-lg mx-auto mb-3 border-2 border-white"
                />
            ) : (
                <label
                    htmlFor={`image-upload-${secondItem.id}`}
                    className="text-center p-2 cursor-pointer"
                >
                    <ImageIcon className="w-24 h-24 text-gray-400 mx-auto mb-2 rounded-lg border border-gray-200 bg-white" />
                </label>
            )}
            <div className="text-center">
                <h3 className="font-bold text-sm leading-tight">
                    {secondItem?.name}
                </h3>
            </div>
        </div>
        <div className="bg-gradient-to-b from-gray-400 to-gray-500 w-full h-24 rounded-b-lg flex items-center justify-center">
            <span className="text-white font-bold text-3xl">2</span>
        </div>
    </div>
);

export const ThirdPlacePodium = ({ thirdItem }: { thirdItem: Item }) => (
    <div className="flex flex-col items-center w-full">
        <div className="text-3xl mb-1">🥉</div>
        <div className="bg-gradient-to-t from-orange-600 to-orange-400 text-white p-3 rounded-t-lg shadow-lg w-full">
            {thirdItem?.image ? (
                <img
                    src={thirdItem.image}
                    alt={thirdItem.name}
                    className="w-24 h-24 object-cover rounded-lg mx-auto mb-3 border-2 border-white"
                />
            ) : (
                <label
                    htmlFor={`image-upload-${thirdItem.id}`}
                    className="text-center p-2 cursor-pointer"
                >
                    <ImageIcon className="w-24 h-24 text-gray-400 mx-auto mb-2 rounded-lg border border-gray-200 bg-white" />
                </label>
            )}
            <div className="text-center">
                <h3 className="font-bold text-sm leading-tight">
                    {thirdItem?.name}
                </h3>
            </div>
        </div>
        <div className="bg-gradient-to-b from-orange-600 to-red-500 w-full h-16 rounded-b-lg flex items-center justify-center">
            <span className="text-white font-bold text-3xl">3</span>
        </div>
    </div>
);

export const RemainingRanking = ({ array }: { array: Item[] }) => (
    <div className="space-y-0 w-full">
        {array.slice(3).map((item, index) => (
            <div
                key={item.id || index + 3}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white mb-4"
            >
                {/* Rank Number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white flex items-center justify-center font-bold">
                    {index + 4}
                </div>

                {/* Item Image */}
                <div className="flex-shrink-0">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                    ) : (
                        <ImageIcon className="w-16 h-16 object-cover text-gray-400 rounded-lg border border-gray-200" />
                    )}
                </div>

                {/* Item Details */}
                <div className="flex-grow">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                </div>
            </div>
        ))}
    </div>
);

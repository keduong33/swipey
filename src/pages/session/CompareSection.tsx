import { useEffect } from 'react';
import { Progress } from '../../components/ui/progress';
import { Item } from '../list/ListItem';
import { CompareCard } from './CompareCard';
import { useHumanMergeSort } from './useHumanChoiceMergeSort';

export default function CompareSection({ items }: { items: Item[] }) {
    const { choose, step, currentArray, getNextStep, sortState, progress } =
        useHumanMergeSort(items);

    useEffect(() => {
        getNextStep();
    }, [items]);

    return (
        <div className="max-w-4xl mx-auto">
            {step?.type === 'comparison' && (
                <>
                    <div className="mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <p className="text-lg font-bold">
                                Choose the card you like more
                            </p>
                        </div>
                        <div className="flex width-full justify-center items-center gap-8">
                            <CompareCard
                                item={step?.leftItem}
                                onClick={() => choose('left')}
                            />
                            <p className="font-black text-gray-900">VS</p>
                            <CompareCard
                                item={step?.rightItem}
                                onClick={() => choose('right')}
                            />
                        </div>
                    </div>

                    <div className="mb-8 gap-4 flex justify-center items-center flex-col">
                        <p>
                            {sortState.currentComparison} out of{' '}
                            {sortState.totalComparisons} matches done
                        </p>
                        <div className="w-full flex items-center justify-center gap-3">
                            <Progress
                                value={progress}
                                className="[&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:via-indigo-500 [&>div]:to-purple-600"
                            />
                            <span className="text-sm">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>
                </>
            )}

            {step?.type === 'complete' && (
                <ol>
                    {currentArray.map((item, i) => (
                        <li>
                            {i + 1}. {item.name}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

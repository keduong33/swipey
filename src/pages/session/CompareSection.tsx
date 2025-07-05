import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Result } from '~/hooks/useGetResult';
import { CircularProgress } from '../../components/CircularProgress';
import { localDb } from '../../storage/indexedDbStorage';
import { List } from '../list/listCard';
import { CompareCard } from './CompareCard';
import { useHumanMergeSort } from './useHumanChoiceMergeSort';

export default function CompareSection({ list }: { list: List }) {
    const { name, description, items } = list;

    const { choose, step, currentArray, getNextStep, sortState, progress } =
        useHumanMergeSort(items);
    const navigate = useNavigate();

    const displayProgress = step?.type === 'complete' ? 100 : progress;

    useEffect(() => {
        getNextStep();
    }, [items]);

    useEffect(() => {
        if (step?.type === 'complete') {
            const result: Result = {
                // Note: right now, 1 history per list
                id: list.id,
                listId: list.id,
                name: name ?? 'Your list',
                currentArray,
                comparisons: sortState.currentComparison,
            };

            localDb.saveResult(result).then(() => {
                navigate({ to: `/result/${result.id}` });
            });
        }
    }, [step]);

    return (
        <>
            <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">
                {name || 'Untitled List'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                {description || ''}
            </p>
            <div className="overflow-x-hidden w-full">
                {step?.type === 'comparison' && (
                    <>
                        <div className="mb-2 max-w-4xl w-full justify-self-center gap-4 flex flex-col">
                            <div className="flex items-center justify-center flex-col">
                                <p className="text-gray-600 dark:text-gray-400">
                                    (Max {sortState.totalComparisons}{' '}
                                    comparisons)
                                </p>
                                <p className="text-lg font-bold">
                                    Choose the card you like more
                                </p>
                            </div>
                            <div className="w-full justify-center items-center gap-2 hidden md:flex md:gap-8">
                                <CompareCard
                                    direction="left"
                                    item={step?.leftItem}
                                    onChoose={choose}
                                />

                                <CompareCard
                                    direction="right"
                                    item={step?.rightItem}
                                    onChoose={choose}
                                />
                            </div>

                            <div className="w-full flex flex-col gap-2 md:hidden">
                                <div className="w-full">
                                    <CompareCard
                                        direction="left"
                                        item={step?.leftItem}
                                        onChoose={choose}
                                    />
                                </div>
                                <div className="w-full flex justify-end">
                                    <CompareCard
                                        direction="right"
                                        item={step?.rightItem}
                                        onChoose={choose}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center items-center flex-col">
                                <p>
                                    {sortState.currentComparison} out of{' '}
                                    {sortState.totalComparisons} matches done
                                </p>
                                {/* <div className="w-full flex items-center justify-center gap-3">
                            <Progress
                                value={progress}
                                className="[&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:via-indigo-500 [&>div]:to-purple-600"
                            />
                            <span className="text-sm">
                                {Math.round(progress)}%
                            </span>
                        </div> */}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 md:right-4">
                            <CircularProgress
                                strokeWidth={10}
                                size={80}
                                value={Math.round(displayProgress)}
                                showLabel
                                renderLabel={(progress) => `${progress}%`}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

import { useCallback, useState } from 'react';
import { Item } from '../list/ListItem';

type ComparisonStep = {
    type: 'comparison';
    leftItem: Item;
    rightItem: Item;
    leftSubarray: Item[];
    rightSubarray: Item[];
};

type CompleteStep = {
    type: 'complete';
};

type Step = ComparisonStep | CompleteStep | null;

type SortState = {
    size: number;
    leftStart: number;
    isComplete: boolean;
    totalComparisons: number;
    currentComparison: number;
    leftArray: Item[];
    rightArray: Item[];
    leftIndex: number;
    rightIndex: number;
    mergeIndex: number;
    waitingForChoice: boolean;
    currentArray: Item[];
};

const defaultState: SortState = {
    size: 1,
    leftStart: 0,
    isComplete: false,
    totalComparisons: 0,
    currentComparison: 0,
    leftArray: [],
    rightArray: [],
    leftIndex: 0,
    rightIndex: 0,
    mergeIndex: 0,
    waitingForChoice: false,
    currentArray: [],
};

const estimateComparisons = (n: number) => Math.ceil(n * Math.log2(n));

export function useHumanMergeSort(initial: Item[] = []) {
    const [originalArray, setOriginalArray] = useState<Item[]>([...initial]);
    const [step, setStep] = useState<Step>(null);
    const [sortState, setSortState] = useState<SortState>({
        ...defaultState,
        totalComparisons: estimateComparisons(initial.length),
        currentArray: [...initial],
    });

    const reset = useCallback(
        (array: Item[] = originalArray) => {
            const freshArray = [...array];
            setOriginalArray(freshArray);
            setSortState({
                ...defaultState,
                totalComparisons: estimateComparisons(freshArray.length),
                currentArray: freshArray,
            });
            setStep(null);
        },
        [originalArray]
    );

    const getNextStep = useCallback(() => {
        setSortState((prev) => {
            if (prev.isComplete || prev.waitingForChoice) return prev;

            const n = prev.currentArray.length;
            const newState = { ...prev };

            while (true) {
                // If we're done with this level, move to the next merge size
                if (newState.leftStart >= n - 1) {
                    newState.size *= 2;
                    newState.leftStart = 0;
                    if (newState.size >= n) {
                        newState.isComplete = true;
                        setStep({ type: 'complete' });
                        return newState;
                    }
                }

                const mid = Math.min(
                    newState.leftStart + newState.size - 1,
                    n - 1
                );
                const rightEnd = Math.min(
                    newState.leftStart + newState.size * 2 - 1,
                    n - 1
                );

                // Skip invalid pairs
                if (mid >= rightEnd) {
                    newState.leftStart += newState.size * 2;
                    continue;
                }

                // Slice out the subarrays for comparison
                newState.leftArray = newState.currentArray.slice(
                    newState.leftStart,
                    mid + 1
                );
                newState.rightArray = newState.currentArray.slice(
                    mid + 1,
                    rightEnd + 1
                );
                newState.leftIndex = 0;
                newState.rightIndex = 0;
                newState.mergeIndex = newState.leftStart;
                break;
            }

            newState.waitingForChoice = true;
            setStep({
                type: 'comparison',
                leftItem: newState.leftArray[0],
                rightItem: newState.rightArray[0],
                leftSubarray: [...newState.leftArray],
                rightSubarray: [...newState.rightArray],
            });

            return newState;
        });
    }, []);

    const choose = useCallback(
        (choice: 'left' | 'right') => {
            setSortState((prev) => {
                if (!prev.waitingForChoice) return prev;

                const newState = { ...prev };
                const newArray = [...newState.currentArray];
                const isLeft = choice === 'left';

                newArray[newState.mergeIndex] = isLeft
                    ? newState.leftArray[newState.leftIndex]
                    : newState.rightArray[newState.rightIndex];

                if (isLeft) newState.leftIndex++;
                else newState.rightIndex++;

                newState.mergeIndex++;
                newState.currentComparison++;
                newState.waitingForChoice = false;

                // Continue comparing next items in the same merge step
                if (
                    newState.leftIndex < newState.leftArray.length &&
                    newState.rightIndex < newState.rightArray.length
                ) {
                    newState.waitingForChoice = true;
                    setStep({
                        type: 'comparison',
                        leftItem: newState.leftArray[newState.leftIndex],
                        rightItem: newState.rightArray[newState.rightIndex],
                        leftSubarray: [...newState.leftArray],
                        rightSubarray: [...newState.rightArray],
                    });
                } else {
                    // Merge remaining items from whichever subarray is not yet exhausted
                    while (newState.leftIndex < newState.leftArray.length) {
                        newArray[newState.mergeIndex++] =
                            newState.leftArray[newState.leftIndex++];
                    }
                    while (newState.rightIndex < newState.rightArray.length) {
                        newArray[newState.mergeIndex++] =
                            newState.rightArray[newState.rightIndex++];
                    }

                    newState.leftStart += newState.size * 2;
                }

                newState.currentArray = newArray;

                return newState;
            });
            getNextStep();
        },
        [getNextStep]
    );

    return {
        originalArray,
        currentArray: sortState.currentArray,
        sortState,
        step,
        progress:
            sortState.totalComparisons > 0
                ? (sortState.currentComparison / sortState.totalComparisons) *
                  100
                : 0,
        isComplete: sortState.isComplete,
        isWaitingForChoice: sortState.waitingForChoice,
        reset,
        getNextStep,
        choose,
    };
}

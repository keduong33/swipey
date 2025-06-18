export const handlePick = ({
    selectedLeft,
    currentMatchesDone,
    setCurrentMatchesDone,
    leftIndex,
    setLeftIndex,
    rightIndex,
    setRightIndex,
    totalMatches,
    numberOfItems,
}: {
    selectedLeft: boolean;
    currentMatchesDone: number;
    setCurrentMatchesDone: (value: number) => void;
    leftIndex: number;
    setLeftIndex: (value: number) => void;
    rightIndex: number;
    setRightIndex: (value: number) => void;
    totalMatches: number;
    numberOfItems: number;
}) => {
    // In the future, we will do something with the selectedLeft param

    if (currentMatchesDone < totalMatches) {
        setCurrentMatchesDone(currentMatchesDone + 1);
    }
    if (leftIndex < numberOfItems - 1) {
        setLeftIndex(leftIndex + 1);
    }
    if (rightIndex < numberOfItems - 1) {
        setRightIndex(rightIndex + 1);
    }
};

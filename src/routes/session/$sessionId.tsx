import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { useGetList } from '~/hooks/useGetList';
import { CompareCard } from '~/pages/list/CompareCard';
import { List } from '~/pages/list/listCard';
import { Item } from '~/pages/list/ListItem';
import Page from '../../components/page';

export const Route = createFileRoute('/session/$sessionId')({
    component: Session,
});

async function Session() {
    const [currentMatchesDone, setCurrentMatchesDone] = useState(0);
    const [leftIndex, setLeftIndex] = useState<number>(0);
    const [rightIndex, setRightIndex] = useState<number>(1);

    const { sessionId } = Route.useParams();
    const navigate = Route.useNavigate();
    const { lists } = useGetList();
    const retrievedList: List | undefined = lists.get(sessionId);

    const [leftPicked, setLeftPicked] = useState<boolean | undefined>(
        undefined
    );

    const mergeSortInteractive = async (items: Item[]): Promise<Item[]> => {
        if (items.length <= 1) return items;

        const mid: number = Math.floor(items.length / 2);
        const left: Promise<Item[]> = mergeSortInteractive(items.slice(0, mid));
        const right: Promise<Item[]> = mergeSortInteractive(items.slice(mid));

        const result: Item[] = [];
        let i = 0,
            j = 0;

        // console.log('me outside here');

        while (i < (await left).length && j < (await right).length) {
            setLeftIndex(i);
            setRightIndex(j);
            // console.log('me inside here');

            await leftPicked;
            if (leftPicked === true) {
                console.log('Left picked');
                result.push((await left)[i++]);
            } else if (leftPicked === false) {
                console.log('Right picked');
                result.push((await right)[j++]);
            }
            setLeftPicked(undefined);
        }

        return result
            .concat((await left).slice(i))
            .concat((await right).slice(j));
    };

    useEffect(() => {
        const run = async () => {
            const sortedItems = await mergeSortInteractive(items);
            console.log(sortedItems);
        };

        run();
    }, []);

    // const [mergeState, setMergeState] = useState<{
    //     results: Item[];
    //     left: string[];
    //     right: string[];
    //     i: number;
    //     j: number;
    //     totalComparisons: number;
    //     comparisonsDone: number;
    //     completed: boolean;
    // }>({
    //     results: [],
    //     left: [],
    //     right: [],
    //     i: 0,
    //     j: 0,
    //     totalComparisons: 0,
    //     comparisonsDone: 0,
    //     completed: false,
    // });

    if (!retrievedList) {
        return (
            <Page headerConfig={{ sessionId }}>
                <Button
                    size="lg"
                    className="sm:w-auto bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate({ to: '/' })}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Go back to Home
                </Button>
                <p>List not found :(</p>
            </Page>
        );
    }

    const { items: retrievedListItems, name, description } = retrievedList;
    const numberOfItems: number = retrievedListItems.length;
    const totalMatches: number = Math.floor(
        numberOfItems * Math.log(numberOfItems)
    );
    const currentPercentageDone: number =
        (currentMatchesDone / totalMatches) * 100;

    const items: Item[] = Array.from(retrievedListItems.values());
    const leftItem: Item = items[leftIndex];
    const rightItem: Item = items[rightIndex];

    const handlePickLeft = () => {
        setLeftPicked(true);
        if (currentMatchesDone < totalMatches) {
            setCurrentMatchesDone(currentMatchesDone + 1);
        }
        // if (leftIndex < numberOfItems - 1) {
        //     setLeftIndex(leftIndex + 1);
        // }
        // if (rightIndex < numberOfItems - 1) {
        //     setRightIndex(rightIndex + 1);
        // }
    };

    const handlePickRight = () => {
        if (currentMatchesDone < totalMatches) {
            setCurrentMatchesDone(currentMatchesDone + 1);
        }
        // In the future, right pick logic will be diff from left pick
        // handlePickLeft();
        setLeftPicked(false);
    };

    return (
        <Page headerConfig={{ sessionId }}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {name || 'Untitled List'}
                    </h1>
                    <p className="text-lg text-gray-600">{description || ''}</p>
                    <p className="text-gray-600">
                        ({numberOfItems} items to rank)
                    </p>
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <p className="text-lg font-bold">
                            Choose the card you like more
                        </p>
                    </div>
                    <div className="flex width-full justify-center items-center gap-8">
                        <CompareCard
                            item={leftItem}
                            onClick={() => handlePickLeft()}
                        />
                        <p className="font-black text-gray-900">VS</p>
                        <CompareCard
                            item={rightItem}
                            onClick={() => handlePickRight()}
                        />
                    </div>
                </div>

                <div className="mb-8 gap-4 flex justify-center items-center flex-col">
                    <p>
                        {currentMatchesDone} out of {totalMatches} matches done
                    </p>
                    <div className="w-full flex items-center justify-center gap-3">
                        <Progress
                            value={currentPercentageDone}
                            className="[&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:via-indigo-500 [&>div]:to-purple-600"
                        />
                        <span className="text-sm">
                            {Math.round(currentPercentageDone)}%
                        </span>
                    </div>
                </div>
            </div>
        </Page>
    );
}

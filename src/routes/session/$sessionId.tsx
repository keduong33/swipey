import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { useGetList } from '~/hooks/useGetList';
import { CompareCard } from '~/pages/list/CompareCard';
import { List } from '~/pages/list/listCard';
import { Item } from '~/pages/list/ListItem';
import { handlePick } from '~/pages/session/services';
import Page from '../../components/page';

export const Route = createFileRoute('/session/$sessionId')({
    component: Session,
});

function Session() {
    const [currentMatchesDone, setCurrentMatchesDone] = useState(0);
    const [leftIndex, setLeftIndex] = useState<number>(0);
    const [rightIndex, setRightIndex] = useState<number>(1);

    const { sessionId } = Route.useParams();
    const navigate = useNavigate();
    const { lists } = useGetList();
    const retrievedList: List | undefined = lists.get(sessionId);

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
                            onClick={() =>
                                handlePick({
                                    selectedLeft: true,
                                    currentMatchesDone,
                                    setCurrentMatchesDone,
                                    leftIndex,
                                    setLeftIndex,
                                    rightIndex,
                                    setRightIndex,
                                    totalMatches,
                                    numberOfItems,
                                })
                            }
                        />
                        <p className="font-black text-gray-900">VS</p>
                        <CompareCard
                            item={rightItem}
                            onClick={() =>
                                handlePick({
                                    selectedLeft: false,
                                    currentMatchesDone,
                                    setCurrentMatchesDone,
                                    leftIndex,
                                    setLeftIndex,
                                    rightIndex,
                                    setRightIndex,
                                    totalMatches,
                                    numberOfItems,
                                })
                            }
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

import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Result } from '~/hooks/useGetResult';
import { ShareDialog } from '~/routes/list';
import { Podium, RemainingRanking } from './Podium';

export default function ResultsSection({ result }: { result: Result }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const { name, currentArray, comparisons } = result;

    const pretty: string = JSON.stringify([result], null, 2);

    const onDownload = (file: string) => {
        const blob = new Blob([file], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${name || 'my-list'}.json`;
        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4 justify-items-center">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">
                    Ranking results
                </h1>
                <p>{name}</p>
            </div>

            <div className="relative mb-4 md:w-2/3">
                <div>
                    {/* Podium for Top 3 */}
                    <div className="flex items-end gap-4 w-full mb-4">
                        {currentArray.length >= 3 ? (
                            <>
                                <Podium item={currentArray[1]} place={2} />
                                <Podium item={currentArray[0]} place={1} />
                                <Podium item={currentArray[2]} place={3} />
                            </>
                        ) : (
                            <>
                                <Podium item={currentArray[0]} place={1} />
                                {currentArray.length === 2 && (
                                    <Podium item={currentArray[1]} place={2} />
                                )}
                            </>
                        )}
                    </div>

                    {/* Remaining Rankings */}
                    {<RemainingRanking items={currentArray.slice(3)} />}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 p-6 bg-gradient-to-r from-accent dark:from-[#1b0530] to-[#e0e4fe] dark:to-accent rounded-xl border">
                <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2 text-primary dark:text-white">
                        Ranking Complete! 🎉
                    </h3>
                    <p>
                        You compared {comparisons} pairs to rank{' '}
                        {currentArray.length} items
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-between justify-center">
                <Button
                    onClick={() =>
                        navigate({ to: `/list/use/${result.listId}` })
                    }
                >
                    Rank again
                </Button>
                <Button onClick={() => setDialogOpen(true)}>
                    Download results
                </Button>
            </div>

            <ShareDialog
                title={'Share Results'}
                open={dialogOpen}
                setIsOpen={setDialogOpen}
                pretty={pretty}
                onDownload={onDownload}
            ></ShareDialog>
        </div>
    );
}

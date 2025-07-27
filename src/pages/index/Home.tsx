import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Plus, Users } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { v4 } from 'uuid';
import { useTheme } from '~/components/ThemeProvider';
import Page from '../../components/Page';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { createNewListServerFn } from '../list/edit/edit.api';
import { CustomErrorCause } from '../list/edit/edit_item.api';
import { getListsOptions } from '../list/list.queries';
import { ListCard } from '../list/ListCard';

export default function Home({ userId }: { userId?: string }) {
    const { theme } = useTheme();
    const { data: allLists } = useQuery(getListsOptions(!!userId));

    const newList = useMutation({
        mutationFn: useServerFn(createNewListServerFn),
        onError: (error) => {
            if (error.cause === CustomErrorCause.UPGRADE_REQUIRED) {
                console.log('Upgrade required');
            }
            alert(error.message);
        },
        onSuccess: (listId) => {
            navigate({ to: `/list/edit/${listId}` });
        },
    });

    const userLists = allLists?.filter((list) => list.userId === userId);
    const nonUserLists = allLists?.filter((list) => list.userId !== userId);

    const navigate = useNavigate();

    return (
        <Page>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 justify-items-center">
                    <img
                        src={`/icon-${theme}.svg`}
                        alt={'Swipey'}
                        className="h-20 my-4"
                    />
                    <h3>Swipe to rank your favourite things</h3>
                </div>

                <div className="mb-8 gap-4 flex justify-center flex-wrap">
                    {/* Create New List Button */}
                    <CreateNewListButton
                        onClick={() =>
                            newList.mutate({
                                data: {
                                    listId: v4(),
                                },
                            })
                        }
                    />
                </div>

                {/* Your Lists Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2>Your Lists</h2>
                        <Button
                            variant="link"
                            className="dark:text-primary-dark"
                            onClick={() => navigate({ to: '/all-lists' })}
                        >
                            View all lists
                        </Button>
                    </div>
                    {userLists?.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <div className="text-gray-500 mb-4">
                                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">
                                        No lists created yet
                                    </p>
                                    <p className="text-sm">
                                        Create your first ranking list to get
                                        started!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {userLists
                                ?.slice(0, 3)
                                .map((list) => (
                                    <ListCard key={list.id} list={list} />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
}

const CreateNewListButton = forwardRef<
    HTMLButtonElement,
    ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
    <Button {...props} ref={ref} size="lg" className="">
        <Plus className="w-5 h-5 mr-2" />
        Create New List
    </Button>
));

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Play, Plus, Users } from 'lucide-react';
import { v4 } from 'uuid';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import Page from '../components/page';
import { useGetList } from '../hooks/useGetList';
import { ListCard } from '../pages/list/listCard';

export const Route = createFileRoute('/')({
    component: Home,
});

export default function Home() {
    const { lists } = useGetList();

    const navigate = useNavigate();

    return (
        <Page headerConfig={{ withProfile: true }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Swipey
                    </h1>
                    <p className="text-lg text-gray-600">
                        Swipe to rank your favorite things
                    </p>
                </div>

                <div className="mb-8 gap-4 flex justify-center">
                    {/* Create New List Button */}
                    <Button
                        size="lg"
                        className="sm:w-auto bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate({ to: `/list/${v4()}` })}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New List
                    </Button>

                    {/* Join session Button */}
                    <Button
                        size="lg"
                        className="sm:w-auto bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate({ to: '/session' })}
                    >
                        <Play className="w-5 h-5 mr-2" />
                        Join session
                    </Button>
                </div>

                {/* Your Lists Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Your Lists
                        </h2>
                        <Button
                            variant="ghost"
                            className="text-purple-600 hover:text-purple-700"
                            onClick={() => navigate({ to: '/all-lists' })}
                        >
                            View all lists
                        </Button>
                    </div>
                    {lists.size === 0 ? (
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
                            {Array.from(lists.values())
                                .slice(0, 3)
                                .map((list) => (
                                    <ListCard
                                        key={list.id}
                                        list={list}
                                        onClick={() =>
                                            navigate({
                                                to: `/list/${list.id}`,
                                            })
                                        }
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
}

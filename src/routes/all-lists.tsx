import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { v4 } from 'uuid';
import Page from '../components/Pagee';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLocalGetLists } from '../hooks/useGetList';
import { ListCard } from '../pages/list/list-card';

export const Route = createFileRoute('/all-lists')({
    component: RouteComponent,
});

function RouteComponent() {
    const { lists } = useLocalGetLists();

    const navigate = useNavigate();

    return (
        <Page>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-primary dark:text-primary-dark hover:bg-accent-darker dark:hover:bg-accent-darker"
                            onClick={() => navigate({ to: `/` })}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h2>All Your Lists</h2>
                    </div>
                    <Button
                        size="lg"
                        className="sm:w-auto"
                        onClick={() => navigate({ to: `/list/${v4()}` })}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New List
                    </Button>
                </div>

                {/* Your Lists Section */}
                <div className="mb-8">
                    {lists?.length === 0 ? (
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
                            {lists?.map((list) => (
                                <ListCard key={list.id} list={list} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
}

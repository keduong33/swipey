import { useNavigate } from '@tanstack/react-router';
import { Plus, Users } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { v4 } from 'uuid';
import Page from '../../components/page';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useLocalGetLists } from '../../hooks/useGetList';
import { ListCard } from '../list/listCard';
import { JsonImportDialog } from './JsonImportSection';

export default function Home() {
    const { lists, fetch } = useLocalGetLists();

    const refresh = async () => {
        await fetch();
    };

    const navigate = useNavigate();

    return (
        <Page>
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

                <div className="mb-8 gap-4 flex justify-center flex-wrap">
                    {/* Create New List Button */}
                    <CreateNewListButton
                        onClick={() => navigate({ to: `/list/edit/${v4()}` })}
                    />
                    <JsonImportDialog refresh={refresh} />
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
                            {lists?.slice(0, 3).map((list) => (
                                <ListCard
                                    key={list.id}
                                    list={list}
                                    onClick={() =>
                                        navigate({
                                            to: `/list/edit/${list.id}`,
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

const CreateNewListButton = forwardRef<
    HTMLButtonElement,
    ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
    <Button
        {...props}
        ref={ref}
        size="lg"
        className="bg-purple-600 hover:bg-purple-700"
    >
        <Plus className="w-5 h-5 mr-2" />
        Create New List
    </Button>
));

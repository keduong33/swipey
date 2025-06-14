'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Clock, Play, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 } from 'uuid';

type Status = 'completed' | 'in-progress' | 'new';
type List = {
    id: number;
    name: string;
    description: string;
    itemCount: number;
    lastPlayed: string;
    status: Status;
};

export default function Home() {
    const [lists, setLists] = useState<List[]>([
        {
            id: 1,
            name: 'Favorite Movies',
            description: 'My top movie picks for 2024',
            itemCount: 12,
            lastPlayed: '2 days ago',
            status: 'completed',
        },
        {
            id: 2,
            name: 'Best Restaurants',
            description: 'Local dining spots to rank',
            itemCount: 8,
            lastPlayed: '1 week ago',
            status: 'in-progress',
        },
        {
            id: 3,
            name: 'Travel Destinations',
            description: 'Places I want to visit',
            itemCount: 15,
            lastPlayed: '3 days ago',
            status: 'new',
        },
    ]);

    const getStatusColor = (status: Status) => {
        switch (status) {
            case 'completed':
                return 'text-green-600';
            case 'in-progress':
                return 'text-yellow-600';
            case 'new':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusText = (status: Status) => {
        switch (status) {
            case 'completed':
                return 'Finished ranking';
            case 'in-progress':
                return 'In progress';
            case 'new':
                return 'Ready to start';
            default:
                return 'Unknown';
        }
    };

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
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
                        onClick={() => router.push(`/edit/${v4()}`)}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New List
                    </Button>

                    {/* Join session Button */}
                    <Button
                        size="lg"
                        className="sm:w-auto bg-purple-600 hover:bg-purple-700"
                        onClick={() => router.push(`/session/`)}
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
                            onClick={() => router.push(`/all-lists`)}
                        >
                            View all lists
                        </Button>
                    </div>
                    {lists.length === 0 ? (
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
                            {lists.slice(0, 6).map((list) => (
                                <Card
                                    key={list.id}
                                    className="hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {list.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {list.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                            <span className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {list.itemCount} items
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {list.lastPlayed}
                                            </span>
                                        </div>
                                        <div
                                            className={`text-sm font-medium ${getStatusColor(
                                                list.status
                                            )}`}
                                        >
                                            {getStatusText(list.status)}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            <Play className="w-4 h-4 mr-2" />
                                            {list.status === 'new'
                                                ? 'Start Ranking'
                                                : 'Continue'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

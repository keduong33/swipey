'use client';

import { ListCard } from '@/components/listCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetList } from '@/hooks/useGetList';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';

export default function Home() {
    const { lists } = useGetList();

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            onClick={() => router.push(`/`)}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            All Your Lists
                        </h1>
                    </div>
                    <Button
                        size="lg"
                        className="sm:w-auto bg-purple-600 hover:bg-purple-700"
                        onClick={() => router.push(`/edit/${v4()}`)}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New List
                    </Button>
                </div>

                {/* Your Lists Section */}
                <div className="mb-8">
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
                            {Array.from(lists.values()).map((list) => (
                                <ListCard key={list.id} list={list} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

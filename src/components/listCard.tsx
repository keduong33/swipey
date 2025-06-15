import { Item } from '@/pages/edit/ListItem';
import { Clock, Play, Users } from 'lucide-react';
import { Button } from './ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card';

export type List = {
    id: string;
    name: string;
    description?: string;
    visibility: Visibility;
    category?: string;
    items: Item[];
    itemCount: number;
    lastPlayed: string;
    status: Status;
};

export type Status = 'completed' | 'in-progress' | 'new';
export type Visibility = 'public' | 'private' | 'friends';

const getStatusColor = (status: Status): string => {
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

const getStatusText = (status: Status): string => {
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

export function ListCard({
    list,
    onClick,
}: {
    list: List;
    onClick?: () => void;
}) {
    return (
        <Card
            key={list.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className="text-lg">{list.name}</CardTitle>
                <CardDescription>{list.description}</CardDescription>
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
                    {list.status === 'new' ? 'Start Ranking' : 'Continue'}
                </Button>
            </CardFooter>
        </Card>
    );
}

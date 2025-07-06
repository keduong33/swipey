import { useNavigate } from '@tanstack/react-router';
import { Copy, Eye, Loader2, Pencil, Play } from 'lucide-react';
import { v4 } from 'uuid';
import { z } from 'zod';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '~/components/ui/tooltip';
import { useLocalGetResult } from '~/hooks/useGetResult';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import { ListSchema } from './zodSchema';

// export type List = {
//     id: string;
//     name: string;
//     description?: string;
//     // visibility: Visibility;
//     category?: string;
//     items: Item[];
//     // lastPlayed: string;
//     // status: Status;
// };

export type List = z.infer<typeof ListSchema>;

export const createNewList = (opts: Partial<List>): List => {
    const id = opts.id ?? v4();
    return {
        ...emptyList,
        ...opts,
        id,
    } satisfies List;
};

const emptyList: List = {
    id: '',
    name: '',
    description: '',
    // visibility: 'private',
    category: '',
    items: [],
    // lastPlayed: new Date().toLocaleDateString(),
    // status: 'new',
};

// export type Status = 'completed' | 'in-progress' | 'new';
// export type Visibility = 'public' | 'private' | 'friends';

// const getStatusColor = (status: Status): string => {
//     switch (status) {
//         case 'completed':
//             return 'text-green-600';
//         case 'in-progress':
//             return 'text-yellow-600';
//         case 'new':
//             return 'text-blue-600';
//         default:
//             return 'text-gray-600';
//     }
// };

// const getStatusText = (status: Status): string => {
//     switch (status) {
//         case 'completed':
//             return 'Finished ranking';
//         case 'in-progress':
//             return 'In progress';
//         case 'new':
//             return 'Ready to start';
//         default:
//             return 'Unknown';
//     }
// };

export function ListCard({ list }: { list: List }) {
    const navigate = useNavigate();
    const { result, isLoading } = useLocalGetResult(list.id);

    return (
        <Card key={list.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg flex justify-between">
                    {list.name}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className="bg-third-primary hover:bg-third-primary-hover text-black dark:text-black "
                                onClick={() =>
                                    navigate({
                                        to: `/list/edit/${list.id}`,
                                    })
                                }
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark:text-white">
                            Edit List
                        </TooltipContent>
                    </Tooltip>
                </CardTitle>
                <CardDescription className="min-h-[1rem]">
                    {list.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="flex items-center">
                        <Copy className="w-4 h-4 mr-1" />
                        {list.items.length} items
                    </span>
                    {/* <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {list.lastPlayed}
                    </span> */}
                </div>
                {/* <div
                    className={`text-sm font-medium ${getStatusColor(
                        list.status
                    )}`}
                >
                    {getStatusText(list.status)}
                </div> */}
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button
                    className="w-full bg-third-primary hover:bg-third-primary-hover text-black dark:text-black "
                    onClick={() =>
                        navigate({
                            to: `/list/use/${list.id}`,
                        })
                    }
                >
                    <Play className="w-4 h-4 mr-2" />
                    Rank list
                </Button>
                <Button
                    disabled={!result}
                    className="w-full bg-third-primary hover:bg-third-primary-hover text-black dark:text-black"
                    onClick={() =>
                        navigate({
                            to: `/result/${list.id}`,
                        })
                    }
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            <Eye className="w-5 h-5 mr-2" />
                            {`${!result ? 'No' : 'View'} Results`}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

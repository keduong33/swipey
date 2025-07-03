import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Page from '../../components/page';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { saveListInStorage, useGetListForMVP } from '../../hooks/useGetList';
import { createNewList, List } from '../../pages/list/listCard';
import { Item } from '../../pages/list/ListItem';
import { ListItems } from '../../pages/list/ListItems';

export const Route = createFileRoute('/list/')({
    component: EditingList,
});

/**
 * This is for MVP
 */
function EditingList() {
    const navigate = useNavigate();
    const [list, setList] = useState<List>();
    // maybe use isSaved in the future
    const [isSaved, setIsSaved] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { list: retrievedList, isLoading } = useGetListForMVP();

    const isShowingExistingList: boolean = !!retrievedList;

    useEffect(() => {
        if (isLoading) return;
        if (retrievedList) {
            setList(retrievedList);
        } else {
            setList(createNewList({}));
        }
    }, [isLoading, retrievedList]);

    if (isLoading || !list) {
        return <Loader2 className="animate-spin" />;
    }

    const updateList = (updates: Partial<List>) => {
        setIsSaved(false);
        setList((prev) => {
            if (!prev) throw new Error('List not initialized');
            return { ...prev, ...updates };
        });
    };

    const addNewItem = () => {
        const newItem: Item = {
            id: list.items.length + 1,
            name: '',
            image: null,
        };
        updateList({
            items: [...list.items, newItem],
        });
    };

    const setItems = (items: Item[]) => {
        updateList({
            items,
        });
    };

    const handleSave = () => {
        setIsSaved(true);
        saveListInStorage(list);
    };

    const handleSaveAndUse = () => {
        handleSave();
        navigate({ to: '/list/use' });
    };

    const handleSaveAndShare = () => {
        handleSave();
        setDialogOpen(true);
    };

    const handleRevert = () => {
        if (retrievedList) {
            setList(retrievedList);
            setIsSaved(false);
        }
    };

    return (
        <Page>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            onClick={() => navigate({ to: '/' })}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isShowingExistingList
                                ? 'Edit List'
                                : 'Create New List'}
                        </h1>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardContent className="space-y-6">
                        {/* List Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="list-name"
                                className="text-sm font-medium"
                            >
                                List Name
                            </Label>
                            <Input
                                id="list-name"
                                placeholder="Enter list name"
                                value={list.name}
                                onChange={(e) =>
                                    updateList({ name: e.target.value })
                                }
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Enter list description here"
                                value={list.description}
                                onChange={(e) =>
                                    updateList({ description: e.target.value })
                                }
                            />
                        </div>

                        {/* List Items */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                List Items
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <ListItems
                                    items={list.items}
                                    setItems={setItems}
                                />
                                <Button
                                    variant="outline"
                                    onClick={addNewItem}
                                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg items-center justify-center hover:border-gray-400 transition-colors"
                                >
                                    <Plus className="w-6 h-6 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                        Add Item
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Category
                            </Label>
                            <Select
                                value={list.category}
                                onValueChange={(e) =>
                                    updateList({ category: e })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="games">
                                        🎮 Games
                                    </SelectItem>
                                    <SelectItem value="movies">
                                        🎬 Movies
                                    </SelectItem>
                                    <SelectItem value="music">
                                        🎵 Music
                                    </SelectItem>
                                    <SelectItem value="food">
                                        🍕 Food
                                    </SelectItem>
                                    <SelectItem value="travel">
                                        ✈️ Travel
                                    </SelectItem>
                                    <SelectItem value="other">
                                        📋 Other
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* </div> */}

                        {/* Action Button */}
                        <div className="flex flex-wrap gap-2 md:justify-between justify-center">
                            <Button
                                size="lg"
                                className="bg-purple-600 hover:bg-purple-700"
                                onClick={handleSaveAndUse}
                            >
                                Save and Use
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="lg">
                                        More Options
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={handleSave}>
                                        Save
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleSaveAndShare}
                                    >
                                        Save and Share
                                    </DropdownMenuItem>
                                    {retrievedList && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={handleRevert}
                                            >
                                                Revert Changes
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ShareListDialog
                open={dialogOpen}
                setIsOpen={setDialogOpen}
                list={list}
            />
        </Page>
    );
}

export function ShareDialog({
    title,
    open,
    setIsOpen,
    pretty,
    onDownload,
}: {
    title: string;
    open: boolean;
    setIsOpen: (open: boolean) => void;
    pretty: string;
    onDownload: (file: string) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Download this file and send it to your friends
                    </DialogDescription>
                </DialogHeader>
                <Textarea readOnly className="overflow-y-auto max-h-[60vh]">
                    {pretty}
                </Textarea>
                <DialogFooter>
                    <Button onClick={() => onDownload(pretty)}>Download</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ShareListDialog({
    open,
    setIsOpen,
    list,
}: {
    open: boolean;
    setIsOpen: (open: boolean) => void;
    list: List;
}) {
    const pretty: string = JSON.stringify(list, null, 2);

    const onDownload = (file: string) => {
        const blob = new Blob([file], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${list.name || 'my-list'}.json`;
        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <ShareDialog
            title={'Share List'}
            open={open}
            setIsOpen={setIsOpen}
            pretty={pretty}
            onDownload={onDownload}
        />
    );
}

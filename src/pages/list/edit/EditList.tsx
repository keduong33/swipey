import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import imageCompression from 'browser-image-compression';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Page from '../../../components/Page';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { ItemInsert } from '../../../integrations/supabase/typescript.types';
import { localDb } from '../../../storage/indexedDbStorage';
import { getListWithItemsOptions } from '../list.queries';
import { createNewList, ListWithItems } from '../ListCard';
import { ListItems } from '../ListItems';
import { MultipleUploads } from '../MultipleUploads';
import { useEditState } from './useEditState';
import { useOnlineEdit } from './useOnlineEdit';

export function EditList({
    listId,
    isOnline,
}: {
    listId: string;
    isOnline: boolean;
}) {
    const navigate = useNavigate();

    const {
        data: retrievedList,
        isLoading,
        error: getListError,
    } = useQuery(getListWithItemsOptions(listId, isOnline));

    useEffect(() => {
        if (getListError) {
            alert(getListError.message);
        }
    }, [getListError]);

    const { list, setList, updateList, setItems } = useEditState();
    const { listNameMutation, listDescriptionMutation } = useOnlineEdit();

    useEffect(() => {
        if (isLoading) return;
        if (retrievedList) {
            setList(retrievedList);
        } else {
            setList(createNewList({ id: listId }));
        }
    }, [isLoading, retrievedList]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [loadingImageIds, setLoadingImageIds] = useState<Set<string>>(
        new Set()
    );

    if (isLoading || !list) {
        return <Loader2 className="animate-spin" />;
    }

    const saveLocally = async (list: ListWithItems) => {
        await localDb.saveList(list);
    };

    const saveListName = () => {
        if (isOnline) {
            listNameMutation.mutate({
                data: {
                    name: list.name,
                    listId,
                },
            });
        } else {
            saveLocally(list);
        }
    };

    const saveListDescription = () => {
        if (isOnline) {
            listDescriptionMutation.mutate({
                data: {
                    description: list.description ?? '',
                    listId,
                },
            });
        } else {
            saveLocally(list);
        }
    };

    const addBlankItem = () => {
        const blankItem = {
            id: v4(),
            name: '',
            imageUrl: null,
            createdAt: new Date().toUTCString(),
            editedAt: new Date().toUTCString(),
            listId,
        } satisfies ItemInsert;

        const updatedList = {
            ...list,
            items: [...list.items, blankItem],
        } satisfies ListWithItems;

        updateList(updatedList);

        if (isOnline) {
        } else {
            saveLocally(updatedList);
        }
    };

    const use = async () => {
        navigate({ to: `/list/use/${listId}` });
    };

    const share = () => {
        setDialogOpen(true);
    };

    const onDeleteList = async () => {
        await localDb.deleteList(listId);
        navigate({ to: '/' });
    };

    const handleImageUpload = async (
        id: string,
        file: File | undefined
    ): Promise<void> => {
        if (!file) return;

        try {
            setLoadingImageIds((prev) => new Set(prev).add(id));
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.1,
                useWebWorker: true,
            });

            const compressedImageUrl =
                await imageCompression.getDataUrlFromFile(compressed);

            console.log(
                `image before compressed: ${file.size / 1024 / 1024} MB`,
                `image after compressed: ${compressed.size / 1024 / 1024} MB`
            );

            setItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, image: compressedImageUrl }
                        : item
                )
            );
        } catch (error) {
            console.error('Error on uploading images:', error);
        } finally {
            setLoadingImageIds((prev) => {
                const updated = new Set(prev);
                updated.delete(id);
                return updated;
            });
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
                            className="p-2 hover:bg-accent-darker dark:hover:bg-accent-darker"
                            onClick={() => navigate({ to: '/' })}
                        >
                            <ArrowLeft className="w-5 h-5 text-primary dark:text-primary-dark" />
                        </Button>
                        <h2>
                            {/* {isShowingExistingList
                                ? 'Edit List'
                                : 'Create New List'} */}
                            Edit List
                        </h2>
                    </div>
                </div>

                <Card className="mb-6 dark:bg-[#0e0e0e]">
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
                                onBlur={saveListName}
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
                                value={list.description ?? ''}
                                onChange={(e) =>
                                    updateList({ description: e.target.value })
                                }
                                onBlur={saveListDescription}
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
                                    handleImageUpload={handleImageUpload}
                                    loadingImageIds={loadingImageIds}
                                />
                            </div>
                            <div className="w-full flex flex-col md:flex-row gap-2 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={addBlankItem}
                                    className="aspect-square border rounded-lg shadow-md items-center justify-center transition-colors"
                                >
                                    <Plus className="w-6 h-6 text-gray-400" />
                                    <p className="text-xs text-muted-foreground">
                                        Add Blank Item
                                    </p>
                                </Button>

                                <MultipleUploads
                                    setItems={setItems}
                                    handleImageUpload={handleImageUpload}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Category
                            </Label>
                            {/* <Select
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
                            </Select> */}
                        </div>
                        {/* </div> */}

                        {/* Action Button */}
                        <div className="flex flex-wrap gap-2 md:justify-between justify-center">
                            <Button size="lg" onClick={use}>
                                Use
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="lg">
                                        More Options
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={share}>
                                        Share
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() =>
                                            setDeleteDialogOpen(true)
                                        }
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DeleteDialog
                open={deleteDialogOpen}
                setIsOpen={setDeleteDialogOpen}
                onDelete={onDeleteList}
            />
            <ShareListDialog
                open={dialogOpen}
                setIsOpen={setDialogOpen}
                list={list}
            />
        </Page>
    );
}

function DeleteDialog({
    open,
    setIsOpen,
    onDelete,
}: {
    open: boolean;
    setIsOpen: (open: boolean) => void;
    onDelete: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action is irreversible!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={onDelete}>Delete List</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
    list: ListWithItems;
}) {
    const pretty: string = JSON.stringify([list], null, 2);

    const onDownload = (file: string) => {
        const blob = new Blob([file], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${list.name || `my-list`}.json`;
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

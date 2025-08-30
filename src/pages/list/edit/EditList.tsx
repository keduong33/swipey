import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
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
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { ListWithItems } from '../ListCard';
import { ListItems } from '../ListItems';
import { useImageUpload } from './hooks/useImageUpload';
import { useEditList } from './hooks/useList';
import { useEditListState } from './hooks/useListState';
import { useOfflineEdit } from './hooks/useOffline';

export function EditList({
    initialList,
    listId,
}: {
    initialList: ListWithItems | null;
    listId: string;
}) {
    const navigate = useNavigate();

    const { saveItemLocally, deleteListLocally, saveListLocally } =
        useOfflineEdit();

    const { list, updateList, setItems } = useEditListState({
        initialList,
        listId,
    });
    const { saveListName, saveListDescription, addBlankItem } = useEditList(
        updateList,
        saveListLocally,
        saveItemLocally
    );

    const { handleImageUpload, imageUploadStatusMap } = useImageUpload({
        setItems,
        saveItemLocally,
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const use = async () => {
        navigate({ to: `/list/use/${listId}` });
    };

    const share = () => {
        setDialogOpen(true);
    };

    const onDeleteList = async () => {
        await deleteListLocally(listId);
        navigate({ to: '/' });
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
                    <div className="flex gap-2">
                        <Label
                            htmlFor="mode-toggle"
                            className="text-muted-foreground text-sm"
                        >
                            {list.isOnline
                                ? 'Online mode'
                                : 'Offline mode (local only)'}
                        </Label>
                        <Switch
                            checked={list.isOnline}
                            onCheckedChange={(isOnline) =>
                                updateList({ isOnline })
                            }
                        />
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
                                defaultValue={list.name}
                                onBlur={(e) =>
                                    saveListName(e.target.value, list)
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
                                defaultValue={list.description ?? ''}
                                onBlur={(e) =>
                                    saveListDescription(e.target.value, list)
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
                                    list={list}
                                    setItems={setItems}
                                    handleImageUpload={handleImageUpload}
                                    imageUploadStatusMap={imageUploadStatusMap}
                                    isOnline={list.isOnline}
                                />
                            </div>
                            <div className="w-full flex flex-col md:flex-row gap-2 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => addBlankItem(list)}
                                    className="aspect-square border rounded-lg shadow-md items-center justify-center transition-colors"
                                >
                                    <Plus className="w-6 h-6 text-gray-400" />
                                    <p className="text-xs text-muted-foreground">
                                        Add Blank Item
                                    </p>
                                </Button>

                                {/* <MultipleUploads
                                    setItems={setItems}
                                    handleImageUpload={handleImageUpload}
                                    listId={listId}
                                /> */}
                            </div>
                        </div>

                        {/* Category */}
                        {/* <div className="space-y-2">
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
                        </div> */}

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

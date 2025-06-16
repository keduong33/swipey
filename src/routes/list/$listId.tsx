import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { List, Visibility } from '../../components/listCard';
import Page from '../../components/page';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
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
import { useGetList } from '../../hooks/useGetList';
import { DeleteConfirmationDialog } from '../../pages/list/DeleteConfirmationDialog';
import { Item } from '../../pages/list/ListItem';
import { ListItems } from '../../pages/list/ListItems';

export const Route = createFileRoute('/list/$listId')({
    component: EditingList,
});

function EditingList() {
    const { listId } = Route.useParams();
    const navigate = useNavigate();
    const [listName, setListName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [category, setCategory] = useState('');
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: '', image: null },
    ]);

    const { lists, setLists } = useGetList();

    const retrievedList: List | undefined = lists.get(listId);

    const isShowingExistingList: boolean = !!retrievedList;

    useEffect(() => {
        if (retrievedList) {
            setListName(retrievedList.name || '');
            setDescription(retrievedList.description || '');
            setVisibility(retrievedList.visibility || 'public');
            setCategory(retrievedList.category || '');
            setItems(
                retrievedList.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image || null,
                }))
            );
        }
    }, [retrievedList]);

    const addNewItem = () => {
        const newItem = {
            id: items.length + 1,
            name: '',
            image: null,
        };
        setItems([...items, newItem]);
    };

    const handleSave = () => {
        const newList: List = {
            id: listId,
            name: listName,
            description,
            visibility: visibility as Visibility,
            category,
            items: items.filter((item) => item.name.trim() !== ''),
            itemCount: items.length,
            lastPlayed: 'Never',
            status: 'new',
        };

        // Handle save logic here
        console.log('Saving list:', newList);

        const existingList: List[] = JSON.parse(
            localStorage.getItem('lists') || '[]'
        );

        localStorage.setItem(
            'lists',
            JSON.stringify([...existingList, newList])
        );

        navigate({ to: `/` });
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
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {isShowingExistingList
                                ? 'Edit List'
                                : 'Create New List'}
                            {isShowingExistingList && (
                                <DeleteConfirmationDialog
                                    lists={lists}
                                    setLists={setLists}
                                    id={listId}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="float-right text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete List
                                    </Button>
                                </DeleteConfirmationDialog>
                            )}
                        </CardTitle>
                    </CardHeader>
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
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* List Items */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                List Items
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <ListItems items={items} setItems={setItems} />
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

                        {/* Thumbnail */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Thumbnail
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                                <Button variant="outline" size="sm">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Thumbnail
                                </Button>
                            </div>
                        </div>

                        {/* Settings Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Visibility */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Visibility
                                </Label>
                                <Select
                                    value={visibility}
                                    onValueChange={setVisibility}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">
                                            🌐 Public
                                        </SelectItem>
                                        <SelectItem value="private">
                                            🔒 Private
                                        </SelectItem>
                                        <SelectItem value="friends">
                                            👥 Friends Only
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Category
                                </Label>
                                <Select
                                    value={category}
                                    onValueChange={setCategory}
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
                        </div>

                        {/* Action Button */}
                        <div className="pt-4">
                            <Button
                                onClick={handleSave}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                size="lg"
                            >
                                {isShowingExistingList
                                    ? 'Save Changes'
                                    : 'Create New List'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Page>
    );
}

"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ImageIcon, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

type Item = {
    id: number;
    name: string;
    image: string | null;
}

export default function EditingList() {
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [listName, setListName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [category, setCategory] = useState('');
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: '', image: null },
        { id: 2, name: '', image: null },
        { id: 3, name: '', image: null },
        { id: 4, name: '', image: null }
    ]);

    const addNewItem = () => {
        const newItem = {
            id: items.length + 1,
            name: '',
            image: null
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: number) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItemName = (id: number, name: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, name } : item
        ));
    };

    const handleImageUpload = (id: number, event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setItems(items.map(item =>
                item.id === id ? { ...item, image: imageUrl } : item
            ));
        }
    };

    const toggleMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSave = () => {
        // Handle save logic here
        console.log('Saving list:', {
            listName,
            description,
            visibility,
            category,
            items: items.filter(item => item.name.trim() !== '')
        });
    };

    useEffect(() => {
        console.log(router.query.id)
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditMode ? 'Edit List' : 'Create New List'}
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        onClick={toggleMode}
                        className="text-sm"
                    >
                        {isEditMode ? 'Switch to Create' : 'Switch to Edit'}
                    </Button>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Swipey</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* List Name */}
                        <div className="space-y-2">
                            <Label htmlFor="list-name" className="text-sm font-medium">
                                Name of list: {isEditMode && <span className="text-blue-600 text-xs cursor-pointer">edit</span>}
                            </Label>
                            <Input
                                id="list-name"
                                placeholder="Enter list name"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                disabled={isEditMode}
                                className={isEditMode ? "bg-gray-50" : ""}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description {isEditMode && <span className="text-blue-600 text-xs cursor-pointer">edit</span>}
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Example: description here"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isEditMode}
                                className={`min-h-[80px] ${isEditMode ? "bg-gray-50" : ""}`}
                            />
                        </div>

                        {/* List Items */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                # List Items {isEditMode && <span className="text-blue-600 text-xs cursor-pointer">edit</span>}
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {items.map((item) => (
                                    <div key={item.id} className="relative">
                                        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:border-gray-400 transition-colors">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <label htmlFor={`image-upload-${item.id}`} className={`text-center p-2 cursor-pointer ${isEditMode ? 'cursor-not-allowed' : ''}`}>
                                                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(item.id, e)}
                                                        className="hidden"
                                                        id={`image-upload-${item.id}`}
                                                        disabled={isEditMode}
                                                    />
                                                    <p

                                                        className={`text-xs text-gray-500`}
                                                    >
                                                        Upload
                                                    </p>
                                                </label>
                                            )}
                                        </div>
                                        <Input
                                            placeholder="Item name"
                                            value={item.name}
                                            onChange={(e) => updateItemName(item.id, e.target.value)}
                                            disabled={isEditMode}
                                            className={`mt-2 text-xs ${isEditMode ? "bg-gray-50" : ""}`}
                                        />
                                        {items.length > 1 && !isEditMode && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(item.id)}
                                                className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {!isEditMode && (
                                    <Button
                                        variant="outline"
                                        onClick={addNewItem}
                                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg items-center justify-center hover:border-gray-400 transition-colors"
                                    >
                                        <Plus className="w-6 h-6 text-gray-400" />
                                        <span className="text-xs text-gray-500">Add Item</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Thumbnail</Label>
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                                <Button variant="outline" size="sm" disabled={isEditMode}>
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
                                    Visibility {isEditMode && <span className="text-blue-600 text-xs cursor-pointer">edit</span>}
                                </Label>
                                <Select value={visibility} onValueChange={setVisibility} disabled={isEditMode}>
                                    <SelectTrigger className={isEditMode ? "bg-gray-50" : ""}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">🌐 Public</SelectItem>
                                        <SelectItem value="private">🔒 Private</SelectItem>
                                        <SelectItem value="friends">👥 Friends Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Category {isEditMode && <span className="text-blue-600 text-xs cursor-pointer">edit</span>}
                                </Label>
                                <Select value={category} onValueChange={setCategory} disabled={isEditMode}>
                                    <SelectTrigger className={isEditMode ? "bg-gray-50" : ""}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="games">🎮 Games</SelectItem>
                                        <SelectItem value="movies">🎬 Movies</SelectItem>
                                        <SelectItem value="music">🎵 Music</SelectItem>
                                        <SelectItem value="food">🍕 Food</SelectItem>
                                        <SelectItem value="travel">✈️ Travel</SelectItem>
                                        <SelectItem value="other">📋 Other</SelectItem>
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
                                {isEditMode ? 'Done' : 'Create'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
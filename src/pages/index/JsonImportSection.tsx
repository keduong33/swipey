import { ImportIcon } from 'lucide-react';

import { ChangeEvent, useRef, useState } from 'react';
import z from 'zod';
import { Button } from '../../components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { localDb } from '../../storage/indexedDbStorage';

type ImportType = 'results' | 'lists';

export function JsonImportDialog({ refresh }: { refresh: () => void }) {
    const [importType, setImportType] = useState<ImportType>('lists');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const onImportClick = () => {
        fileInputRef.current?.click();
    };

    async function onImport(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        // 🔧 Reset file input value so the same file can be uploaded again
        e.target.value = '';

        if (!file) return;

        try {
            setIsImporting(true);
            const text = await file.text();
            const jsonData = JSON.parse(text);

            if (importType === 'lists') {
                await localDb.saveLists(jsonData);
            } else {
                await localDb.saveResults(jsonData);
            }

            refresh();
            setIsOpen(false);
        } catch (err) {
            if (err instanceof z.ZodError) {
                console.error('Validation errors:', err.errors);
                alert('Invalid data. Please check your file.');
            } else {
                console.error('Parsing error:', err);
                alert('Failed to import');
            }
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="">
                    <ImportIcon className="w-5 h-5 mr-2" />
                    Import your saved lists
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="space-y-3">
                        <RadioGroup
                            value={importType}
                            onValueChange={(value) =>
                                setImportType(value as ImportType)
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lists" id="lists" />
                                <Label htmlFor="lists">Rankings</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="results" id="results" />
                                <Label htmlFor="results">Results</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Input
                        id="upload-json"
                        name="upload-json"
                        className="hidden"
                        accept="application/json"
                        type="file"
                        onChange={onImport}
                        ref={fileInputRef}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={onImportClick}
                        isLoading={isImporting}
                        disabled={isImporting}
                    >
                        Import
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

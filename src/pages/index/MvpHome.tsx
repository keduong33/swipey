import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Eye, ImportIcon, Loader2, Plus } from 'lucide-react';
import {
    ButtonHTMLAttributes,
    ChangeEvent,
    forwardRef,
    ReactNode,
    useRef,
} from 'react';
import z from 'zod';
import { useGetResult } from '~/hooks/useGetResult';
import Page from '../../components/page';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { saveListInStorage, useGetListForMVP } from '../../hooks/useGetList';
import { ListSchema } from '../list/zodSchema';

export function MvpHome() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFileInput = () => {
        fileInputRef.current?.click();
    };

    const { list, isLoading } = useGetListForMVP();
    const { result, isLoading: isResultLoading } = useGetResult();

    async function onImport(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);

            // Validate the parsed data
            const parsedList = ListSchema.parse(jsonData);

            saveListInStorage(parsedList);
            console.log('me run?');
            navigate({ to: '/list' });
        } catch (err) {
            if (err instanceof z.ZodError) {
                console.error('Validation errors:', err.errors);
                alert('Invalid data structure. Please check your JSON.');
            } else {
                console.error('Parsing error:', err);
                alert('Failed to parse JSON file.');
            }
        }
    }

    function createNewList() {
        saveListInStorage(undefined);
        navigate({ to: '/list' });
    }

    return (
        <Page headerConfig={{ hideLogo: true }}>
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Swipey
                    </h1>
                    <p className="text-lg text-gray-600">
                        Swipe to rank your favorite things
                    </p>
                </div>

                <div className="mb-8 gap-4 flex flex-col">
                    <Button
                        size="lg"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate({ to: '/list' })}
                        disabled={!list}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <ArrowRight className="w-5 h-5 mr-2" />
                                {`${!list ? 'No' : 'Use'} Saved List`}
                            </>
                        )}
                    </Button>

                    <Button
                        size="lg"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate({ to: '/list/result' })}
                        disabled={!result}
                    >
                        {isResultLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <Eye className="w-5 h-5 mr-2" />
                                {`${!result ? 'No' : 'View'} Results`}
                            </>
                        )}
                    </Button>

                    {!list ? (
                        <CreateNewListButton
                            onClick={() => navigate({ to: '/list' })}
                        />
                    ) : (
                        <AlertWrappedButton
                            button={<CreateNewListButton />}
                            onContinue={createNewList}
                        />
                    )}

                    {!list ? (
                        <ImportButton onClick={openFileInput} />
                    ) : (
                        <AlertWrappedButton
                            button={<ImportButton />}
                            onContinue={openFileInput}
                        />
                    )}
                </div>
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
        </Page>
    );
}

const ImportButton = forwardRef<
    HTMLButtonElement,
    ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
    <Button
        {...props}
        ref={ref}
        size="lg"
        className="bg-purple-600 hover:bg-purple-700"
    >
        <ImportIcon className="w-5 h-5 mr-2" />
        Import List from JSON
    </Button>
));

const CreateNewListButton = forwardRef<
    HTMLButtonElement,
    ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
    <Button
        {...props}
        ref={ref}
        size="lg"
        className="bg-purple-600 hover:bg-purple-700"
    >
        <Plus className="w-5 h-5 mr-2" />
        Create New List
    </Button>
));

function AlertWrappedButton({
    button,
    onContinue,
}: {
    button: ReactNode;
    onContinue: () => void;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{button}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will delete your currently saved list.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onContinue}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

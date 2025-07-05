import { useNavigate } from '@tanstack/react-router';
import { ImportIcon, Plus } from 'lucide-react';
import { ButtonHTMLAttributes, ChangeEvent, forwardRef, useRef } from 'react';
import { v4 } from 'uuid';
import z from 'zod';
import { useTheme } from '~/hooks/useTheme';
import Page from '../../components/page';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { saveListInStorage } from '../../hooks/useGetList';
import { ListSchema } from '../list/zodSchema';

export function MvpHome() {
    const theme = useTheme();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFileInput = () => {
        fileInputRef.current?.click();
    };

    async function onImport(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);

            // Validate the parsed data
            const parsedList = ListSchema.parse(jsonData);

            saveListInStorage(parsedList);
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

    return (
        <Page headerConfig={{ hideLogo: true }}>
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                {/* Header */}
                <div className="text-center justify-items-center mb-8">
                    <img
                        src={`/icon-${theme}.svg`}
                        alt={'Swipey'}
                        className="h-20 my-8"
                    />
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Swipe to rank your favorite things
                    </p>
                </div>

                <div className="mb-8 gap-4 flex flex-col">
                    {/* <Button
                        size="lg"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate({ to: `/result/${}` })}
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
                    </Button> */}

                    <CreateNewListButton
                        onClick={() => navigate({ to: `/list/${v4()}` })}
                    />

                    <ImportButton onClick={openFileInput} />
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
    <Button {...props} ref={ref} size="lg">
        <ImportIcon className="w-5 h-5 mr-2" />
        Import List from JSON
    </Button>
));

const CreateNewListButton = forwardRef<
    HTMLButtonElement,
    ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
    <Button {...props} ref={ref} size="lg">
        <Plus className="w-5 h-5 mr-2" />
        Create New List
    </Button>
));

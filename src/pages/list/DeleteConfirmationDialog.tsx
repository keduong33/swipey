import { useNavigate } from '@tanstack/react-router';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '../../components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../components/ui/dialog';
import { List } from './ListCard';

export const DeleteConfirmationDialog = ({
    lists,
    setLists,
    id,
    children,
}: {
    lists: Map<string, List>;
    setLists: Dispatch<SetStateAction<Map<string, List>>>;
    id: string;
    children: React.ReactNode;
}) => {
    const navigate = useNavigate();

    const handleDelete = () => {
        const updatedLists: Map<string, List> = new Map(lists);

        updatedLists.delete(id);

        setLists(updatedLists);
        localStorage.setItem(
            'lists',
            JSON.stringify(Array.from(updatedLists.values()))
        );

        navigate({
            to: '/',
        });
    };

    return (
        <Dialog>
            <DialogTrigger className="float-right">{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete ?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the list and all its items.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Cancel</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        variant="secondary"
                        onClick={() => {
                            handleDelete();
                        }}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

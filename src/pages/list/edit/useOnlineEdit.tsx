import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import {
    updateListDescriptionServerFn,
    updateListNameServerFn,
} from './edit.api';

export const useOnlineEdit = () => {
    const updateListNameFn = useServerFn(updateListNameServerFn);
    const listNameMutation = useMutation({
        mutationFn: updateListNameFn,
        onError: () => {
            alert('Failed to save list name');
        },
    });

    const updateListDescriptionFn = useServerFn(updateListDescriptionServerFn);
    const listDescriptionMutation = useMutation({
        mutationFn: updateListDescriptionFn,
        onError: () => {
            alert('Failed to save list description');
        },
    });

    return {
        listDescriptionMutation,
        listNameMutation,
    };
};

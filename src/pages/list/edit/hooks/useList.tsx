import { v4 } from 'uuid';
import { ItemInsert } from '../../../../integrations/supabase/typescript.types';
import { BaseList, ListWithItems } from '../../ListCard';
import { Item } from '../../ListItem';
import { useListOnline } from './useListOnline';
import { UpdateListOpts } from './useListState';

export function useEditList(
    updateList: (update: UpdateListOpts) => void,
    saveListLocally: (list: BaseList) => void,
    saveItemLocally: (item: Item) => void
) {
    const { listNameMutation, listDescriptionMutation, addNewItem } =
        useListOnline();

    const saveListName = (name: string, list: ListWithItems | undefined) => {
        if (!list || list.name === name) return;
        updateList({ name });

        if (list.isOnline) {
            listNameMutation.mutate({ data: { name, listId: list.id } });
        } else {
            saveListLocally({ ...list, name });
        }
    };

    const saveListDescription = (
        description: string,
        list: ListWithItems | undefined
    ) => {
        if (!list || list.description === description) return;

        updateList({ description });

        if (list.isOnline) {
            listDescriptionMutation.mutate({
                data: { description, listId: list.id },
            });
        } else {
            saveListLocally({ ...list, description });
        }
    };

    const addBlankItem = (list: ListWithItems | undefined) => {
        if (!list) return;
        const blankItem = {
            id: v4(),
            name: '',
            imageUrl: null,
            createdAt: new Date().toUTCString(),
            editedAt: new Date().toUTCString(),
            listId: list.id,
        } satisfies ItemInsert;

        const updatedList = {
            ...list,
            items: [...list.items, blankItem],
        } satisfies ListWithItems;

        updateList(updatedList);

        if (list.isOnline) {
            addNewItem.mutate(
                {
                    data: {
                        ...blankItem,
                    },
                },
                {
                    onError: () => {
                        updateList(list);
                    },
                }
            );
        } else {
            saveItemLocally(blankItem);
        }
    };

    return {
        saveListName,
        saveListDescription,
        addBlankItem,
    };
}

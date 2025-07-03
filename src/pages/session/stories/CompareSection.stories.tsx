import type { Meta, StoryObj } from '@storybook/react';
import { List } from '~/pages/list/listCard';
import { Item } from '../../list/ListItem';
import CompareSection from '../CompareSection';

const ComponentWithOriginal = ({ list }: { list: List }) => {
    const { items } = list;
    return (
        <>
            <ol>
                Original:[
                {items
                    .map((item) => item.name)
                    .join(', ')
                    .trim()}
                ]
            </ol>
            <CompareSection list={list} />
        </>
    );
};

const meta = {
    component: ComponentWithOriginal,
} satisfies Meta<typeof CompareSection>;

type Story = StoryObj<typeof meta>;

export default meta;

const items: Item[] = [
    { id: 1, name: 'A', image: null },
    { id: 2, name: 'E', image: null },
    { id: 3, name: 'D', image: null },
    { id: 4, name: 'C', image: null },
    { id: 5, name: 'K', image: null },
];

const list: List = {
    id: '1',
    name: 'Test List',
    description: 'Test description',
    items: items,
};

export const FullTest: Story = {
    args: {
        list,
    },
};

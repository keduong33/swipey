import type { Meta, StoryObj } from '@storybook/react';
import { Item } from '../../list/ListItem';
import CompareSection from '../CompareSection';

const ComponentWithOriginal = ({ items }: { items: Item[] }) => {
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
            <CompareSection items={items} />
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

export const FullTest: Story = {
    args: {
        items,
    },
};

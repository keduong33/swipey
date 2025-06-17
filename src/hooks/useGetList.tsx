import { useEffect, useState } from 'react';
import { List } from '../pages/list/listCard';

const initialList: List[] = [
    {
        id: '90ad0167-79f3-44f6-9d04-ed7e08bb583e',
        name: 'Favorite Movies',
        description: 'My top movie picks for 2024',
        items: [
            { id: 1, name: 'The Shawshank Redemption', image: null },
            { id: 2, name: 'The Godfather', image: null },
            { id: 3, name: 'The Dark Knight', image: null },
            { id: 4, name: 'The Godfather Part II', image: null },
            { id: 5, name: '12 Angry Men', image: null },
            {
                id: 6,
                name: 'The Lord of the Rings: The Return of the King',
                image: null,
            },
            { id: 7, name: "Schindler's List", image: null },
            { id: 8, name: 'Pulp Fiction', image: null },
            {
                id: 9,
                name: 'The Lord of the Rings: The Fellowship of the Ring',
                image: null,
            },
            { id: 10, name: 'The Good, the Bad and the Ugly', image: null },
            { id: 11, name: 'Forrest Gump', image: null },
            {
                id: 12,
                name: 'The Lord of the Rings: The Two Towers',
                image: null,
            },
        ],
        itemCount: 12,
        lastPlayed: '2 days ago',
        status: 'completed',
        visibility: 'public',
        category: 'movies',
    },
    {
        id: 'fa4d7176-0b63-4527-8760-78bed25c7cec',
        name: 'Best Restaurants',
        description: 'Local dining spots to rank',
        items: [
            { id: 1, name: 'McDonalds', image: null },
            { id: 2, name: "Tina's Noodle Kitchen", image: null },
            { id: 3, name: 'Waya Japanese', image: null },
            { id: 4, name: 'Subway', image: null },
            { id: 5, name: 'Running Pot', image: null },
            { id: 6, name: 'Piatella Cafe Bar', image: null },
            { id: 7, name: 'Dragon Hot Pot', image: null },
            { id: 8, name: "Wong's Late Night Hot Pot", image: null },
        ],
        itemCount: 8,
        lastPlayed: '1 week ago',
        status: 'in-progress',
        visibility: 'public',
        category: 'food',
    },
    {
        id: '77a8305c-4a4f-43e8-9c2b-dcfab4a6bf79',
        name: 'Travel Destinations',
        description: 'Places I want to visit',
        items: [
            { id: 1, name: 'Japan', image: null },
            { id: 2, name: 'Iceland', image: null },
            { id: 3, name: 'Greece', image: null },
            { id: 4, name: 'Italy', image: null },
            { id: 5, name: 'United Kingdom', image: null },
            { id: 6, name: 'Norway', image: null },
            { id: 7, name: 'Thailand', image: null },
            { id: 8, name: 'America', image: null },
            { id: 9, name: 'New Zealand', image: null },
            { id: 10, name: 'Indonesia', image: null },
            { id: 11, name: 'Switzerland', image: null },
            { id: 12, name: 'China', image: null },
            { id: 13, name: 'Canada', image: null },
            { id: 14, name: 'Fiji', image: null },
            { id: 15, name: 'Dubai', image: null },
        ],
        itemCount: 15,
        lastPlayed: 'Never',
        status: 'new',
        visibility: 'public',
        category: 'travel',
    },
];

export const initialListMap: Map<string, List> = new Map(
    initialList.map((list) => [list.id, list])
);

export const useGetList = () => {
    const [lists, setLists] = useState<Map<string, List>>(new Map());

    useEffect(() => {
        const raw: string | null = localStorage.getItem('lists');

        if (raw) {
            const parsedArray: List[] = JSON.parse(raw);
            const map: Map<string, List> = new Map(
                parsedArray.map((list) => [list.id, list])
            );
            setLists(map);
        } else {
            localStorage.setItem(
                'lists',
                JSON.stringify(Array.from(initialListMap.values()))
            );
            setLists(initialListMap);
        }
    }, []);

    return { lists, setLists };
};

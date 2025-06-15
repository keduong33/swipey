export type Status = 'completed' | 'in-progress' | 'new';
export type Visibility = 'public' | 'private' | 'friends';

export type Item = {
    id: number;
    name: string;
    image: string | null;
};

export type List = {
    id: string;
    name: string;
    description?: string;
    visibility: Visibility;
    category?: string;
    items: Item[];
    itemCount: number;
    lastPlayed: string;
    status: Status;
};

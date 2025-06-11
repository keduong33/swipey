"use server"

import EditingList from './EditingList';

export default async function Edit({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditingList />
}
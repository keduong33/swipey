'use client';
import { useRouter } from 'next/router';
import Page from '../../components/page';

export default function Session() {
    const router = useRouter();
    const id = router.query.id as string;

    return <Page headerConfig={{ sessionId: id }}>ID: {id}</Page>;
}

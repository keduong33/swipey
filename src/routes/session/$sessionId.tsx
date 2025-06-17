import { createFileRoute } from '@tanstack/react-router';
import Page from '../../components/page';

export const Route = createFileRoute('/session/$sessionId')({
    component: Session,
});

function Session() {
    const { sessionId } = Route.useParams();

    return <Page headerConfig={{ sessionId }}>ID: {sessionId}</Page>;
}

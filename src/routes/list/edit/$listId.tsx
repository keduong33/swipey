import { createFileRoute } from '@tanstack/react-router';
import { EditList } from '../../../pages/list/edit/EditList';

export const Route = createFileRoute('/list/edit/$listId')({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = Route.useRouteContext();
    const { listId } = Route.useParams();

    return (
        <EditList listId={listId} isOnline={user?.isAuthenticated ?? false} />
    );
}

import { createFileRoute } from '@tanstack/react-router';
import Home from '../pages/index/Home';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = Route.useRouteContext();
    const userId = user.isAuthenticated ? user.id : undefined;
    return <Home userId={userId} />;
}

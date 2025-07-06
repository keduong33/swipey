import { createFileRoute } from '@tanstack/react-router';
import Home from '../pages/index/Home';

export const Route = createFileRoute('/')({
    component: Home,
});

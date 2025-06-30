import { createFileRoute } from '@tanstack/react-router';
import { MvpHome } from '../pages/index/MvpHome';

export const Route = createFileRoute('/')({
    component: MvpHome,
});

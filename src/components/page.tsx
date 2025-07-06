import { ReactNode } from 'react';
import { Header, HeaderProps } from './header';

export default function Page({
    children,
    headerConfig,
}: {
    children: ReactNode;
    headerConfig?: HeaderProps;
}) {
    return (
        <div className="flex w-full flex-col min-h-screen">
            <Header {...headerConfig} />
            <main className="flex-1 flex-col bg-primary p-4">{children}</main>
        </div>
    );
}

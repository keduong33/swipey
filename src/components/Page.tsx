import { ReactNode } from 'react';
import { Header, HeaderProps } from './Header';

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
            <main className="flex-1 flex-col bg-background p-4">
                {children}
            </main>
            <footer className="text-center p-4 text-gray-600 dark:text-gray-400">
                All data is stored locally on your device. We do not access your
                content and are not responsible for any illegal or inappropriate
                material.
            </footer>
        </div>
    );
}

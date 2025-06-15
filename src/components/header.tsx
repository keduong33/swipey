import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/router';

export type HeaderProps = {
    withProfile?: boolean;
    sessionId?: string;
};

function UserAvatar() {
    const router = useRouter();
    return (
        <Avatar
            className="cursor-pointer"
            onClick={() => router.push('/profile')}
        >
            <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
        </Avatar>
    );
}

export function Header({ withProfile, sessionId }: HeaderProps) {
    return (
        <header className="flex w-full justify-between items-center">
            <Link href={'/'}>
                <h1>Swipey</h1>
            </Link>
            {sessionId && <p>Session: {sessionId}</p>}
            {withProfile && <UserAvatar />}
        </header>
    );
}

import { Link, useNavigate } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export type HeaderProps = {
    withProfile?: boolean;
    sessionId?: string;
    hideLogo?: boolean;
};

function UserAvatar() {
    const navigate = useNavigate();
    return (
        <Avatar
            className="cursor-pointer"
            onClick={() => navigate({ to: '/profile' })}
        >
            <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
        </Avatar>
    );
}

export function Header({ hideLogo, withProfile, sessionId }: HeaderProps) {
    return (
        <header className="flex w-full justify-between items-center">
            {!hideLogo && (
                <Link to={'/'}>
                    <h1>Swipey</h1>
                </Link>
            )}
            {sessionId && <p>Session: {sessionId}</p>}
            {withProfile && <UserAvatar />}
        </header>
    );
}

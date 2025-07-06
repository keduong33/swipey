import { Link, useNavigate } from '@tanstack/react-router';
import { useTheme } from './ThemeProvider';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ModeToggle } from './ui/theme-toggle';

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
    const { theme } = useTheme();
    return (
        <header className="flex w-full justify-between items-center bg-sidebar">
            {!hideLogo && (
                <Link to={'/'}>
                    <img
                        src={`/icon-${theme}.svg`}
                        alt={'Swipey'}
                        className="object-cover h-8 ml-4 my-2"
                    />
                </Link>
            )}
            {sessionId && <p>Session: {sessionId}</p>}
            {withProfile && <UserAvatar />}
            <ModeToggle />
        </header>
    );
}

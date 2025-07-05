import { useState } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(
        window.matchMedia('(prefers-color-scheme:dark)').matches
            ? 'dark'
            : 'light'
    );

    window
        .matchMedia('(prefers-color-scheme:dark)')
        .addEventListener('change', (event) => {
            setTheme(event.matches ? 'dark' : 'light');
        });

    return theme;
};

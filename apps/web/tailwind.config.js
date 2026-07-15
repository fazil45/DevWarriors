/** @type {import('tailwindcss').Config} */
const config = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                orange: {
                    300: '#F6A860',
                    400: '#F97316',
                    500: '#EA580C',
                    600: '#C2410C',
                    700: '#9A3412',
                },
                ink: {
                    700: '#182133',
                    800: '#111827',
                    850: '#0f172a',
                    900: '#0b1220',
                },
                blade: {
                    400: '#7C3AED',
                    500: '#8B5CF6',
                    600: '#6366F1',
                },
            },
            boxShadow: {
                glow: '0 20px 70px rgba(232, 121, 61, 0.2)',
            },
            animation: {
                pulseRing: 'pulseRing 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                pulseRing: {
                    '0%': { transform: 'scale(0.9)', opacity: '0.75' },
                    '50%': { transform: 'scale(1.1)', opacity: '0.2' },
                    '100%': { transform: 'scale(0.9)', opacity: '0.75' },
                },
            },
        },
    },
    plugins: {
        '@tailwindcss/postcss': {},
    },
};

export default config;

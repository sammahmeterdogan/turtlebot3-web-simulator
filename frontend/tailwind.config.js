/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00A9FF',
                    light: '#89CFF3',
                    dark: '#008DDB',
                },
                gray: {
                    950: '#0A0E1A',
                    900: '#111827',
                    800: '#1F2937',
                    700: '#374151',
                    // Diğer gri tonları tailwind'in varsayılanını kullanır
                },
                glow: {
                    blue: 'rgba(0, 169, 255, 0.5)',
                    purple: 'rgba(138, 43, 226, 0.5)',
                },
            },
            boxShadow: {
                'glow-blue': '0 0 15px rgba(0, 169, 255, 0.4)',
                'glow-purple': '0 0 15px rgba(138, 43, 226, 0.4)',
            },
            animation: {
                'subtle-float': 'subtle-float 6s ease-in-out infinite',
            },
            keyframes: {
                'subtle-float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};
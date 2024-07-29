/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: ({ colors }) => ({
      ...colors,
      inherit: colors.inherit,
      current: colors.current,
      secondary: '#0096FF',
      primary: '#0061D3',
      gray: {
        ...colors.gray,
        20: '#E5E5E5',
        30: '#B0B0B0',
        60: '#323232',
        80: '#191919',
      },
      red: '#FF5050',
    }),
    extend: {
      fontFamily: {
        'primary-300': 'Roboto-Light',
        'primary-400': 'Roboto-Regular',
        'primary-500': 'Roboto-Medium',
        'primary-700': 'Roboto-Bold',
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities({
        typo: value => {
          const [size, weight] = value.split('-') || [];
          return {
            fontSize: Number(size) ? `${size / 16}rem` : size,
            fontFamily: theme(`fontFamily.primary-${weight}`),
          };
        },
      });
    }),
  ],
};

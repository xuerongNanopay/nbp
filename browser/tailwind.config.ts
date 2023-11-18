import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react';
import CUSTOMIZE_NEXTUI_THEME from './theme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'nbp-background': "url('/images/background.svg')",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(CUSTOMIZE_NEXTUI_THEME)],
}
export default config

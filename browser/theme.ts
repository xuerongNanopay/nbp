import type { NextUIPluginConfig } from "@nextui-org/react"

const CUSTOMIZE_NEXTUI_THEME: NextUIPluginConfig = {
  themes: {
    "nbp": {
      extend: "light", // <- inherit default values from dark theme
      colors: {
        background: "#0D001A",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#0E793C",
          foreground: "#ffffff",
        },
        focus: "#12A150",
      },
      layout: {
        disabledOpacity: "0.3",
        radius: {
          small: "4px",
          medium: "6px",
          large: "8px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
    },
  },
}

export default CUSTOMIZE_NEXTUI_THEME
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        unblur: {
          "0%": { filter: "blur(8px)" },
          "100%": { filter: "blur(0px)" },
        },
        unblur_img: {
          "0%": { filter: "blur(16px)" },
          "100%": { filter: "blur(0px)" },
        },
      },
      animation: {
        unblur: "unblur 300ms ease-in-out",
        unblur_img: "unblur_img 300ms ease-in-out",
      },
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;

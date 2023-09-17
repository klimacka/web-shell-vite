import react from "@vitejs/plugin-react";
import { UserConfig } from "vite";
import htmlPlugin from "vite-plugin-html-config";
import ssr from "vite-plugin-ssr/plugin";

const htmlConfig = {
  links: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap",
    },
  ],
};

const config: UserConfig = {
  plugins: [react(), ssr(), htmlPlugin(htmlConfig)],
};

export default config;

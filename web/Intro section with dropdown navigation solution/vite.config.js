import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),],
  base: 'exercises/web/Intro%20section%20with%20dropdown%20navigation%20solution/dist'
});

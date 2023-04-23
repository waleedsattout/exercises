import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

window.isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

let app = createApp(App);
app.mount("#app");

import { createApp } from "vue";
import { createPinia } from "pinia";
import Buefy from "buefy";
import "buefy/dist/css/buefy.css";
import App from "./App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(Buefy);

const html = document.documentElement;
html.setAttribute('data-theme', 'light');
localStorage.setItem('theme', 'light');

app.mount("#app");

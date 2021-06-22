import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";

// Import Framework7
import Framework7 from "./f7config";
// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from "framework7-vue/bundle";

// Import f7 styles
import "./styles/framework7-custom.less";

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

const app = createApp(App);
// Register Framework7 Vue components
registerComponents(app);
app.use(store);
app.mount("#app");

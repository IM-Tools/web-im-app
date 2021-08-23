import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
//vue-router
import router from './router';
import store from './store';
import Cookies from 'js-cookie';

import DiscordPicker from 'vue3-discordpicker';


const app = createApp(App);
app.config.devtools = true;
app.use(ElementPlus);
app.use(store);

app.use(DiscordPicker);
app.use(router);
app.use(Cookies);
app.mount('#app');

//createApp(App).mount('#app')

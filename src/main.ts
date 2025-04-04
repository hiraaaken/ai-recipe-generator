import { createApp } from 'vue'
import "@aws-amplify/ui-vue/styles.css"
import App from './App.vue'
import  AmplifyVue from '@aws-amplify/ui-vue';

const app = createApp(App);
app.use(AmplifyVue);
app.mount('#app');


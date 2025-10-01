import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";
import ChatWindow from "../components/ChatWindow.vue";

const routes = [
    {
        path: '/',
        component: App,
        children: [
            {
                path: 'chat/:id',
                name: 'Chat',
                component: ChatWindow,
                props: true,
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
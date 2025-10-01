<template>
    <div class="flex flex-col h-full border rounded-lg shadow bg-base-100">
        <!-- Chat messages -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
            <div
                v-for="(msg, i) in messages"
                :key="i"
                class="chat"
                :class="msg.from === 'me' ? 'chat-end' : 'chat-start'"
            >
                <!-- Avatar -->
                <div class="chat-image avatar">
                    <div class="w-10 rounded-full">
                        <img :src="msg.avatar" :alt="msg.user" />
                    </div>
                </div>

                <!-- Header -->
                <div class="chat-header">
                    {{ msg.user }}
                    <time class="text-os opacity-50 ml-2">{{ msg.time }}</time>
                </div>

                <!-- Bubble -->
                <div class="chat-bubble">{{ msg.text }}</div>

                <!-- Footer -->
                <div v-if="msg.footer" class="chat-footer opacity-50">
                    {{ msg.footer }}
                </div>
            </div>
        </div>
        <!-- Input box -->
        <form @submit.prevent="sendMessage" class="p-3 flex gap-2 border-t">
            <input 
                v-model="newMessage"
                type="text"
                placeholder="Napiš zprávu..."
                class="input input-bordered flex-1"
            />
            <button type="submit" class="btn btn-primary">
                Odeslat
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue"
import { useRoute } from "vue-router";
import axios from "axios"
import { io } from "socket.io-client"

const route = useRoute();
const messages = ref([]);
const newMessage = ref("")
let socket

const fetchMessages = async (chatId) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/chats/${chatId}/messages`)
        messages.value = response.data
    }catch (err) {
        console.error("Chyba při načítání zpráv:", err)
    }
}

const sendMessage = () => {
    if (!newMessage.value) return
    const msg = {
        chatId: route.params.id,
        from: "me",
        user: "Anakin",
        avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
        time: new Date().toLocaleTimeString(),
        text: newMessage.value,
    }

    socket.emit("sendMessage", msg)

    newMessage.value = ""
}

watch(
    () => route.params.id,
    async (id) => {
        if (!id) return

        await fetchMessages(id)

        if (socket) socket.disconnect()
        socket = io("http://localhost:3000")

        socket.emit("joinRoom", id)

        socket.on("newMessage", (msg) => {
            if (msg.chatId == id) {
                messages.value.push(msg)
            }
        })
    },
    { immediate: true }
)

onUnmounted(() => {
    if (socket) socket.disconnect()
})
</script>
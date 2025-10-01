<template>
    <div class="w-full h-full border rounded-lg bg-base-100 shadow flex flex-col">
        <div class="p-4 border-b font-bold text-lg">Moje Chaty</div>

        <div class="flex-1 overflow-y-auto">
            <div
                v-for="chat in chats"
                :key="chat.id"
                class="flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer"
                @click="openChat(chat)"
            >
                <!-- Avatar -->
                <div class="avatar">
                    <div class="w-12 rounded-full">
                        <img :src="chat.avatar" :alt="chat.name" />
                    </div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center">
                        <span class="font-medium truncate">{{ chat.name }}</span>
                        <span class="text-xs opacity-50">{{ chat.time }}</span>
                    </div>
                    <div class="text-sm opacity-70 truncate">{{ chat.lastMessage }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter();

const chats = ref([
    {
    id: 1,
    name: "Obi-Wan Kenobi",
    avatar: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
    lastMessage: "You were the Chosen One!",
    time: "12:45",
  },
  {
    id: 2,
    name: "Anakin",
    avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
    lastMessage: "I hate you!",
    time: "12:46",
  },
  {
    id: 3,
    name: "Yoda",
    avatar: "https://img.daisyui.com/images/profile/demo/ash@192.webp",
    lastMessage: "Do or do not, there is no try.",
    time: "12:47",
  },
])

const openChat = (chat) => {
    router.push({ name: 'Chat', params: { id: chat.id }})
}
</script>
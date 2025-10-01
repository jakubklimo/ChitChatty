<template>
  <div class="h-screen flex flex-col">
    <Navbar />
    <div class="flex flex-1 min-h-0">
      <div class="w-1/3 border-r">
        <ChatList />
      </div>
      <div class="flex-1">
        <ChatWindow />
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import ChatWindow from './components/ChatWindow.vue';
import ChatList from './components/ChatList.vue';
</script>
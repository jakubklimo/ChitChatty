const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());
app.use(express.json());

let chats = {
  1: [
    { from: "other", user: "Obi-Wan Kenobi", text: "You were the Chosen One!", time: "12:45" },
    { from: "me", user: "Anakin", text: "I hate you!", time: "12:46" },
  ],
  2: [
    { from: "other", user: "Anakin", text: "I will bring balance.", time: "12:47" },
  ],
};

app.get("/api/chats/:id/messages", (req, res) => {
    const chatId = req.params.id;
    res.json(chats[chatId] || []);
});

app.post("/api/chats/:id/messages", (req, res) => {
  const chatId = req.params.id;
  const message = req.body;

  if (!chats[chatId]) chats[chatId] = [];
  chats[chatId].push(message);

  res.status(201).json(message);
});

io.on("connection", (socket) => {
    console.log("Uživatel se připojil:", socket.id);

    socket.on("joinRoom", (chatId) => {
        socket.join(chatId);
        console.log(`Socket ${socket.id} se připojil do room: ${chatId}`);
    })

    socket.on("sendMessage", (msg) => {
        const { chatId } = msg;

        if (!chats[chatId]) chats[chatId] = [];
        chats[chatId].push(msg);

        io.to(chatId).emit("newMessage", msg);
    });

    socket.on("disconnect", () => {
        console.log("Uživatel odpojen:", socket.io);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
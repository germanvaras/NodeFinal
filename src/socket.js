const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const { getMessagesServices, addMessageServices } = require("./services/message");
const recoverMessages = async () => {
    const messages = await getMessagesServices();
    return messages;
};
io.on("connection", async (socket) => {
    socket.emit("all messages", await recoverMessages());

});
module.exports = {
    httpServer,
    addMessages: async function (message) {
        await addMessageServices(message);
        io.emit("all messages", await recoverMessages());
    },
};
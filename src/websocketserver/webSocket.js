// // const { createServer } = require("http");
// import http from 'http';
// import { Server, Socket } from "socket.io";

// const server = http.createServer();

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("stripeWebHookEvent", (data) => {
//     console.log(
//       "websocket event occur-------------/n web socket event data:",
//       data,
//     );
//   });

//   socket.on("btnClickEvent", (data) => {
//     console.log(data);
//   });

//   socket.on("disconnect", () => {
//     console.log("web socket disconnected", socket.id);
//   });
// });

// server.listen(3001, () => {
//   console.log("WebSocket server listening on port 3001");
// });
// export default io;

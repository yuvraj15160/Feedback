import { io } from "socket.io-client";

const URL = "https://feedbacksystem-p2.onrender.com";

const socket = io(URL, {
  reconnection: false,
});

export default socket;
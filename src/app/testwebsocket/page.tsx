"use client";

import React, { useEffect } from "react";
import io from "socket.io-client";

const TestWebSocket = () => {
  const socket = io("http://localhost:3001");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected:", socket.id);
    });
    socket.on("btnClickEvent", (data) => {
      console.log(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <button
        onClick={() => {
          console.log("btn clicked")
          socket.emit("btnClickEvent", "btn is clicked from client side");
        }}
      >
        Click
      </button>
    </div>
  );
};

export default TestWebSocket;

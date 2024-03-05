"use client";

import { useEffect, useState } from "react";
import { json } from "stream/consumers";

interface MemoryUsage {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

export default function Home() {

  const [message, setMessage] = useState<MemoryUsage>()

  useEffect(() => {
    const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://localhost:8080`);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      // Handle incoming messages
      const msg = JSON.parse(event.data)
      setMessage(msg)
      // console.log("Received:", event.data);
      // console.log("rss:", msg.rss);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };

  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Memory usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RSS</td>
            <td id="rss">{message?.rss}</td>
          </tr>
          <tr>
            <td>Heap total</td>
            <td id="heapTotal">{message?.heapTotal}</td>
          </tr>
          <tr>
            <td>Heap used</td>
            <td id="heapUsed">{message?.heapUsed}</td>
          </tr>
          <tr>
            <td>External</td>
            <td id="external">{message?.external}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

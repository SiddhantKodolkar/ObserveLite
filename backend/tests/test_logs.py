import asyncio
import websockets

async def listen():
    uri = "ws://localhost:8000/ws/logs"
    async with websockets.connect(uri) as websocket:
        print("📡 Connected to WebSocket, waiting for logs...\n")
        while True:
            data = await websocket.recv()
            print("📥 Log received:", data)

asyncio.run(listen())


# WS server 

import asyncio
import websockets
import json

async def readIn(websocket, path):
    while True:
        rawPacket = await websocket.recv()
        packet = json.loads(rawPacket)
        print(packet)
        if (packet['request']):
        	print("sending more")
        	await websocket.send("hello")
        	print("Sending more")

def send():
	websocket.send("sdasdas") 
	print("Sending more")
	
        
def getMoreCharacters():
	return "blahblah"; #Kevin impliment


print("Starting server")
start_server = websockets.serve(readIn, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
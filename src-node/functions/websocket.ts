import WebSocket from "ws";

export async function callWebsocketApi(
  action: string,
  data: object,
  path: string
): Promise<object> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(path);

    ws.onopen = () => {
      ws.send(JSON.stringify({ action, data }));
      console.log("Connected to Websocket");
    };

    ws.onmessage = (event) => {
      // Handle incoming messages
      try {
        const messageData = JSON.parse(event.data);
        //check to see if erro key present in response
        //this error is different from catch error
        if (!messageData["error"]) {
          resolve(messageData);
        }
        if (messageData["error"]) {
          throw new Error(messageData["error"]);
        }
      } catch (error) {
        reject(new Error("Failed to parse message"));
      } finally {
        console.log("Closing connection");
        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.log("error", error.message);
      reject(new Error(`${error.message}`));
    };

    ws.onclose = (event) => {
      if (!event.wasClean) {
        // Handle non-clean closure of the WebSocket connection
        console.error(
          "WebSocket connection closed unexpectedly:",
          event.reason
        );
        reject(new Error("WebSocket connection closed unexpectedly"));
      }
    };
  });
}

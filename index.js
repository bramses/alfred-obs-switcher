import OBSWebSocket from "obs-websocket-js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const initWebSocket = async () => {
  const obs = new OBSWebSocket();
  try {
    const { obsWebSocketVersion } = await obs.connect(
      `ws://${process.env.IP_ADDRESS}:4444`,
      process.env.OBS_PASSWORD
    );
    console.log(`[initWebSocket] Connected to server ${obsWebSocketVersion} `);
    return obs;
  } catch (error) {
    console.error("[initWebSocket] Failed to connect", error.code, error.message);
    throw error;
  }
};

try {
  const obs = await initWebSocket();

  const setScene = async (obs, sceneName) => {
    try {
        await obs.call("SetCurrentProgramScene", { sceneName });
    } catch (err) {
        console.error("[setScene] Failed to set scene", err.message);
        throw err;
    }
  };

  const app = express();
  const port = 3008;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/scene", (req, res) => {
    const sceneName = req.query.name;
    if (sceneName) {
      setScene(obs, sceneName);
      res.send(`Scene set to ${sceneName}`);
    } else {
      res.send("No scene name provided");
    }
  });

  // a curl example
    // curl -X GET "http://localhost:3008/scene?name=Scene1"

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  }).on('error', function(err) {
    console.log('check ip address and port');
    console.log(err);
  });
} catch (error) {
  console.error("Failed to connect to OBS", error);
}

var token = require("./data/token.json");
var RingApi = require('ring-client-api').RingApi
var fs = require("fs");
var promisify = require("util").promisify;
var path = require("path");
var express = require("express");

// TODO: env
var PORT = 80;

const app = express();

const ringApi = new RingApi({
  refreshToken: token
});

ringApi.onRefreshTokenUpdated.subscribe(
  async ({ newRefreshToken, oldRefreshToken }) => {
    await promisify(fs.writeFile)("data/token.json", JSON.stringify(newRefreshToken));
    console.log("Refresh Token Updated.");
  }
);

app.use(express.json({strict: false, limit: "5mb"}));

app.post("/:name", async (req, res) =>
{
  //get all cameras
  var cameras = await ringApi.getCameras();
  for(var camera of cameras)
  {
    if(camera.name != req.params.name)
    {
      continue;
    }

    //if camera name matches
    var buf = await camera.getSnapshot();
    //await fs.createWriteStream(`${camera.name}.jpg`).write(buf);
    res.json(buf.toString('base64'));
    return;
  }

  return null;
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

const https = require("https");
const express= require("express");

const port = 3000;
const app = express();

app.get("/samenwerken", (req, res) => {
  https.get("https://www.cmd-amsterdam.nl/wp-json/wp/v2/pages/758", response => {
    let data = "";

    response.on("data", buffer => data += buffer)

    response.on("end", () => {
      const parsed = JSON.parse(data);
      console.log(parsed.content.rendered)
      // console.log(Object.keys(parsed))
    })
  })
})

app.listen(port, () => console.log(`Listening to port: ${port}`))

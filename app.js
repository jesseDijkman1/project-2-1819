const https = require("https");
const express = require("express");
const fs = require("fs");
const path = require("path");

const port = 3000;
const app = express();

app.get("/samenwerken", (req, res) => {
  https.get("https://www.cmd-amsterdam.nl/wp-json/wp/v2/pages/758", response => {
    let data = "";

    response.on("data", buffer => data += buffer)

    response.on("end", () => {
      const html = JSON.parse(data).content.rendered;

      const rx = /\[.+\]/g;

      let tst = html.replace(rx, "");
      console.log(tst)

      fs.writeFile('index.html', tst, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

      res.sendFile(path.join(`${__dirname}/index.html`))
      // let result;
      // while (result = rx.exec(html)) !== null) {
      //
      // }

      // console.log(parsed.content.rendered)
      // console.log(Object.keys(parsed))
    })
  })
})

app.listen(port, () => console.log(`Listening to port: ${port}`))

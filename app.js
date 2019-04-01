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

      let normalHtml = html.replace(rx, "");

      const whiteSpaceCleaner = /(?<=\>)[\t\n\r\s]+(?=\<)/g;

      let minifiedHtml = normalHtml.replace(whiteSpaceCleaner, "")

      // console.log(tst)
      let stripRx = /\<(p|a|button|h[1-6]).+?\1\>|\<img.+?\/?\>|(?<=(div|span).+\>).[^\<\>]+(?=\<\/(div|span))/g;

      let temp = [];
      let result;

      while((result = stripRx.exec(minifiedHtml)) !== null) {
          temp.push(result[0])
      }
      console.log(temp)
    })
  })
})

app.listen(port, () => console.log(`Listening to port: ${port}`))

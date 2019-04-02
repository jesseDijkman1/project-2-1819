const https = require("https");
const express = require("express");
const fs = require("fs");
const path = require("path");

const port = 3000;
const app = express();

app.get("/samenwerken", (req, res) => {

// https://www.cmd-amsterdam.nl/wp-json/wp/v2/pages/758
  https.get("https://www.cmd-amsterdam.nl/wp-json/wp/v2/pages/8858", response => {
    let data = "";

    response.on("data", buffer => data += buffer)

    response.on("end", () => {
      const html = JSON.parse(data).content.rendered;

      // Selects all the: [full-width] bs
      const rx1 = /\[.+\]/g;

      // Selects all white spaces
      const rx2 = /(?<=\>)[\t\n\r\s]+(?=\<)/g;

      // Selects all the useful tags
      const rx3 = /\<(p|a|form|button|h[1-6]).+?\1\>|\<img.+?\/?\>|(?<=(div|span).+\>).[^\<\>]+(?=\<\/(div|span))/g;

      const normalHtml = html.replace(rx1, "");

      const minifiedHtml = normalHtml.replace(rx2, "")

      let ts = removeEmpty(minifiedHtml);


    })
  })
})

function removeEmpty(txt) {
  const rx = /\<(div|span|h[1-6])\s*(.[^\<])*\>[\s\t]*\<\/{1}\1\>/g;

  if (rx.test(txt) === true) {
    let newTxt = txt.replace(rx, "")
    console.log("loop over again")
    return removeEmpty(newTxt)
  } else {
    console.log("ending")
    return txt;
  }
}

app.listen(port, () => console.log(`Listening to port: ${port}`))

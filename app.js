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

      let smallerHtml = removeEmpty(minifiedHtml);

      let littleBetter = makeUlLi(smallerHtml)

      res.send(littleBetter)
      console.log(littleBetter)
      // console.log(tst)
      // console.log(smallerHtml)
    })
  })
})

function removeEmpty(html) {
  const rx = /\<(div|span|h[1-6])\s*(?:.[^\<])*\>[\s\t]*\<\/{1}\1\>/g;

  if (rx.test(html) === true) {
    let newHtml = html.replace(rx, "")
    console.log("loop over again")
    return removeEmpty(newHtml)
  } else {
    console.log("ending")
    return html;
  }
}

function makeUlLi(html) {
  // Full regex
  const rx = /(?:\<(div)\s*(?:.[^\<])*\>)?[\s\t\n]*(•).+?(?:\<\/(div)|(br\s*\/{0,1}))?\>/g;

  html = html.replace(rx, (...args) => {
    let match = args[0];
    const firstDiv = args[1];
    const bullet = args[2];
    const lastDiv = args[3];
    const br = args[4];

    if (firstDiv !== undefined) {
      match = match.replace(firstDiv, "ul")
    }

    if (bullet !== undefined) {
      match = match.replace(bullet, "<li>")
    }

    if (lastDiv !== undefined) {
      match = match.replace(lastDiv, "li></ul")
    }

    if (br !== undefined) {
      match = match.replace(br, "/li")
    }

    return match
  })

  return html
}

app.listen(port, () => console.log(`Listening to port: ${port}`))

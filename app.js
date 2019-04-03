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


      // Selects all the: [full-width] and &nbsp;
      const rx1 = /(?:\[.+\]|&nbsp;)/g;

      // fs.writeFile("preview.html", html, err => {
      //   if (err) throw err
      // })
      // Selects all white spaces
      const rx2 = /(?<=\>)[\t\n\r\s]+(?=\<)/g;

      // Selects all the useful tags
      const rx3 = /\<(p|a|form|button|h[1-6]).+?\1\>|\<img.+?\/?\>|(?<=(div|span).+\>).[^\<\>]+(?=\<\/(div|span))/g;

      const normalHtml = html.replace(rx1, "");

      const minifiedHtml = normalHtml.replace(rx2, "")
      console.log(minifiedHtml.length)
      const smallerHtml = removeEmpty(minifiedHtml);
      console.log(smallerHtml.length)
      const littleBetter = makeUlLi(smallerHtml)
      const labeled = makeLabels(littleBetter);

      res.send(labeled)
    })
  })
})

function removeEmpty(html) {
  const rx = /\<(\w+?)(?:.[^\<]*)?\>(?:[\s\t])*\<\/\1\>/g

  let tmp = 0;

  const newHtml = html.replace(rx, (...arg) => {
    const fullMatch = arg[0];
    const group = arg[1];

    if (["iframe", "textarea"].includes(group)) {
      return fullMatch
    } else {
      tmp++;
      return ""
    }
  })

  if (tmp > 0) {
    console.log("yes")
    return removeEmpty(newHtml)
  } else {
    return newHtml
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

function makeLabels(html) {
  // console.log(html)
  const rx = /\<(p)\>(.*)(\<br\s*\/\>).*(input|textarea|select).*\<\/?(\1)\>/g;
  const allPsRx = /(\<p\s*(?:.[^\<p])*\>).+?(\<\/p\>)/g
  const hasInputRx = /\<(input|textarea|select)/;
  const getP = /(?<=\<{1}\/?)p/g;

  // const inputTextareaRx = //g
  let result;

  // const allPsRx = /(\<p\s*(?:.[^\<p])*\>).+?(\<\/p\>)/g
  // while ((result = allPsRx.exec(html)) !== null) {
  //     if (hasInputRx.test(result[0])) {
  //
  //       let tst = result[0].replace(getP, "label")
  //       console.log(tst, "\n")
  //     }
  // }

  html = html.replace(allPsRx, (...args) => {
    if (hasInputRx.test(args[0])) {

      return args[0].replace(getP, "label")
    } else {
      return args[0]
    }
    // if (hasInputRx.test)
  })
  // console.log(html)
  return html
}

app.listen(port, () => console.log(`Listening to port: ${port}`))

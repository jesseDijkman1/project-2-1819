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

      // fs.writeFile("preview.html", html, err => {
      //   if (err) throw err
      // })
      // Selects all white spaces
      const rx2 = /(?<=\>)[\t\n\r\s]+(?=\<)/g;

      // Selects all the useful tags
      const rx3 = /\<(p|a|form|button|h[1-6]).+?\1\>|\<img.+?\/?\>|(?<=(div|span).+\>).[^\<\>]+(?=\<\/(div|span))/g;

      const normalHtml = html.replace(rx1, "");



      const minifiedHtml = normalHtml.replace(rx2, "")


      // console.log(minifiedHtml)
      // console.log(minifiedHtml.length)
      let smallerHtml = removeEmpty(minifiedHtml);
      console.log(smallerHtml)


      // let littleBetter = makeUlLi(smallerHtml)


      // console.log(littleBetter)
      // let labeled = makeLabels(littleBetter);
      // makeLabels(littleBetter)
      // res.send(littleBetter)
      // console.log(littleBetter)
      // console.log(tst)
      // console.log(smallerHtml)
    })
  })
})

function removeEmpty(html) {
  const rx = /\<(\w+?).[^\<]*\>(?:[\s\t])*\<\/\1\>/g

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
  // const rx = /\<(p)\>(.*)(\<br\s*\/\>).*(input|textarea|select).*\<\/?(\1)\>/g;
  const allPsRx = /(\<p\s*(?:.[^\<p])*\>).+?(\<\/p\>)/g
  // const inputTextareaRx = //g
  let result;

  while ((result = allPsRx.exec(html)) !== null) {
      // console.log(result[0], "\n")
  }

  // html = html.replace(rx, (...args) => {
  //   console.log("test")
  //   let match = args[0];
  //   const firstP = args[1];
  //   const content = args[2];
  //   const br = args[3];
  //   const inputType = args[4];
  //   const lastP = args[5];
  //
  //   // console.log(content, inputType)
  // })
}

app.listen(port, () => console.log(`Listening to port: ${port}`))

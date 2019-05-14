const https = require("https");
const express = require("express");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("static"));

app.get("/samenwerken", (req, res) => {

// https://www.cmd-amsterdam.nl/wp-json/wp/v2/pages/758
  https.get("https://www.cmd-amsterdam.nl/wp-json/wp/v2/pages/8858", response => {
    let data = "";

    response.on("data", buffer => data += buffer)

    response.on("end", () => {
      let html = JSON.parse(data).content.rendered;

      // Selects all the: [full-width] and &nbsp;
      const rx1 = /(?:\[.+\]|&nbsp;)/g;

      // Selects all white spaces
      const rx2 = /(?<=\>)[\t\n\r\s]+(?=\<)/g;

      // Selects all the useful tags
      const rx3 = /\<(p|a|form|button|h[1-6]).+?\1\>|\<img.+?\/?\>|(?<=(div|span).+\>).[^\<\>]+(?=\<\/(div|span))/g;

      console.log(html)
      html = html.replace(rx1, "");

      html = html.replace(rx2, "");

      html = removeEmpty(html)

      html = createHeadings(html)

      html = standalones(html);
      html = makeUlLi(html)
      html = makeLabels(html)

      html = removeBr(html)

      html = finalCleaner(html)

      html = paragrapher(html)

      html = iframeFixer(html)

      html = sectioner(html)

      html = docWrapper(html)
      res.send(html)
      // res.render("main.ejs", {cleanedHTML: html})
    })
  })
})

function removeEmpty(html) {
  const rx = /\<(\w+?)(?:.[^\<]*)?\>(?:[\s\t])*\<\/\1\>/g
  const bgImageRx = /\<(?:div|span).*?(background-image).*?\>/;

  let tmp = 0;

  const newHtml = html.replace(rx, (...arg) => {
    const fullMatch = arg[0];
    const group = arg[1];
    if (["iframe", "textarea"].includes(group)) {
      return fullMatch
    } else if (bgImageRx.test(fullMatch)) {
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
  const allPsRx = /(\<p\s*(?:.[^\<p])*\>).+?(\<\/p\>)/g
  const hasInputRx = /\<(input|textarea|select)/;
  const getP = /(?<=\<{1}\/?)p/g;

  html = html.replace(allPsRx, (...args) => {
    if (hasInputRx.test(args[0])) {
      return args[0].replace(getP, "label")
    } else {
      return args[0]
    }
  })

  return html
}

function createHeadings(html) {
  const rx = /\<(?:(?:span)\s(?:class="nectar-dropcap")(?:.[^\<\>]*))\>(.[^\<\>]+)*?\<\/(?:span)\>/g;

  return html.replace(rx, (...arg) => `<h2>${arg[1]}</h2>`)
}

function removeBr(html) {
  const rx = /\<br\s*\/\>/g;

  return html.replace(rx, "");
}

function standalones(html) {
  const rx = /\<(div|span)(?:.[^\<]*)?\>(.[^\<\>]+?)\<\/\1\>/g;

  return html.replace(rx, (...arg) => `${arg[2]}`)
}

function finalCleaner(html) {
  const rx = /\<(div|span).+?\>|\<\/(div|span)\>/g;

  return html.replace(rx, "");
}

function paragrapher(html) {
  const rx = /(?<=(\<\/.+?\>)).+?(\<\/?.+?\>)/g;
  const rx2 = /^([^<].+)\<(\/?)p\>/m
  // let res;

  return html.replace(rx, (...arg) => {
    // console.log(`\n${arg[0]}\n`)
    if (rx2.test(arg[0])) {
      // console.log(`${arg[0]}\n`)

      return arg[0].replace(rx2, (...g) => {
        if (!g[2]) {
          return g[0].replace(g[1], () => `<p>${g[1]}</p>`)
        } else {
          return `<p>${g[1]}</p>`
        }
      })
    } else {
      return arg[0]
    }
  })

}

function sectioner(html) {
  const rx = /<h2>.+?<\/h2>/g;
  const rxUlDiv = /<h3[\w\d\W\n\s\t]+?<\/ul>/g;
  const max = html.match(rx).length;
  let i = 0;

  let temp = html.replace(rx, (...g) => {
    if (i == 0) {
      i++
      return `<header>${g[0]}`
    } else if (i >= max - 1) {

      i++
      return `</section><footer>${g[0]}`
    } else if (i == 1) {
      i++
      return `</header><section>${g[0]}`
    } else {
      i++
      return `</section><section>${g[0]}`
    }
  })

  temp = temp.replace(rxUlDiv, (...g) => {
    return `<div class="list-container">${g[0]}</div>`
  })



  temp += "</footer>"

  return temp;
}

function iframeFixer(html) {
  const rx = /(?:<p>)(<ifram.+?>.*?<\/iframe>)(?:<\/p>)/g;

  return html.replace(rx, (...g) => `<div class="iframe-container">${g[1]}</div>`)
}

function docWrapper(html) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
  	<meta charset="UTF-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/css/cleaned.css">
  </head>
  <body>
    ${html}
  </body>
  </html>
`
}

app.listen(port, () => console.log(`Listening to port: ${port}`))

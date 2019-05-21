# Project 2 CMDA - Jesse Dijkman
## Assignment
For this course we're going to improve the performance and accessiblity of a website. The website I'm going to improve is [cmd-amsterdam.nl](https://www.cmd-amsterdam.nl/).

---

## Table of contents
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Running](#running)

---

## Getting Started
### Installation
- `git@github.com:jesseDijkman1/project-2-1819.git`
- `cd project-2-1819`
- `npm install`

### Running
`npm start`

---

## First audit
![audit results](https://raw.githubusercontent.com/jesseDijkman1/project-2-1819/master/readme-images/performance-score-1-cmd-amsterdam.png)
> These are the results for the "samenwerking" page. Looking at this, I'm going to first focus on fixing the performance. How I can easily fix this is just by recreating the entire html, and while doing this I'm also going to use semantic html. Because the current html is filled with divs

---

## Concept
My concept is a plugin that you can install on wordpress, that allows users to convert the current wordpress site to a readable one (for screenreaders).

## How it works
With the use of a wordpress feature that allows you to get JSON data from any wordpress website by pasting this: `/wp-json/wp/v2/pages/${page id}` after the URL. With this I can get JSON and by diving into the data I can get the static HTML. This html is converted to a single line, and then with the use of [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) I can look for patterns and convert them to more semantic html. The HTML goes through multiple steps:

```js
html = html.replace(/(?:\[.+\]|&nbsp;)/g, "");
html = html.replace(/(?<=\>)[\t\n\r\s]+(?=\<)/g, "");
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
```

And with the use of CSS selectors I can add some styling.

In samenwerking met [Robin Stut](https://github.com/RobinStut)

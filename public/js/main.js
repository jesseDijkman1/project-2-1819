if (navigator.serviceWorker) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../miniSw.js")
      .then(reg => console.log("Service worker: Registered"))
      .catch(err => console.log(`ervice worker: Error - ${err}`))
  })
}


console.log("cunt")

import { storeKey, views } from "./constants.js"

let period = document.querySelector('#period')
let body = document.querySelector('body')
let iframe = body.querySelector('#views')
let sessionAdmin = localStorage.getItem(storeKey)
if(!sessionAdmin) window.location = "/"
let dataAdmin = JSON.parse(sessionAdmin)
let signed = document.querySelector("#signed")
let year = new Date().getFullYear()
signed.innerHTML = dataAdmin.name
iframe.src = views["teacher"]

period.innerHTML = `${year} - ${year + 1}`


body.onclick = (e) => {
    let element = e.target
    let opt = element.dataset.opt
    let close = element.dataset.close
    if(opt) {
        iframe.src = views[opt]
    }

    if(close) {
        localStorage.removeItem(storeKey)
        window.location = "/logAdmin"
    }

}
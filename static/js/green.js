let btnNext = document.querySelector("#btn-next")
let nextColor = "/purple-color"

let store = localStorage.getItem("session-student")
if(!store) window.location = "/course"

btnNext.onclick = () => {
    window.location = nextColor
}
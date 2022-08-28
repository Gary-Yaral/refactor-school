let btnBefore = document.querySelector("#btn-before")
let btnNext = document.querySelector("#btn-next")
let beforeColor = "/orange-color"
let nextColor = "/test"

btnBefore.onclick = () => {
    window.location = beforeColor
}

btnNext.onclick = () => {
    window.location = nextColor
}
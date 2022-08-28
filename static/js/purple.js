let btnBefore = document.querySelector("#btn-before")
let btnNext = document.querySelector("#btn-next")
let beforeColor = "/green-color"
let nextColor = "/orange-color"

btnBefore.onclick = () => {
    window.location = beforeColor
}

btnNext.onclick = () => {
    window.location = nextColor
}

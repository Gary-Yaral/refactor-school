let btnBefore = document.querySelector("#btn-before")
let btnNext = document.querySelector("#btn-next")
let beforeColor = "/purple-color"
let nextColor = "/training"

btnBefore.onclick = () => {
    window.location = beforeColor
}

btnNext.onclick = () => {
    window.location = nextColor
}
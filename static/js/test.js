let btnBefore = document.querySelector("#btn-before")
let btnNext = document.querySelector("#btn-next")
let controls = document.querySelector('.block-controls')
let hearts = document.querySelector('.hearts')
let timer = document.querySelector("#timer") 

let store = localStorage.getItem("session-student")
if(!store) window.location = "/course"

let data = {
    "9": ["g1", "g2", "g3"],
    "10": ["p1", "p2"],
    "11": ["o1", "o2", "o3"]
} 

let counter = 0
timer.innerHTML = counter + "s"

setInterval(() => {
    counter++
    timer.innerHTML = counter + "s"
}, 1000)

let nRandom = generateRandomInt(9, 12)

controls.innerHTML = `
    <audio controls autoplay>
        <source src="../static/sounds/${nRandom}.m4a" type="audio/mp3">
    </audio>
`
let limit = nRandom === 9 || nRandom === 11 ? 3: 2
let blockImg = document.querySelector('.block-img')
let colors = []
let clicks = 0

blockImg.onclick = (e) => {
    let element = e.target
    let color = element.dataset.img
    if(color) {
        clicks++
        let obj = data[`${nRandom}`]
        let foundColor = obj.includes(color)
        if(foundColor) {
            if (!colors.includes(color)) {
                colors.push(color)
            }
        }

        if (clicks === obj.length) {
            if(colors.length === obj.length) {
                Swal.fire("OK", "😃 Ganaste!!!", "success")
                .then(ok => {
                    sendData(true)
                    return window.location = "stars"
                })
            } else {
                Swal.fire("OWwww!", "🙂 Tú puedes!!. Intentalo de nuevo!", "warning")
                .then(ok => {
                    let heart = document.querySelectorAll('.heart')
                    if(heart.length === 1) {
                        sendData(false)
                        return window.location = "stars"
                    }
                    hearts.removeChild(heart[0])
                    colors = []
                    clicks = 0
                })
            }
        } 
        
    }  
}

function sendData(status) {
    let student = JSON.parse(localStorage.getItem("session-student"))
    let note = 0
    let time = counter
    if(status === true) {
        note = 10
    } else {
        note = 5
    }

    student = {...student, time, note} 
    localStorage.setItem("session-student", JSON.stringify(student))
}

function generateRandomInt(min,max){
    return Math.floor((Math.random() * (max-min)) + min);
}



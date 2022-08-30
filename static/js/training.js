let btnBefore = document.querySelector("#btn-before")
let btnNext = document.querySelector("#btn-next")
let beforeColor = "/orange-color"
let nextColor = "/test"
let controls = document.querySelector('.block-controls')
let hearts = document.querySelector('.hearts')
let keyStore = "training"
let store = localStorage.getItem(keyStore)
let lifes = 0

let storeStd = localStorage.getItem("session-student")
if(!storeStd) window.location = "/course"

if(store) {
    let storeData = JSON.parse(store)
    lifes = storeData.lifes
    for(let i = 0; i < storeData.lifes; i++ ) {
        let heart = document.querySelectorAll('.heart')
        hearts.removeChild(heart[0])
    }
}

let data = {
    "6": ["g1", "g2", "g3"],
    "7": ["p1", "p2"],
    "8": ["o1", "o2", "o3"]
} 


let nRandom = generateRandomInt(6, 9)
controls.innerHTML = `
    <audio controls autoplay>
        <source src="../static/sounds/${nRandom}.m4a" type="audio/mp3">
    </audio>
`
let limit = nRandom === 6 || nRandom === 8 ? 3: 2

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
                    lifes = 0
                    localStorage.setItem(keyStore, JSON.stringify({lifes}))
                    window.location = ""
                })
            } else {
                Swal.fire("OWwww!", "🙂 Tú puedes!!. Intentalo de nuevo!", "warning")
                .then(ok => {
                    lifes++
                    if(lifes === 3) {
                        lifes = 0
                    }

                    localStorage.setItem(keyStore, JSON.stringify({lifes}))
                    window.location = ""
                })
            }
        } 
        
    }
    
    
}

btnBefore.onclick = () => {
    window.location = beforeColor
}

btnNext.onclick = () => {
    localStorage.removeItem(keyStore)
    window.location = nextColor
}

function generateRandomInt(min,max){
    return Math.floor((Math.random() * (max-min)) + min);
}



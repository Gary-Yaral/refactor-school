const btnSend = document.querySelector('#btn-send')
const rating = document.querySelectorAll('input[name=rating]');
let stars = 0

let store = localStorage.getItem("session-student")
if(!store) window.location = "/course"

rating.forEach((radio) => {
    radio.addEventListener('change', getRating);
});

btnSend.onclick = () => {
    sendData()
}

function getRating() {
    stars = document.querySelector('input[name=rating]:checked').value;
}


function sendData() {
    let student = JSON.parse(localStorage.getItem("session-student"))
    console.log(student)
    let data = {...student, stars}
    console.log(data)
    let route = "/save-test"
    $.post(route, {...data}, (result) => {
        console.log(result)
        if(result.saved) {
            console.log("here")
            localStorage.removeItem("session-student")
            window.location = "/course"
        }
    })

}

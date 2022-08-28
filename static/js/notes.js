import { storeKeyTeachers } from "./constants.js"


let signedTeacher = localStorage.getItem(storeKeyTeachers)
if(!signedTeacher) window.location = "/teacher"
const route = "/get-students"
const close = document.querySelector("#close")
const teacher = document.querySelector("#teacher")
const teacherData = JSON.parse(signedTeacher)
teacher.innerHTML = teacherData.name

close.onclick = (e) => {
    localStorage.removeItem(storeKeyTeachers)
    window.location = "/teacher"
}


$.get(route, (result) => {
})
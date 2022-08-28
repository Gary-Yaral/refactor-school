import { storeKeyStudents } from "./constants.js"

let courses = document.querySelector("#courses")
let title = document.querySelector("#title-course")
let body = document.querySelector("body")
let store = localStorage.getItem(storeKeyStudents)
if(!store) window.location = "/course"
let dataStore = JSON.parse(store)
let course = dataStore.course
title.innerHTML = `Bienvenidos a ${dataStore.courseName}`

courses.innerHTML = ""
const coursesRoute = "/get-students"
$.post(coursesRoute, {id: course}, (result) => {
    if(result.length === 0) {
        courses.innerHTML = `<div class="col-12">No hay cursos registrados</div>`
    } else {
        result.forEach(data => {
            let id = data._id.$oid
            courses.innerHTML += `
                <div class="custom-btn" data-student= ${id}>
                    <img class="custom-img" src="${data.image}">
                </div>`
        });
    } 
})

body.onclick = (e) => {
    let element = e.target
    let student = element.dataset.student
    if(student) {
        dataStore.studentID = student
        localStorage.setItem(storeKeyStudents, JSON.stringify(dataStore))
        window.location = "/green-color"
    }
}

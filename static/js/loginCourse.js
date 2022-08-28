import { sessionStudent, storeKeyStudents } from "./constants.js"

let courses = document.querySelector("#courses")
let body = document.querySelector("body")
courses.innerHTML = ""
const coursesRoute = "/get-courses"
$.get(coursesRoute, (result) => {
    if(result.length === 0) {
        courses.innerHTML = `<div class="col-12">No hay cursos registrados</div>`
    } else {
        result.forEach(data => {
            let id = data._id.$oid
            let course = data.course
            let parallel = data.parallel
            let courseName = course + " " + parallel
            courses.innerHTML += `
                <div 
                    class="custom-btn custom-display" 
                    data-course="${id}" 
                    data-name="${courseName}"
                >
                    ${courseName}
                </div>`
        });
    } 
})

body.onclick = (e) => {
    let element = e.target
    let course = element.dataset.course
    if(course) {
        sessionStudent.course = course
        sessionStudent.courseName = element.dataset.name
        localStorage.setItem(storeKeyStudents, JSON.stringify(sessionStudent))
        window.location = "/select-student"
    }
}

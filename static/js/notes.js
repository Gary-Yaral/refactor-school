import { storeKeyTeachers } from "./constants.js"

let signedTeacher = localStorage.getItem(storeKeyTeachers)
if(!signedTeacher) window.location = "/teacher"
const route = "/get-tests"
const close = document.querySelector("#close")
const teacher = document.querySelector("#teacher")
const courseName = document.querySelector("#course")
const teacherData = JSON.parse(signedTeacher)
const tbody = document.querySelector('tbody')
teacher.innerHTML = teacherData.name
courseName.innerHTML = teacherData.course

close.onclick = (e) => {
    localStorage.removeItem(storeKeyTeachers)
    window.location = "/teacher"
}

$.get(route, (result) => {
    tbody.innerHTML = ""
    if(result.length === 0) {

    } else {
        result.forEach((data, index) => {
            let dni = data.student[0].dni
            let name = data.student[0].name
            let row = `
                <tr>
                    <th class="text-center">${index + 1}</th>
                    <td class="text-center">${dni}</td>
                    <td class="text-center">${name}</td>
                    <td class="text-center">${data.time} s</td>
                    <td class="text-center">${data.stars}</td>
                    <td class="text-center">${data.note}</td>
                </tr>
            `
            tbody.innerHTML += row
        });
    }
})
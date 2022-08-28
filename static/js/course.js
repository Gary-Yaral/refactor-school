import { resetValues, validateField, validateFieldsObject } from "./formValidator.js"

let form = document.querySelector("form")
let body = document.querySelector("body")
let {course, parallel, teacher, limit}  = form

loadParallels()
loadLimit()
loadTeachers()
loadTable()

let validator = {
    course: false,
    parallel: false,
    teacher: false,
    limit: false,
}

let errors = {
    course: "Seleccione un aula",
    parallel: "Seleccione el paralelo",
    teacher: "Seleccione el docente",
    limit: "Seleccione el cupo"
}

let data = {
    course: "",
    parallel: "",
    teacher: "",
    limit: ""
}

course.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "course",
        values: data,
        selector: ".error-course",
        validator,
        errors
    }
    validateField(objectValidator) 
}

parallel.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "parallel",
        values: data,
        selector: ".error-parallel",
        validator,
        errors
    }
    validateField(objectValidator) 
}

teacher.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "teacher",
        values: data,
        selector: ".error-teacher",
        validator,
        errors
    }
    validateField(objectValidator) 
}

limit.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "limit",
        values: data,
        selector: ".error-limit",
        validator,
        errors
    }
    validateField(objectValidator) 
}

form.addEventListener("submit", async(e) => {
    e.preventDefault()
    if(validateFieldsObject(data)) {
        const route = "/save-course"
        $.post(route, data, (result) => {
            if(result.saved) {
                return Swal.fire("Listo!!", result.message, "success")
                .then(ok => {
                        form.reset()
                        resetValues(data)
                        loadTable()
                })
            } else {
                Swal.fire("Atención!!", result.error, "warning")
                }
            })

    } else {
        Swal.fire("Atención", "Debe seleccionar todos los campos", "warning")
    }
})

async function loadTeachers() {
    const route = "/get-teachers"
    teacher.innerHTML = `
        <option value="">
            Seleccione el docente
        </option>
    `
    let response = await fetch(route)
    let result = await response.json()
    
    if(result.length> 0) {
        result.forEach(data => {
            let opt = `
                <option value="${data._id.$oid}">
                    ${data.name}
                </option>
            `
            teacher.innerHTML += opt
        }); 
    }
}

function loadParallels() {
    let total = ["A", "B", "C", "D", "F", "G"]
    total.forEach(letter => {
        parallel.innerHTML += `
            <option value=${letter}>
                ${letter}
            </option>
        `
    })
}

function loadLimit() {
    let total = 50
    for (let i = 1; i <= total; i++) {
        limit.innerHTML += `
            <option value=${i}>
                ${i}
            </option>
        `
    }
}

function loadTable() {
    const tbody = document.querySelector('tbody')
    const route = "/get-courses"
    tbody.innerHTML = ""
    $.get(route, (result) => {
        if(result.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td class="text-center" colspan="6">
                        No hay aulas registradas
                    </td>
                </tr>
            `
        } else {
            result.forEach((data, index) => {
                let id = data._id.$oid
                let courseName = data.course + " " + data.parallel
                let totalStudents = data.students.length
                let available = data.limit  - totalStudents
                let teacherName = data.teacher[0].name
                let row = `
                    <tr>
                        <th class="text-center">${index + 1}</th>
                        <td class="text-center">${courseName}</td>
                        <td class="text-center">${teacherName}</td>
                        <td class="text-center">${data.limit}</td>
                        <td class="text-center">${available}</td>
                        <td class="text-center">
                            <button class="btn btn-success" data-update="${id}">
                                Editar
                            </button>
                            <button class="btn btn-danger" data-delete="${id}">
                                Borrar
                            </button>
                        </td>
                    </tr>
                `
                tbody.innerHTML += row
            })
        }
    })
}

function deleteCourse(id) {
    const route = "/delete-course"
    $.post(route, {id}, (result) => {
        if(result.deleted) {
            return Swal.fire("Listo!!", result.message, "success")
            .then(ok => {
                loadTable()
            })
        } else {
            Swal.fire("Atención!!", result.error, "warning")
        }
    })
}

body.onclick = async (e) => {
    let element = e.target
    let updateID = element.dataset.update
    let deleteID = element.dataset.delete

    if( updateID ) {

    }

    if (deleteID) {
        deleteCourse(deleteID)
    }

} 


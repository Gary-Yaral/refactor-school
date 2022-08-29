import { resetValues, validateField, validateFieldsObject } from "./formValidator.js"
import { getModal } from "./modal.js"

let form = document.querySelector("form")
let body = document.querySelector("body")
let {course, parallel, teacher, limit}  = form
let {modal, showModal, hideModal} = getModal()
let formModal = modal.querySelector('form')
let {
    parallel_update, 
    course_update,
    limit_update,
    teacher_update
} = formModal

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

let validatorUpdate = {
    course_update: false,
    parallel_update: false,
    teacher_update: false,
    limit_update: false,
}

let errorsUpdate = {
    course_update: "Seleccione un aula",
    parallel_update: "Seleccione el paralelo",
    teacher_update: "Seleccione el docente",
    limit_update: "Seleccione el cupo"
}

let dataUpdate = {
    id_course: "",
    course_update: "",
    parallel_update: "",
    teacher_update: "",
    limit_update: 0,
    students: 0
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

course_update.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "course_update",
        values: dataUpdate,
        selector: ".error-course-update",
        validator: validatorUpdate,
        errors: errorsUpdate
    }
    validateField(objectValidator) 
}

parallel_update.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "parallel_update",
        values: dataUpdate,
        selector: ".error-parallel-update",
        validator: validatorUpdate,
        errors: errorsUpdate
    }
    validateField(objectValidator) 
}

teacher_update.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "teacher_update",
        values: dataUpdate,
        selector: ".error-teacher-update",
        validator: validatorUpdate,
        errors: errorsUpdate
    }
    validateField(objectValidator) 
}

limit_update.onchange = (e) => {
    const objectValidator = {
        element: e.target,
        field: "limit_update",
        values: dataUpdate,
        selector: ".error-limit-update",
        validator: validatorUpdate,
        errors: errorsUpdate
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
        Swal.fire("Atención", "Debe haber seleccionado todos los campos", "warning")
    }
})

formModal.addEventListener("submit", async(e) => {
    e.preventDefault()
    if(validateFieldsObject(dataUpdate)) {
        if(dataUpdate.limit_update < dataUpdate.students) {
            console.log("click")
            return Swal.fire(
                "Atención!!", 
                "El cupo debe ser mayor al numero de estudiantes que ya pertenecen al aula", "warning"
            )
        }

        const route = "/update-course"
        $.post(route, dataUpdate, (result) => {
            if(result.updated) {
                return Swal.fire("Listo!!", result.message, "success")
                .then(ok => {
                        formModal.reset()
                        resetValues(dataUpdate)
                        loadTable()
                        hideModal()
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
    const optDefault = `
        <option value="">
            Seleccione el docente
        </option>
    `
    teacher.innerHTML = optDefault
    teacher_update.innerHTML = optDefault

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
            teacher_update.innerHTML += opt
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
        parallel_update.innerHTML += `
            <option value=${letter}>
                ${letter}
            </option>
        `
    })
}

function loadLimit() {
    let total = 50
    for (let i = 1; i <= total; i++) {
        const opt = `
            <option value=${i}>
                ${i}
            </option>
        `
        limit.innerHTML += opt
        limit_update.innerHTML += opt

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
                let totalStudents = data.students.length
                let available = data.limit  - totalStudents
                let teacherName = data.teacher[0].name
                let teacherID = data.teacher[0]._id.$oid
                let row = `
                    <tr>
                        <th class="text-center">${index + 1}</th>
                        <td class="text-center">${data.course}</td>
                        <td class="text-center">${data.parallel}</td>
                        <td class="text-center" data-id="${teacherID}">
                            ${teacherName}
                        </td>
                        <td class="text-center">${data.limit}</td>
                        <td class="text-center">${available}</td>
                        <td class="text-center">
                            <button class="btn btn-primary" data-update="${id}">
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
        let row = element.parentNode.parentNode
        let tds = row.querySelectorAll('td')
        let course = tds[0].innerHTML
        let parallel = tds[1].innerHTML
        let teacher = tds[2].dataset.id
        let limit = tds[3].innerHTML
        let students = limit - tds[4].innerHTML
        dataUpdate.id_course = updateID
        dataUpdate.students = students
        let data = {
            course_update: course,
            parallel_update: parallel,
            teacher_update: teacher,
            limit_update: limit,
        }

        dataUpdate = { ...dataUpdate, ... data }
        showModal(data)
    }

    if (deleteID) {
        deleteCourse(deleteID)
    }

} 


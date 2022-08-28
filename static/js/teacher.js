import { resetValues, validateField, validateFieldsObject } from "./formValidator.js"

let form = document.querySelector('form')
let body = document.querySelector('body')
let {dni, name} = form

loadTeachers()

let validator = {
    dni: /^([\d]{10})$/,
    name: /^([a-zA-ZáéíóúÁÉÍÓÚ\s]{2,})$/,
}

let errors = {
    dni: "Por favor ingresa 10 números",
    name: "Nombre debe contener al menos 2 letras, solo se permiten letras y espacios"
}

let data = {
    dni: "",
    name: ""
}

dni.oninput = (e) => {
    const objectValidator = {
        element: e.target,
        field: "dni",
        values: data,
        selector: ".error-dni",
        validator,
        errors
    }
    validateField(objectValidator) 
}

name.oninput = (e) => {
    const objectValidator = {
        element: e.target,
        field: "name",
        values: data,
        selector: ".error-name",
        validator,
        errors
    }
    validateField(objectValidator) 
}

form.onsubmit = async(e) => {
    e.preventDefault()
    if(validateFieldsObject(data)) {
        const route = "/save-teacher"
        let formData = new FormData()
        formData.append("dni", data.dni)
        formData.append("name", data.name)

        let response = await fetch(route, {
            method: "POST",
            body: formData
        })

        let result = await response.json()
        if(result.saved) {
           return Swal.fire("Listo!!", result.message, "success")
           .then(ok => {
                form.reset()
                resetValues(data)
                loadTeachers()
           })
        } else {
            Swal.fire("Atención!!", result.error, "warning")
        }
    }
}

body.onclick = async (e) => {
    let element = e.target
    let updateID = element.dataset.update
    let deleteID = element.dataset.delete

    if( updateID ) {

    }

    if (deleteID) {
        deleteTeacher(deleteID)
    }

} 

async function loadTeachers() {
    const teacherRoute = "/get-teachers"
    const tbody = document.querySelector('tbody')
    let response = await fetch(teacherRoute)
    let data = await response.json()
    tbody.innerHTML = ""
    if(data.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td class="text-center" colspan="5">
                No hay docentes registrados
            </td>
        </tr>
        `
    }

    data.forEach((teacher, index) => {
        let id = teacher._id.$oid
        let row = ` 
        <th class="text-center">${index + 1}</th>
        <td>${teacher.dni}</td>
        <td>${teacher.name}</td>
        <td>${teacher.username}</td>
        <td>
            <div class="btn btn-primary" data-update="${id}">
                Editar
            </div>
            <div class="btn btn-danger" data-delete="${id}">
                Borrar
            </div>
        </td>
        `
        tbody.innerHTML += row
    });
    
}

async function deleteTeacher(id) {
    const route = "/delete-teacher"
    let formData = new FormData()
    formData.append('id', id)
    let response = await fetch(route, {method:"POST", body: formData})
    let result = await response.json()
    if(result.saved) {
        return Swal.fire("Listo!!", result.message, "success")
           .then(ok => {
                loadTeachers()
           })
    } else {
        Swal.fire("Error!!", result.error, "error")
    }
}

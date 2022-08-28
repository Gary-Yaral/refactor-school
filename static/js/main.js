import { storeKey } from "./constants.js"
import { validateField, validateFieldsObject } from "./formValidator.js"

let sessionAdmin = localStorage.getItem(storeKey)
if(sessionAdmin) window.location = "/control-panel"
const form = document.querySelector('form')
const {username, password} = form

let validator = {
    username: /^([a-zA-Z_\.\d\@]{8,})$/,
    password: /^([a-zA-Z_\.\d\@]{8,})$/,
}

let errors = {
    username: "Usuario debe contener al menos 8 caracteres",
    password: "Contraseña debe contener al menos 8 caracteres"
}

let data = {
    username: "",
    password: ""
}

username.oninput = (e) => {
    const objectValidator = {
        element: e.target,
        field: "username",
        values: data,
        selector: ".error-username",
        validator,
        errors
    }
    validateField(objectValidator) 
}

password.oninput = (e) => {
    const objectValidator = {
        element: e.target,
        field: "password",
        values: data,
        selector: ".error-password",
        validator,
        errors
    }
    validateField(objectValidator) 
}

form.addEventListener("submit", async(e) => {
    e.preventDefault()
    if(validateFieldsObject(data)) {
        const loginRoute = "/login-admin"
        let { username, password } = data
        const formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)
        let response = await fetch(loginRoute, {
            method: "POST",
            body:formData
        })

        let result = await response.json()
        if(result.access) {
            form.reset()
            let { _id, name } = result.data
            let signed = {_id, name}
            localStorage.setItem(storeKey, JSON.stringify(signed))
            window.location = "/control-panel"

        } else {
            Swal.fire("Error", result.error, "warning")
        }

    } else {
        Swal.fire("Atención", "Debe rellenar todos los campos", "warning")
    }
})
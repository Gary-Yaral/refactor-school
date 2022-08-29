let storeKey = "session-admin"
let storeKeyStudents = "session-student"
let storeKeyTeachers = "session-teacher"
let views = {
    teacher: "../static/views/teacher.html",
    student: "../static/views/student.html",
    course: "../static/views/course.html"
}

let sessionStudent = {
    course: "", 
    courseName: "", 
    studentID: "",
    note: "",
    time: 0,
    stars: 0
}

let sessionTeacher = {
    id: "",
    name: "",
    course: ""
}

export { 
    views, 
    storeKey, 
    storeKeyStudents, 
    storeKeyTeachers, 
    sessionStudent,
    sessionTeacher
 }
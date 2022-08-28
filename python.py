
from flask import Flask, render_template
from flask_pymongo import PyMongo
import routes.login as login
import routes.course as course
import routes.teacher as teacher
import routes.colors as colors
import routes.student as student

app = Flask(__name__, template_folder='templates')

# Conexion con la Base de datos
app.config['MONGO_DBNAME'] = 'Proyecto-U3'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Proyecto-U3'

mongo = PyMongo(app)

# Validates the admin credentials
@app.route('/login-admin', methods=['POST'])
def validate_access_admin():
    return login.validateAccess(mongo)


# Shows login form of the admin
@app.route('/')
def show_teacher_form():
    return render_template('/logAdmin.html')

# Validates the admin credentials
@app.route('/login-teacher', methods=['POST'])
def validate_access_teacher():
    return teacher.validateAccess(mongo)
    
# Shows login form of the admin
@app.route('/teacher')
def show_admin_form():
    return render_template('/logTeacher.html')

# Show the control pane ------------------
@app.route('/control-panel', methods=['GET'])
def controlPane():
    return render_template('/regData.html')

# Show the control pane ------------------
@app.route('/notes', methods=['GET'])
def controlNotes():
    return render_template('/notes.html')

# Register a Teacher ----------------------
@app.route('/save-student', methods=['POST'])
def save_student():
    return student.save(mongo)

# Register a Teacher ----------------------
@app.route('/save-teacher', methods=['POST'])
def save_teacher():
    return teacher.save(mongo)

# Saves a course --------------------------
@app.route('/save-course', methods=['POST'])
def save_course():
    return course.save(mongo)

# Gets all Teachers ------------------------
@app.route('/get-students', methods=['POST', 'GET'])
def get_students():
   return student.getAll(mongo)

# Gets all Teachers ------------------------
@app.route('/get-teachers', methods=['GET'])
def get_teachers():
   return teacher.getAll(mongo)

# Gets all Courses -------------------------
@app.route('/get-courses', methods=['GET'])
def get_courses():
    return course.getAll(mongo)

# Deletes one Teacher -----------------------
@app.route('/delete-teacher', methods=['POST'])
def delete_teacher():
    return teacher.delete(mongo)

# Deletes one student -----------------------
@app.route('/delete-student', methods=['POST'])
def delete_student():
    return student.delete(mongo)

# Deletes one course -----------------------
@app.route('/delete-course', methods=['POST'])
def delete_course():
    return course.delete(mongo)

# Show all registered courses ---------------
@app.route('/course', methods=['POST', "GET"])
def login_students():
    return render_template("/logCourse.html")

# Show all registered courses ---------------
@app.route('/select-student', methods=["GET"])
def select_student():
    return render_template("/selectStudent.html")

# Shows the template of red color -----------
@app.route('/green-color', methods=['POST', "GET"])
def show_green_color():
    return colors.setTemplate("green")

# Shows the template of purple color --------
@app.route('/purple-color', methods=['POST', "GET"])
def show_purple_color():
    return colors.setTemplate("purple")

# Shows the template of orange color --------
@app.route('/orange-color', methods=['POST', "GET"])
def show_orange_color():
    return colors.setTemplate("orange")

# Shows the template for training --------
@app.route('/training', methods=['POST', "GET"])
def show_training():
    return render_template("/training.html")

# Shows the template so kinds can do the test -----
@app.route('/test', methods=['POST', "GET"])
def show_test():
    return render_template("/test.html")

# Shows the template stars -----
@app.route('/stars', methods=['POST', "GET"])
def show_stars():
    return render_template("/stars.html")



if __name__ == '__main__':
    app.secret_key = 'mysecret'
    app.run(debug=True)

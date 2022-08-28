from flask import request, Response, jsonify
from bson.json_util import dumps
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

def getAll(mongo):
    if request.method == 'GET':
        users = mongo.db.Users
        teachers = users.find({"rol": ["Teacher"]})
        data = dumps(teachers)
        return Response(data, mimetype="application/json")

def save(mongo):
    if request.method == 'POST':
        users = mongo.db.Users
        dni = request.form['dni']
        teacher_name = request.form['name']
        username = "doc_" + request.form['dni']
        existing_user = users.find_one({'username': username})

        if existing_user is None:
            password = generate_password_hash(dni, "sha256", 10)
            users.insert_one({
                "dni": dni,
                "name": teacher_name,
                "username": "doc_" + dni,
                "password": password,
                "rol": ["Teacher"]
            })

            return jsonify({
                "saved": True, 
                "message": "Docente guardado correctamente"
            })
        return jsonify({
                "saved": False,
                "error": "Ya existe un docente con esa cédula"
            })

def delete(mongo):
    if request.method == 'POST':
        users = mongo.db.Users
        courses = mongo.db.Courses
        id = ObjectId(request.form["id"])
        found_course = courses.find_one({"teacher": id})

        if found_course != None:
            return jsonify({
                "saved": False, 
                "error": "No es posible eliminar. Docente tiene aula asignada"
            })

        users.delete_one({"_id": id})
        return jsonify({
            "saved": True, 
            "message": "Docente eliminado correctamente"
        })

def validateAccess(mongo):
    users = mongo.db.Users
    username = request.form['username']
    password = request.form['password']
    rol_admin = "Teacher"

    login_user = users.find_one({
        'username': username, 
        "rol": [rol_admin]
    })

    if login_user == None:
         return jsonify ({
            "access": False,
            "error": "Usuario no es valido"
        })  

    passwordIsValid = check_password_hash(login_user["password"], password)
    if passwordIsValid:
        data = dumps({
            "access": True,
            "data": login_user
        })

        return Response(data, mimetype="application/json")
    else:
        return jsonify ({
            "access": False,
            "error": "Contraseña incorrecta"
        })

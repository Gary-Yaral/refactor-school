from flask import request, Response, jsonify
from bson.json_util import dumps
import json
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

def update(mongo):
    if request.method == 'POST':
        users = mongo.db.Users
        id = ObjectId(request.form["id"])
        name = request.form["name"]
        dni = request.form["dni"]

        found_teacher = users.find_one({"dni": dni})
        print(found_teacher)
        # Veriifcamos si ya existe esa cedula
        if found_teacher != None:
            isSame = found_teacher['_id'] == id
            if isSame == False:
                return jsonify({
                    "error": "Este usuario ya existe"
                })

        password = generate_password_hash(dni, "sha256", 10)
        users.find_one_and_update(
            {
                "_id": id
            },
            {
                "$set": {
                    "name": name,
                    "dni": dni,
                    "username": "doc_"+dni,
                    "password": password
                }
            }
        )

        return jsonify({
            "updated": True, 
            "message": "Docente actualizado correctamente"
        })


def validateAccess(mongo):
    users = mongo.db.Users
    courses = mongo.db.Courses
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
        course = courses.find_one({"teacher": login_user["_id"]})
        data = dumps({
            "access": True,
            "data": login_user,
            "course": course
        })
        return Response(data, mimetype="application/json")

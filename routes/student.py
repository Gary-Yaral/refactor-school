from urllib import request
from flask import jsonify, request, Response
from bson.objectid import ObjectId
from bson.json_util import dumps

def save(mongo):
    if request.method == "POST":
        users = mongo.db.Users
        dni = request.form["dni"]
        name = request.form["name"]
        course = ObjectId(request.form["course"])
        image = request.form["image"]
        found_user = users.find_one({"dni": dni})

        if found_user != None:
            return jsonify({"error": "Este usuario ya existe"})

        found_user = users.insert_one({
            "dni": dni,
            "name": name,
            "username": "est_" + dni,
            "course": course,
            "image": image,
            "rol": ["Student"]
        })

        return jsonify({
            "saved": True,
            "message": "Estudiante ha sido guardado"
        })

def delete(mongo):
    users = mongo.db.Users
    subjects = mongo.db.Subjects
    id = ObjectId(request.form["id"])
    users.delete_one({"_id": id})
    found_users = subjects.find_one({"student": id})
    print(found_users)
    if found_users != None:
        return jsonify({
            "error": "No es posible eliminar estudiante. Tiene notas registradas"
        })

    return jsonify({
        "deleted": True,
        "message": "Estudiante ha sido eliminado"
    })

def getAll(mongo): 
    if request.method == "GET":
        users = mongo.db.Users
        students = dumps(users.aggregate([
            {
                "$match": {
                    "rol": ["Student"]
                }
            },
            { 
                "$lookup": {
                        "from": "Courses", 
                        "foreignField": "_id",
                        "localField": "course",
                        "as": "course"
                    }
            }
        ]))
        return Response(students, mimetype="application/json")
    if request.method == "POST":
        users = mongo.db.Users
        if request.form["id"] != None:
            id = ObjectId(request.form["id"])
            students = dumps(users.find({"course": id}))   
            return Response(students, mimetype="application/json")
        else:
            return jsonify({
                "error": "404"
            })
from flask import request, jsonify, Response
from bson.objectid import ObjectId
from bson.json_util import dumps

def save(mongo): 
    if request.method == 'POST':
        courses = mongo.db.Courses
        course = request.form['course']
        teacher_id = ObjectId(request.form['teacher'])
        parallel = request.form['parallel']
        limit = request.form['limit']

        found_course = courses.find_one({
            "course": course,
            "parallel": parallel
        })

        if found_course != None:
            return jsonify({
                "saved": False,
                "error": "Ya existe esa aula"
            })

        found_teacher = courses.find_one({
            "teacher": teacher_id
        })


        if found_teacher != None:
            return jsonify({
                "saved": False,
                "error": "Este docente ya ha tiene aula asignada"
            })
        
        courses.insert_one({
            "course": course,
            "parallel": parallel,
            "teacher": teacher_id,
            "limit": limit
        })
        
        return jsonify({
            "saved": True, 
            "message": "Aula guardada correctamente"
        })

def getAll(mongo):
    if request.method == 'GET':
        courses = mongo.db.Courses
        data = dumps(courses.aggregate([
        { 
            "$lookup": {
                    "from": "Users", 
                    "foreignField": "_id",
                    "localField": "teacher",
                    "as": "teacher"
                }
        },
        { 
            "$lookup": {
                "from": "Users", 
                "foreignField": "course",
                "localField": "_id",
                "as": "students"
            }
        }])
        )
        return Response(data, mimetype="application/json")

def delete(mongo):
    courses = mongo.db.Courses
    users = mongo.db.Users
    id = ObjectId(request.form["id"])

    found_user = users.find_one({"course": id})
    if found_user != None:
        return jsonify({
            "error": "No es posible eliminar esta aula. Tiene estudiantes registrados"
        })

    courses.delete_one({"_id": id})
    return jsonify({
        "deleted": True,
        "message": "Aula ha sido eliminada"
    })


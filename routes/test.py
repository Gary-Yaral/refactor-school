from flask import request, Response, jsonify
from bson.json_util import dumps
from bson.objectid import ObjectId

def get(mongo):
    tests = mongo.db.Tests
    result = dumps(tests.aggregate([
        {
            "$lookup": {
                "from": "Users",
                "foreignField": "_id",
                "localField": "student",
                "as": "student"
            }
        }
    ]))
    return Response(result, mimetype="application/json")

def save(mongo):
    if request.method == "POST":
        tests = mongo.db.Tests
        student = ObjectId(request.form["studentID"])
        course = ObjectId(request.form["course"])
        note = request.form["note"]
        stars = request.form["stars"]
        time = request.form["time"]

        found_student = tests.find_one({"student": student})

        if found_student != None: 
            tests.find_one_and_update(
                {
                    "student": student
                }, 
                {
                    "$set": {
                        "course": course,
                        "note": note,
                        "stars": stars,
                        "time": time
                    }
                }
            )
            return jsonify({
                "saved": True,
            })

        tests.insert_one({      
            "student": student,
            "course": course,
            "note": note,
            "stars": stars,
            "time": time
        })

        return jsonify({
            "saved": True,
        })
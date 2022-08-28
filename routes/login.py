
from flask import jsonify,  request, Response
from werkzeug.security import check_password_hash
from bson import ObjectId
from bson.json_util import dumps


def validateAccess(mongo):
    users = mongo.db.Users
    username = request.form['username']
    password = request.form['password']
    rol_admin = "Administrador"

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

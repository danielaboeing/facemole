from flask import Flask
from flask_restful import Resource, Api
from flask import request
from flask import jsonify
from flask_cors import CORS, cross_origin
from markupsafe import escape
import pymongo

import face_recognition


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)


class ComparePerson(Resource):
    def post(self, userid):
        file = open("face.png", "wb")
        file.write(request.files["image"].read())
        file.close()

        # search db and compare
        # image = face_recognition.load_image_file("face.png")
        #known_image = face_recognition.load_image_file("known_picture.jpg")
        #unknown_image = face_recognition.load_image_file("unknown_picture.jpg")
        #known_encoding = face_recognition.face_encodings(known_image)[0]
        #unknown_encoding = face_recognition.face_encodings(unknown_image)[0]
        #results = face_recognition.compare_faces([known_encoding], unknown_encoding)
        return {
            #"faceID": request.form["faceID"],
            "givenName": 'Test'
        }


api.add_resource(ComparePerson, '/api/<userid>/compare')

"""
DB_PATH = "mongodb://localhost:27017"
DB_USER = "root"
DB_PASSWORD = "example"

@app.route('/api/<userid>', methods=['GET'])
def getUserInfo(userid): #TODO
    with MongoClient(DB_PATH) as client:
        db = client["facemole"]
    return escape(userid)

@app.route('/api/user', methods=['POST'])
def addNewUser(): #TODO
    pass

@app.route('/api/<userid>', methods=['POST'])
def adminUserInfo(userid): #TODO
    pass

@app.route('/api/<userid>/persons', methods=['GET'])
def getKnownPersons(userid): #TODO
    pass

@app.route('/api/<userid>/<personid>', methods=['GET'])
def getPersonInfo(userid, personid): #TODO
    pass

@app.route('/api/<userid>/<personid>', methods=['POST'])
def adminPersonInfo(userid, personid): #TODO
    pass

"""


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

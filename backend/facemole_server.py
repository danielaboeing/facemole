#!/usr/bin/env python
from flask import Flask
from flask_restful import Resource, Api
from flask import request
from flask_cors import CORS, cross_origin
from markupsafe import escape
from mongoengine import *

import face_recognition

# Globals
IMAGE_BASE_PATH="./images/"

app = Flask(__name__)
# Cross-Origin allowed
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# DB configuration
connect(alias='default',
        db='facemole',
        username='root',
        password='example',
        host='localhost',
        port=27017,
        authentication_source='admin')

# RESTful
api = Api(app)

# Models

class Person(Document):
    givenName = StringField()
    imageFileName = StringField()


class User(Document):
    ownID = StringField()
    fullName = StringField()
    persons = ListField(ReferenceField(Person))


# For Testing
Person.objects.delete()
newPerson = Person(id="6058c4089143e6ef6c8d4bf1", givenName="Brad Pitt",
               imageFileName="6058c4089143e6ef6c8d4bf1.png")
newPerson.save()

User.objects.delete()
userE = User(ownID="1234", fullName="Test User", persons=[newPerson])
userE.save()


# Routes
class ComparePerson(Resource):
    def post(self, userid):
        # search db and compare
        unknown_image = face_recognition.load_image_file(request.files["image"])
        encoding_result = face_recognition.face_encodings(unknown_image)
        if len(encoding_result) > 0:
            unknown_encoding = encoding_result[0]
            compare_images = []
            ids = []
            for person in User.objects(ownID=userid).first().persons:
                known_image = face_recognition.load_image_file(IMAGE_BASE_PATH + person.imageFileName)
                known_encoding = face_recognition.face_encodings(known_image)[
                    0]
                compare_images.append(known_encoding)
                ids.append(person.id)

            counter = 0
            for match in face_recognition.compare_faces(compare_images, unknown_encoding):
                if match:
                    best_id = ids[counter]
                    match_obj = Person.objects(id=best_id).first()
                    return {  # Take first match only
                        "ID": str(match_obj.id),
                        "givenName": match_obj.givenName
                    }
                counter = counter+1
        return {
            "ID": "",
            "givenName": "...none found"
        }

class Persons(Resource):
    def get(self, userid):
        pass #TODO

    def post(self, userid):
        # save new person in db
        newPerson = Person(givenName=request.form.get("givenName"), imageFileName="")
        newPerson.save()

        # save photo of new person in db with newly created id as file name
        fileformat = request.files["image"].content_type.split("/")[1]
        newPerson.imageFileName = str(newPerson.id) + "." + fileformat
        file = open(IMAGE_BASE_PATH + newPerson.imageFileName, "wb")
        file.write(request.files["image"].read())
        file.close()
        newPerson.save()

        # connect new person with user
        currentUser = User.objects(ownID=userid).first()
        currentUser.update(add_to_set__persons=[newPerson])
        currentUser.save()
        return newPerson.to_json()



api.add_resource(ComparePerson, '/api/<userid>/compare')
api.add_resource(Persons, '/api/<userid>/persons')

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

@app.route('/api/<userid>/<personid>', methods=['GET'])
def getPersonInfo(userid, personid): #TODO
    pass


"""


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

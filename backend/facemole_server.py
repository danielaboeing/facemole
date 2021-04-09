#!/usr/bin/env python
from flask import Flask, request, abort, send_file
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from markupsafe import escape
from mongoengine import *

import face_recognition

from models.person import Person
from models.user import User


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
                known_image = face_recognition.load_image_file(IMAGE_BASE_PATH + person.imageFileName + person.imageFileType)
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
                    }, 200
                counter = counter+1
        return {}, 204

class Persons(Resource):
    def get(self, userid):
        # get all persons of certain user
        persons = User.objects(ownID=userid).first().persons
        results = []
        for person in persons:
            results.append(person.to_json())
        return results, 200

    def post(self, userid):
        requestGivenName = request.form.get("givenName")

        # save new person in db
        newPerson = Person(givenName=requestGivenName, imageFileName="")
        newPerson.save()

        # connect new person with user
        currentUser = User.objects(ownID=userid).first()
        currentUser.update(add_to_set__persons=[newPerson])
        currentUser.save()
        return newPerson.to_json(), 201


class SinglePerson(Resource):
    def delete(self, userid, personid):
        deletePerson = Person.objects(id=personid).first()
        user = User.objects(ownID=userid).first()
        user.update(pull__persons=deletePerson)
        user.save()
        deletePerson.delete()
        return {}, 204

    def get(self, userid, personid):
        requestedPerson = Person.objects(id=personid).first()
        return requestedPerson.to_json(), 200

    def post(self, userid, personid):
        # change givenName
        requestedPerson = Person.objects(id=personid).first()
        newName = request.form.get("givenName")
        requestedPerson.givenName = newName
        requestedPerson.save()
        return requestedPerson.to_json(), 201

class PersonPhoto(Resource):
    def get(self, userid, personid):
        requestedPerson = Person.objects(id=personid).first()
        return send_file(IMAGE_BASE_PATH + requestedPerson.imageFileName + requestedPerson.imageFileType)

    def post(self, userid, personid):
        # save photo of new person in db
        requestedPerson = Person.objects(id=personid).first()
        fileformat = request.files["image"].content_type.split("/")[1]
        requestedPerson.imageFileType = fileformat
        requestedPerson.imageFileName = personid
        file = open(IMAGE_BASE_PATH + requestedPerson.imageFileName + requestedPerson.imageFileType, "wb")
        file.write(request.files["image"].read())
        file.close()
        requestedPerson.save()
        print(requestedPerson.imageFileName)
        return requestedPerson.to_json(), 201


class UserAccount(Resource):
    def get(self, userid):
        requestedUser = User.objects(ownID=userid).first()
        return requestedUser.to_json(), 200

    def post(self, userid):
        # change fullName
        requestedUser = User.objects(ownID=userid).first()
        newName = request.form.get("fullName")
        statusCode = 400
        if newName:
            requestedUser.fullName = newName
            requestedUser.save()
            statusCode = 201
        return requestedUser.to_json(), statusCode

# for Testing only
class Testing(Resource):
    def get(self):
        Person.objects.delete()
        newPerson = Person(id="6058c4089143e6ef6c8d4bf1", givenName="Brad Pitt",
                    imageFileName="6058c4089143e6ef6c8d4bf1", imageFileType=".png")
        newPerson.save()

        User.objects.delete()
        userE = User(ownID="1234", fullName="Test User", persons=[newPerson])
        userE.save()


api.add_resource(ComparePerson, '/api/<userid>/compare')
api.add_resource(Persons, '/api/<userid>/persons')
api.add_resource(SinglePerson, '/api/<userid>/persons/<personid>')
api.add_resource(PersonPhoto, '/api/<userid>/persons/<personid>/photo')
api.add_resource(UserAccount, '/api/<userid>')

api.add_resource(Testing, '/api/testing')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

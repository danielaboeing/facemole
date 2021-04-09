from mongoengine import *

class Person(Document):
    givenName = StringField()
    imageFileName = StringField()
    imageFileType = StringField()
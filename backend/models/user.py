from mongoengine import *

from models.person import Person

class User(Document):
    ownID = StringField()
    fullName = StringField()
    persons = ListField(ReferenceField(Person))
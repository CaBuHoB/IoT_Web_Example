from flask_login import UserMixin
from . import db


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))


class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    led = db.Column(db.Integer)
    temp = db.Column(db.Integer)
    value = db.Column(db.Integer)
    lamp = db.Column(db.BOOLEAN)
    list_lamp_1 = db.Column(db.BOOLEAN)
    list_lamp_2 = db.Column(db.BOOLEAN)
    list_lamp_3 = db.Column(db.BOOLEAN)

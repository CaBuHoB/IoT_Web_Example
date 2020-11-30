from random import randint
from flask import Blueprint, jsonify, request
from flask_login import login_required
from . import db
from .models import Data

api = Blueprint('api', __name__)


@api.route('/api/getAllData', methods=['GET'])
@login_required
def get_data():
    data = Data.query.all()[0]
    data.temp = randint(-20, 35)
    data.value = randint(0, 100)
    data_json = {
        "LED": data.led,
        "LAMP": data.lamp,
        "LIST_LAMP_1": data.list_lamp_1,
        "LIST_LAMP_2": data.list_lamp_2,
        "LIST_LAMP_3": data.list_lamp_3,
        "TEMP": data.temp,
        "VALUE": data.value
    }
    return jsonify(data_json)


@api.route('/api/changeState/led', methods=['POST'])
@login_required
def change_state_led():
    data = Data.query.all()[0]
    data.led = int(request.form['newState'])
    db.session.commit()
    return jsonify({"result": 1})


@api.route('/api/changeState/lamp', methods=['POST'])
@login_required
def change_state_lamp():
    data = Data.query.all()[0]
    data.lamp = int(request.form['newState'])
    db.session.commit()
    return jsonify({"result": 1})


@api.route('/api/changeState/list_lamp/<id>', methods=['POST'])
@login_required
def change_state_list_lamp(id):
    data = Data.query.all()[0]
    if id == '1':
        data.list_lamp_1 = int(request.form['newState'])
    elif id == '2':
        data.list_lamp_2 = int(request.form['newState'])
    elif id == '3':
        data.list_lamp_3 = int(request.form['newState'])
    db.session.commit()
    return jsonify({"result": 1})

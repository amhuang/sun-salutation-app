import unidecode
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from os import listdir
from os.path import isfile, join
import random

app = Flask(__name__)

# Quiz data
quiz_responses = {}
QUIZ_LEN = 11
TOTAL_POINTS = 8 + 12

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/')
def learn():
    return render_template('learn.html')

@app.route('/quiz/<id>', methods = ['POST', 'GET'])
def quiz(id=None):
    id = int(id)
    if request.method == 'GET':
        data = get_quiz_data(id)
        return render_template('quiz.html', data=data)
    else:
        answer = request.get_json()
        quiz_responses[id] = answer
        data = get_quiz_data(id)
        return jsonify(data=data)
        
def get_quiz_data(id):
    # Pose name matching question
    if id == 1:
        type = "matching"
        answers = ["Cobra", "Downward Facing Dog", "Eight Point Salute", "Equestrian (L)", "Half Forward Bend", "Plank", "Mountain Pose", "Raised Arm"]
        img_paths = ["/static/img/poses/" + pose + ".jpeg" for pose in answers]   

    # Sun salutation order question
    elif id == 2:
        type = "ordering" 
        answers = ["Prayer Pose", "Raised Arm", "Half Forward Bend", "Equestrian (L)", "Plank", "Eight Point Salute"]
        img_paths = ["/static/img/poses/" + pose + ".jpeg" for pose in answers]   

    elif id == 3:
        type = "ordering" 
        answers = ["Cobra", "Downward Facing Dog", "Equestrian (R)", "Half Forward Bend", "Raised Arm", "Mountain Pose"]
        img_paths = ["/static/img/poses/" + pose + ".jpeg" for pose in answers]   

    # Muscles used in a pose question
    elif 4 <= id and id < 12:
        type = "muscles"

    data = { 
        "id": id,
        "len": QUIZ_LEN,
        "type": type,
        "imgs": img_paths,
        "answers": answers,
        "user_data": quiz_responses[id] if id in quiz_responses else "",
    }
    return data

if __name__ == '__main__':
   app.run(debug = True)
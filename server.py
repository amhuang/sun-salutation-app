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
QUIZ_LEN = 3

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/')
def learn():
    return render_template('learn.html')

@app.route('/quiz/<id>', methods = ['POST', 'GET'])
def quiz(id=None):
    global quiz_responses
    id = int(id)
    if request.method == 'GET':
        data = get_quiz_data(id)
        print("getting data","\n", data)
        return render_template('quiz.html', data=data)
    else:
        answer = request.get_json()
        quiz_responses[id] = answer
        print("quiz_responses","\n",  quiz_responses)
        data = get_quiz_data(id)
        print("update ddata","\n",  data)
        return jsonify(data=data)
        
def get_quiz_data(id):
    # Pose name matching question
    if id == 1:
        type = "matching"
        question = "Match the name to the pose."
        answers = ["Cobra", "Downward Facing Dog", "Eight Point Salute", "Equestrian (L)", "Half Forward Bend", "Plank", "Mountain Pose", "Raised Arm"]
        img_paths = ["/static/img/poses/" + pose + ".jpeg" for pose in answers]   

    # Sun salutation order question
    elif id == 2:
        type = "ordering" 
        question = "Drag the poses in order for moves 1-6 of a sun salutation"
        answers = ["Prayer Pose", "Raised Arm", "Half Forward Bend", "Equestrian (L)", "Plank", "Eight Point Salute"]
        img_paths = ["/static/img/poses/" + pose + ".jpeg" for pose in answers]   

    elif id == 3:
        type = "ordering" 
        question = "Drag the poses in order for moves 7-12 of a sun salutation"
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
        "question": question,
        "answers": answers,
        "user_data": quiz_responses[id] if id in quiz_responses else "",
    }
    return data

@app.route('/quiz_result', methods = ['GET'])
def quiz_results():
    matching_score = 0
    ordering_score = 0
    for key in quiz_responses:
        val = quiz_responses[key]
        if val["type"] == "matching":
            matching_score += val["score"]
        elif val["type"] == "ordering":
            ordering_score += val["score"]
        
    data = {
        "prev": QUIZ_LEN,
        "matching_score": matching_score,
        "matching_total": 8,
        "ordering_score": ordering_score,
        "ordering_total": 12,
    }
    return render_template('quiz_result.html', data=data)

'''
QUIZ_QUESTIONS = {
    1: {
        "id": 1,
        "len": QUIZ_LEN,
        "type": "matching",
        "answers": ["Cobra", "Downward Facing Dog", "Eight Point Salute", "Equestrian (L)", "Half Forward Bend", "Plank", "Mountain Pose", "Raised Arm"],
        "imgs": [],
        "user_data": quiz_responses[id] if id in quiz_responses else "",
    }
}
'''

if __name__ == '__main__':
   app.run(debug = True)
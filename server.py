import unidecode
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from os import listdir
from os.path import isfile, join
import random

app = Flask(__name__)

data = {
   "1": {
      "id": "1",
      "Name": "Prayer Pose",
      "Muscles": ["Pelvis", "Legs"],
      "img": "/static/img/poses/mountain",
      "gif": "/static/img/GIFs/1-mountain",
   },

   "2": {
      "id": "2",
      "Name":"Raised Arm Pose",
      "Muscles": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"],
      "img": "/static/img/poses/raised",
      "gif": "/static/img/GIFs/2-raised",

   },

   "3": {
      "id": "3",
      "Name": "Half Forward Bend",
      "Muscles": ["Hamstrings","Calves","Spine"],
      "img": "/static/img/poses/forward",
      "gif": "/static/img/GIFs/3-forward",
   },

   "4": {
      "id": "4",
      "Name":"Equestrian Pose (L)",
      "Muscles": ["Calves", "Hamstrings", "Quadriceps", "Hip Flexors"],
      "img": "/static/img/poses/equestrianL",
      "gif": "/static/img/GIFs/4-equestrianL",
   },

   "5": {
      "id": "5",
      "Name": "Plank Pose",
      "Muscles": ["Abs", "Obliques", "Shoulders"],
      "img": "/static/img/poses/plank",
      "gif": "/static/img/GIFs/5-plank",
   },

   "6": {
      "id": "6",
      "Name":"Eight Point Salute",
      "Muscles": ["Shoulders","Spine"],
      "img": "/static/img/poses/eight",
      "gif": "/static/img/GIFs/6-eight",
   },

   "7": {
      "id": "7",
      "Name":"Cobra Pose",
      "Muscles": ["Lower Back", "Lats","Lower Traps"],
      "img": "/static/img/poses/cobra",
      "gif": "/static/img/GIFs/7-cobra",
   },

   "8": {
      "id": "8",
      "Name":"Downward Facing Dog",
      "Muscles":["Claves", "Hamstrings","Lats", "Spine"],
      "img": "/static/img/poses/downward",
      "gif": "/static/img/GIFs/8-downward",
   },

   "9": {
      "id": "9",
      "Name":"Equestrian Pose (R)",
      "Muscles": ["Calves", "Hamstrings","Quadriceps","Hip Flexors"],
      "img": "/static/img/poses/equestrianR",
      "gif": "/static/img/GIFs/9-equestrianR",
   },

   "10": {
      "id": "10",
      "Name":"Half Forward Bend",
      "Muscles":["Hamstrings", "Calves", "Spine"],
      "img": "/static/img/poses/forward",
      "gif": "/static/img/GIFs/10-forward",
   },

   "11": {
      "id": "11",
      "Name":"Raised Arm Pose",
      "Muscles": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"],
      "img": "/static/img/poses/raised",
      "gif": "/static/img/GIFs/11-raised",
   },

   "12": {
      "id": "12",
      "Name":"Mountain Pose",
      "Muscles": ["Pelvis", "Legs"],
      "img": "/static/img/poses/prayer",
      "gif": "/static/img/GIFs/1-mountain",
   }
}

# Quiz data
QUIZ_LEN = 3
quiz_data = {
    1: {
        "id": 1,
        "len": QUIZ_LEN,
        "type": "matching",
        "question": "Match the name to the pose.",
        "answers": ["Cobra", "Downward Facing Dog", "Eight Point Salute", "Equestrian (L)", "Half Forward Bend", "Plank", "Mountain Pose", "Raised Arm"],
        "imgs": ["/static/img/poses/Cobra.jpeg", "/static/img/poses/Downward Facing Dog.jpeg", "/static/img/poses/Eight Point Salute.jpeg", "/static/img/poses/Equestrian (L).jpeg", "/static/img/poses/Half Forward Bend.jpeg", "/static/img/poses/Plank.jpeg", "/static/img/poses/Mountain Pose.jpeg", "/static/img/poses/Raised Arm.jpeg"],
        "user_data": "",
    },
    2: {
        "id": 2,
        "len": QUIZ_LEN,
        "type": "ordering",
        "question": "Match the name to the pose.",
        "answers": ["Prayer Pose", "Raised Arm", "Half Forward Bend", "Equestrian (L)", "Plank", "Eight Point Salute"],
        "imgs": ["/static/img/poses/Prayer Pose.jpeg", "/static/img/poses/Raised Arm.jpeg", "/static/img/poses/Half Forward Bend.jpeg", "/static/img/poses/Equestrian (L).jpeg", "/static/img/poses/Plank.jpeg", "/static/img/poses/Eight Point Salute.jpeg"],
        "user_data": "",
    },
    3: {
        "id": 3,
        "len": QUIZ_LEN,
        "type": "matching",
        "question": "Match the name to the pose.",
        "answers": ["Cobra", "Downward Facing Dog", "Eight Point Salute", "Equestrian (L)", "Half Forward Bend", "Plank", "Mountain Pose", "Raised Arm"],
        "imgs": ["/static/img/poses/Cobra.jpeg", "/static/img/poses/Eight Point Salute.jpeg", "/static/img/poses/Equestrian (L).jpeg", "/static/img/poses/Half Forward Bend.jpeg", "/static/img/poses/Plank.jpeg", "/static/img/poses/Mountain Pose.jpeg", "/static/img/poses/Raised Arm.jpeg"],
        "user_data": "",
    },
    4: {
        "id": 4,
        "len": QUIZ_LEN,
        "type": "muscle",
        "question": "Select the muscles activated in raised arm pose.",
        "answers": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"],
        "imgs": [],
        "user_data": "",
    }
}


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<id>')
def learn(id=None):
    global learn
    d = data[id]
    return render_template('learn.html', d = d)

@app.route('/learn_order')
def learn_order():
    return render_template('learn_order.html')

@app.route('/quiz/<id>', methods = ['POST', 'GET'])
def quiz(id=None):
    global quiz_responses
    id = int(id)
    if request.method == 'GET':
        data = quiz_data[id] #get_quiz_data(id)
        print("getting data","\n", data)
        return render_template('quiz.html', data=data)
    else:
        answer = request.get_json()
        print("answer", "\n", answer)
        quiz_data[id]["user_data"] = answer
        #quiz_responses[id] = answer
        print("quiz_responses","\n",  quiz_data[id]["user_data"])
        data = quiz_data[id] # get_quiz_data(id)
        print("update ddata","\n",  data)
        return jsonify(data=data)

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

    quiz_results = {
        "prev": QUIZ_LEN,
        "matching_score": matching_score,
        "matching_total": 8,
        "ordering_score": ordering_score,
        "ordering_total": 12,
    }
    return render_template('quiz_result.html', data=quiz_results)

if __name__ == '__main__':
   app.run(debug = True)

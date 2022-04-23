#import unidecode
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from os import listdir
from os.path import isfile, join
import random

app = Flask(__name__)

learn_data = {
   "1": {
      "id": "1",
      "Name": "Prayer Pose",
      "Muscles": ["Pelvis", "Legs"],
      "Date" : "",
      "img": "/static/img/poses/Prayer Pose.jpeg",
      "gif": "/static/img/GIFs/1-mountain",
      "Directions": ["stand at the edge with feet together", "Expand your chest and relax shoulders", "Lift both arms from side as you inhale", "Bring your palms together on exhale"],
   },

   "2": {
      "id": "2",
      "Name":"Raised Arm Pose",
      "Muscles": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"],
      "Date" : "",
      "img": "/static/img/poses/Raised Arm.jpeg",
      "gif": "/static/img/GIFs/2-raised",
      "Directions": ["Lift arms up and back on inhale", "Stretch whole body", "Push pelvis forward to deepen stretch"],
   },

   "3": {
      "id": "3",
      "Name": "Half Forward Bend",
      "Muscles": ["Hamstrings","Calves","Spine"],
      "Date" : "",
      "img": "/static/img/poses/Half Forward Bend.jpeg",
      "gif": "/static/img/GIFs/3-forward",
      "Directions": ["Stretch forward", "Bend downwards", "Bring hands down to floor on exhale"],
   },

   "4": {
      "id": "4",
      "Name":"Equestrian Pose (L)",
      "Muscles": ["Calves", "Hamstrings", "Quadriceps", "Hip Flexors"],
      "Date" : "",
      "img": "/static/img/poses/Equestrian (L).jpeg",
      "gif": "/static/img/GIFs/4-equestrianL",
      "Directions": ["Push right leg  back", "Look up", "Left foot between palms"]
   },

   "5": {
      "id": "5",
      "Name": "Plank Pose",
      "Muscles": ["Abs", "Obliques", "Shoulders"],
      "Date" : "",
      "img": "/static/img/poses/plank.jpeg",
      "gif": "/static/img/GIFs/5-plank",
      "Directions": ["Push left leg back","Do a plank with arms straight"],
   },

   "6": {
      "id": "6",
      "Name":"Eight Point Salute",
      "Muscles": ["Shoulders","Spine"],
      "Date" : "",
      "img": "/static/img/poses/Eight Point Salute.jpeg",
      "gif": "/static/img/GIFs/6-eight",
      "Directions": ["Bring knees to floor and exhale","Take hips back slightly", "Slide forward","Rest chest and chin on floor"],
   },

   "7": {
      "id": "7",
      "Name":"Cobra Pose",
      "Muscles": ["Lower Back", "Lats","Lower Traps"],
      "Date" : "",
      "img": "/static/img/poses/Cobra.jpeg",
      "gif": "/static/img/GIFs/7-cobra",
      "Directions": ["Slide forward", "Raise chest", "Keep elbows bent"],
   },

   "8": {
      "id": "8",
      "Name":"Downward Facing Dog",
      "Muscles":["Claves", "Hamstrings","Lats", "Spine"],
      "Date" : "",
      "img": "/static/img/poses/Downward Facing Dog.jpeg",
      "gif": "/static/img/GIFs/8-downward",
      "Directions": ["Lift hips", "Face chest downwards", "Keep heels to floor to deepen"],
   },

   "9": {
      "id": "9",
      "Name":"Equestrian Pose (R)",
      "Muscles": ["Calves", "Hamstrings","Quadriceps","Hip Flexors"],
      "Date" : "",
      "img": "/static/img/poses/Equestrian (R).jpeg",
      "gif": "/static/img/GIFs/9-equestrianR",
      "Directions": ["Push right leg  back", "Look up" ,"Left foot between palms"],
   },

   "10": {
      "id": "10",
      "Name":"Half Forward Bend",
      "Muscles":["Hamstrings", "Calves", "Spine"],
      "Date" : "",
      "img": "/static/img/poses/Half Forward Bend.jpeg",
      "gif": "/static/img/GIFs/10-forward",
      "Directions": ["Stretch forward", "Bend downwards", "Bring hands down to floor on exhale"],
   },

   "11": {
      "id": "11",
      "Name":"Raised Arm Pose",
      "Muscles": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"],
      "Date" : "",
      "img": "/static/img/poses/Raised Arm.jpeg",
      "gif": "/static/img/GIFs/11-raised",
      "Directions": ["Lift arms up and back on inhale", "Stretch whole body", "Push pelvis forward to deepen stretch"],
   },

   "12": {
      "id": "12",
      "Name":"Mountain Pose",
      "Muscles": ["Pelvis", "Legs"],
      "Date" : "",
      "img": "/static/img/poses/Prayer Pose.jpeg",
      "gif": "/static/img/GIFs/1-mountain",
      "Directions": ["Straighten body", "Bring arms down"],
   }
}

# Quiz data
QUIZ_LEN = 10
with open("./static/img/muscles/labeled.svg", "r") as f:
    MUSCLE_SVG = f.read()

quiz_data = {
    1: {
        "id": 1,
        "len": QUIZ_LEN,
        "type": "matching",
        "question": "Match the name to the pose.",
        "answers": ["Cobra", "Downward Facing Dog", "Eight Point Salute", "Equestrian", "Half Forward Bend", "Plank", "Mountain Pose", "Raised Arm"],
        "imgs": ["/static/img/poses/Cobra.jpeg", "/static/img/poses/Downward Facing Dog.jpeg", "/static/img/poses/Eight Point Salute.jpeg", "/static/img/poses/Equestrian (L).jpeg", "/static/img/poses/Half Forward Bend.jpeg", "/static/img/poses/Plank.jpeg", "/static/img/poses/Mountain Pose.jpeg", "/static/img/poses/Raised Arm.jpeg"],
        "user_data": "",
    },
    2: {
        "id": 2,
        "len": QUIZ_LEN,
        "type": "ordering",
        "question": "Drag the poses in order for moves 1-6 of a sun salutation.",
        "answers": ["Prayer Pose", "Raised Arm", "Half Forward Bend", "Equestrian (L)", "Plank", "Eight Point Salute"],
        "imgs": ["/static/img/poses/Prayer Pose.jpeg", "/static/img/poses/Raised Arm.jpeg", "/static/img/poses/Half Forward Bend.jpeg", "/static/img/poses/Equestrian (L).jpeg", "/static/img/poses/Plank.jpeg", "/static/img/poses/Eight Point Salute.jpeg"],
        "user_data": "",
    },
    3: {
        "id": 3,
        "len": QUIZ_LEN,
        "type": "ordering",
        "question": "Drag the poses in order for moves 7-12 of a sun salutation.",
        "answers": ["Cobra", "Downward Facing Dog", "Equestrian (R)", "Half Forward Bend", "Raised Arm", "Mountain Pose"],
        "imgs": ["/static/img/poses/Cobra.jpeg", "/static/img/poses/Downward Facing Dog.jpeg", "/static/img/poses/Equestrian (R).jpeg", "/static/img/poses/Half Forward Bend.jpeg", "/static/img/poses/Raised Arm.jpeg", "/static/img/poses/Mountain Pose.jpeg"],
        "user_data": "",
    },
    4: {
        "id": 4,
        "len": QUIZ_LEN,
        "type": "muscle",
        "question": "Select the muscles activated in raised arm pose.",
        "answers": ["Calves","Chest","Hamstrings","Shoulders","Spine"],
        "imgs": [MUSCLE_SVG, "/static/img/poses/Raised Arm.jpeg"],
        "user_data": "",
    },
    5: {
        "id": 5,
        "len": QUIZ_LEN,
        "type": "muscle",
        "question": "Select the muscles activated in half forward bend pose.",
        "answers": ["Hamstrings","Calves","Spine"],
        "imgs": [MUSCLE_SVG, "/static/img/poses/Half Forward Bend.jpeg"],
        "user_data": "",
    },
    6: {
        "id": 6,
        "len": QUIZ_LEN,
        "type": "muscle",
        "question": "Select the muscles activated in equestrian pose",
        "answers": ["Calves", "Hamstrings", "Quadriceps", "Hip Flexors"],
        "imgs": [MUSCLE_SVG, "/static/img/poses/Equestrian (R).jpeg"],
        "user_data": "",
    },
    7: {
        "id": 7,
        "len": QUIZ_LEN,
        "type": "muscle",
        "question": "Select the muscles activated in plank pose.",
        "answers": ["Abs", "Obliques", "Shoulders"],
        "imgs": [MUSCLE_SVG, "/static/img/poses/Plank.jpeg"],
        "user_data": "",
    },
    8: {
        "id": 8,
        "len": QUIZ_LEN,
        "type": "muscle",
        "question": "Select the muscles activated in eight point salute.",
        "answers": ["Shoulders","Spine"],
        "imgs": [MUSCLE_SVG, "/static/img/poses/Eight Point Salute.jpeg"],
        "user_data": "",
    },
    9: {
        "id": 9,
        "len": QUIZ_LEN,
        "type": "muscle",
        "question": "Select the muscles activated in cobra pose.",
        "answers": ["Lower Back", "Lats","Lower Traps"],
        "imgs": [MUSCLE_SVG, "/static/img/poses/Cobra.jpeg"],
        "user_data": "",
    },
    10: {
        "id": 10,
        "len": QUIZ_LEN,
        "type": "muscle",
        "question": "Select the muscles activated in downward facing dog.",
        "answers": ["Claves", "Hamstrings","Lats", "Spine"],
        "imgs": [MUSCLE_SVG, "/static/img/poses/Downward Facing Dog.jpeg"],
        "user_data": "",
    }
}

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<id>')
def learn(id=None):
    global learn
    d = learn_data[id]
    return render_template('learn.html', d = d)

@app.route('/learn_order')
def learn_order():
    return render_template('learn_order.html')

@app.route('/update_time', methods = ['POST'])
def update_time():
    json_data = request.get_json()
    current_id = json_data["id"]
    current_date = json_data["Date"]

    learn_data[current_id]["Date"] = current_date
    print(learn_data[current_id])

    return jsonify(data=learn_data)

@app.route('/quiz/<id>', methods = ['POST', 'GET'])
def quiz(id=None):
    id = int(id)

    if request.method == 'GET':
        data = quiz_data[id]
        print("getting page for", id)
        return render_template('quiz.html', data=data)

    else:
        answer = request.get_json()
        quiz_data[id]["user_data"] = answer
        print("quiz_responses for", id)

        data = quiz_data[id] 
        print(quiz_data[id]["user_data"]["score"])
        return jsonify(data=data)

@app.route('/quiz_result', methods = ['GET'])
def quiz_results():
    matching_score = 0
    ordering_score = 0
    muscle_score = 0

    score_data = {
        "prev": QUIZ_LEN,
        "matching_total": 8,
        "ordering_total": 12,
        "muscle_total": 7,
        "incomplete": 0     # the earliest incomplete question, if there is one
    }

    for key in quiz_data:
        question = quiz_data[key]
        type = question["type"]
        response = question["user_data"]
        print(response)

        if response == "":
            score_data["incomplete"] = key
            return render_template('quiz_result.html', data=score_data)
       
        if type == "matching":
            matching_score += response["score"]
        elif type == "ordering":
            ordering_score += response["score"]
        elif type == "muscle":
            muscle_score += response["score"]

    score_data.update({
        "matching_score": matching_score,
        "ordering_score": ordering_score,
        "muscle_score": muscle_score 
    })

    return render_template('quiz_result.html', data=score_data)

if __name__ == '__main__':
   app.run(debug = True)

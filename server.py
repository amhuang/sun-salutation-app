import unidecode
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from os import listdir
from os.path import isfile, join
import random

app = Flask(__name__)

# Vars for quiz data

#pose_files = [img_dir + f for f in listdir(img_dir + "poses")]
#poses_tested = set(pose_files)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/')
def learn():
    return render_template('learn.html')


quiz_answers = {}
QUIZ_LEN = 12
@app.route('/quiz/<id>', methods = ['POST', 'GET'])
def quiz(id=None):
    id = int(id)
    if request.method == 'GET':
        data = get_quiz_data(id)
        return render_template('quiz.html', data=data)
    else:
        answer = request.get_json()
        quiz_answers[id] = answer
        data = get_quiz_data(id)
        return jsonify(data=data)
        
def get_quiz_data(id):
    # Pose name matching question
    if 1 <= id and id < 3:
        type = "matching"
        img_dir = "/static/img/poses/"
        imgs = [img_dir + f for f in listdir("." + img_dir)]   

    # Muscles used in a pose question
    elif 3 <= id and id < 11:
        type = "muscles"

    # Sun salutation order question
    elif 11 <= id and id < 13:
        type = "ordering" 

    data = { 
        "id": id,
        "len": QUIZ_LEN,
        "type": type,
        "imgs": imgs,
        "answer_data": quiz_answers[id] if id in quiz_answers else "",
    }
    return data

if __name__ == '__main__':
   app.run(debug = True)
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

answers = {}
@app.route('/quiz/<id>', methods = ['POST', 'GET'])
def quiz(id=None):
    if request.method == 'GET':
        data = get_quiz(int(id))
        return render_template('quiz.html', data=data)
    else:
        answer = request.get_json()
        print(answer)
        print(id)
        answers[id] = answer[id]
        return
        
    

def get_quiz(id):
    quiz_len = 12
        
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

    data = { "id": id,
            "len": quiz_len,
            "type": type,
            "imgs": imgs,
            "answers": answers[id] if id in answers else ""
            }
    print(data)
    return data

if __name__ == '__main__':
   app.run(debug = True)
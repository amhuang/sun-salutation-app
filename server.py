import unidecode
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

data = {
   "1": {
      "Name": "Prayer Pose",
      "Muscles": ["Pelvis", "Legs"],
      "img": "/static/img/poses/mountain",
      "gif": "/static/img/GIFs/1-mountain",

   },

   "2": {
      "Name":"Raised Arm Pose",
      "Muscles": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"],
      "img": "/static/img/poses/raised",
      "gif": "/static/img/GIFs/2-raised",

   },

   "3": {
      "Name": "Half Forward Bend",
      "Muscles": ["Hamstrings","Calves","Spine"],
      "img": "/static/img/poses/forward",
      "gif": "/static/img/GIFs/3-forward",
   },

   "4": {
      "Name":"Equestrian Pose (L)",
      "Muscles": ["Calves", "Hamstrings", "Quadriceps", "Hip Flexors"],
      "img": "/static/img/poses/equestrianL",
      "gif": "/static/img/GIFs/4-equestrianL",
   },

   "5": {
      "Name": "Plank Pose",
      "Muscles": ["Abs", "Obliques", "Shoulders"],
      "img": "/static/img/poses/plank",
      "gif": "/static/img/GIFs/5-plank",
   },

   "6": {
      "Name":"Eight Point Salute",
      "Muscles": ["Shoulders","Spine"],
      "img": "/static/img/poses/eight",
      "gif": "/static/img/GIFs/6-eight",
   },

   "7": {
      "Name":"Cobra Pose",
      "Muscles": ["Lower Back", "Lats","Lower Traps"],
      "img": "/static/img/poses/cobra",
      "gif": "/static/img/GIFs/7-cobra",
   },

   "8": {
      "Name":"Downward Facing Dog",
      "Muscles":["Claves", "Hamstrings","Lats", "Spine"],
      "img": "/static/img/poses/downward",
      "gif": "/static/img/GIFs/8-downward",
   },

   "9": {
      "Name":"Equestrian Pose (R)",
      "Muscles": ["Calves", "Hamstrings","Quadriceps","Hip Flexors"],
      "img": "/static/img/poses/equestrianR",
      "gif": "/static/img/GIFs/9-equestrianR",
   },

   "10": {
      "Name":"Half Forward Bend",
      "Muscles":["Hamstrings", "Calves", "Spine"],
      "img": "/static/img/poses/forward",
      "gif": "/static/img/GIFs/10-forward",
   },

   "11": {
      "Name":"Raised Arm Pose",
      "Muscles": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"],
      "img": "/static/img/poses/raised",
      "gif": "/static/img/GIFs/11-raised",
   },

   "12": {
      "Name":"Mountain Pose",
      "Muscles": ["Pelvis", "Legs"],
      "img": "/static/img/poses/prayer",
      "gif": "/static/img/GIFs/1-mountain",
   }
}

scores = {
   "pose":"0",
   "matching":"0",
   "order":"0"
}

@app.route('/')
def home():
   return render_template('home.html')

@app.route('/learn/<id>')
def learn(id=None):
   return render_template('learn.html')

@app.route('/quiz/<id>')
def quiz(id=None):
   return render_template('quiz.html', data = data)

@app.route('/quiz/results')
def quiz():
   return render_template('quiz_results', scores = scores )

if __name__ == '__main__':
   app.run(debug = True)
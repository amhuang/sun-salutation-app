import unidecode
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

quiz_data = {
   "1": {
      "Name": "Prayer Pose",
      "Muscles": ["Pelvis", "Legs"]
   },

   "2": {
      "Name":"Raised Arm Pose",
      "Muscles": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"],
   },

   "3": {
      "Name": "Half Forward Bend",
      "Muscles": ["Hamstrings","Calves","Spine"],
   },

   "4": {
      "Name":"Equestrian Pose (L)",
      "Muscles": ["Calves", "Hamstrings", "Quadriceps", "Hip Flexors"]
   },

   "5": {
      "Name": "Plank Pose",
      "Muscles": ["Abs", "Obliques", "Shoulders"]
   },

   "6": {
      "Name":"Eight Point Salute",
      "Muscles": ["Shoulders","Spine"]
   },

   "7": {
      "Name":"Cobra Pose",
      "Muscles": ["Lower Back", "Lats","Lower Traps"]
   },

   "8": {
      "Name":"Downward Facing Dog",
      "Muscles":["Claves", "Hamstrings","Lats", "Spine"]
   },

   "9": {
      "Name":"Equestrian Pose (R)",
      "Muscles": ["Calves", "Hamstrings","Quadriceps","Hip Flexors"]
   },

   "10": {
      "Name":"Half Forward Bend",
      "Muscles":["Hamstrings", "Calves", "Spine"]
   },

   "11": {
      "Name":"Raised Arm Pose",
      "Muscles": ["Hamstrings","Calves", "Spine", "Chest", "Shoulders"]
   },

   "12": {
      "Name":"Mountain Pose",
      "Muscles": ["Pelvis", "Legs"]
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
   return render_template('quiz.html')

@app.route('/quiz/results')
def quiz():
   return render_template('quiz_results', )

if __name__ == '__main__':
   app.run(debug = True)
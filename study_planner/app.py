from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from collections import Counter

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)

# --- Model ---
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    subject = db.Column(db.String(100)) 
    completed = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "subject": self.subject,
            "completed": self.completed
        }

# --- Routes ---

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/tasks", methods=["GET", "POST"])
def handle_tasks():
    if request.method == "POST":
        data = request.get_json()
        task = Task(title=data["title"], subject=data["subject"])
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201
    else:
        tasks = Task.query.all()
        return jsonify([task.to_dict() for task in tasks])

@app.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    if "completed" in data:
        task.completed = data["completed"]
    db.session.commit()
    return jsonify(task.to_dict())

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted."})

@app.route("/api/stats", methods=["GET"])
def task_stats():
    tasks = Task.query.filter_by(completed=True).all()
    subject_counts = Counter(task.subject for task in tasks)

    total = sum(subject_counts.values())
    stats = [
        {"subject": subj, "count": count, "percent": round((count / total) * 100, 2)}
        for subj, count in subject_counts.items()
    ]

    return jsonify(stats)

# --- Init ---
if __name__ == "__main__":
    app.run(debug=True)

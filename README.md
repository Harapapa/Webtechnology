# Project overview
- My project was about a Study planner webapplication which is a comprehensive web-based application designed to help students effectively manage their study time, track assignments, and optimize their learning efficiency. Built with a Flask backend and a modern JavaScript frontend, it combines task management with the Pomodoro time management technique to create a powerful productivity tool specifically tailored for academic environments.
- The application addresses common challenges students face: managing multiple subjects, tracking time spent on different topics, maintaining focus during study sessions, and planning their workload effectively. By integrating task management with time tracking metrics, Study planner provides valuable insights that help users identify which subjects require more attention and optimize their study habits.

## Technical informations
### System Requirements
- Operating System: Windows, macOS, or Linux
- Python: Version 3.7 or higher
-	Browser: Chrome, Firefox, Safari, or Edge (latest versions recommended)  
-	Flask (2.0+)
-	Flask-SQLAlchemy (2.5+)
-	SQLite3 (included with Python)
-	Collections (built-in module)
-	VSCode or PyCharm for development (was created in VSCode)
-	Browser for frontend debugging
### How to run the app
1.	Creating a virtual environment with: python3 -m venv venv
2.	Need to create the route, to activate the environment basically how it looks: source venv/bin/activate
3.	Then Installing the required packages is needed: pip install -r requirements.txt
4.	After the requirements create the database schema: python init_db.py
5.	Then lets compile it with: set -x FLASK_APP /home/user/prime dictionary/folder of the application/study_planner/app.py
6.	If the route is clear and the FLASK_APP compiled, lets start the Flask application with a simple command: flask run
### How to use the app
1. When you are on the page most of the cases are statistics about what kind of subject did you learn.
2. Adding a new task with a subject will be saved into the database. It will save it for the future too.
3. Tasks are independent from the actual subject under the pomodoro timer. Why? Because it's about learning a subject and not mostly not about what kind of study session. If you are mark done any kind of task it will be showed as "Completed tasks" and of course saved for future, when you are looking after which sessions are done those will be marked as completed.
4. Under the pomodoro timer choosing an "Actual subject" which will be saved after it is decleared under the "Tasks" menu, starting the pomodoro timer will write out how many times you started to study which subject.
5. If the timer hits 00:00, then the subject name will loaded into the "Pomodoro Statistics", where you can see in percentage the stat.
6. Any time you can pause or reset the timer, but if you are studying should use the reset only :)
7. When you are done, you can leave everything as it was, because after closing/refreshing the page the statistics will be increased and everything will be stored in the database.

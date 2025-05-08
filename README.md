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

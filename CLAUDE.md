# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PythonLearnHub is a Flask-based web application for learning Python. It provides interactive code execution, structured learning modules, an online judge (OJ) system, and progress tracking.

## Running the Application

```bash
# Install dependencies
pip install -r requirements.txt

# Start development server (runs on http://localhost:5000)
python app.py
```

For production, Gunicorn is used via a systemd service. See `deployment_readme.md` for details.

## Architecture

### Single-File Application
All routes and logic are in `app.py` (monolithic design). Views are not split into blueprints—new routes should be added directly to `app.py`.

### Database
- **SQLite** via SQLAlchemy ORM (`instance/database.db`)
- Models in `models/` directory
- Initialize with `db.create_all()` (already called in app.py)

### Key Models
- `User` - user accounts with email/password_hash
- `UserProfile` - avatar and user preferences
- `Progress` - tracks user progress per module (browse_coverage, study_time, progress_value)
- `Note` - user notes
- `Submission` - OJ submissions with status (AC/WA/TLE/RE)
- `CodeExecution` - code execution history

### Learning Modules
Content is defined in `utils/module_content.py`:
- `ALL_MODULES` dict contains all module data (examples, topics)
- `MODULE_NAVIGATION` list defines sidebar navigation order
- Modules include: variables, strings, lists, tuples, flow_control, functions, exceptions, files, regex

### Safe Code Execution
`utils/safe_executor.py` provides sandboxed Python execution via AST whitelisting:
- Allowed: basic builtins, `math`, `re`, `collections`
- Blocked: file operations, subprocess, eval/exec, dangerous attributes
- Used by the code playground and OJ system

### Online Judge System
`utils/judge.py` (`JudgeEngine` class):
- Problems stored as JSON in `Data/problem_*.json`
- Test cases in `Data/test_case_*.json`
- Supports function-mode execution with time limits
- Status codes: AC (Accepted), WA (Wrong Answer), TLE (Time Limit Exceeded), RE (Runtime Error)

## Common Patterns

### Adding a New Learning Module
1. Add module content to `utils/module_content.py` (both `ALL_MODULES` and `MODULE_NAVIGATION`)
2. Add a route in `app.py` for the module page
3. Create corresponding template in `templates/`

### User Authentication
- Session-based (`session['user_id']`, `session['username']`)
- `@login_required` decorator for protected routes
- Password hashing via `werkzeug.security`

### Progress Tracking
Frontend reports progress via POST to `/api/progress`:
```json
{"module_id": "variables", "browse_coverage": 0.75, "study_time": 5.5}
```
Progress value = 60% browse_coverage + 40% normalized study_time

## File Structure

```
/home/webdev6/PythonLearnHub/
├── app.py                 # Main Flask application (all routes here)
├── models/                # SQLAlchemy models
│   ├── __init__.py        # db = SQLAlchemy() initialization
│   ├── user.py
│   ├── user_profile.py
│   ├── progress.py
│   ├── notes.py
│   ├── code_execution.py
│   └── problem.py
├── utils/
│   ├── safe_executor.py   # Safe code execution via AST
│   ├── judge.py           # Online Judge engine
│   └── module_content.py  # Learning module content
├── templates/             # Jinja2 templates
├── static/                # CSS, JS, images
├── Data/                  # OJ problems (problem_*.json, test_case_*.json)
├── instance/              # SQLite database (database.db)
└── deployment/            # Production config (nginx, systemd)
```

from flask import Flask

app = Flask(__name__)

@app.get("/")
def index():
    return "<h1>Flask 실행 성공!</h1>"
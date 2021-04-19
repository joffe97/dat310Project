from flask import Flask, url_for
import sqlite3

app = Flask(__name__)
app.secret_key = "eawadæniowqno83y7w93m96b3666bsefnalqqaaaknqpidh289n19ncos"

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(debug=True)
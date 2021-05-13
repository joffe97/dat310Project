from setup_db import add_trip, delete_trip_by_id, get_all_trips, updateFavorite, updateFinish, updateTrip_by_id, get_trip_by_id, get_hash_for_login, get_user_by_name, add_user
from flask import Flask, url_for, request, abort, g, flash, session
import sqlite3
import json
from werkzeug.security import generate_password_hash, check_password_hash
import re

app = Flask(__name__)
app.secret_key = "eawadæniowqno83y7w93m96b3666bsefnalqqaaaknqpidh289n19ncos"

# DB-connections:
def get_db():
    if not hasattr(g, "_database"):
        print("create connection")
        g._database = sqlite3.connect("database.db")
    return g._database

@app.teardown_appcontext
def teardown_db(error):
    """Closes the database at the end of the request."""
    db = getattr(g, '_database', None)
    if db is not None:
        print("close connection")
        db.close()

# Check if passwords match
def valid_login(usr, pwd):
    """Checks if username and password is valid"""
    conn = get_db()
    hash = get_hash_for_login(conn, usr)
    if hash != None:
        return check_password_hash(hash, pwd)
    return False

# Validate Login:
@app.route("/checkUsrPwd", methods=["POST"])
def validateLogin():
    loginData = request.get_json()
    if loginData.get("username", "") != "":
        if valid_login(loginData["username"], loginData["password"]):
            conn = get_db()
            user = get_user_by_name(conn,loginData["username"])
            print(user)
            session["username"] = user["username"]
            session["role"] = user["role"]
            print("User: {} validated".format(loginData["username"]))
            return {"valid": True}
        else:
            return {"valid": False}
    else: 
        abort(400, "Missing requirements")

# Get current user:
@app.route("/user", methods=["GET"])
def getUser():
    conn = get_db()
    if session.get("username", "") != "":
        user =get_user_by_name(conn, session["username"])
        print(user)
        return json.dumps(user)
    return {"isLoggedIn": False}

# Register:
@app.route("/register", methods=["POST"])
def register():
    #validate username
    error = []
    loginData = request.get_json()
    print(loginData)
    if loginData["username"] == "":
        error.append("Username must be entered")
    if len(loginData["username"]) < 6:
        error.append("Username must have at least 6 characters")
    #Validate password:
    if loginData["password"] == "":
        error.append("Password must be entered")
    if not re.findall('.*[a-z].*', loginData["password"]):
        error.append("Password must contain a lower case letter")
    #Check for uppercase character
    if not re.findall('.*[A-Z].*', loginData["password"]):
        error.append("Password must contain an upper case letter")
    #Check for number character
    if not re.findall('.*[0-9].*', loginData["password"]):
        error.append("Password must contain a numeric value")
    #Check for special characters
    if not re.findall('.*[_@$!?].*', loginData["password"]):
        error.append("Password must contain a special character")
    if len(error) != 0:
        return {"errors": error}
    hash = generate_password_hash(loginData["password"])
    conn = get_db()
    id = add_user(conn, loginData["username"], hash)
    if id == -1:
        error.append("Username already taken")
        return {"errors": error}
    session["username"] = loginData["username"]
    user = get_user_by_name(conn, session["username"])
    session["role"] = user["role"]
    return {"errors": []}

#Log out:
@app.route("/logOut", methods=["POST"])
def logOut():
    user = request.get_json()
    print("User: {}".format(user))
    if user.get("username", "") != "":
        session.pop("username")
        session.pop("role")
        print("User: {} with role {} logged out".format(user["username"], user["role"]))
        return {"successfull": True}
    else: 
        abort(400, "Missing requirements")

# Get all trips from db:
@app.route("/trips", methods=["GET"])
def getTrips():
    conn = get_db()
    user = get_user_by_name(conn, session["username"])
    trips = get_all_trips(conn, user["userid"])
    return json.dumps(trips)

# Delete, add and modify trips that are under the "Up Next page"
@app.route("/trips", methods=["POST"])
def addTrip():
    """adds a new trip and creates a tripid """
    trip = request.get_json()
    print("Trip: {}".format(trip))
    if trip.get("city", "") != "":
        conn = get_db()
        print(trip)
        newTripId = add_trip(conn, trip["city"], trip["country"], trip["continent"], trip["date"], trip["description"], trip["image"], trip["userid"])
        trip["tripid"] = newTripId
        print("Trip: {} got ID {}".format(trip, newTripId))
        return trip
    else: 
        # bad request return 400 error
        abort(400, "Missing requirements")

@app.route("/trip/<int:tid>", methods=["DELETE"])
def deleteTrip(tid):
    print(tid)
    if (tid):
        conn = get_db()
        user = get_user_by_name(conn, session["username"])
        alltrips = get_all_trips(conn, user["userid"])
        for trip in alltrips:
            if trip["tripid"] == tid:
                delete_trip_by_id(conn, tid, user["userid"])
                break
    else:
        #not found
        abort(404, "Trip not found")
    return "Trip {} removed!".format(tid)

@app.route("/trip/<int:tripid>", methods=["PUT"])
def updateTrip(tripid):
    data = request.get_json()
    if data.get("tripid", "") == "":
        abort(400, "No new trip submitted")
    conn = get_db()
    user = get_user_by_name(conn, session["username"])
    alltrips = get_all_trips(conn, user["userid"])
    for trip in alltrips:
        if trip["tripid"] == tripid:
            updateTrip_by_id(conn, tripid, data["city"], data["country"], data["continent"], data["date"], data["description"], data["image"], data["userid"])
            print(get_trip_by_id(conn, tripid))
            break
    else:
        #not found
        abort(404, "Trip not found")
    return "Trip {} updated!".format(tripid)

#Update favorite trip:
@app.route("/favTrip/<int:tripid>", methods=["PUT"])
def updateFav(tripid):
    data = request.get_json()
    if data.get("tripid", "") == "":
        abort(400, "No trip submitted")
    conn = get_db()
    user = get_user_by_name(conn, session["username"])
    alltrips = get_all_trips(conn, user["userid"])
    for trip in alltrips:
        print(trip["tripid"])
        if trip["tripid"] == tripid:
            if trip["favorite"] == False:
                updateFavorite(conn, tripid, user["userid"], True)
            else:
                updateFavorite(conn, tripid, user["userid"], False)
            print(get_trip_by_id(conn, tripid))
            break
    else:
        #not found
        abort(404, "Trip not found")
    return "Trip {} favorite updated!".format(tripid)

#Update finished trip:
@app.route("/finishedTrip/<int:tripid>", methods=["PUT"])
def updateFinished(tripid):
    data = request.get_json()
    if data.get("tripid", "") == "":
        abort(400, "No trip submitted")
    conn = get_db()
    user = get_user_by_name(conn, session["username"])
    alltrips = get_all_trips(conn, user["userid"])
    for trip in alltrips:
        print(trip["tripid"])
        if trip["tripid"] == tripid:
            if trip["finished"] == False:
                updateFinish(conn, tripid, user["userid"], True)
            else:
                updateFinish(conn, tripid, user["userid"], False)
            print(get_trip_by_id(conn, tripid))
            break
    else:
        abort(404, "Trip not found")
    return "Trip {} finished updated!".format(tripid)

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(debug=True)
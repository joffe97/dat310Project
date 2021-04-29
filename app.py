from setup_db import add_trip, delete_trip_by_id, get_all_trips, updateFavorite, updateFinish, updateTrip_by_id, get_trip_by_id, get_hash_for_login, get_user_by_name
from flask import Flask, url_for, request, abort, g, flash, session
import sqlite3
import json
from werkzeug.security import generate_password_hash, check_password_hash

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
    print("Data: {}".format(loginData)) # Remove this afterwards.
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
        # bad request return 400 error
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

# Get all trips from db:
@app.route("/trips", methods=["GET"])
def getTrips():
    conn = get_db()
    trips = get_all_trips(conn, 1) # Need to insert user id here!!!!
    print(trips)
    return json.dumps(trips)

# Delete, add and modify trips that are under the "Up Next page"
@app.route("/trips", methods=["POST"])
def addTrip():
    """adds a new trip and creates a tripid """
    trip = request.get_json()
    print("Trip: {}".format(trip))
    if trip.get("city", "") != "":
        conn = get_db()
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
        alltrips = get_all_trips(conn, 1) #Endre med skikkelig UID!!!
        for trip in alltrips:
            if trip["tripid"] == tid:
                delete_trip_by_id(conn, tid, 1) #Endre med skikkelig UID!!!
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
    alltrips = get_all_trips(conn, 1) #Endre med skikkelig UID!!!
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
    alltrips = get_all_trips(conn, 1) #Endre med skikkelig UID!!!
    for trip in alltrips:
        print(trip["tripid"])
        if trip["tripid"] == tripid:
            if trip["favorite"] == False:
                updateFavorite(conn, tripid, 1, True) # Endre med skikkelig UID!!!
            else:
                updateFavorite(conn, tripid, 1, False) # Endre med skikkelig UID!!!
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
    alltrips = get_all_trips(conn, 1) #Endre med skikkelig UID!!!
    for trip in alltrips:
        print(trip["tripid"])
        if trip["tripid"] == tripid:
            if trip["finished"] == False:
                updateFinish(conn, tripid, 1, True) # Endre med skikkelig UID!!!
            else:
                updateFinish(conn, tripid, 1, False) # Endre med skikkelig UID!!!
            print(get_trip_by_id(conn, tripid))
            break
    else:
        #not found
        abort(404, "Trip not found")
    return "Trip {} finished updated!".format(tripid)

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(debug=True)
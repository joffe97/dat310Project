from flask import Flask, url_for, request, abort
import sqlite3
import json

app = Flask(__name__)
app.secret_key = "eawadæniowqno83y7w93m96b3666bsefnalqqaaaknqpidh289n19ncos"

@app.route("/trips", methods=["POST"])
def addTrip():
    """adds a new trip and creates a tripid """
    trip = request.get_json()
    print("Trip: {}".format(trip))
    if trip.get("city", "") != "":
        trip["tripid"] = 1 #STUDENTS[-1]["student_no"]+1 GENERER EN TRIPID/Hent ut fra db.
        #Legg til i db
        print("Trip: {}".format(trip))
        return trip #Return last row in db, aka trip with the current trip id.
    else: 
        # bad request return 400 error
        abort(400, "Missing requirements")

@app.route("/trip/<int:tid>", methods=["DELETE"])
def deleteTrip(tid):
    print(tid)
    alltrips = "" #Hent fra db
    #for trip in alltrips:
    #    if alltrips["tripid"] == tid:
    #        #Remove from db
    #        break
    #else:
        #not found
    #    abort(404, "Trip not found")
    return "Trip {} removed!".format(tid)

@app.route("/trip/<int:tripid>", methods=["PUT"])
def updateTrip(tripid):
    data = request.get_json()
    if data.get("tripid", "") == "":
        abort(400, "No new trip submitted")
    alltrips = [{tripid:1}, {tripid:2}, {tripid:3}] #hent fra db
    for trip in alltrips:
        if trip[tripid] == tripid:
            # update data in db
            break
    else:
        #not found
        abort(404, "Trip not found")
    return "Trip {} updated!".format(tripid)

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(debug=True)
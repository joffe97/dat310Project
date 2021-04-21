import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

# Functions handling the user-info:
def create_user_table(conn):
    """Create table."""
    cur = conn.cursor()
    try:
        sql = ("CREATE TABLE users ("
               "userid INTEGER, "
               "username VARCHAR(20) NOT NULL, "
               "passwordhash VARCHAR(120) NOT NULL, "
               "role TEXT, "
               "PRIMARY KEY(userid) "
               "UNIQUE(username))")
        cur.execute(sql)
        conn.commit
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    else:
        print("User table created.")
    finally:
        cur.close()

def add_user(conn, username, hash, role="user"):
    """Add user. Returns the new user id"""
    cur = conn.cursor()
    try:
        sql = ("INSERT INTO users (username, passwordhash, role) VALUES (?,?,?)")
        cur.execute(sql, (username, hash,role))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        return -1
    else:
        print("User {} created with id {}.".format(username, cur.lastrowid))
        return cur.lastrowid
    finally:
        cur.close()

def get_user_by_name(conn, username):
    """Get user details by name."""
    cur = conn.cursor()
    try:
        sql = ("SELECT userid, username, role FROM users WHERE username = ?")
        cur.execute(sql, (username,))
        for row in cur:
            (id,name,role) = row
            return {
                "username": name,
                "userid": id,
                "role": role
            }
        else:
            #user does not exist
            return {
                "username": username,
                "userid": None,
                "role": None
            }
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close()

def get_hash_for_login(conn, username):
    """Get user details from id."""
    cur = conn.cursor()
    try:
        sql = ("SELECT passwordhash FROM users WHERE username=?")
        cur.execute(sql, (username,))
        for row in cur:
            (passhash,) = row
            return passhash
        else:
            return None
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close()

#Functions handling the trip info:
def create_user_table(conn):
    """Create table."""
    cur = conn.cursor()
    try:
        sql = ("CREATE TABLE trips ("
               "tripid INTEGER, "
               "city VARCHAR(20) NOT NULL, "
               "country VARCHAR(120) NOT NULL, "
               "continent VARCHAR(20) NOT NULL, "
               "date DATE NOT NULL, "
               "description TEXT NOT NULL, "
               "image VARCHAR(50) NOT NULL, "
               "favorite INTEGER NOT NULL"
               "finished INTEGER NOT NULL, "
               "userid INTEGER, "
               "PRIMARY KEY(tripid) "
               "FOREIGN KEY (userid) REFERENCES users(userid), "
               )
        # Dates must be stored in this format:  YYYY-MM-DD
        # Can choose length of text woth VARCHAR(), but not with TEXT
        cur.execute(sql)
        conn.commit
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    else:
        print("Trip table created.")
    finally:
        cur.close()

def add_trip(conn, city, country, continent, date, description, image, userid):
    """Add a trip. Returns the new trip id"""
    cur = conn.cursor()
    try:
        sql = ("INSERT INTO trips (city, country, continent, date, description, image, userid) VALUES (?,?,?,?,?,?,?)")
        cur.execute(sql, (city, country, continent, date, description, image, userid))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        return -1
    else:
        print("Trip to {} created with id {}.".format(city, cur.lastrowid))
        return cur.lastrowid
    finally:
        cur.close()

def updateTrip(conn, tripid, city, country, continent, date, description, image, userid):
    cur = conn.cursor()
    try:
        sql = ("UPDATE trips SET city=?, country=?, continent=? date=?, description=?, image=? WHERE userid=? AND tripid=?")
        cur.execute(sql, (city, country, continent, date, description, image, userid, tripid))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        return -1
    else:
        print("Trip to {} updated with id {} for user {}.".format(city, tripid, userid))
        return tripid
    finally:
        cur.close()

def updateFavorite(conn, tripid, userid, favorite):
    cur = conn.cursor()
    try:
        sql = ("UPDATE trips SET favorite=?  WHERE userid=? AND tripid=?")
        cur.execute(sql, (favorite, userid, tripid))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        return -1
    else:
        print("Trip {} for user {} updated favorite to {}.".format(tripid, userid, favorite))
        return favorite
    finally:
        cur.close()

def updateFinished(conn, tripid, userid, finished):
    cur = conn.cursor()
    try:
        sql = ("UPDATE trips SET finished=?  WHERE userid=? AND tripid=?")
        cur.execute(sql, (finished, userid, tripid))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        return -1
    else:
        print("Trip {} for user {} updated finished to {}.".format(tripid, userid, finished))
        return finished
    finally:
        cur.close()

# Check if i need this.
def get_trip_by_id(conn, tripid):
    """Get user details by name."""
    cur = conn.cursor()
    try:
        sql = ("SELECT tripid, city, country, continent, date, description, image, favorite, finished, userid FROM trips WHERE tripid = ?")
        cur.execute(sql, (tripid,))
        for row in cur:
            (tripid, city, country, continent, date, description, image, favorite, finished, userid) = row
            return {
                "tripid": tripid,
                "city": city,
                "country": country,
                "contient": continent,
                "date": date,
                "description": description,
                "image": image,
                "favorite": favorite,
                "finished": finished,
                "userid": userid
            }
        else:
            #trip does not exist
            return {
                "tripid": tripid,
                "city": None,
                "country": None,
                "contient": None,
                "date": None,
                "description": None,
                "image": None,
                "favorite": None,
                "finished": None,
                "userid": None
            }
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close()

def get_all_trips(conn, userid):
    """Get user details by name."""
    cur = conn.cursor()
    all_trips = []
    try:
        sql = ("SELECT tripid, city, country, continent, date, description, image, favorite, finished, userid FROM trips WHERE userid = ?")
        cur.execute(sql, (userid,))
        for row in cur:
            (tripid, city, country, continent, date, description, image, favorite, finished, userid) = row
            trip = {
                "tripid": tripid,
                "city": city,
                "country": country,
                "contient": continent,
                "date": date,
                "description": description,
                "image": image,
                "favorite": favorite,
                "finished": finished,
                "userid": userid
            }
            all_trips.append(trip)
        return all_trips
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close()

if __name__ == "__main__":
    try:
        conn = sqlite3.connect("database.db")
    except sqlite3.Error as err:
        print(err)
    else:
        #drop_table(conn)
        create_user_table(conn)
        conn.close()
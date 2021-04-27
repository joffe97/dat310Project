let upnext = {
    template: /*html*/`
    <div class="content">
         <!-- Next Trip banner -->
        <div class="image-box">
            <img src="static/images/Nextbanner.png" alt="NextTripBanner"/>
            <p v-if="daysUntilNextTrip===1" v-bind:style="{'position':'absolute', 'top':'50%', 'left':'50%', 'transform': 'translate(-50%, -50%)', 'color':'white', 'font-size':'25px', 'margin': '0', 'margin-top':'1%'}" >{{daysUntilNextTrip}} day!</p>
            <p v-bind:style="{'position':'absolute', 'top':'4.5%', 'left':'48%', 'transform': 'translate(-50%, -50%)', 'color':'white', 'font-size':'25px', 'margin': '0', 'margin-top':'1%'}"  v-else>{{daysUntilNextTrip}} days!</p>
        </div>
        <!-- For-loop kjørt en gang. Sortert etter dato. -->
        <div class="wrapper" v-if="trips.length">
            <tripArticle
            v-for="article, index in 1"
            v-bind:article="trips[index]"
            v-on:delete="deleteTrip(index, true)" 
            v-on:modify="editInfo(trips[index])" 
            >
            </tripArticle>
        </div>
        <!-- Scheduled Trip banner -->
        <div class="image-box">
            <img :src="'static/images/ScheduledBanner.png'" alt="ScheduledBanner"/>
        </div>
        <!-- Add Trip -->
        <div id="adddiv">
            <label for="addtrip" v-if="editing">Modify trip: </label>
            <label for="addtrip" v-else>Add trip: </label>
            <button class="btn btn-secondary" id="addtrip" v-on:click="seen = !seen">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>
        </div>
        <div v-if="seen" v-bind:style="{ background: '#e3f2fd' }">
            <div class="container">
                <form class="box" @submit="addTrip">
                    <label for="city" class="fixed">City: </label><input id="city" v-model="newtrip.city"/><br>
                    <label for="country" class="fixed">Country: </label><input id="country" v-model="newtrip.country"/><br>
                    <label for="continent" class="fixed">Continent:</label>
                    <select id="continent" v-model="newtrip.continent">
                        <option v-for="option in cnt" v-bind:value="option.value">
                            {{ option.text }}
                        </option>
                    </select><br>
                    <label for="date" class="fixed">Date:</label><input type="date" id="date" v-model="newtrip.date" /><br>
                    <label for="description" class="fixed">Description: </label><input id="description" v-model="newtrip.description"/><br>
                    <label for="uploadimage" class="fixed">Image: </label><input type="file" accept="image/*" id="file-input"><br>
                    <input type="submit" value="Submit" v-if="!editing">  
                </form>
                <p v-if="errors.length">
                    <b>Please correct the following error(s) before submitting:</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
              </p>
            </div>
            <button @click="modifyTrip" v-if="editing" id="modButton" v-bind:style="{'margin-left': '40%', 'margin-bottom': '10px'}">Modify trip</button>
        </div>
        <!-- For-loop alle ganger untatt den første. Sortert etter dato. -->
        <div class="wrapper" v-if="trips.length">
            <tripArticle
            v-for="article, index in trips.length-1"
            v-bind:article="trips[index+1]" 
            v-on:delete="deleteTrip(index, false)"
            v-on:modify="editInfo(trips[index+1])"
            >
            </tripArticle>
        </div>
    </div>
    `,
    data: function(){
        return {
            trips: [],
            seen: false,
            newtrip: {
                tripid: "",
                city: "",
                country: "",
                continent: "",
                date: "",
                description: "",
                image: "",
                userid: "",
            },
            cnt: [
                { text: 'Europe', value: 'Europe' },
                { text: 'North America', value: 'North America' },
                { text: 'South America', value: 'South America' },
                { text: 'Asia', value: 'Asia' },
                { text: 'Africa', value: 'Africa' },
                { text: 'Australia/Oceania', value: 'Australia/Oceania' },
                { text: 'Antarctica', value: 'Antarctica' }
            ],
            errors: [],
            editing: false,
            daysUntilNextTrip: 0,
        }
    },
    created: async function(){
        let request = await fetch("/trips");
        if (request.status == 200){
            let result = await request.json();
            //this.trips = result;
            let tmpList = []
            for (let i=0; i<result.length; i++) {
                if (result[i].finished === 0) {
                    tmpList.push(result[i])
                }
            }
            this.trips = tmpList
            this.finishedTrips()
            this.nextTrip()
            this.sortedTripsByDate()
        }
    },
    methods: {
        finishedTrips: function() {
            let now = new Date();
            for (let i=0;i<this.trips.length;i++) {
                if (new Date(this.trips[i].date) < now && this.trips[i].finished === 0) {
                    this.makeFinished(this.trips[i])
                }
            }
        },
        makeFinished: async function(trip) {
            if (trip){
                console.log("updating");
                trip.finished = !trip.finished
            }
            let request = await fetch("/finishedTrip/" + trip.tripid, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(trip)
            });
            if (request.status == 200){
                let result = await request.text();
                console.log(result);
            }
        },
        validateForm: function(e) {
            this.errors = [];
            if (!this.newtrip.city) {
              this.errors.push("City required");
            }
            if (!this.newtrip.country) {
                this.errors.push("Country required");
            }
            if (!this.newtrip.continent) {
                this.errors.push("Continent required");
            }
            if (!this.newtrip.date) {
                this.errors.push("Date required");
            }
            if (!this.newtrip.description) {
                this.errors.push("Description required");
            }
            //NEED VALIDATION FOR IMAGE
            if (!this.errors.length) {
                return true;
            }
            e.preventDefault();
        }, 
        addTrip: function (e) {
            if (this.validateForm(e)) {
                console.log("no errors")
                userid = this.getUserId();
                this.sendTrip(userid)
            } else {
                console.log("errors")
            }
        },
        getUserId: function() {
            if (this.trips.length) {
                return this.trips[0].userid
            }
        },
        sendTrip: async function(uid) {
            let new_trip = Vue.reactive({tripid: null, city: this.newtrip.city, country: this.newtrip.country, continent: this.newtrip.continent, date: this.newtrip.date, description: this.newtrip.description, image: this.newtrip.image, favorite: false, finished: false, userid: uid});
            this.trips.push(new_trip);
            this.finishedTrips()
            this.nextTrip()
            let request = await fetch("/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(new_trip)
            });
            if (request.status == 200){
                let result = await request.json();
                console.log(result);
                if (new_trip.city == result.city && new_trip.date == result.date){
                    new_trip.tripid = result.tripid;
                }
                this.sortedTripsByDate()
            }
        },
        deleteTrip: async function(index, first) {
            // first-attribute is to check if the trip is the next trip or not. 
            // Because of the for-loop, the index varies according to the trips index
            let trip = ""
            if (first) {
                trip = this.trips[index];
                this.trips.splice(index, 1);
            } else {
                trip = this.trips[index+1];
                this.trips.splice(index+1, 1);
            }
            let request = await fetch("/trip/" + trip.tripid, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (request.status == 200){
                let result = await request.text();
                console.log(result);
            }
        },
        modifyTrip: async function(e) {
            if (this.validateForm(e)) {
                let trip = this.trips.find(t=>t.tripid == this.newtrip.tripid);
                if (trip) {
                    console.log("Modifying");
                    trip.city = this.newtrip.city
                    trip.country = this.newtrip.country
                    trip.continent = this.newtrip.continent
                    trip.date = this.newtrip.date
                    trip.description = this.newtrip.description
                    trip.image = this.newtrip.image
                }
                this.editing = false;
                this.seen = false;
                this.resetInputs();
                let request = await fetch("/trip/" + trip.tripid, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(trip)
                });
                if (request.status == 200){
                    let result = await request.text();
                    console.log(result);
                    this.nextTrip()
                }
            }
        },
        editInfo: function(trip) {
            this.newtrip.tripid = trip.tripid;
            this.newtrip.city = trip.city;
            this.newtrip.country = trip.country;
            this.newtrip.continent = trip.continent;
            this.newtrip.date = trip.date;
            this.newtrip.description = trip.description;
            this.newtrip.image = trip.image;
            this.editing = true;
            this.seen = true;
        },
        resetInputs: function() {
            this.newtrip.tripid = "";
            this.newtrip.city = "";
            this.newtrip.country = "";
            this.newtrip.continent = "";
            this.newtrip.date = "";
            this.newtrip.description = "";
            this.newtrip.image = "";
        },
        nextTrip: function() {
            let tripDate = new Date(this.trips[0].date);
            let nextTripDate = tripDate.getFullYear()+'-'+(tripDate.getMonth()+1)+'-'+tripDate.getDate();
            console.log(nextTripDate)
            let today = new Date();
            let dateToday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            console.log(dateToday)
            this.daysUntilNextTrip = Math.round(( Date.parse(nextTripDate) - Date.parse(dateToday) )/(1000*60*60*24));
            console.log(this.daysUntilNextTrip)
        },
        sortedTripsByDate: function() {
            return this.trips.sort((a, b) => new Date(a.date) - new Date(b.date))
        },   
    },
}
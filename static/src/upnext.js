let upnext = {
    template: /*html*/`
    <div class="content">
         <!-- Next Trip banner -->
        <div class="image-box">
            <img src="static/images/Nextbanner.png" alt="NextTripBanner"/>
            <p>Next Trip</p>
        </div>
        <!-- For-loop kjørt en gang. Sortert etter dato. -->
        <div class="cardboard">
            <tripArticle
            v-for="article, index in 1"
            v-bind:article="trips[index]" 
            >
            </tripArticle>
        </div>
        <!-- Scheduled Trip banner -->
        <div class="image-box">
            <img :src="'static/images/ScheduledBanner.png'" alt="ScheduledBanner"/>
        </div>
        <!-- Add Trip -->
        <div id="adddiv">
            <label for="addtrip">Add trip: </label>
            <button class="btn btn-secondary" id="addtrip" v-on:click="seen = !seen"> <!-- Lage ny knapp for å lukke? Eller on submit, lukk. Ha kun =true her og sett lik false ved lukkingen-->
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
                    <input type="submit" value="Submit">   
                </form>
                <p v-if="errors.length">
                    <b>Please correct the following error(s) before submitting:</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
              </p>
            </div>
        </div>
        <!-- For-loop alle ganger untatt den første. Sortert etter dato. -->
        <div class="cardboard">
            <tripArticle
            v-for="article, index in trips.length-1"
            v-bind:article="trips[index+1]" 
            >
            </tripArticle>
        </div>
    </div>
    `,
    data: function(){
        return {
            trips: [{tripid: 2, city: "Los Angeles", country: "USA", continent: "North America", date: "2021-05-12", description: "This is a long and nice description of all the trips. It is only temporarily because I need some text for demonstration", image: "this.image", favorite: false, finished: false, userid: 1},
                    {tripid: 3, city: "San Diego", country: "USA", continent: "North America", date: "2021-06-12", description: "This is a long and nice description of all the trips. It is only temporarily because I need some text for demonstration", image: "this.image", favorite: false, finished: false, userid: 1},
                    {tripid: 4, city: "Texas", country: "USA", continent: "North America", date: "2021-07-12", description: "This is a long and nice description of all the trips. It is only temporarily because I need some text for demonstration", image: "this.image", favorite: false, finished: false, userid: 1},
                    {tripid: 5, city: "Dallas", country: "USA", continent: "North America", date: "2021-08-12", description: "This is a long and nice description of all the trips. It is only temporarily because I need some text for demonstration", image: "this.image", favorite: false, finished: false, userid: 1}],
            seen: false,
            newtrip: {
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
        }
    },
    methods: {
        validateForm: function (e) {
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
                console.log(this.trips)
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
            }
        },
    }
}
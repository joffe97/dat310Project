let finishedtrips = {
    template: /*html*/`
        <div class="content">
            <!-- Favorite Trips Banner -->
            <div class="image-box">
                <img :src="'static/images/FavoriteTrips.png'" alt="FavoriteBanner"/>
            </div>
            <!-- Show number of favorites -->
            <div id="nrMenu">
                <label for="nrFavorite">Show: </label>
                <select id="nrFavorite" v-model="showNrFavorites">
                    <option v-for="option in show" v-bind:value="option.value">
                        {{ option.text }}
                    </option>
                </select><br>
            </div>
            <!-- Display favorite trips -->
            <div class="wrapper">
                <favArticle
                    v-for="article,index in oldTrips"
                    v-bind:article="article"
                    @togglefav="togglefav(oldTrips[index])"
                    @modify="editInfo(article)" 
                    >
                </favArticle>
            </div>
            <!-- Old Trips Banner -->
            <div class="image-box">
                <img :src="'static/images/RevisitTrips.png'" alt="RevisitBanner"/>
            </div>
            <!-- Old trips mini menu -->
            <div id="revisitMenu">
                <button @click="showSettings = !showSettings" id="settingsButton">Settings</button>
                <div id="serachFilterDiv">
                    <label for="filter">Filter: </label>
                    <select id="filter" v-model="currFilter">
                        <option v-for="option in filters" v-bind:value="option.value">
                            {{ option.text }}
                        </option>
                    </select><br>
                    <div class="searchdiv">
                        <input type="text" v-model="searchValue" placeholder="Search by city.."/>
                    </div>
                </div>
            </div>
            <!-- modify Trip -->
            <div v-if="seen" v-bind:style="{ background: '#e3f2fd' }">
                <div class="container">
                    <form class="box">
                        <label for="description" class="fixed">Description: </label><input id="description" v-model="oldtrip.description"/><br>
                        <label for="uploadimage" class="fixed">Image: </label><input type="file" accept="image/*" id="file-input"><br>
                        <button @click="modifyTrip" type="button" v-if="editing" id="modButton" v-bind:style="{'margin-left': '40%', 'margin-bottom': '10px'}">Modify trip</button>
                    </form>
                    <p v-if="errors.length">
                        <b>Please correct the following error(s) before submitting:</b>
                        <ul>
                            <li v-for="error in errors">{{ error }}</li>
                        </ul>
                    </p>
                </div>
            </div>
            <!-- Settings panel -->
            <div v-if="showSettings" v-bind:style="{ background: '#e3f2fd' }">
                <div class="container">
                    <form class="box">
                        <label for="color" class="fixed">Color:</label>
                        <select id="color" v-model="style.backgroundColor">
                            <option v-for="option in colors" v-bind:value="option.value">
                                {{ option.text }}
                            </option>
                        </select><br>
                        <label for="border" class="fixed">Border:</label>
                        <select id="border" v-model="style.borderColor">
                            <option v-for="option in colors" v-bind:value="option.value">
                                {{ option.text }}
                            </option>
                        </select><br>
                        <label for="fSize" class="fixed">Size:</label>
                        <select id="fSize" v-model="style.fontSize">
                            <option v-for="option in sizes" v-bind:value="option.value">
                                {{ option.text }}
                            </option>
                        </select><br>
                        <button @click="changeSettings" type="button">Change style</button>
                    </form>
                </div>
            </div>
            <!-- Display old trips -->
            <div class="wrapper">
                <notFavArticle
                    v-for="article,index in filteredTrips"
                    v-bind:article="article"
                    v-bind:newStyle="style"
                    @togglefav="togglefav(filteredTrips[index])"
                    @delete="deleteTrip(article)"
                    v-on:modify="editInfo(article)" 
                    >
                </notFavArticle>
            </div>
        </div>
    `,
    data: function(){
        return {
            show: [
                { text: '1', value: 1 },
                { text: '2', value: 2 },
                { text: '3', value: 3 },
            ],
            showNrFavorites: 1,
            filters: [
                { text: 'Alphabetically by city', value: 'alphabetically' },
                { text: 'date', value: 'date' },
            ],
            currFilter: 'date',
            searchValue: "",
            oldTrips: [],
            errors: [],
            oldtrip: {
                tripid: "",
                description: "",
                image: "",
            },
            seen: false,
            editing: false,
            nrfavTrips: 0,
            style: {
                backgroundColor: 'white',
                fontSize: 16,
                borderColor: '#335c81'
            }, 
            showSettings: false,
            colors: [
                { text: 'White', value: 'FFFFFF' },
                { text: 'Bdazzeled Blue', value: '#335c81' },
                { text: 'Lavender Gray', value: 'CAC4CE' },
                { text: 'Key Lime', value: 'E6F9AF' },
                { text: 'Unbleached Silk', value: 'FFD8BE' },
                { text: 'Silver Pink', value: 'D0B8AC' },
                { text: 'Pale Purple Pantone', value: 'F5E5FC' },
                { text: 'Black Shadows', value: 'BFACB5' },
                { text: 'Champagne Pink', value: 'E5D0CC' },
            ],
            sizes: [
                { text: '12', value: '12' },
                { text: '14', value: '14' },
                { text: '16', value: '16' },
                { text: '18', value: '18' },
            ]
        }
    },
    created: async function(){
        let request = await fetch("/trips");
        if (request.status == 200){
            let result = await request.json();
            tmpList = []
            for (let i=0; i<result.length; i++) {
                if (result[i].finished === 1) {
                    tmpList.push(result[i])
                }
            }
            this.oldTrips = tmpList
        }
    },
    methods: {
        togglefav: async function(trip) {
            this.nrfavTrips = 0
            for (let i=0;i<this.oldTrips.length;i++) {
                if (this.oldTrips[i].favorite === 1) {
                    this.nrfavTrips ++
                }
            }
            if (this.nrfavTrips >= 3 && trip.favorite === 0) {
                alert("You can only have three favorites. Remove one favorite and try again")
            } else {
                if (trip){
                    console.log("updating");
                    // gjøre noe her for å automatisk oppdatere utseende? Gir kun info hver gang for-loopen kjører.
                    trip.favorite = !trip.favorite
                }
                let request = await fetch("/favTrip/" + trip.tripid, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(trip)
                });
                if (request.status == 200){
                    let result = await request.text();
                    console.log(result);
                    // Need to do something with the result? Maybe that will make it update?
                    this.getAllTrips()
                }
            }
        },
        deleteTrip: async function(trip, ) {
            if(confirm("Are you sure that you want to delete?")) {
                let index = 0
                for (let i=0;i<this.oldTrips.length;i++) {
                    if (trip.tripid === this.oldTrips[i]) {
                        index = i
                    }
                }
                this.oldTrips.splice(index, 1);
                let request = await fetch("/trip/" + trip.tripid, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (request.status == 200){
                    let result = await request.text();
                    console.log(result);
                    this.getAllTrips()
                }
            }
        },
        modifyTrip: async function(e) {
            if (this.validateForm(e)) {
                let trip = this.oldTrips.find(t=>t.tripid == this.oldtrip.tripid);
                if (trip) {
                    console.log("Modifying");
                    trip.description = this.oldtrip.description
                    trip.image = this.oldtrip.image
                }
                this.editing = false;
                this.seen = false;
                //this.resetInputs();
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
                }
            }
        },
        editInfo: function(trip) {
            this.seen = true;
            this.oldtrip.tripid = trip.tripid;
            this.oldtrip.description = trip.description;
            this.oldtrip.image = trip.image;
            this.editing = true;
            this.seen = true;
        },
        validateForm: function (e) {
            this.errors = [];
            if (!this.oldtrip.description) {
                this.errors.push("Description required");
            }
            //NEED VALIDATION FOR IMAGE
            if (!this.errors.length) {
                return true;
            }
            e.preventDefault();
        }, 
        getAllTrips: async function() {
            let request = await fetch("/trips");
            if (request.status == 200){
                let result = await request.json();
                tmpList = []
                for (let i=0; i<result.length; i++) {
                    if (result[i].finished === 1) {
                        tmpList.push(result[i])
                    }
                }
                this.oldTrips = tmpList
            }
        },
    },
    computed: {
        filteredTrips: function() {
            let tmpTrips = this.oldTrips
            // Handle search input
            if (this.searchValue != '' && this.searchValue) {
                tmpTrips = tmpTrips.filter((trip) => {
                  return trip.city
                    .toLowerCase()
                    .includes(this.searchValue.toLowerCase())
                })
              }  
            // Sort by alphabetical order
                tmpTrips = tmpTrips.sort((a, b) => {
                    if (this.currFilter == 'alphabetically') {
                        let fa = a.city.toLowerCase(), fb = b.city.toLowerCase()
                  
                      if (fa < fb) {
                        return -1
                      }
                      if (fa > fb) {
                        return 1 
                      }
                      return 0
                      
                      // Sort by date
                    } else if (this.currFilter == 'date') {
                        let fa = new Date(a.date), fb = new Date(b.date)
                        if (fa < fb) {
                            return -1
                          }
                          if (fa > fb) {
                            return 1 
                          }
                          return 0
                    }
                })
                
                return tmpTrips
        }
    },
}
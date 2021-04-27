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
                    v-for="article,index in favTrips"
                    v-bind:article="article"
                    @togglefav="togglefav(favTrips[index])"
                    >
                </favArticle>
            </div>
            <!-- Old Trips Banner -->
            <div class="image-box">
                <img :src="'static/images/RevisitTrips.png'" alt="RevisitBanner"/>
            </div>
            <!-- Old trips mini menu -->
            <div id="revisitMenu">
                <button @click="" id="settingsButton">Settings</button>
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
            <!-- Display old trips -->
            <div class="wrapper">
                <favArticle
                    v-for="article,index in filteredTrips"
                    v-bind:article="article"
                    @togglefav="togglefav(filteredTrips[index])"
                    @delete="deleteTrip(article)"
                    >
                </favArticle>
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
            favTrips: [],
            otherTrips: [],
        }
    },
    created: async function(){
        let request = await fetch("/trips");
        if (request.status == 200){
            let result = await request.json();
            this.oldTrips = result;
        }
        this.favoriteTrips()
    },
    methods: {
        togglefav: async function(trip) {
            if (this.favTrips.length >= 3 && trip.favorite === 0) {
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
                }
                this.favoriteTrips()
            }
        },
        favoriteTrips: function() {
            this.favTrips = []
            this.otherTrips = []
            for (let i=0; i<this.oldTrips.length; i++) {
                if (this.oldTrips[i].favorite === 1) {
                    this.favTrips.push(this.oldTrips[i])
                } else {
                    this.otherTrips.push(this.oldTrips[i])
                }
            }
        },
        deleteTrip: async function(trip, ) {
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
            }
        },
    },
    computed: {
        filteredTrips() {
            let tmpTrips = this.otherTrips
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
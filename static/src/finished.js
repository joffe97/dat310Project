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
                <tripArticle
                    v-for="article in filteredTrips"
                    v-bind:article="article"
                    >
                </tripArticle>
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
            oldTrips: [{city:"C Los Angeles", country:"USA", continent:"North America", date:"2022-05-12", description:"This is going to be the best trip ever. We are visiting some of the most amazing places in the world", image:"imageurl", userid:1}, {city:"B Los Boss", country:"USA", continent:"North America", date:"2021-05-12", description:"This is going to be the best trip ever. We are visiting some of the most amazing places in the world", image:"imageurl", userid:1},{city:"A Los Tacos", country:"USA", continent:"North America", date:"2023-05-12", description:"This is going to be the best trip ever. We are visiting some of the most amazing places in the world", image:"imageurl", userid:1}],
        }
    },
    computed: {
        filteredTrips() {
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
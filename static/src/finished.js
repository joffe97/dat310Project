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
                    <select id="filter" v-model="currFilter">
                        <option v-for="option in filters" v-bind:value="option.value">
                            {{ option.text }}
                        </option>
                    </select><br>
                    <div class="searchdiv">
                        <input type="text" v-model="search" placeholder="Search by city.."/>
                    </div>
                </div>
            </div>
            <!-- Display old trips -->
            <div class="wrapper">
                <tripArticle
                    v-for="article in filteredList"
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
                { text: 'city', value: 'city' },
                { text: 'country', value: 'country' },
                { text: 'continent', value: 'continent' },
                { text: 'date', value: 'date' },
            ],
            currFilter: "",
            search: "",
            oldTrips: [{city:"Los Angeles", country:"USA", continent:"North America", date:"2021-05-12", description:"This is going to be the best trip ever. We are visiting some of the most amazing places in the world", image:"imageurl", userid:1}, {city:"Los Boss", country:"USA", continent:"North America", date:"2021-05-12", description:"This is going to be the best trip ever. We are visiting some of the most amazing places in the world", image:"imageurl", userid:1},{city:"Los Tacos", country:"USA", continent:"North America", date:"2021-05-12", description:"This is going to be the best trip ever. We are visiting some of the most amazing places in the world", image:"imageurl", userid:1}],
        }
    },
    computed: {
        filteredList() {
            return (this.oldTrips.filter(trip => { return trip.city.toLowerCase().includes(this.search.toLowerCase())})
        )}
    },
}
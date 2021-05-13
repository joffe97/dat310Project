let statistics = {
    template: /*html*/`
    <!--
    <MapChart
    :countryData="{'US': 4, 'CA': 7, 'GB': 8, 'IE': 14, 'ES': 21}"
    highColor="#ff0000"
    lowColor="#aaaaaa"
    countryStrokeColor="#909090"
    defaultCountryFillColor="#dadada"
    />
    -->
    <div>
        <div class="content">
            <!-- Satistics Banner -->
            <div class="image-box">
                <img :src="'static/images/statistics.png'" alt="FavoriteBanner"/>
            </div>
            <main class="main">
                <aside>
                    <h3>How many countries have you visited?</h3>
                        <table class="country-table">
                            <tbody>
                                <tr
                                v-for="con in continents"
                                >
                                    <td>You have visited <strong>{{con.countriesVistied}}</strong> of <strong>{{con.totalCountries}}</strong> countries in {{con.continent}}</td>
                                </tr>
                            </tbody>
                        </table>
                </aside>
                <div>
                    <div class="flexbox">
                        <pieChart
                        :pieData="pieData"
                        ></pieChart>
                        <div class="pie_right">
                            <div v-for="cnt, index in continents.length-1" class="boxcontainer">
                                <div class='colorbox' :style="{backgroundColor: pieData[index].color}"></div>
                                <p>{{continents[index].continent}}</p>
                            </div>
                        </div>
                    </div>
                
                    <h1>Details</h1>
                
                    <div class="framed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales neque quis nisi facilisis lobortis. Nam
                        efficitur eget nisi sit amet bibendum. Vestibulum elementum faucibus quam ut posuere. Vivamus pellentesque
                        luctus nunc at bibendum. Mauris viverra ultrices nisi, sit amet imperdiet lectus accumsan eu. Morbi ornare diam
                        nulla, nec aliquet nisl accumsan dictum. Mauris sit amet tellus in ipsum commodo hendrerit. Nunc at mollis
                        magna. Proin felis nibh, venenatis non lobortis quis, ullamcorper nec dolor. Vivamus tempus volutpat fringilla.
                        Praesent volutpat sit amet massa nec ultricies. Curabitur sollicitudin pharetra tortor in dictum. In mattis orci
                        vel augue vehicula rutrum. Nullam vitae sollicitudin orci.
                    </div>
                </div>
            </main>
        </div>
    </div>
    `,
    data: function() {
        return {
            continents: [
                {continent: 'Europe', countriesVistied: 0, totalCountries: 44},
                {continent: 'North America', countriesVistied: 0, totalCountries: 23},
                {continent: 'South America', countriesVistied: 0, totalCountries: 13},
                {continent: 'Asia', countriesVistied: 0, totalCountries: 48},
                {continent: 'Africa', countriesVistied: 0, totalCountries: 54},
                {continent: 'Oceania', countriesVistied: 0, totalCountries: 14},
                {continent: 'Antarctica', countriesVistied: 0, totalCountries: 1},
                {continent: 'The World', countriesVistied: 0, totalCountries: 196},
            ],
            pieData: [
                {color: '#545677', value: 10 },
                {color: '#1C6E8C', value: 10 },
                {color: '#91B7C7', value: 10 },
                {color: '#E2C044', value: 10 },
                {color: '#FF8552', value: 10 },
                {color: '#63C7B2', value: 20 },
                {color: '#8E6C88', value: 30 },
            ],
            completedTrips: []
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
            this.completedTrips = tmpList
            this.numberOf()
            this.updatePieData()
        }
    },
    methods: {
        numberOf: function() {
            let countedCountries = [];
            for (let i= 0; i < this.completedTrips.length; i++) {
                console.log(this.completedTrips[i])
                for (let j = 0; j < this.continents.length-1; j++) {
                    if (this.completedTrips[i]["continent"] === this.continents[j].continent) {
                        if (countedCountries.includes(this.completedTrips[i]["country"])) {
                            continue
                        } else {
                            this.continents[j].countriesVistied ++;
                            countedCountries.push(this.completedTrips[i].country);
                        }
                    }
                }
            }
            this.continents[7].countriesVistied = countedCountries.length
        },
        updatePieData: function() {
            let allCountries = this.continents[7].countriesVistied;
            for (let i = 0; i < this.continents.length-1; i++) {
                this.pieData[i].value = this.continents[i].countriesVistied / allCountries * 100;
            }
        }
    }
}
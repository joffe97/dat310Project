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
            v-for="article in (array.length - (array.length-1))"
            v-bind:article="article" 
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
            <button class="btn btn-secondary" id="addtrip">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>
        </div>
        <!-- For-loop alle ganger untatt den første. Sortert etter dato. -->
        <div class="cardboard">
            <tripArticle
            v-for="article, index in array.length-1"
            v-bind:article="array[index+1]" 
            >
            </tripArticle>
        </div>
    </div>
    `,
    data: function(){
        return {
            array: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]
        }
    },
    methods: {

    }
}
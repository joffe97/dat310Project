let notFavC = {
    props: ["article", "newStyle"],
    template: /*html*/`
    <div class="outer" v-if="article.favorite===0">
        <div class="card front" :style="newStyle">
            <img :src="article.image" alt="ScheduledBanner"/>
            <div class="description">
                <h3>{{article.city}}, {{article.country}}</h3>
                <p><strong>Departure: {{ article.date }}</strong></p>
                <p>{{article.description}}</p>
                <div id="delModFavDiv">
                    <a
                    href="javascript:void(0);"
                    @click="$emit('modify')" 
                    >Modify</a>
                    <a
                    href="javascript:void(0);"
                    @click="$emit('delete')"
                    >Delete</a>
                    <button @click="$emit('togglefav')" ><i v-bind:class="[is_fav==1 ?  'fa-heart' : 'fa-heart-o', 'fa']" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    </div>
    `,
    computed: {
        is_fav() {
            return this.article.favorite;
        }
    }
}
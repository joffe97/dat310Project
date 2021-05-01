let articleC = {
    props: ["article"],
    template: /*html*/`
    <div class="outer" v-if="article.finished===0">
        <div class="card front">
            <img :src="article.image" alt="tripImage"/>
            <div class="description">
                <h3>{{article.city}}, {{article.country}}</h3>
                <p><strong>Departure: {{ article.date }}</strong></p>
                <p>{{article.description}}</p>
                <div id="delModDiv">
                    <a
                    href="javascript:void(0);"
                    @click="$emit('modify')" 
                    >Modify</a>
                    <a
                    href="javascript:void(0);"
                    @click="$emit('delete')"
                    >Delete</a>
                </div>
            </div>
        </div>
    </div>
    `,
}
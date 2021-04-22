let articleC = {
    props: ["article"],
    template: /*html*/`
    <div class="outer">
        <div class="card front">
            <img :src="'https://images.unsplash.com/photo-1618023217167-088530104197?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1652&q=80'" alt="ScheduledBanner"/>
            <div class="description">
                <h3>\{{article.city}}, {{article.country}}</h3>
                <p><strong>Departure: {{ article.date }}</strong></p>
                <p>{{article.description}}</p>
            </div>
        </div>
    </div>
    `,
    //data(){
    //    return store.state;
    //}
}
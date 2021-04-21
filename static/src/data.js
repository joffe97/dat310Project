class Trip {
    constructor(id, city, country, continent, date, description, image, finished, favorite, userid) {
        this.id = id;
        this.city = city;
        this.country = country;
        this.continent = continent;
        this.date = date;
        this.description = description;
        this.image = image;
        this.finished = finished;
        this.favorite = favorite;
        this.userid = userid;
    }
}

let trips = []
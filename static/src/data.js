async function getTrips(){
    let request = await fetch("/trips");
    if (request.status == 200){
        let result = await request.json();
        return result
    }
}

class DataStore {
    constructor(trips){
        this.state = Vue.reactive({
            trips: trips,
        });
    }
}
let trips = getTrips();
let store = new DataStore(trips);
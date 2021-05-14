/*
async function getTrips(){
    let request = await fetch("/trips");
    if (request.status == 200){
        let result = await request.json();
        result.sort((a, b) => new Date(a.date) - new Date(b.date))
        for (let i=0; i<result.length; i++) {
            if (result[i].finished === 1) {
                store.state.finishedTrips.push(result[i])
            } else {
                store.state.plannedTrips.push(result[i])
            }
        }
    }
}
*/

async function getCurrentUser() {
    let request = await fetch("/user");
    if (request.status == 200){
        let result = await request.json();
        console.log(result)
        if (result.username) {
            store.state.activeUser = result
        } else {
            store.state.activeUser = ""
        }
    }
}


class DataStore {
    constructor(){
        this.state = Vue.reactive({
            //finishedTrips: [],
            //plannedTrips: [],
            activeUser: "",
        });
    }
}

//let trips = getTrips();
activeUser = getCurrentUser();
//trips = getTrips();
let store = new DataStore();
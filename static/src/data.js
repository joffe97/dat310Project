//async function getTrips(){
//    let request = await fetch("/trips");
//    if (request.status == 200){
//        let result = await request.json();
//        return result
//    }
//}

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
            //trips: "",
            activeUser: "",
        });
    }
}

//let trips = getTrips();
activeUser = getCurrentUser();
let store = new DataStore();
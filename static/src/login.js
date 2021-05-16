let loginform = {
    template: /*html*/`
        <div>
            <div class="content">
                <main class="main">
                    <aside class="loginbox">
                        <div class="loginform">
                            <h2>Log In</h2>
                            <form @submit="checkLogin">
                                <input id="username" v-model="loginData.username" placeholder="Username" required/><br>
                                <input type="password" id="password" v-model="loginData.password" placeholder="Password" required/><br>
                                <input class="loginButtons" type="submit" value="Log In"> 
                                <button class="loginButtons" type="button" @click="toRegister">Register</button>
                            </form>
                            <div v-if="proccessing" class="text-center"> Please wait... </div>
                            <div v-if="invalid" class="text-center"> Invalid username or password</div>
                        </div>
                    </aside>
                    <div>
                        <div class="flexbox logo">
                            <img :src="'static/images/travelLogo.png'" alt="Logo"/>
                        </div>
                        <div class="companyname">
                            <h2>TRAVEL</h2>
                        </div>
                    </div>
            </main>
        </div>
    </div>
    `,
    data: function() {
        return {
            loginData: {
                username: "",
                password: "",
            },
            proccessing: false,
            invalid: false,
            activeUser: ""
        }
    },
    methods: {
        checkLogin: async function(e) {
            this.proccessing = true;
            this.invalid = false
            let request = await fetch("/checkUsrPwd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.loginData)
            });
            if (request.status == 200){
                let result = await request.json();
                // returned data:
                console.log(result);
                this.proccessing = false
                if (result.valid === false) {
                    this.invalid = true
                } else {
                    //this.$emit('successfulllogin')
                    this.$router.push("/upnext")
                    // Must be another way to update user status.
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
                    this.getCookies()
                }
            }
            // block the traditional submission of the form.
            e.preventDefault();
        },
        toRegister: function() {
            this.$router.push("/register")
        },
        //Trenger man denne her når man har den i index.html?
        getCookies: async function() {
            let request = await fetch("/getCookieInfo");
            if (request.status == 200){
                let result = await request.json();
                console.log(result);
                if (result != "") {
                    store.state.preferences = result
                }
            }
        }
    },
}
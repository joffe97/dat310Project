let registerform = {
    template: /*html*/`
        <div>
            <div class="content">
                <main class="main">
                    <div class="registerbox">
                        <div class="loginform registerform">
                            <img id="smallLogo" src="static/images/travelLogo.png" alt="Logo"/>
                            <h2>Register</h2>
                            <form @submit="checkRegister">
                                <p v-if="showErrors" id="registerError">
                                    <b>Invalid username or password:</b>
                                    <ul>
                                        <li v-for="error, index in errors">{{ errors[index]}}</li>
                                    </ul>
                                </p>
                                <input id="username" v-model="registerData.username" placeholder="Username" required/><br>
                                <input type="password" id="password" v-model="registerData.password" placeholder="Password" required/><br>
                                <input id="registerbutton" type="submit" value="Register"> 
                                <div v-if="proccessing" class="text-center"> Please wait... </div>
                            </form>
                        </div>
                    </div>
            </main>
        </div>
    </div>
    `,
    data: function() {
        return {
            registerData: {
                username: "",
                password: "",
            },
            proccessing: false,
            errors: [],
            showErrors: false,
        }
    },
    methods: {
        checkRegister: async function(e) {
            this.proccessing = true;
            showErrors = false;
            let request = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.registerData)
            });
            if (request.status == 200){
                let result = await request.json();
                // returned data:
                console.log(result);
                console.log(result.errors)
                this.proccessing = false
                if (result.errors.length) {
                    this.showErrors = true
                    this.errors = result.errors
                } else {
                    //this.$emit('successfulllogin')
                    this.$router.push("/upnext")
                }
            }
            // block the traditional submission of the form.
            e.preventDefault();
        },
    },
}
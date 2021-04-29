let registerform = {
    template: /*html*/`
        <div>
            <div class="content">
                <main class="main">
                    <div class="registerbox">
                        <div class="loginform registerform">
                            <img id="smallLogo" src="static/images/travelLogo.png" alt="Logo"/>
                            <h2>Register</h2>
                            <form @submit="">
                                <input id="username" v-model="registerData.username" placeholder="Username" required/><br>
                                <input type="password" id="password" v-model="registerData.password" placeholder="Password" required/><br>
                                <button id="registerbutton" type="button" @click="">Register</button>
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
            }
        }
    }
}
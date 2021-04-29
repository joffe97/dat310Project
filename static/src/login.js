let loginform = {
    template: /*html*/`
        <div>
            <div class="content">
                <main class="main">
                    <aside class="loginbox">
                        <div class="loginform">
                            <h2>Log In</h2>
                            <form @submit="">
                                <input id="username" v-model="loginData.username" placeholder="Username" required/><br>
                                <input type="password" id="password" v-model="loginData.password" placeholder="Password" required/><br>
                                <input class="loginButtons" type="submit" value="Log In"> 
                                <button class="loginButtons" type="button" @click="">Register</button>
                            </form>
                            <p v-if="errors.length">
                                <b>Please correct the following error(s) before submitting:</b>
                                <ul>
                                    <li v-for="error in errors">{{ error }}</li>
                                </ul>
                            </p>
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
            errors: [],
        }
    }
}
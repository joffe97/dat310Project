// The router component created with VueRouter
let router = VueRouter.createRouter({

    history: VueRouter.createWebHashHistory(),
    routes: [
      { path: '/', component: loginform },
      { path: '/register', component: registerform},
    ]
});
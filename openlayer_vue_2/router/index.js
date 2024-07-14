import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 重定向
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      beforeEnter: () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
        }
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
  ],
});

export default router;

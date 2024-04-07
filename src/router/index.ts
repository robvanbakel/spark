import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/store";

import routes from "./routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuth();

  if (!authStore.user && !to.meta.noAuth) {
    return next({ name: "Auth" });
  }

  if (to.name !== "Planner") {
    let title = "Spark";

    if (to.meta.title) {
      title = `${to.meta.title} - ${title}`;
    }

    document.title = title;
  }

  next();
});

export default router;

import { createRouter, createWebHistory } from "vue-router"

import { auth } from "@/firebase"
import store from "@/store"

import Home from "@/views/Home"
import EmployeeList from "@/views/EmployeeList"
import Planner from "@/views/Planner"
import Schedule from "@/views/Schedule"
import Auth from "@/views/Auth"
import Settings from "@/views/Settings"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      name: "Home",
    },
    {
      path: "/auth",
      component: Auth,
      name: "Auth",
      meta: {
        noAuth: true,
        title: "Login",
      },
    },
    {
      path: "/staff",
      component: EmployeeList,
      name: "EmployeeList",
      meta: {
        admin: true,
        title: "Staff",
      },
    },
    {
      path: "/planner/:weekId?",
      component: Planner,
      name: "Planner",
      meta: {
        admin: true,
      },
      async beforeEnter(to) {
        store.dispatch("date/setDates", to.params.weekId)
      },
    },
    {
      path: "/schedule/:weekId?",
      component: Schedule,
      name: "Schedule",
      async beforeEnter(to) {
        store.dispatch("date/setDates", to.params.weekId)
      },
    },
    {
      path: "/settings",
      component: Settings,
      name: "Settings",
      meta: {
        title: "Settings",
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  let title = "Spark"

  if (to.meta.title) {
    title = `${to.meta.title} - ${title}`
  }

  document.title = title

  if (!to.meta.noAuth && !auth.currentUser) {
    next({ name: "Auth" })
  } else if (to.meta.admin && !store.getters["auth/admin"]) {
    next({ name: "Schedule" })
  } else {
    next()
  }
})

export default router

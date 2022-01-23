import { createApp } from "vue"

import router from "@/router.js"
import store from "@/store/index.js"
import App from "@/App.vue"

import "@/assets/styles/main.css"

import BaseBadge from "@/components/ui/BaseBadge"
import BaseButton from "@/components/ui/BaseButton"
import BaseSwitch from "@/components/ui/BaseSwitch"
import BaseOverlay from "@/components/ui/BaseOverlay"
import BaseModal from "@/components/ui/BaseModal"
import BaseDropdown from "@/components/ui/BaseDropdown"
import BaseConfirm from "@/components/ui/BaseConfirm"
import BaseDatePicker from "@/components/ui/BaseDatePicker"
import WeekSwitch from "@/components/ui/WeekSwitch"
import TheSidebar from "@/components/layout/TheSidebar"

import { auth } from "@/firebase"

// Sign user out before demo environment is reloaded
if(store.getters['settings/mode'] === 'demo') {
  auth.signOut()
}

// Get Firebase Auth status before app instantiation

let app = null

auth.onAuthStateChanged(async (user) => {
  if (user) {
    await store.dispatch("settings/getSettings")
    await store.dispatch("employees/getUsers")
    await store.dispatch("planner/getSchedules")
    await store.dispatch("date/setDates")
  }

  if (!app) {
    app = createApp(App)

    app.use(router)
    app.use(store)

    app.component("base-button", BaseButton)
    app.component("base-badge", BaseBadge)
    app.component("base-switch", BaseSwitch)
    app.component("base-overlay", BaseOverlay)
    app.component("base-modal", BaseModal)
    app.component("base-dropdown", BaseDropdown)
    app.component("BaseConfirm", BaseConfirm)
    app.component("BaseDatePicker", BaseDatePicker)
    app.component("week-switch", WeekSwitch)
    app.component("the-sidebar", TheSidebar)

    app.mount("#app")
  }
})

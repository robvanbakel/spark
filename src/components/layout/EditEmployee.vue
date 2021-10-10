<template>
  <base-modal class="edit-employee" globalClose @close="closeEditEmployee">
    <template v-slot:header>
      <h1 v-if="this.new">Add Employee</h1>
      <h1 v-else>{{ employee.firstName }} {{ employee.lastName }}</h1>
      <StatusPicker
        v-if="!this.new && activeEmployee.status"
        :activeStatus="activeEmployee.status"
        @setActiveStatus="setActiveStatus"
      />
    </template>
    <template v-slot:main>
      <div v-if="this.new">
        <div class="form-control">
          <label for="firstName">First name</label>
          <input type="text" id="firstName" v-model.trim="activeEmployee.firstName" />
        </div>
        <div class="form-control">
          <label for="lastName">Last name</label>
          <input type="text" id="lastName" v-model.trim="activeEmployee.lastName" />
        </div>
      </div>
      <div class="form-control">
        <label for="role">Role</label>
        <base-dropdown
          v-if="activeEmployee.role || this.new"
          :items="roles"
          :active="activeEmployee.role"
          @choice="setRole"
        ></base-dropdown>
      </div>
      <div class="form-control">
        <label for="contract">Contract</label>
        <div class="form-control-contract">
          <div>
            <input type="text" id="contract" v-model.trim="activeEmployee.contract" />
            <span class="input-label">hours</span>
          </div>
          <base-switch
            :items="['fulltime', 'parttime']"
            id="contractType"
            :active="employee.contractType"
            @active-item="setContractType"
          ></base-switch>
        </div>
      </div>
      <div class="form-control">
        <label for="email">Email</label>
        <input type="text" id="email" v-model.trim="activeEmployee.email" />
      </div>
      <div class="form-control">
        <label for="phone">Phone</label>
        <input type="text" id="phone" v-model.trim="activeEmployee.phone" />
      </div>
      <div class="form-control note">
        <label for="note">Notes</label>
        <textarea id="note" v-model="activeEmployee.note"></textarea>
      </div>
    </template>
    <template v-slot:actions>
      <base-button
        v-if="!this.new"
        color="danger"
        iconOnly
        icon="delete"
        class="left"
        @click="deleteEmployee"
      ></base-button>
      <base-button secondary @click="closeEditEmployee">Cancel</base-button>
      <base-button @click="saveEditEmployee">Save</base-button>
    </template>
  </base-modal>

  <base-confirm
    ref="confirmDeleteEmployee"
    message="Deleting an employee cannot be undone."
    choiceTrue="Delete Employee"
  ></base-confirm>
</template>

<script>
import StatusPicker from "@/components/ui/StatusPicker"

export default {
  props: ["employee", "new"],
  emits: ["closeEditEmployee"],
  components: {
    StatusPicker,
  },
  data() {
    return {
      activeEmployee: {},
      showConfirmDelete: false,
    }
  },
  methods: {
    setActiveStatus(status) {
      this.activeEmployee.status = status
    },
    setCurrentEmployeeData() {
      if (this.new) {
        this.activeEmployee.status = "staged"
      } else {
        this.activeEmployee.status = this.employee.status
      }
      this.activeEmployee.email = this.employee.email || ""
      this.activeEmployee.phone = this.employee.phone || ""
      this.activeEmployee.role = this.employee.role || ""
      this.activeEmployee.contract = this.employee.contract || ""
      this.activeEmployee.contractType = this.employee.contractType || ""
      this.activeEmployee.note = this.employee.note || ""
    },
    setContractType(value) {
      this.activeEmployee.contractType = value
    },
    setRole(value) {
      this.activeEmployee.role = value
    },
    closeEditEmployee() {
      this.$emit("closeEditEmployee")
    },
    async deleteEmployee() {
      if (await this.$refs.confirmDeleteEmployee.open()) {
        this.activeEmployee.status = "archived"
        this.saveEditEmployee()
      }
    },
    async saveEditEmployee() {
      // TODO verify data

      if (this.new) {
        this.$store.dispatch("employees/createNewUser", {
          employee: this.activeEmployee,
        })
      } else {
        this.$store.dispatch("employees/updateUser", {
          id: this.employee.id,
          data: this.activeEmployee,
        })
      }

      this.closeEditEmployee()
    },
  },
  computed: {
    roles() {
      return this.$store.getters["settings/roles"].map((role) => {
        return { id: role, display: role }
      })
    },
  },
  mounted() {
    this.setCurrentEmployeeData()
  },
}
</script>

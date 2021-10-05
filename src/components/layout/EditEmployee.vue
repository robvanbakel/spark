<template>
  <div class="edit-modal">
    <base-overlay dark transparent></base-overlay>
    <div class="modal">
      <div v-if="!this.new" class="header">
        <h1>{{ employee.firstName }} {{ employee.lastName }}</h1>
        <StatusPicker v-if="activeEmployee.status" :activeStatus="activeEmployee.status" @setActiveStatus="setActiveStatus" />
        <span class="clear material-icons material-icons-round" @click="closeEditEmployee">clear</span>
      </div>
      <div v-else class="header">
        <h1>Add Employee</h1>
        <span class="clear material-icons material-icons-round" @click="closeEditEmployee">clear</span>
      </div>
      <div class="main">
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
          <input type="text" id="role" v-model.trim="activeEmployee.role" />
        </div>
        <div class="form-control">
          <label for="contract">Contract</label>
          <div class="form-control-contract">
            <div>
              <input type="text" id="contract" v-model.trim="activeEmployee.contract" />
              <span class="input-label">hours</span>
            </div>
            <base-switch :items="['fulltime', 'parttime']" :active="employee.contractType" @active-item="setContractType"></base-switch>
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

        <base-confirm message="Deleting an employee cannot be undone." choiceTrue="Delete Employee" v-if="showConfirmDelete" @choice="deleteEmployee" />

        <div class="form-actions">
            <base-button v-if="!this.new" color="danger" iconOnly icon="delete" @click="showConfirmDelete = true"></base-button>
            <base-button secondary @click="closeEditEmployee">Cancel</base-button>
            <base-button @click="saveEditEmployee">Save</base-button>
        </div>
      </div>
    </div>
  </div>
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
    closeEditEmployee() {
      this.$emit("closeEditEmployee")
    },
    deleteEmployee(confirmed) {
      if (confirmed) {
        this.activeEmployee.status = "archived"
        this.saveEditEmployee()
      }

      this.showConfirmDelete = false
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
  mounted() {
    this.setCurrentEmployeeData()
  },
}
</script>

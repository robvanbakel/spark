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
          <input
            autocomplete="off"
            type="text"
            id="firstName"
            @input="clearError('firstName')"
            :class="{ error: error.firstName }"
            v-model.trim="activeEmployee.firstName"
          />
        </div>
        <div class="form-control">
          <label for="lastName">Last name</label>
          <input
            autocomplete="off"
            type="text"
            id="lastName"
            @input="clearError('lastName')"
            :class="{ error: error.lastName }"
            v-model.trim="activeEmployee.lastName"
          />
        </div>
      </div>
      <div class="form-control">
        <label for="role">Role</label>
        <base-dropdown
          v-if="activeEmployee.role || this.new"
          :items="roles"
          :active="activeEmployee.role"
          :error="error.role"
          @choice="setRole"
        ></base-dropdown>
      </div>
      <div class="form-control">
        <label for="contract">Contract</label>
        <div class="form-control-contract">
          <div>
            <input
              autocomplete="off"
              type="text"
              id="contract"
              @input="clearError('contract')"
              :class="{ error: error.contract }"
              v-model.trim="activeEmployee.contract"
            />
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
        <input
          autocomplete="off"
          type="text"
          id="email"
          @input="clearError('email')"
          :class="{ error: error.email }"
          v-model.trim="activeEmployee.email"
        />
      </div>
      <div class="form-control">
        <label for="phone">Phone</label>
        <input autocomplete="off" type="text" id="phone" v-model.trim="activeEmployee.phone" />
      </div>
      <div class="form-control notes">
        <label for="notes">Notes</label>
        <textarea id="notes" v-model="activeEmployee.notes"></textarea>
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
      <base-button @click="validate">Save</base-button>
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
      error: {
        firstName: false,
        lastName: false,
        role: false,
        contract: false,
        email: false,
      },
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
      this.activeEmployee.notes = this.employee.notes || ""
    },
    setContractType(value) {
      this.activeEmployee.contractType = value
    },
    setRole(value) {
      this.clearError("role")
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
    validate() {
      if (this.new) {
        // Validate field: firstName
        if (this.activeEmployee.firstName) {
          this.error.firstName = false
        } else {
          this.error.firstName = true
        }

        // Validate field: lastName
        if (this.activeEmployee.lastName) {
          this.error.lastName = false
        } else {
          this.error.lastName = true
        }
      }

      // Validate field: role
      if (this.activeEmployee.role) {
        this.error.role = false
      } else {
        this.error.role = true
      }

      // Validate field: contract
      this.activeEmployee.contract = parseFloat(this.activeEmployee.contract.toString().replace(",", "."))

      if (this.activeEmployee.contract) {
        this.error.contract = false
      } else {
        this.activeEmployee.contract = ""
        this.error.contract = true
      }

      const emailRegex = /^.+@\w+\.\w+$/i

      // Validate field: email
      if (emailRegex.test(this.activeEmployee.email)) {
        this.error.email = false
      } else {
        this.error.email = true
      }

      if (!Object.values(this.error).includes(true)) {
        this.saveEditEmployee()
      }
    },
    async saveEditEmployee() {
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
    clearError(field) {
      this.error[field] = false
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

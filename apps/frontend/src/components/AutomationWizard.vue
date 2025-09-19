<template>
  <div class="space-y-6">
    <!-- Automation List -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-gray-900">Automations</h3>
        <p class="text-sm text-gray-600">What happens when someone submits your form?</p>
      </div>
      <div class="card-content">
        <!-- Empty State -->
        <div v-if="currentForm.automations.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p class="text-gray-500 mb-4">No automations added yet</p>
          <button @click="showAddModal = true" class="btn btn-primary btn-sm">
            Add Automation
          </button>
        </div>

        <!-- Automation List -->
        <div v-else class="space-y-4">
          <div
            v-for="automation in currentForm.automations"
            :key="automation.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-8 h-8 bg-imoya-100 rounded-full flex items-center justify-center">
                    <component :is="getAutomationIcon(automation.type)" class="w-4 h-4 text-imoya-600" />
                  </div>
                  <span class="font-medium text-gray-900">{{ getAutomationTitle(automation.type) }}</span>
                </div>
                
                <div v-if="automation.when" class="text-sm text-gray-600 mb-2">
                  <span class="font-medium">When:</span> {{ automation.when }}
                </div>
                
                <div class="text-sm text-gray-500">
                  {{ getAutomationDescription(automation) }}
                </div>
              </div>
              
              <button
                @click="removeAutomation(automation.id)"
                class="ml-4 text-red-600 hover:text-red-800"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Add Automation Button -->
        <div v-if="currentForm.automations.length > 0" class="pt-4 border-t border-gray-200">
          <button @click="showAddModal = true" class="btn btn-outline btn-sm w-full">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Another Automation
          </button>
        </div>
      </div>
    </div>

    <!-- Add Automation Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Automation</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
              <select v-model="newAutomation.type" class="input w-full">
                <option value="">Select an action...</option>
                <option value="send_email">Send Email</option>
                <option value="append_sheet">Add to Google Sheet</option>
                <option value="slack_notify">Send Slack Message</option>
              </select>
            </div>

            <!-- Email Configuration -->
            <div v-if="newAutomation.type === 'send_email'" class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gmail Credential ID</label>
                <input
                  v-model="newAutomation.config.fromCredentialId"
                  type="text"
                  placeholder="cred:gmail:123"
                  class="input w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subject Template</label>
                <input
                  v-model="newAutomation.config.subject"
                  type="text"
                  placeholder="Thanks {{name}}"
                  class="input w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                <textarea
                  v-model="newAutomation.config.message"
                  placeholder="We received: {{message}}"
                  rows="3"
                  class="input w-full"
                />
              </div>
            </div>

            <!-- Google Sheets Configuration -->
            <div v-if="newAutomation.type === 'append_sheet'" class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sheets Credential ID</label>
                <input
                  v-model="newAutomation.config.sheetCredentialId"
                  type="text"
                  placeholder="cred:gsheets:456"
                  class="input w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Document ID</label>
                <input
                  v-model="newAutomation.config.docId"
                  type="text"
                  placeholder="1AbC..."
                  class="input w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sheet Name</label>
                <input
                  v-model="newAutomation.config.sheetName"
                  type="text"
                  placeholder="Leads"
                  class="input w-full"
                />
              </div>
            </div>

            <!-- Slack Configuration -->
            <div v-if="newAutomation.type === 'slack_notify'" class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Condition (Optional)</label>
                <input
                  v-model="newAutomation.when"
                  type="text"
                  placeholder="{{orderTotal}} > 500"
                  class="input w-full"
                />
                <p class="text-xs text-gray-500 mt-1">Leave empty to always send</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Slack Credential ID</label>
                <input
                  v-model="newAutomation.config.slackCredentialId"
                  type="text"
                  placeholder="cred:slack:789"
                  class="input w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                <input
                  v-model="newAutomation.config.channel"
                  type="text"
                  placeholder="#sales"
                  class="input w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                <textarea
                  v-model="newAutomation.config.text"
                  placeholder="High value lead: {{name}} (${{orderTotal}})"
                  rows="3"
                  class="input w-full"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button @click="cancelAdd" class="btn btn-outline btn-sm">
              Cancel
            </button>
            <button 
              @click="addAutomation" 
              :disabled="!newAutomation.type"
              class="btn btn-primary btn-sm"
            >
              Add Automation
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFormsStore } from '../stores/forms'
import type { Automation } from '../types'

// Icons
import { Mail, FileSpreadsheet, MessageSquare } from 'lucide-vue-next'

const formsStore = useFormsStore()
const { currentForm, addAutomation: addAutomationAction, removeAutomation: removeAutomationAction } = formsStore

const showAddModal = ref(false)
const newAutomation = reactive<Partial<Automation>>({
  type: '',
  config: {},
  when: ''
})

const getAutomationIcon = (type: string) => {
  switch (type) {
    case 'send_email': return Mail
    case 'append_sheet': return FileSpreadsheet
    case 'slack_notify': return MessageSquare
    default: return Mail
  }
}

const getAutomationTitle = (type: string) => {
  switch (type) {
    case 'send_email': return 'Send Email'
    case 'append_sheet': return 'Add to Google Sheet'
    case 'slack_notify': return 'Send Slack Message'
    default: return 'Unknown'
  }
}

const getAutomationDescription = (automation: Automation) => {
  switch (automation.type) {
    case 'send_email':
      return `Send email to {{email}} with subject "${automation.config.subject || 'Thanks {{name}}'}"`
    case 'append_sheet':
      return `Add row to Google Sheet "${automation.config.sheetName || 'Sheet1'}"`
    case 'slack_notify':
      return `Send message to ${automation.config.channel || '#sales'}${automation.when ? ` when ${automation.when}` : ''}`
    default:
      return 'Unknown automation'
  }
}

const addAutomation = () => {
  if (!newAutomation.type) return

  addAutomationAction({
    type: newAutomation.type as any,
    config: newAutomation.config || {},
    when: newAutomation.when
  })

  // Reset form
  newAutomation.type = ''
  newAutomation.config = {}
  newAutomation.when = ''
  showAddModal.value = false
}

const cancelAdd = () => {
  newAutomation.type = ''
  newAutomation.config = {}
  newAutomation.when = ''
  showAddModal.value = false
}
</script>

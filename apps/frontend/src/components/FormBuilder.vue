<template>
  <div class="space-y-6">
    <!-- Form Settings -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-gray-900">Form Settings</h3>
      </div>
      <div class="card-content space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
          <input
            v-model="currentForm.form.title"
            type="text"
            placeholder="Enter form title"
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <textarea
            v-model="currentForm.form.description"
            placeholder="Describe what this form is for"
            rows="3"
            class="input w-full"
          />
        </div>
      </div>
    </div>

    <!-- Form Fields -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-gray-900">Form Fields</h3>
        <p class="text-sm text-gray-600">Add fields to collect information from your users</p>
      </div>
      <div class="card-content">
        <!-- Field List -->
        <div v-if="currentForm.form.fields.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-500 mb-4">No fields added yet</p>
          <button @click="addField" class="btn btn-primary btn-sm">
            Add Your First Field
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="field in currentForm.form.fields"
            :key="field.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="flex-1">
                    <input
                      v-model="field.label"
                      type="text"
                      placeholder="Field label"
                      class="input w-full"
                    />
                  </div>
                  <select
                    v-model="field.type"
                    class="input w-32"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="textarea">Textarea</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                <div v-if="field.type === 'select'" class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Options (one per line)</label>
                  <textarea
                    v-model="fieldOptionsText[field.id]"
                    @input="updateFieldOptions(field.id, $event.target.value)"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows="3"
                    class="input w-full"
                  />
                </div>

                <div class="flex items-center space-x-4">
                  <label class="flex items-center">
                    <input
                      v-model="field.required"
                      type="checkbox"
                      class="rounded border-gray-300 text-imoya-600 focus:ring-imoya-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Required</span>
                  </label>
                  <div class="flex-1">
                    <input
                      v-model="field.placeholder"
                      type="text"
                      placeholder="Placeholder text"
                      class="input w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                @click="removeField(field.id)"
                class="ml-4 text-red-600 hover:text-red-800"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Add Field Button -->
        <div class="pt-4 border-t border-gray-200">
          <button @click="addField" class="btn btn-outline btn-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Field
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormsStore } from '../stores/forms'
import type { Field } from '../types'

const formsStore = useFormsStore()
const { currentForm, addField: addFieldAction, removeField: removeFieldAction, updateField } = formsStore

const fieldOptionsText = ref<Record<string, string>>({})

const addField = () => {
  addFieldAction({
    type: 'text',
    label: 'New Field',
    required: false,
    placeholder: ''
  })
}

const removeField = (fieldId: string) => {
  removeFieldAction(fieldId)
  delete fieldOptionsText.value[fieldId]
}

const updateFieldOptions = (fieldId: string, text: string) => {
  const options = text.split('\n').filter(opt => opt.trim())
  updateField(fieldId, { options })
}

// Initialize field options text
const initializeFieldOptions = () => {
  currentForm.form.fields.forEach(field => {
    if (field.type === 'select' && field.options) {
      fieldOptionsText.value[field.id] = field.options.join('\n')
    }
  })
}

// Watch for field type changes
const handleFieldTypeChange = (fieldId: string, newType: string) => {
  if (newType === 'select' && !fieldOptionsText.value[fieldId]) {
    fieldOptionsText.value[fieldId] = ''
  } else if (newType !== 'select') {
    delete fieldOptionsText.value[fieldId]
    updateField(fieldId, { options: undefined })
  }
}

// Initialize on mount
initializeFieldOptions()
</script>

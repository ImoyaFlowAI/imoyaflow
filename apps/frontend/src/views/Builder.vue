<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Form Builder</h1>
            <p class="text-gray-600 mt-2">Create forms and automations that work like magic</p>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="saveForm" 
              :disabled="isLoading"
              class="btn btn-outline btn-md"
            >
              <svg v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ isLoading ? 'Saving...' : 'Save' }}
            </button>
            <button 
              @click="compileAndPush" 
              :disabled="!canCompile || isLoading"
              class="btn btn-primary btn-md"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Publish
            </button>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Form Builder -->
        <div class="lg:col-span-2">
          <FormBuilder />
        </div>

        <!-- Automation Panel -->
        <div class="lg:col-span-1">
          <AutomationWizard />
        </div>
      </div>

      <!-- Compiled Workflow Preview -->
      <div v-if="compiledWorkflow" class="mt-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Compiled Workflow</h3>
            <p class="text-sm text-gray-600">This is the n8n workflow generated from your form and automations</p>
          </div>
          <div class="card-content">
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">{{ JSON.stringify(compiledWorkflow, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFormsStore } from '../stores/forms'
import FormBuilder from '../components/FormBuilder.vue'
import AutomationWizard from '../components/AutomationWizard.vue'

const route = useRoute()
const formsStore = useFormsStore()

const { 
  currentForm, 
  compiledWorkflow, 
  isLoading, 
  error, 
  canCompile,
  loadForm,
  saveForm: saveFormAction,
  compileForm,
  pushToN8n,
  resetForm
} = formsStore

// Load form if editing
onMounted(async () => {
  const formId = route.params.formId as string
  if (formId) {
    try {
      await loadForm(formId)
    } catch (err) {
      console.error('Failed to load form:', err)
    }
  } else {
    // New form - set a default ID
    formsStore.setFormId(`form_${Date.now()}`)
  }
})

async function saveForm() {
  try {
    await saveFormAction()
    console.log('Form saved successfully')
  } catch (err) {
    console.error('Failed to save form:', err)
  }
}

async function compileAndPush() {
  try {
    // First save the form
    await saveFormAction()
    
    // Then compile
    await compileForm()
    
    // Then push to n8n
    const result = await pushToN8n()
    console.log('Form published successfully:', result)
  } catch (err) {
    console.error('Failed to publish form:', err)
  }
}
</script>

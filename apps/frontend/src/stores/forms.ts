import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'
import type { HybridDefinition, Field, Automation } from '../types'

export const useFormsStore = defineStore('forms', () => {
  // State
  const currentForm = ref<HybridDefinition>({
    form: {
      id: '',
      title: '',
      description: '',
      fields: []
    },
    automations: []
  })

  const compiledWorkflow = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasFields = computed(() => currentForm.value.form.fields.length > 0)
  const hasAutomations = computed(() => currentForm.value.automations.length > 0)
  const canCompile = computed(() => hasFields.value && hasAutomations.value)

  // Actions
  function setFormId(id: string) {
    currentForm.value.form.id = id
  }

  function updateFormTitle(title: string) {
    currentForm.value.form.title = title
  }

  function updateFormDescription(description: string) {
    currentForm.value.form.description = description
  }

  function addField(field: Omit<Field, 'id'>) {
    const newField: Field = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...field
    }
    currentForm.value.form.fields.push(newField)
  }

  function updateField(fieldId: string, updates: Partial<Field>) {
    const field = currentForm.value.form.fields.find(f => f.id === fieldId)
    if (field) {
      Object.assign(field, updates)
    }
  }

  function removeField(fieldId: string) {
    const index = currentForm.value.form.fields.findIndex(f => f.id === fieldId)
    if (index > -1) {
      currentForm.value.form.fields.splice(index, 1)
    }
  }

  function addAutomation(automation: Omit<Automation, 'id'>) {
    const newAutomation: Automation = {
      id: `automation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...automation
    }
    currentForm.value.automations.push(newAutomation)
  }

  function updateAutomation(automationId: string, updates: Partial<Automation>) {
    const automation = currentForm.value.automations.find(a => a.id === automationId)
    if (automation) {
      Object.assign(automation, updates)
    }
  }

  function removeAutomation(automationId: string) {
    const index = currentForm.value.automations.findIndex(a => a.id === automationId)
    if (index > -1) {
      currentForm.value.automations.splice(index, 1)
    }
  }

  async function saveForm() {
    if (!currentForm.value.form.id) {
      currentForm.value.form.id = `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    try {
      isLoading.value = true
      error.value = null
      
      await api.post('/forms', {
        definition: currentForm.value
      })
      
      return currentForm.value.form.id
    } catch (err: any) {
      error.value = err.message || 'Failed to save form'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function compileForm() {
    if (!currentForm.value.form.id) {
      throw new Error('Form must be saved before compiling')
    }

    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.post('/forms/compile', {
        formId: currentForm.value.form.id
      })
      
      compiledWorkflow.value = response.data.compiled
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to compile form'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function pushToN8n() {
    if (!currentForm.value.form.id) {
      throw new Error('Form must be saved before pushing to n8n')
    }

    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.post(`/forms/${currentForm.value.form.id}/push-to-n8n`)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to push to n8n'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function loadForm(formId: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.get(`/forms/${formId}`)
      currentForm.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to load form'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function resetForm() {
    currentForm.value = {
      form: {
        id: '',
        title: '',
        description: '',
        fields: []
      },
      automations: []
    }
    compiledWorkflow.value = null
    error.value = null
  }

  return {
    // State
    currentForm,
    compiledWorkflow,
    isLoading,
    error,
    
    // Getters
    hasFields,
    hasAutomations,
    canCompile,
    
    // Actions
    setFormId,
    updateFormTitle,
    updateFormDescription,
    addField,
    updateField,
    removeField,
    addAutomation,
    updateAutomation,
    removeAutomation,
    saveForm,
    compileForm,
    pushToN8n,
    loadForm,
    resetForm
  }
})

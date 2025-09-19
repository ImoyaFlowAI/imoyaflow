<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Form Templates</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Get started quickly with our pre-built templates. Each template includes a form and automations ready to use.
        </p>
      </div>

      <!-- Template Categories -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category
              ? 'bg-imoya-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Templates Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="useTemplate(template)"
        >
          <div class="card-content">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-imoya-100 rounded-lg flex items-center justify-center">
                <component :is="getTemplateIcon(template.category)" class="w-6 h-6 text-imoya-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ template.name }}</h3>
                <p class="text-sm text-gray-500">{{ template.category }}</p>
              </div>
            </div>
            
            <p class="text-gray-600 mb-4">{{ template.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ template.definition.form.fields.length }} fields
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ template.definition.automations.length }} automations
              </div>
            </div>
            
            <button class="btn btn-primary btn-sm w-full">
              Use This Template
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTemplates.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
        <p class="text-gray-500">Try selecting a different category or create your own form.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFormsStore } from '../stores/forms'
import type { Template } from '../types'

// Icons
import { 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  FileText, 
  Calendar,
  Heart
} from 'lucide-vue-next'

const router = useRouter()
const formsStore = useFormsStore()
const { resetForm } = formsStore

const selectedCategory = ref('All')

const categories = ['All', 'Lead Generation', 'E-commerce', 'Customer Support', 'Events', 'Healthcare']

const templates: Template[] = [
  {
    id: 'lead-capture',
    name: 'Lead Capture Form',
    description: 'Collect leads with contact information and automatically send follow-up emails and add to your CRM.',
    category: 'Lead Generation',
    definition: {
      form: {
        id: 'lead-capture-form',
        title: 'Lead Capture Form',
        description: 'Get in touch with us and we\'ll reach out soon!',
        fields: [
          { id: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
          { id: 'email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
          { id: 'company', type: 'text', label: 'Company', required: false, placeholder: 'Your company name' },
          { id: 'phone', type: 'text', label: 'Phone Number', required: false, placeholder: 'Your phone number' },
          { id: 'message', type: 'textarea', label: 'Message', required: false, placeholder: 'Tell us about your project' },
          { id: 'budget', type: 'select', label: 'Budget Range', required: false, options: ['Under $5k', '$5k - $10k', '$10k - $25k', '$25k+'] }
        ]
      },
      automations: [
        {
          id: 'email-confirmation',
          type: 'send_email',
          config: {
            fromCredentialId: 'cred:gmail:123',
            subject: 'Thanks for your interest, {{name}}!',
            message: 'Hi {{name}},\n\nThank you for reaching out! We\'ll review your message and get back to you within 24 hours.\n\nBest regards,\nThe Team'
          }
        },
        {
          id: 'add-to-sheets',
          type: 'append_sheet',
          config: {
            sheetCredentialId: 'cred:gsheets:456',
            docId: '1AbC...',
            sheetName: 'Leads'
          }
        },
        {
          id: 'slack-notify',
          type: 'slack_notify',
          when: '{{budget}} === "$25k+"',
          config: {
            slackCredentialId: 'cred:slack:789',
            channel: '#sales',
            text: '🔥 High-value lead: {{name}} from {{company}} ({{budget}})'
          }
        }
      ]
    }
  },
  {
    id: 'contact-form',
    name: 'Contact Us Form',
    description: 'Simple contact form with email notifications and automatic ticket creation.',
    category: 'Customer Support',
    definition: {
      form: {
        id: 'contact-form',
        title: 'Contact Us',
        description: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
        fields: [
          { id: 'name', type: 'text', label: 'Name', required: true, placeholder: 'Your name' },
          { id: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
          { id: 'subject', type: 'text', label: 'Subject', required: true, placeholder: 'What\'s this about?' },
          { id: 'message', type: 'textarea', label: 'Message', required: true, placeholder: 'Your message here...' },
          { id: 'priority', type: 'select', label: 'Priority', required: false, options: ['Low', 'Medium', 'High', 'Urgent'] }
        ]
      },
      automations: [
        {
          id: 'email-owner',
          type: 'send_email',
          config: {
            fromCredentialId: 'cred:gmail:123',
            subject: 'New Contact Form: {{subject}}',
            message: 'New contact form submission:\n\nName: {{name}}\nEmail: {{email}}\nSubject: {{subject}}\nPriority: {{priority}}\n\nMessage:\n{{message}}'
          }
        },
        {
          id: 'add-to-sheets',
          type: 'append_sheet',
          config: {
            sheetCredentialId: 'cred:gsheets:456',
            docId: '1AbC...',
            sheetName: 'Support Tickets'
          }
        }
      ]
    }
  },
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Register for events with automatic confirmation emails and attendee tracking.',
    category: 'Events',
    definition: {
      form: {
        id: 'event-registration',
        title: 'Event Registration',
        description: 'Join us for an amazing event! Register below to secure your spot.',
        fields: [
          { id: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Your full name' },
          { id: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
          { id: 'phone', type: 'text', label: 'Phone', required: true, placeholder: 'Your phone number' },
          { id: 'company', type: 'text', label: 'Company/Organization', required: false, placeholder: 'Your company' },
          { id: 'dietary', type: 'textarea', label: 'Dietary Requirements', required: false, placeholder: 'Any dietary restrictions or allergies?' },
          { id: 'ticket-type', type: 'select', label: 'Ticket Type', required: true, options: ['General Admission', 'VIP', 'Student', 'Group (5+)'] }
        ]
      },
      automations: [
        {
          id: 'confirmation-email',
          type: 'send_email',
          config: {
            fromCredentialId: 'cred:gmail:123',
            subject: 'Event Registration Confirmed - {{name}}',
            message: 'Hi {{name}},\n\nThank you for registering for our event! Your ticket type: {{ticket-type}}\n\nWe\'ll send you more details closer to the event date.\n\nBest regards,\nEvent Team'
          }
        },
        {
          id: 'add-to-sheets',
          type: 'append_sheet',
          config: {
            sheetCredentialId: 'cred:gsheets:456',
            docId: '1AbC...',
            sheetName: 'Event Attendees'
          }
        },
        {
          id: 'slack-notify',
          type: 'slack_notify',
          when: '{{ticket-type}} === "VIP"',
          config: {
            slackCredentialId: 'cred:slack:789',
            channel: '#events',
            text: '⭐ VIP registration: {{name}} from {{company}}'
          }
        }
      ]
    }
  }
]

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'All') {
    return templates
  }
  return templates.filter(template => template.category === selectedCategory.value)
})

const getTemplateIcon = (category: string) => {
  switch (category) {
    case 'Lead Generation': return Users
    case 'E-commerce': return ShoppingCart
    case 'Customer Support': return MessageSquare
    case 'Events': return Calendar
    case 'Healthcare': return Heart
    default: return FileText
  }
}

const useTemplate = (template: Template) => {
  // Reset current form and load template
  resetForm()
  formsStore.currentForm = { ...template.definition }
  formsStore.setFormId(`form_${Date.now()}`)
  
  // Navigate to builder
  router.push('/builder')
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-imoya-50 to-primary-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Where data moves like
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-imoya-600 to-primary-600">
              air
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build powerful workflows with the simplicity of forms. 
            Connect your tools, automate your processes, and breathe life into your business.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/builder" class="btn btn-primary btn-lg">
              Start Building
            </router-link>
            <router-link to="/templates" class="btn btn-outline btn-lg">
              Browse Templates
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Simple forms meet powerful automation
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Create forms as easy as breathing, then watch your data flow through powerful workflows automatically.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-imoya-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-imoya-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Drag & Drop Forms</h3>
            <p class="text-gray-600">
              Build beautiful forms with our intuitive drag-and-drop builder. No coding required.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Powerful Automation</h3>
            <p class="text-gray-600">
              Connect to 500+ apps and services. Send emails, update sheets, notify teams automatically.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p class="text-gray-600">
              Describe what you want in plain English. Our AI will build the workflow for you.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p class="text-lg text-gray-600">
            Three simple steps to automate your workflows
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-imoya-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Create Your Form</h3>
            <p class="text-gray-600">
              Use our drag-and-drop builder to create beautiful forms with fields, validation, and styling.
            </p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-imoya-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Add Automations</h3>
            <p class="text-gray-600">
              Choose what happens when someone submits your form. Send emails, update databases, notify teams.
            </p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-imoya-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Publish & Watch</h3>
            <p class="text-gray-600">
              Share your form and watch as submissions automatically trigger your workflows. It's that simple.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-imoya-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          Ready to breathe life into your workflows?
        </h2>
        <p class="text-xl text-imoya-100 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses already using Imoya Flow to automate their processes.
        </p>
        <router-link to="/builder" class="btn bg-white text-imoya-600 hover:bg-gray-100 btn-lg">
          Get Started Free
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Home page setup
</script>

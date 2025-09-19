<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-imoya-500 to-imoya-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">I</span>
              </div>
              <span class="text-xl font-bold text-gray-900">Imoya Flow</span>
            </router-link>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link 
              to="/templates" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Templates
            </router-link>
            <router-link 
              to="/builder" 
              class="btn btn-primary btn-md"
            >
              Create Form
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-16">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 Imoya Flow. Where data moves like air.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// App setup
</script>

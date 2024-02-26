<script setup>
const nav = [
  { label: 'Home', to: '/' },
  { label: 'Basic Setup', to: '/basic-setup' },
  { label: 'Categorize', to: '/categorize' },
  { label: 'Manipulating Objects', to: '/manipulating-objects' },
  { label: 'Measurements Extension', to: '/measurement-tool' },
  { label: 'Object Loader', to: '/obj-loader' },
]
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-container class="d-flex align-center">
        <v-btn
          v-for="link in nav"
          :key="link.label"
          :text="link.label"
          variant="text"
          :href="link.to"
        />
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet min-height="90vh" rounded="lg">
              <slot />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

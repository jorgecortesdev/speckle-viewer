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
  <div>
    <ul>
      <li v-for="link in nav" :key="link.label">
        <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
      </li>
    </ul>
    <slot />
  </div>
</template>

<style scoped>
ul {
  display: flex;
  gap: 10px;
}
ul > li {
  list-style-type: none;
}
</style>

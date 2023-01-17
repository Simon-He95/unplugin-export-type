<script setup lang="ts">
import type { Props } from '../common'
import { isDark, toggleDark } from '~/composables'
const { name } = defineProps<Props>()
</script>

<template>
  <nav text-xl mt-6 inline-flex gap-2>
    {{ name }} {{ age }}
    <button class="icon-btn !outline-none" @click="toggleDark()">
      <div v-if="isDark" i-carbon-moon />
      <div v-else i-carbon-sun />
    </button>

    <a
      class="icon-btn"
      i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/Simon-He95/my-vitesse-app"
      target="_blank"
      title="GitHub"
    />
  </nav>
</template>

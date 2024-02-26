<script setup>
import { ref } from 'vue';
import BasicSetup from '@/components/BasicSetup.vue';
import Categorize from '@/components/Categorize.vue';
import ManipulatingObjects from '@/components/ManipulatingObjects.vue';
import MeasurementsExtensionTool from '@/components/MeasurementsExtensionTool.vue';
import ObjLoader from '@/components/ObjLoader.vue';

const selectedTab = ref(null);
const tabs = [
  { anchor: 'basic', label: 'Basic Setup', component: BasicSetup },
  { anchor: 'categorize', label: 'Categorize', component: Categorize },
  // { anchor: 'manipulating', label: 'Manipulating Objects', components: ManipulatingObjects },
  // { anchor: 'MeasurementsExtensionTool', label: 'Measurement Extension', components: MeasurementsExtensionTool },
  // { anchor: 'object-loader', label: 'Object Loader', component: ObjLoader },
];
</script>

<template>
  <div>
    <BasicSetup />
    <!-- <v-app-bar class="px-3" flat density="compact">
      <v-tabs v-model="selectedTab" centered color="grey-darken-2">
        <v-tab v-for="tab in tabs" :key="`tab-anchor-${tab.anchor}`" :value="tab.anchor">
          {{  tab.anchor }}
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3" style="min-height: 100vh;">
      <v-window v-model="selectedTab">
        <v-window-item v-for="tab in tabs" :key="`tab-component-${tab.anchor}`" :value="tab.anchor">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-sheet rounded="lg">
                  <component
                    :is="tab.component"
                    :key="selectedTab"
                  />
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
    </v-main> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  Viewer,
  DefaultViewerParams,
  ObjLoader,
  CameraController,
  SelectionExtension
} from "@speckle/viewer";
import { d20_obj_contents } from "../data/d20.ts";

const isLoading = ref(false);

async function loadObject() {
  isLoading.value = true;

  const container = document.getElementById("obj-loader");
  const params = DefaultViewerParams;
  params.showStats = true;
  params.verbose = true;

  const viewer = new Viewer(container, params);

  await viewer.init();

  viewer.createExtension(CameraController);
  viewer.createExtension(SelectionExtension);

  const loader = new ObjLoader(viewer.getWorldTree(), "d20", d20_obj_contents);

  await viewer.loadObject(loader, 1);

  isLoading.value = false;
}

onMounted(() => {
  loadObject();
});
</script>

<template>
  <v-card flat>
    <v-card-title>Object Loader</v-card-title>
    <v-card-subtitle>Speckle Viewer Sample</v-card-subtitle>
    <v-card-text>
      <div id="obj-loader" style="height:70vh;"></div>
      <v-progress-linear color="primary" height="10" rounded indeterminate v-if="isLoading" />
    </v-card-text>
  </v-card>
</template>

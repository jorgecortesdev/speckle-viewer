<script setup>
import { ref } from 'vue';
import {
  Viewer,
  DefaultViewerParams,
  SpeckleLoader,
  CameraController,
  SelectionExtension
} from "@speckle/viewer";

const isLoading = ref(false);

async function loadObject() {
  isLoading.value = true;

  const container = document.getElementById("basic-setup");
  const params = DefaultViewerParams;
  params.showStats = true;
  params.verbose = true;

  const viewer = new Viewer(container, params);

  await viewer.init();

  viewer.createExtension(CameraController);
  viewer.createExtension(SelectionExtension);

  const loader = new SpeckleLoader(
    viewer.getWorldTree(),
    "https://latest.speckle.dev/streams/c43ac05d04/objects/d807f3888a400dbd814529fafd8ccac0",
    ""
  );

  await viewer.loadObject(loader, 1);

  isLoading.value = false;
}

onMounted(() => {
  loadObject();
});
</script>

<template>
  <v-card flat>
    <v-card-title>Basic Setup</v-card-title>
    <v-card-subtitle>Speckle Viewer Sample</v-card-subtitle>
    <v-card-text>
      <div id="basic-setup" style="height: 80vh;"></div>
      <v-progress-linear color="primary" height="10" rounded indeterminate v-if="isLoading" />
    </v-card-text>
  </v-card>
</template>

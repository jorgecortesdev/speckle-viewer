<script setup>
import { ref } from 'vue';
import {
  Viewer,
  DefaultViewerParams,
  SpeckleLoader,
  CameraController,
  SelectionExtension
} from "@speckle/viewer";
import { Categorize } from "../utils/Categorize.ts";

const isLoading = ref(false);

async function loadObject() {
  isLoading.value = true;

  const container = document.getElementById("categorize");
  const params = DefaultViewerParams;
  params.showStats = true;
  params.verbose = true;

  const viewer = new Viewer(container, params);

  await viewer.init();

  viewer.createExtension(CameraController);
  viewer.createExtension(SelectionExtension);

  const categorize = viewer.createExtension(Categorize);

  const loader = new SpeckleLoader(
    viewer.getWorldTree(),
    "https://speckle.xyz/streams/da9e320dad/objects/31d10c0cea569a1e26809658ed27e281",
    ""
  );

  await viewer.loadObject(loader, 1);

  categorize.run();

  isLoading.value = false;
}

onMounted(() => {
  loadObject();
});
</script>

<template>
  <v-card flat>
    <v-card-title>Categorize</v-card-title>
    <v-card-subtitle>Speckle Viewer Sample</v-card-subtitle>
    <v-card-text>
      <div id="categorize" style="height:60vh;"></div>
      <v-progress-linear color="primary" height="10" rounded indeterminate v-if="isLoading" />
    </v-card-text>
  </v-card>
</template>

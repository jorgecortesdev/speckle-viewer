<script setup>
import { ref } from 'vue';
import {
  Viewer,
  DefaultViewerParams,
  CameraController,
  MeasurementsExtension,
  SpeckleLoader,
  MeasurementType,
} from "@speckle/viewer";

const isLoading = ref(false);

async function loadObject() {
  isLoading.value = true;

  const container = document.getElementById("measurements-extension-tool");
  const params = DefaultViewerParams;
  params.showStats = true;
  params.verbose = true;

  const viewer = new Viewer(container, params);

  await viewer.init();

  viewer.createExtension(CameraController);

  const measurements = viewer.createExtension(MeasurementsExtension);

  const loader = new SpeckleLoader(
    viewer.getWorldTree(),
    "https://latest.speckle.dev/streams/92b620fb17/objects/32978115e9bb09a43407d535ea313a09",
    ""
  );

  await viewer.loadObject(loader, 1);

  const measurementsParams = {
    type: MeasurementType.POINTTOPOINT, //MeasurementType.PERPENDICULAR
    vertexSnap: true, // false
    units: "m", // "cm, in, ft, mi"
    precision: 2,
  };
  measurements.enabled = true;
  measurements.options = measurementsParams;

  isLoading.value = false;
}

onMounted(() => {
  loadObject();
});
</script>

<template>
  <v-card flat>
    <v-card-title>Measurements Extension</v-card-title>
    <v-card-subtitle>Speckle Viewer Sample</v-card-subtitle>
    <v-card-text>
      <div id="measurements-extension-tool" style="height:70vh;"></div>
      <v-progress-linear color="primary" height="10" rounded indeterminate v-if="isLoading" />
    </v-card-text>
  </v-card>
</template>

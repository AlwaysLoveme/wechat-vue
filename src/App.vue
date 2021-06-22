<template>
  <f7-app v-bind="params">
    <!-- Your main view, should have "view-main" class -->
    <f7-view
      main
      url="/"
      browserHistory
      class="safe-areas"
      browserHistorySeparator="#"
    ></f7-view>
  </f7-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import routes from "@/f7routes";
import { Framework7Parameters } from "framework7/types";

export default defineComponent({
  name: "App",
  setup() {
    const params: Framework7Parameters = {
      theme: "ios",
      routes,
      iosTranslucentBars: false,
      // lazy load
      lazy: {
        placeholder: "",
        threshold: 0,
        sequential: true,
      },
      touch: {
        iosTouchRipple: true,
      },
    };

    return {
      params,
    };
  },
});
</script>

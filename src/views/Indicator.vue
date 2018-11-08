<template>
    <v-alert v-if="show"
             :value="true"
             :color="color"
             :icon="icon"
             outline>
        {{message}}
    </v-alert>
</template>

<script>
  import Vue from 'vue';
  import {IndicatorType} from "./IndicatorType";

  export default Vue.extend({
    name: 'indicator',
    props: ['message', 'type', /*'timeout'*/],
    data() {
      return {
        timeoutFinished: false,
        timeoutHandle: undefined
      };
    },
    computed: {
      color: function () {
        switch (this.type) {
          case IndicatorType.error:
            return "error";
          case IndicatorType.success:
            return "success";
        }
      },
      icon: function () {
        switch (this.type) {
          case IndicatorType.error:
            return "warning";
          case IndicatorType.success:
            return "check_circle";
        }
      },
      /*saneTimeout: function () {
        if (this.timeout === null || this.timeout === undefined) return 0;
        return this.timeout;
      },
      hasTimeout: function () {
        return this.saneTimeout > 0;
      },*/
      show: function () {
        /*const res = !!this.message && (!this.hasTimeout || !this.timeoutFinished);
        console.log(res);
        return res;*/
        return !!this.message;
      }
    },
    /*watch: {
      message: function (newValue, oldValue) {
        if (!this.hasTimeout) return;
        this.startTimeout();
      }
    },
    methods: {
      startTimeout() {
        this.stopTimeout();
        this.timeoutHandle = setTimeout(() => this.timeoutFinished = false, this.timeout * 1000);
      },
      stopTimeout() {
        this.timeoutFinished = false;
        if (this.timeoutHandle === undefined) return;
        clearTimeout(this.timeoutHandle);
        this.timeoutHandle = undefined;
      }
    }*/
  });

</script>

<style scoped>

</style>

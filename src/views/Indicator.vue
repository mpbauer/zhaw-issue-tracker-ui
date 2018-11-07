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
    props: [ 'message', 'type' ],
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
        show: function () {
            return !!this.message;
        }
    }
});

</script>

<style scoped>

</style>
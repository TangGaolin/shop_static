<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
    created() {
        this.getConfig()
    },
    methods: {
        getConfig(){
            this.$store.dispatch('getConfigAction')
        }
    }
}
</script>

<style>
#app {
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: 0px;
  width: 100%;
  font-size: 12px;
}
    .content {
        width: auto;
        padding-top: 20px;
        margin-left: 55px;
        margin-right: 55px;
        font-size: 14px;
    }

</style>

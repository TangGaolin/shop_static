<style>
</style>
<template>
        <Button :type=type :size= size>
            <router-link :to = to target="_blank">{{name}}</router-link>
        </Button>
</template>
<script>
    export default {
        props: {
            to: String,
            size: String,
            type: String,
            name: String
        }
    }

</script>
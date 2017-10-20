<template>
    <div class="content">
        <DataView></DataView>
        <OrderTimeTable :empData = empData></OrderTimeTable>
        <br/>
        <br/>
    </div>
</template>

<script>
    export default {
        props: {
            empData: Array
        },
        data() {
            return {
            }
        }
    }
</script>
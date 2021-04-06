<template>
<div id="start">
    <input type="text" style="width:200px;" v-model="url">
    <button @click="enter">点击进入</button>
</div>
</template>

<script>
export default {
    data() {
        return {
            url: 'https://www.hao123.com'
        }
    },
    methods: {
        enter() {
            console.log(this.$router)
            this.$router.push({
                path: '/home',
                query: {
                    url: this.url
                }
            })
        }
    }
}
</script>

<style>
#start {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>

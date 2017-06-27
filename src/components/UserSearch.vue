<style>
    .user-search {
        width: 400px;
        margin: 0px auto;
        position: relative;
    }
    .search-input{
        width: 400px;
    }
    .search-res {
        box-sizing: border-box;
        z-index: 999;
        width: 400px;
        position: absolute;
        background: #fff;
    }

    .search-res ul{
        margin-top: 2px;
        border-radius: 3px;
        border: 1px solid #ccc;
    }

    .search-res li {
        line-height: 32px;
        vertical-align: middle;
        font-size: 16px;
        padding-left: 15px;
        width: 100%
    }
</style>
<template>
    <div class="user-search">
        <Input v-model="value4"  placeholder="姓名/手机号..." size="large" icon="ios-search"  class = "search-input" style="border-radius: 0px"></Input>
        <div class="search-res">
            <ul>
                <li v-for="item  in searchRes" @click="chooseUser(item.uid)">
                    {{item.user_name}} &nbsp;&nbsp; {{item.phone_no}} &nbsp;&nbsp;
                </li>
            </ul>
        </div>

    </div>
</template>
<script>
    export default {
        props: {
//            storeList: Array
        },
        data () {
            return {
                searchRes: [
//                   {
//                        uid:1234,
//                        user_name:"张晓",
//                        phone_no:"13247719350",
//                        emp_name:"小红"
//                   },
//                   {
//                        uid:1235,
//                        user_name:"小丽",
//                        phone_no:"13247719351",
//                        emp_name:"小白"
//                   }
                ],
            }
        },
        methods: {
            handleSuccess (res, file) {
                // 因为上传过程为实例，这里模拟添加 url
                this.$Message.success("导入成功！")
                this.importEmployee = false
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            chooseUser (uid) {

            }
        }
    }
</script>

<style>
    .user-search {
        margin: 0px auto;
        position: relative
    }
    .search-input{

    }
    .search-res {
        box-sizing: border-box;
        z-index: 999;
        position: absolute;
        background: #fff;
        width: 100%
    }
    .search-res ul{
        margin-top: 2px;
        border-radius: 3px;
        border: 1px solid #ccc;
    }

    .search-res li {
        line-height: 28px;
        vertical-align: middle;
        font-size: 14px;
        padding-left: 15px;
    }
</style>
<template>
    <div class="user-search">
        <Input v-model="user_name_phone"  placeholder="会员姓名/手机号..."  icon="ios-search"  class = "search-input" style="border-radius: 0px"></Input>
        <div class="search-res" v-show="false">
            <ul>
                <li v-for="item in searchRes" @click="chooseUser(item.uid)">
                    {{item.user_name}} &nbsp; {{item.phone_no}} &nbsp;
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
                user_name_phone: "",
                searchRes: [
                   {
                        uid:1234,
                        user_name:"张晓",
                        phone_no:"13247719350",
                        emp_name:"小红"
                   },
                   {
                        uid:1235,
                        user_name:"小丽",
                        phone_no:"13247719351",
                        emp_name:"小白"
                   }
                ],
            }
        },
        methods: {

            chooseUser (uid) {

            }
        }
    }
</script>

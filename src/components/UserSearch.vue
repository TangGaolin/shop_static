<style>
    .user-search {
        margin: 0px auto;
        position: relative
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

    .search-res li{
        line-height: 28px;
        vertical-align: middle;
        font-size: 14px;
        /*padding-left: 15px;*/
        text-align: center
    }
</style>
<template>
    <div class="user-search">
        <Input v-model="user_name_phone"  placeholder="会员姓名/手机...回车"  icon="ios-search"   style="border-radius: 0px"  @on-enter="searchUser" @on-focus = "searchUser"></Input>
        <div class="search-res" v-if="searchResModel">
            <ul>
                <li v-if = "0 == searchRes.length" style="text-align: center">
                    没有记录
                </li>
                <li v-for="item in searchRes" >
                    <Button type="text" size="large" @click="chooseUser(item.uid)">{{item.user_name}} &nbsp; {{item.phone_no}}</Button>
                </li>

                <li>
                    <Button long size="small" icon="ios-close-outline" @click = "closeSearchModel()">关  闭</Button>
                </li>
            </ul>
        </div>

    </div>
</template>
<script>
    import { searchUserList } from '../api/api'
    export default {

        props: {
            shopConfig: Object
        },
        data () {
            return {
                user_name_phone: "",
                searchResModel: false,
                searchRes: [],
            }
        },
        methods: {
            searchUser() {
                if("" === this.user_name_phone){
                    return;
                }
                searchUserList({
                    user_name_phone: this.user_name_phone,
                    shop_id: this.shopConfig.shop_id
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.searchRes = response.data.data
                    }
                    this.searchResModel = true
                }).catch((error) => {
                    console.log(error)
                })
            },

            closeSearchModel() {
                this.searchResModel = false
            },
            chooseUser (uid) {
                this.$router.push('/user-controller?uid=' + uid)
                this.closeSearchModel()
            }
        }
    }
</script>

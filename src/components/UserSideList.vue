<style>
.user-list p{
    font-size: 14px;
    text-align: center;

}
</style>
<template>
    <div class="user-list">
        <Collapse >
            <Panel name="1">
                预约顾客
                <ul slot="content">

                </ul>
            </Panel>
            <Panel name="2">
                生日提醒
                <p slot="content">

                </p>
            </Panel>
            <Panel name="3" >
                今日顾客 ( {{ sideUsers.today_user.length }} )
                <p slot="content" v-for="user in sideUsers.today_user">
                    <Button type="text" size="large" @click="chooseUser(user.uid)"> {{user.user_name}} &nbsp; {{user.phone_no}}</Button>
                </p>
            </Panel>
        </Collapse>
    </div>
</template>
<script>
    import { getShopSideUsers } from '../api/api'
    export default {

        props: {
            shopConfig: Object
        },
        data () {
            return {

                sideUsers: {},
            }
        },
        created() {
            this.getShopSideUsers()
        },
        methods: {
            getShopSideUsers() {
                getShopSideUsers({
                    shop_id: this.shopConfig.shop_id
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.sideUsers = response.data
                    }
                    this.searchResModel = true
                }).catch((error) => {
                    console.log(error)
                })
            },
            chooseUser (uid) {
                this.$router.push('/user-controller?uid=' + uid)
            }
        }
    }
</script>

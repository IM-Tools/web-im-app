<template>
    <el-dialog :lock-scroll="false" :modal="false" title="添加好友" v-model="ChumAddVisible" width="500px" @close="$emit('update:ChumAddVisible', false)">
        <el-form :model="numberValidateForm">
            <el-input ref="numberValidateForm" label-width="100px" class="demo-ruleForm" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchFrom.keyword" @keyup.enter="searchGoods" @mouseleave="searchGoods"> </el-input>
        </el-form>
        <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%; overflow: auto" @selection-change="handleSelectionChange">
            <el-table-column prefix-icon="el-icon-search" label="选择需要添加的好友" style="width: 100%; overflow: auto">
                <template class="row scope-row" #default="scope">
                    <img :src="scope.row.avatar" />
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prefix-icon="el-icon-search" label="操作" style="width: 100%; overflow: auto">
                <template class="row scope-row" #default="scope">
           
                <el-button v-if="scope.row.status==''"  @click="addFriend(scope.row)" type="text" size="small">添加</el-button>
                <span v-else>等待申请通过</span>
                </template>
            </el-table-column>

            
        </el-table>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import { addFriendRequest } from '../api/friends';
export default {
    name: 'Friend',
    data() {
        return {
            searchFrom: {
                keyword: undefined,
            },
            multipleSelection: [],
            list: [],
        };
    },
    computed: mapState({
        users: state => state.auth.users,
        auth: state => state.auth.auth,
        goodslist: state => state.user.userlist,
    }),
    props: {
        ChumAddVisible: {
            type: Boolean,
            default: false,
        },
    },
    created() {
        this.list = this.goodslist;
        console.log(this.list)
    },
    methods: {
        addFriend(data) {
            this.$prompt('请输入申请信息', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^s*([^s]s*){2,20}$/,
                inputErrorMessage: '应该在2-20个字符之间',
            })
                .then(({ value }) => {
                    console.log(value)
                    addFriendRequest({ f_id: data.id, information: value }).then(response => {
                        
                        const { code } = response.data;
                        if (code == 200) {
                            this.$notify({
                                title: '成功',
                                message: '请成功～',
                                type: 'success',
                            });
                            this.$refs.multipleTable.clearSelection();
                            this.$emit('setNotification');
                        }
                    });
                })
                .catch((error) => {
                    console.log(error)
                    this.$message({
                        type: 'info',
                        message: '取消输入',
                    });
                });


            console.log(data);
        },
    },
};
</script>
<style lang="scss" scoped>
span {
    margin-left: 5px;
}
td {
    border-bottom: 1px solid #fff !important;
}
</style>
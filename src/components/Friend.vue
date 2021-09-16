<template>
    <el-dialog :lock-scroll="false" :modal="false" title="添加好友" v-model="ChumAddVisible" width="500px" @close="$emit('update:ChumAddVisible', false)">
        <el-form :model="numberValidateForm">
            <el-input ref="numberValidateForm" label-width="100px" class="demo-ruleForm" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchFrom.keyword" @keyup.enter="searchGoods" @mouseleave="searchGoods"> </el-input>
        </el-form>
        <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%; overflow: auto" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prefix-icon="el-icon-search" label="选择需要添加好友" width="220">
                <template class="row scope-row" #default="scope">
                    <img :src="scope.row.avatar" />
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="addFriend()">创建</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import { CreateGroup } from '../api/group';
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
        goodslist: state => state.user.goodslist,
    }),
    props:{
        ChumAddVisible:{
             type: Boolean,
            default: false,
        }
    },
    created() {
         this.list = this.goodslist;
    },
    methods: {
        addFriend(){

        }
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
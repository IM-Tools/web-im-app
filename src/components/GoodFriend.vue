<template>
    <el-dialog :lock-scroll="false" :modal="false" title="创建一个群组" v-model="GoodFriendDialogVisible" width="500px" @close="$emit('update:GoodFriendDialogVisible', false)">
        <el-form :model="numberValidateForm">
            <el-input ref="numberValidateForm" label-width="100px" class="demo-ruleForm" placeholder="请输入内容" prefix-icon="el-icon-search"  v-model="searchFrom.keyword" 
            @keyup.enter="searchGoods" @mouseleave="searchGoods"> </el-input>
        </el-form>
        <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%; overflow: auto" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prefix-icon="el-icon-search" label="选择好友" width="220">
                <template class="row scope-row" #default="scope">
                    <img :src="scope.row.avatar" />
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="createGroup()">创建</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { ElNotification } from 'element-plus';
import { mapState } from 'vuex';
export default {
    name: 'GoodFriend',
    data() {
        return {
            GoodFriendDialogVisible: false,
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
    props: {
        GoodFriendDialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    created() {
        this.list = this.goodslist;
    },
    methods: {
        searchGoods() {
            if (this.searchFrom.keyword == '' || this.searchFrom.keyword == undefined) {
                this.list = this.goodslist;
                return;
            }
            let newList = this.list.filter(value => {
                if (value.name.search(this.searchFrom.keyword) != -1) {
                    return value;
                }
            });
            this.list = newList;
        },
        createGroup() {
        
         if(this.multipleSelection.length==0){
           ElNotification({
             type:"warning",
             message:"请选择好友"
           })
           return
         }
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleFriendDialogClose(done) {
          this.multipleSelection=[];
            done();
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
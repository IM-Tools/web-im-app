<template>
    <el-dialog title="创建一个群组" v-model="GoodFriendDialogVisible" width="500px"  @close="$emit('update:GoodFriendDialogVisible', false)">
     <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
    <el-input type="age" v-model.number="searchFrom.keyword" autocomplete="off"></el-input>
</el-form>
<el-table
    ref="multipleTable"
    :data="goodslist"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
        <template slot-scope="{row}">
          <img :src="row.avatar">
          <span>{{row.name}}</span>
        </template>
       <img>
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-button @click="createGroup()">创建</el-button>
  </div>
    </el-dialog>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'GoodFriend',
    data() {
        return {
            GoodFriendDialogVisible: false,
            searchFrom:{
                keyword:undefined
            },
             tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
         multipleSelection: []
        };
    },
      computed: mapState({
        users: state => state.auth.users,
        auth: state => state.auth.auth,
        goodslist: state => state.user.goodslist
    }),
    props: {
        GoodFriendDialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    created() {
      
    },
    methods: {
        createGroup(){

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
            done();
        },
    },
};
</script>
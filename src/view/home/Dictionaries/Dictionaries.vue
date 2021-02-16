<template>
  <div>
    <!-- 搜索 -->
    <div class="flex input">
      <div>
        字典名(中)<el-input v-model="serchData.name" placeholder="请输入" size="small" style="width: 100px;height:40px;"></el-input>
      </div>
      <div>
        字典名(英)<el-input v-model="serchData.type" placeholder="请输入" size="small" style="width: 100px;height:40px;"></el-input>
      </div>
      <div>
        状态<el-select v-model="serchData.status" clearable size="small" style="width: 100px;height:40px;" placeholder="请选择">
          <el-option v-for="item in serchData.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        描述<el-input v-model="serchData.desc" placeholder="请输入" size="small" style="width: 100px;height:40px;"></el-input>
      </div>
      <div>
        <el-button type="primary" size="small" @click="serch">搜索</el-button>
        <el-button type="text" size="small" @click="create">新增</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table border :data="tableData" class="table">
      <el-table-column label="日期" width="180">
        <template slot-scope="scope">{{scope.row.CreatedAt|formatDate}}</template>
      </el-table-column>
      <el-table-column prop="name" label="字典名(中)" width="140">
      </el-table-column>
      <el-table-column prop="type" label="字典名(英)" width="140">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="140">
        <template slot-scope="scope">{{scope.row.status|formatBoolean}}</template>
      </el-table-column>
      <el-table-column prop="desc" label="描述">
      </el-table-column>
      <el-table-column prop="address" label="按钮组" width="220">
        <template slot-scope="scope">
          　　<el-button size="small" type="primary" @click="modifyUser(scope.row.ID)">修改</el-button>
          　<el-button size="small" type="primary" @click="deleteData(scope.row.ID)">删除</el-button>　

          　</template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalresult">
    </el-pagination>
    <el-dialog :before-close="closeDialog" :visible.sync="dialogFormVisible" title="弹窗操作">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px">
        <el-form-item label="字典名（中）" prop="name">
          <el-input v-model="formData.name" placeholder="请输入字典名（中）" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="字典名（英）" prop="type">
          <el-input v-model="formData.type" placeholder="请输入字典名（英）" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" required>
          <el-switch v-model="formData.status" active-text="开启" inactive-text="停用"></el-switch>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="formData.desc" placeholder="请输入描述" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>

      <div class="dialog-footer" slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="newDictionary" v-if="updataCreate" type="primary">新 增</el-button>
        <el-button @click="setUpdateDictionary" v-else type="primary">修 改</el-button>

      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    createSysDictionary,
    deleteSysDictionary,
    updateSysDictionary,
    findSysDictionary,
    getSysDictionaryList
  } from '../../../api/sysDictionary.js'
  import {
    formatTimeToStr
  } from "@/utils/date"
  import axios from 'axios'
  import store from '../../../store/index.js'
  export default {
    data() {
      return {
        id: "",
        value1: '',
        totalresult: 0,
        currpage: 1,
        pagesize: 10,
        serchData: {
          name: null,
          type: null,
          options: [{
            value: true,
            label: '是'
          }, {
            value: false,
            label: '否'
          }],
          desc: null,
          status: null
        },

        tableData: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        updataCreate: true,
        formData: {
          name: null,
          type: null,
          status: true,
          desc: null
        },
        formLabelWidth: '120px',
        rules: {
          name: [{
            required: true,
            message: "请输入字典名（中）",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "请输入字典名（英）",
            trigger: "blur"
          }],
          desc: [{
            required: true,
            message: "请输入描述",
            trigger: "blur"
          }]
        },
      }
    },

    mounted() {
      this.getData();
    },
    filters: {
      formatDate: function(time) {
        if (time != null && time != "") {
          var date = new Date(time);
          return formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
        } else {
          return "";
        }
      },
      formatBoolean: function(bool) {
        if (bool != null) {
          return bool ? "是" : "否";
        } else {
          return "";
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val;
        this.getData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currpage = val
        this.getData()

      },
      modifyUser(e) {
        this.dialogFormVisible = true,
          this.updataCreate = false
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].ID == e) {
            console.log(1)
            this.formData.name = this.tableData[i].name,
              this.formData.type = this.tableData[i].type,
              this.formData.status = this.tableData[i].status,
              this.formData.desc = this.tableData[i].desc,
              this.rowID = this.tableData[i].ID
          }
        }
      },
      setUpdateDictionary() {
        console.log(this.rowID)
        updateSysDictionary({
          'ID': this.rowID,
          'name': this.formData.name,
          'type': this.formData.type,
          'status': this.formData.status,
          'desc': this.formData.desc
        }).then(res => {
          console.log(res.data);
          this.closeDialog()
          this.getData()
        }, res => {
          console.log("error");
        });
      },
      serch() {
          var params = {
            page: this.currpage,
            pageSize: this.pagesize,
            status:null
          }
          if(this.serchData.name !== "") {
            params.name = this.serchData.name
          }
          if(this.serchData.type !== "") {
            params.type = this.serchData.type
          }
          if(this.serchData.status ===true||this.serchData.status ===false) {
            console.log('-------',this.serchData.status)
            params.status = this.serchData.status
          }
          if(this.serchData.desc !== "") {
            params.desc = this.serchData.desc
          }
        // var params ={
        //   page: this.currpage,
        //   pageSize: this.pagesize,
        //   name: this.serchData.name,
        //   type: this.serchData.type,
        //   status: this.serchData.status,
        //   desc: this.serchData.desc

        // }

        getSysDictionaryList(params).then(response => {

          this.tableData = response.data.data.list
          this.totalresult = response.data.data.total

        }, response => {
          console.log("error");
        });
      },
      getData() {
        console.log(this.currpage, this.pagesize)
        getSysDictionaryList({
          page: this.currpage,
          pageSize: this.pagesize
        }).then(response => {
          console.log(response.data.data.list)
          this.tableData = response.data.data.list
          this.inputID = ''
          this.totalresult = response.data.data.total
          console.log(this.tableData);
        }, response => {
          console.log("error");
        });
      },
      deleteData(e) {
        console.log(e)
        deleteSysDictionary({
          ID: e
        }).then(response => {
          console.log(this.response);
          this.getData()
        }, response => {
          console.log("error");
        });
      },
      newDictionary() {
        console.log(this.formData)
        createSysDictionary({
          name: this.formData.name,
          type: this.formData.type,
          status: this.formData.status,
          desc: this.formData.desc
        }).then(res => {
          console.log(res.data);
          this.closeDialog()
          this.getData()
        }, res => {
          console.log("error");
        });
      },
      create() {
        this.dialogFormVisible = true
        this.updataCreate = true
      },
      closeDialog() {
        this.dialogFormVisible = false;
        this.formData = {
          name: null,
          type: null,
          status: true,
          desc: null
        };
      },
    },
  }
</script>
<style>
  .flex {
    display: flex;
  }

  .input {
    flex-wrap: wrap;
  }

  .input div {
    padding-right: 10px;
  }

  .input .el-input {
    margin-left: 10px;
  }

  .flex1 {
    flex: 1;
  }

  .icon {
    width: 60px;
    height: 60px;
    border-radius: 8px;
  }

  .information1 {
    font-size: 16px;
    font-weight: bold;
  }

  .information2 {
    color: gray;
  }

  .information2 div {
    margin-left: 10px;
  }

  .information3 {
    color: skyblue;
  }

  .el-table td,
  .el-table th {
    text-align: center;
  }

  .cente {
    text-align: left;
  }

  .teble {
    width: 1960px;
    height: 630px;

  }

  .el-table {
    margin-top: 20px;
  }

  .el-main {
    line-height: 40px;
  }

  .el-input__suffix {
    right: 10px;
  }
</style>

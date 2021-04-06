<template>
  <div style="padding: 10px">
    <el-card>
      <!-- 三级联动 -->
      <CategorySelector @handlercategory="handlercategory" :isShowDiv="isShowDiv"></CategorySelector>
    </el-card>

    <el-card style="margin: 20px 0">
      <!-- 属性列表 -->
      <div v-show="isShowDiv">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
          >添加属性</el-button
        >

        <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
          <el-table-column
            prop="prop"
            label="序号"
            type="index"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                style="margin-right: 3px"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="showUpdateDiv(row)"
              ></HintButton>
              <el-popconfirm :title="`确定删除${row.attrName}吗? `" @onConfirm="deleteAttr(row)">
                <!-- <el-button slot="reference">删除</el-button> -->
                <HintButton
                  type="danger"
                  slot="reference"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或修改DIv -->
      <div v-show="!isShowDiv">
        <el-form :inline="true" :model="attrFrom">
          <el-form-item label="属性名">
            <el-input
              v-model="attrFrom.attrName"
              placeholder="属性名"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrFrom.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="showAttrList">取消</el-button>

        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrFrom.attrValueList"
        >
          <el-table-column
            prop="prop"
            label="序号"
            type="index"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="属性值"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                size="mini"
              ></el-input>
              <span
                style="display: block"
                v-else
                @click="toEdit(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="attrFrom.attrValueList.splice($index, 1)"
              >
                <!-- <el-button slot="reference">删除</el-button> -->
                <HintButton
                  type="danger"
                  slot="reference"
                  icon="el-icon-delete"
                  tital="删除"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          :disabled="attrFrom.attrValueList.length === 0"
          @click="save"
          >保存</el-button
        >
        <el-button @click="showAttrList">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowDiv: true,
      attrFrom: {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "",
          // },
        ],
        categoryId: 0,
        categoryLevel: 0,
        // id: 0,
      },
    };
  },
  methods: {
    // 获取三级联动传递的id
    handlercategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        // 清空二三级数据
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        // 清空数据
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 3) {
        this.category3Id = categoryId;
        this.getList();
      }
    },
    // 获取属性列表
    async getList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 20000 || result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 点击添加按钮,显示添加
    showAddDiv() {
      this.isShowDiv = false;
      this.attrFrom = {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "",
          // },
        ],
        categoryId: this.category3Id,
        categoryLevel: 3,
        // id: 0,
      };
    },
    // 点击修改,显示修改页面
    showUpdateDiv(row) {
      this.isShowDiv = false;
      this.attrFrom = cloneDeep(row);
      this.attrFrom.attrValueList.forEach((item) =>
        this.$set(item, "isEdit", false)
      );
    },
    // 点击取消,显示属性列表
    showAttrList() {
      this.isShowDiv = true;
    },
    // 点击添加属性值, 自动获取焦点
    addAttrValue() {
      this.attrFrom.attrValueList.push({
        attrId: this.attrFrom.id,
        // id: 0,
        valueName: "",
        isEdit: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrFrom.attrValueList.length - 1].focus();
      });
    },
    // 失去焦点 或 按下回车 ,切换到 查看模式
    toLook(row) {
      // 新增的属性值不能为空,并且出去它本身,不能有重复的属性值
      if (!row.valueName.trim()) {
        this.$message.error('输入不能为空')
        // 清空输入框
        row.valueName = "";
        // 退出函数,阻止程序继续向下执行
        return;
      }

      // 只要有一个项是符合条件的,就为true
      // 因为这里的判断是除去自身的,第二次blur事件进来,判断还是会除去自身,
      // 所以不用处理清空输入框
      // 而spu中的判断是不用除去自身的,第一次回车触发blur,将用户输入的属性值,添加到数组当中,
      // 第二次blur事件,又拿着刚才的属性值,去数组中判断有没有重复的,所以要清空输入框
      const result = this.attrFrom.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });
      if (result) {
        this.$message.error("不能有重复的属性值");
        row.valueName = "";
        return;
      }

      row.isEdit = false;
    },
    // 点击span 切换到 编辑模式, 自动获取焦点
    toEdit(row, index) {
      row.isEdit = true;
      // 自动获取焦点
      // imput 自动获取焦点,需要获取inputDom节点,通过节点的focus方法获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 点击保存按钮
    async save() {
      // 获取数据
      let attr = this.attrFrom;
      // 整理数据
      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName) {
          delete item.isEdit;
          return true;
        }
        // if(item.valueName !== ''){
        //   delete item.isEdit
        //   return true
        // }
      });
      if(attr.attrValueList.length === 0){
        return 
      }

      // 发请求
      try {
        await this.$API.attr.addOrUpdate(attr);
        this.$message.success("保存成功");
        this.isShowDiv = true;
        this.getList();
      } catch (error) {
        this.$message.error("保存失败");
      }
    },
    // 删除列表中的属性
    async deleteAttr(row){
      await this.$API.attr.delete(row.id)
      this.$message.success('删除成功')
      this.getList()
    }
  },
};
</script>

<style lang="less" scoped>
</style>

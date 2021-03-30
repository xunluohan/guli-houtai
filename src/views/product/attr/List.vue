<template>
  <div style="padding: 10px">
    <el-card>
      <!-- 三级联动 -->
      <CategorySelector @handlercategory="handlercategory"></CategorySelector>
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
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
              ></HintButton>
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

        <el-table border style="width: 100%; margin: 20px 0" :data="attrFrom.attrValueList">
          <el-table-column
            prop="prop"
            label="序号"
            type="index"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="属性值"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <HintButton type="danger" icon="el-icon-delete" tital="删除" size="mini"></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
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
    },
    // 点击取消,显示属性列表
    showAttrList() {
      this.isShowDiv = true;
    },
    // 点击添加属性值
    addAttrValue() {
      this.attrFrom.attrValueList.push({
        attrId: this.attrFrom.id,
        // id: 0,
        valueName: "",
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>

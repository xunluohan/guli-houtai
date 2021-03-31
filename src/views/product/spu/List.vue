<template>
  <div>
    <el-card>
      <!-- 三级联动 -->
      <CategorySelector
        :isShowDiv="isShowDiv"
        @handlercategory="handlercategory"
      ></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <!-- 列表 -->
      <div v-show="!isShowSkuForm && !isShowSpuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpuForm"
          >添加SPU</el-button
        >

        <el-table :data="spuList" style="width: 100%; margin: 20px 0">
          <el-table-column
            prop="prop"
            label="序号"
            type="index"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="primary"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的sku"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除spu"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[2, 3, 5]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,  sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- SPU -->
      <SpuForm v-show="isShowSpuForm"></SpuForm>

      <!-- SKU -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SkuForm from "@/views/product/components/SkuForm";
import SpuForm from "@/views/product/components/SpuForm";
export default {
  name: "Spu",
  components: { SkuForm, SpuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      isShowDiv: true, // 只用于控制添加SPU按钮的可操控性
      page: 1,
      limit: 2,
      total: 0,

      isShowSkuForm: false,
      isShowSpuForm: false,
    };
  },
  methods: {
    // 接收三级分类的id
    handlercategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.spuList = [];
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取spu列表
    async getSpuList(pager = 1) {
      this.page = pager;
      // 收集数据
      let { page, limit, category3Id } = this;
      // 发请求
      try {
        const result = await this.$API.spu.getList(page, limit, category3Id);
        if (result.code === 20000 || result.code === 200) {
          this.spuList = result.data.records;
          this.total = result.data.total;
        }''
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    // 修改每页显示信息条数
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    // 点击 添加SPU 按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
    },
    // 点击 修改SPU 按钮
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true;
    },
    // 点击 添加SKU 按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
    },
  },
};
</script>

<style lang="less" scoped>
</style>

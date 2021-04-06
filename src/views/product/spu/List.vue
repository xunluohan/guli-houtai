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
                title="查看当前spu的sku列表"
                @click="showSkuList(row)"
              ></HintButton>
              <el-popconfirm
                :title="`你确定删除${row.spuName}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <!-- <el-button >删除</el-button> -->
                <HintButton
                  type="danger"
                  slot="reference"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></HintButton>
                <!-- @click="deleteSpu(row)" -->
              </el-popconfirm>
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
      <SpuForm
        @cancleBack="cancleBack"
        @backSuccess="backSuccess"
        v-show="isShowSpuForm"
        :visible.sync="isShowSpuForm"
        ref="spu"
      ></SpuForm>

      <!-- SKU -->
      <SkuForm
        ref="sku"
        v-show="isShowSkuForm"
        :visible.sync="isShowSkuForm"
      ></SkuForm>
    </el-card>

    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      :before-close="handlerClose"
    >
      <el-table :data="skuList" v-loading="loading">
        <el-table-column
          property="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column property="" label="默认图片">
          <template slot-scope="{ row, $index }">
            <img
              style="width: 100px; height: 80px"
              :src="row.skuDefaultImg"
              alt=""
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
      page: 1,
      limit: 2,
      total: 0,

      isShowDiv: true, // 只用于控制添加SPU按钮的可操控性

      isShowSkuForm: false,
      isShowSpuForm: false,

      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true,
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
        }
        ("");
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    // 修改每页显示信息条数
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    // 点击 添加SKU 按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
      let { category1Id, category2Id } = this;
      this.$refs.sku.getAddSkuInitInfo(row, category1Id, category2Id);
    },
    // 点击 添加SPU 按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.getAddSpuInfo(this.category3Id);
    },
    // 点击 修改SPU 按钮
    showUpdateSpuForm(row) {
      this.flag = row.id;
      this.isShowSpuForm = true;
      this.$refs.spu.getChangeSpuInfo(row, this.category3Id);
    },

    // 通知父组件 保存成功回来了
    backSuccess() {
      // 是添加回来的,还是修改回来的
      if (this.flag) {
        // 修改回来的
        this.getSpuList(this.page);
      } else {
        console.log(1);
        // 添加回来的
        this.getSpuList();
      }
      // 清除标志
      this.flag = null;
    },

    // 通知父组件 点击取消回来了
    cancleBack() {
      this.flag = null;
    },

    // 点击删除按钮 删除 SPU
    async deleteSpu(row) {
      await this.$API.spu.remove(row.id);
      this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1);
    },

    // 点击查看当前spu的sku列表数据
    async showSkuList(row) {
      this.spu = row;
      this.dialogTableVisible = true;
      this.loading = true;

      // 发请求 getListBySpuId sku
      const result = await this.$API.sku.getListBySpuId(row.id);
      this.loading = false;
      if (result.code === 20000 || result.code === 200) {
        this.skuList = result.data;
      }
    },
    // dialog关闭之前清空数据
    handlerClose(){
      this.skuList = [];
      this.dialogTableVisible = false
      this.loading = false
    }
  },

  // 监视数据完成三级联动的可操作性
  watch: {
    isShowSkuForm(newVal, oddVal) {
      this.isShowDiv = !newVal;
    },
    isShowSpuForm(newVal, oddVal) {
      this.isShowDiv = oddVal;
    },
  },
};
</script>

<style lang="less" scoped>
</style>

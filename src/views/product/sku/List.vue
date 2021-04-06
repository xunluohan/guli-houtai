<template>
  <el-card class="skuList">
    <!-- 表格 -->
    <el-table border :data="records" style="width: 100%; margin: 20px 0">
      <el-table-column
        prop="prop"
        label="序号"
        type="index"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="150">
        <template slot-scope="{ row, $index }">
          <img style="width: 100px" :src="row.skuDefaultImg" alt="商品图片" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="width">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <HintButton
            type="success"
            icon="el-icon-plus"
            size="mini"
            title="添加"
          ></HintButton>
          <HintButton
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改"
            @click="toUpdateSkuInfo"
          ></HintButton>
          <HintButton
            type="info"
            icon="el-icon-info"
            size="mini"
            title="查看详情"
            @click="getSkuInfo(row)"
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

    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getSkuDataList"
      :current-page="page"
      :page-sizes="[10, 20, 50]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,  sizes, total"
      :total="total"
    >
    </el-pagination>

    <!-- 抽屉 -->
    <!-- :before-close="handleClose" -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :show-close="isShowClose"
      size="50%"
    >
      <el-row>
        <el-col :span="5"> 名称 </el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            style="margin-left: 5px"
            v-for="(value, index) in skuInfo.skuAttrValueList"
            :key="value.id"
          >
            {{ `${value.attrId} - ${value.valueId}` }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel trigger="click" height="400px">
            <el-carousel-item
              v-for="skuImg in skuInfo.skuImageList"
              :key="skuImg.id"
            >
              <img style="width: 400px" :src="skuImg.imgUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      records: [],
      total: 0,
      skuInfo: {},

      // 抽屉
      drawer: false,
      direction: "rtl",
      isShowClose: false,
    };
  },
  mounted() {
    this.getSkuDataList();
  },
  methods: {
    // 获取初始化信息展示
    async getSkuDataList(page = 1) {
      this.page = page;
      // getList sku page limit
      const result = await this.$API.sku.getList(this.page, this.limit);
      if (result.code === 20000 || result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 修改每页信息数量
    handleSizeChange(size) {
      this.limit = size;
    },
    // 修改Sku信息
    toUpdateSkuInfo() {
      this.$message.info("正在开发中......");
    },
    // 抽屉
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 根据 id 获取sku详情
    async getSkuInfo(row) {
      // 开启抽屉
      this.drawer = true;
      // 获取详情
      const result = await this.$API.sku.get(row.id);
      if (result.code === 20000 || result.code === 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.skuList {
  margin: 10px;
  .el-row {
    height: 40px;
    .el-col {
      line-height: 40px;
      &.el-col-5 {
        font-size: 20px;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
      .el-carousel {
        width: 400px;
      }
    }
  }
  ::v-deep .el-carousel__indicators {
    button {
      width: 15px;
      height: 15px;
      background-color: pink;
      border-radius: 50%;
    }
    &.is-active {
      background-color: hotpink;
    }
  }
}
</style>

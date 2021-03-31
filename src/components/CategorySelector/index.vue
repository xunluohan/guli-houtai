<template>
  <div>
    <el-form :inline="true" :model="categoryId" :disabled="!isShowDiv">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryId.category1Id"
          placeholder="请选择一级分类"
          @change="handlerCategory1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryId.category2Id"
          placeholder="请选择二级分类"
          @change="handlerCategory2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="categoryId.category3Id"
          placeholder="请选择三级分类"
          @change="handlerCategory3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props:['isShowDiv'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      categoryId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1();
  },
  methods: {
    // 获取一级分类列表
    async getCategory1() {
      const result = await this.$API.category.getCategory1();
      if (result.code === 20000 || result.code === 200) {
        this.category1List = result.data;
      }
    },
    // 选中一级分类的回调
    async handlerCategory1(category1Id) {
      // 清除二三级分类的数据
      this.category2List = [];
      this.category3List = [];
      this.categoryId.category2Id = "";
      this.categoryId.category3Id = "";

      // 自定义事件
      this.$emit('handlercategory',{categoryId:category1Id,level:1})

      // 获取二级分类数据
      const result = await this.$API.category.getCategory2(category1Id);
      if (result.code === 20000 || result.code === 200) {
        this.category2List = result.data;
      }
    },
    // 选中耳机分类的回调
    async handlerCategory2(category2Id) {
      // 清空三级分类数据
      this.category3List = [];
      this.categoryId.category3Id = "";

      // 自定义事件
      this.$emit('handlercategory',{categoryId:category2Id,level:2})

      // 获取三级分类数据
      const result = await this.$API.category.getCategory3(category2Id);
      if (result.code === 20000 || result.code === 200) {
        this.category3List = result.data;
      }
    },
    async handlerCategory3(category3Id) {
      // 自定义事件
      this.$emit('handlercategory',{categoryId:category3Id,level:3})
},
  },
};
</script>

<style scoped>
</style>

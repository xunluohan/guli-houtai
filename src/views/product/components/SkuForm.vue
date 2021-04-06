<template>
  <div>
    <el-form label-width="100px" :model="skuInfo">
      <!-- spu名称 -->
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>

      <!-- sku名称 -->
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>

      <!-- 价格(元) -->
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuInfo.price"
          placeholder="价格(元)"
          type="number"
        ></el-input>
      </el-form-item>

      <!-- 重量(千克) -->
      <el-form-item label="重量(千克)">
        <el-input
          v-model="skuInfo.weight"
          placeholder="重量(千克)"
          type="number"
        ></el-input>
      </el-form-item>

      <!-- 规格描述 -->
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4"></el-input>
      </el-form-item>

      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <!--  -->
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <!--  -->
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="spuSaleAttr.saleAttrName"
            v-for="(spuSaleAttr, index) in spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <el-select
              v-model="spuSaleAttr.saleAttrIdValueId"
              placeholder="请选择"
            >
              <el-option
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
                v-for="(
                  spuSaleAttrValue, index
                ) in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <el-table
          border
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                style="width: 100px; height: 80px"
                :src="row.imgUrl"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                @click="setDefault(row, spuImageList)"
                type="primary"
                size="mini"
                v-if="row.isDefault === '0'"
                >设为默认</el-button
              >
              <el-tag type="success" :disable-transitions="true" v-else
                >默认</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 底部按钮 -->
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuInfo: {
        // 三大类
        // 父组件传递的,包含在spu中的
        category3Id: "",
        tmId: "",
        spuId: "",
        // v-model收集的
        skuName: "",
        skuDesc: "",
        weight: "",
        price: "",

        // 需要自己写代码收集
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuDefaultImg: "",
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },

      spu: {},
      attrList: [],
      spuSaleAttrList: [],
      // spu的图片列表
      spuImageList: [],

      // 收集到的sku图片列表
      skuImageList: [],
    };
  },
  methods: {
    // Promise.all()
    // 功能: 批量发送异步请求(处理异步操作)
    // 参数: 数组,promise对象的数组
    // 返回值: 返回一个新的promise对象,

    // 返回的promise对象,是成功还是失败
    // 数组中所有的promise都是成功的,就返回成功的promise
    //      成功的结果,就是所有数组参数当中promise成功结果组成的数组
    // 数组中只要有一个promise是失败的,就返回失败的promise
    //      失败的原因,是参数数组当中第一个失败的promise对象的失败原因

    // 点击添加sku,初始化请求动态数据
    async getAddSkuInitInfo(row, category1Id, category2Id) {
      this.spu = row;
      // 根据三级分类获取属性列表  getList attr
      const promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        row.category3Id
      );

      // 获取spu销售属性列表 getSpuSaleAttrList sku
      const promise2 = this.$API.sku.getSpuSaleAttrList(row.id);

      // 获取spu的图片列表 getSpuImageList sku
      const promise3 = this.$API.sku.getSpuImageList(row.id);

      try {
        const result = await Promise.all([promise1, promise2, promise3]);
        this.attrList = result[0].data;
        this.spuSaleAttrList = result[1].data;
        let spuImageList = result[2].data;
        spuImageList.forEach((item) => (item.isDefault = "0"));
        this.spuImageList = spuImageList;
      } catch (error) {
        this.$message.error("初始化请求数据失败" + error.message);
      }
    },
    // 选择table中图片的时候的回调
    handleSelectionChange(val) {
      console.log(val);
      this.skuImageList = val;
    },
    // 点击 默认图片按钮 进行排它
    // 同时收集默认图片路径
    setDefault(row, spuImageList) {
      spuImageList.forEach((item) => (item.isDefault = "0"));
      row.isDefault = "1";
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 保存
    async save() {
      // 获取参数数据
      let { skuInfo, spu, attrList, spuSaleAttrList, skuImageList } = this;
      // 整理参数
      // 整理父组件传递过来的
      skuInfo.category3Id = spu.category3Id;
      skuInfo.tmId = spu.tmId;
      skuInfo.spuId = spu.id;

      // 整理图片列表
      //#region
      // {
      //   imgName: "string",
      //   imgUrl: "string",
      //   isDefault: "string",
      //   spuImgId: 0, ==> 就是收集到的图片的id
      // },
      //#endregion
      skuInfo.skuImageList = skuImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id /*  ==> 就是收集到的图片的id */,
        };
      });

      // 收集
      // // {
      //     attrId: 0,
      //     valueId: 0,
      // // },
      skuInfo.skuSaleAttrValueList = attrList.reduce((preve, item) => {
        if (item.attrIdValueId) {
          let [attrId, valueId] = item.attrIdValueId.split(":");
          let obj = { attrId, valueId };
          preve.push(obj);
        }
        return preve;
      }, []);

      //
      //  {
      //     saleAttrId: 0,
      //     saleAttrValueId: 0,
      //   },
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((preve, item) => {
        if (item.saleAttrIdValueId) {
          let [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(":");
          let obj = { saleAttrId, saleAttrValueId };
          preve.push(obj);
        }
        return preve;
      }, []);
      // 发请求
      try {
        // 成功
        await this.$API.sku.addUpdate(skuInfo);
        this.$message.success("修改成功");
        this.$emit("update:visible", false);
        // 清空数据
        this.resetData();
      } catch (error) {
        // 失败
        this.$message.error(error.message + "保存失败");
      }
    },
    // 清空data
    resetData() {
      this.skuInfo = {
        category3Id: "",
        tmId: "",
        spuId: "",
        skuName: "",
        skuDesc: "",
        weight: "",
        price: "",
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuImageList: [],
        skuSaleAttrValueList: [],
      };
      this.spu = {};
      this.attrList = [];
      this.spuSaleAttrList = [];
      this.spuImageList = [];
      this.skuImageList = [];
    },
    // 点击取消
    cancle(){
      this.$emit("update:visible",false)
      this.resetData()
    }
  },
};
</script>



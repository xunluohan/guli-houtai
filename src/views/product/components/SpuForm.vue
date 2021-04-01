<template>
  <div>
    <el-form :model="spuInfo">
      <!-- SPU名称 -->
      <el-form-item label="SPU名称" label-width="100px">
        <el-input v-model="spuInfo.spuName" placeholder="请输入"></el-input>
      </el-form-item>

      <!-- 品牌 -->
      <el-form-item label="品牌" label-width="100px">
        <el-select v-model="spuInfo.tmId" placeholder="请选择">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 文本域 -->
      <el-form-item label="SPU描述" label-width="100px">
        <!-- type:textarea 表示这是一个文本域  rows表示可以输入几行 -->
        <el-input
          placeholder="请输入SPU描述"
          type="textarea"
          rows="4"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>

      <!-- 照片墙 -->
      <el-form-item label="SPU图片" label-width="100px">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <!-- 销售属性 -->
      <el-form-item label="销售属性" label-width="100px">
        <el-select
          v-model="chanckedSaleAttrIdName"
          :placeholder="
            unChanckedSaleAttrList.length > 0
              ? `还有${unChanckedSaleAttrList.length}选择`
              : '没有啦!!!'
          "
        >
          <el-option
            :label="saleAttr.name"
            :value="`${saleAttr.id}:${saleAttr.name}`"
            v-for="(saleAttr, index) in unChanckedSaleAttrList"
            :key="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!chanckedSaleAttrIdName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table border style="width: 100%" :data="spuInfo.spuSaleAttrList">
          <el-table-column
            prop="prop"
            label="序号"
            type="index"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- tag标签 -->
              <el-tag
                :key="spuSaleAttrValue.id"
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <!-- input框 -->
              <el-input
                class="input-new-tag"
                v-model="row.saleAttrValueName"
                ref="saveTagInput"
                size="small"
                v-if="row.inputVisible"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- 添加按钮 -->
              <!-- v-else -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="spuInfo.spuSaleAttrList.splice($index,1)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 底部按钮 -->
      <el-form-item label-width="100px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  props: ["visible"],
  data() {
    return {
      // 照片墙
      dialogImageUrl: "",
      dialogVisible: false,
      chanckedSaleAttrIdName: "", 
      category3Id:'',
      spuInfo: {
        category3Id:'',
        spuName: "",
        tmId: '',
        description: "",
        spuSaleAttrList: [],
      },
      trademarkList: [],
      spuImageList: [],
      saleAttrList: [],
    };
  },
  methods: {
    // 删除成功回调
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImageList = fileList;
    },
    // 照片墙查看大图回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 照片上传成功的回调
    handleAvatarSuccess(res, file, fileList) {
      // console.log(res,file,fileList)
      this.spuImageList = fileList;
    },

    // 点击 添加 发送两个请求
    async getAddSpuInfo(category3Id) {
      this.category3Id = category3Id
      // 获取所有品牌列表 getAllTrademarkList
      const tmResult = await this.$API.trademark.getAllTrademarkList();
      if (tmResult.code === 20000 || tmResult.code === 200) {
        this.trademarkList = tmResult.data;
      }

      // 获取所有销售属性列表 getSaleAttrList
      const SALResult = await this.$API.spu.getSaleAttrList();
      if (SALResult.code === 20000 || SALResult.code === 200) {
        this.saleAttrList = SALResult.data;
      }
    },
    // 点击 修改 发送4个请求
    async getChangeSpuInfo(spu,category3Id) {
      this.category3Id = category3Id
      // 根据 id 获取SPU详情 get
      const result = await this.$API.spu.get(spu.id);
      if (result.code === 20000 || result.code === 200) {
        this.spuInfo = result.data;
      }

      // 根据 id 获取spu图片列表 getSpuImageList
      const imgResult = await this.$API.sku.getSpuImageList(spu.id);
      if (imgResult.code === 20000 || imgResult.code === 200) {
        let imgList = imgResult.data;
        imgList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = imgList;
      }

      // 获取所有品牌列表 getAllTrademarkList
      const tmResult = await this.$API.trademark.getAllTrademarkList();
      if (tmResult.code === 20000 || tmResult.code === 200) {
        this.trademarkList = tmResult.data;
      }

      // 获取所有销售属性列表 getSaleAttrList
      const SALResult = await this.$API.spu.getSaleAttrList();
      if (SALResult.code === 20000 || SALResult.code === 200) {
        this.saleAttrList = SALResult.data;
      }
    },
    // 点击 添加销售属性按钮
    addSaleAttr() {
      // {
      //   baseSaleAttrId:1,
      //   saleAttrName:"颜色",
      // }
      let [baseSaleAttrId, saleAttrName] = this.chanckedSaleAttrIdName.split(
        ":"
      );

      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };

      this.spuInfo.spuSaleAttrList.push(obj);

      this.chanckedSaleAttrIdName = "";
    },
    // 点击 添加属性值 按钮, 切换为input
    addSaleAttrValue(row){
      this.$set(row,'inputVisible',true)
      this.$set(row,'saleAttrValueName','')
      // 自动获取焦点
      this.$nextTick(()=>{
        this.$refs.saveTagInput.focus()
      })
    },
    // 失去焦点 
    handleInputConfirm(row){
      let {baseSaleAttrId,saleAttrValueName} = row

      if(saleAttrValueName.trim() === ''){
        row.saleAttrValueName = ''
        row.inputVisible = false
        return
      }

      // 不能有重复的属性值
      let result = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName === saleAttrValueName
      })

      if(result){
        this.$message.error('不能有重复的属性值')
        row.saleAttrValueName = ''
        return
      }

      let obj ={
        baseSaleAttrId,
        saleAttrValueName
      }

      row.spuSaleAttrValueList.push(obj)

      row.saleAttrValueName = ''

      // 切换回 按钮
      row.inputVisible = false

    },
    // 点击按钮保存
    save(){
      // 收集数据
      let {spuInfo,spuImageList,category3Id} = this
      // 整理数据
      spuInfo.category3Id = category3Id
      spuInfo.spuImageList = spuImageList.map(item => {
        return {
          imgName:item.name,
          imgUrl:item.imgUrl || item.response.data
        }
      })
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.inputVisible
        delete item.saleAttrValueName
      })
      // 发请求
      try {
        // 成功干啥
        this.$API.spu.addUpdate(spuInfo)
        this.$message.success('保存成功')
        // 回到列表页
        this.$emit('update:visible', false)

        // 通知父组件回去了
        this.$emit('backSuccess')
        // 清空数据
        this.resetData()
      } catch (error) {
        // 失败干啥
        this.$message.error(error.message)
      }
    },
    // 清空数据
    resetData(){
      this.dialogImageUrl= ""
      this.dialogVisible= false
      this.chanckedSaleAttrIdName= ""
      this.category3Id=''
      this.spuInfo= {
        category3Id:'',
        spuName: "",
        tmId: '',
        description: "",
        spuSaleAttrList: []
      }
      this.trademarkList= []
      this.spuImageList= []
      this.saleAttrList= []
    },
    // 点击取消按钮
    cancle(){
      this.$emit('update:visible', false)
      this.$emit('cancleBack')
      // 清空数据
      this.resetData()
    }
  },
  computed: {
    // 计算未选中的属性
    unChanckedSaleAttrList() {
      return this.saleAttrList.filter((item) => {
        return this.spuInfo.spuSaleAttrList.every((item1) => {
          // 总的销售属性 和 spu自身的销售属性 不相等的 才是没有被选择的
          return item1.saleAttrName !== item.name;
        });
      });
    },
  },
};
</script>


<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>



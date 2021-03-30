<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showAddTemplate"
      >添加</el-button
    >
    <!-- 表单 -->
    <el-table border :data="trademarkList" style="width: 100%; margin:20px 0">
      <el-table-column
        align="center"
        prop="prop"
        label="序号"
        type="index"
        width="80px"
      >
      </el-table-column>
      <el-table-column prop="prop" label="品牌名称" width="width">
        <template slot-scope="{ row, $index }">
          <span>{{ row.tmName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img style="width: 80px; height: 60px" :src="row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper , -> , total, sizes"
      :total="total"
    >
    </el-pagination>
    <!-- dialog 对话框 -->
    <el-dialog
      :title="tmFrom.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="tmFrom" style="width: 80%" :rules="rules" ref="tmFrom">
        <el-form-item label="品牌名称" :label-width="'100px'" prop="tmName">
          <el-input v-model="tmFrom.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="'100px'" prop="logoUrl">
          <!-- 上传 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      dialogFormVisible: false,
      tmFrom: {
        tmName: "",
        logoUrl: "",
      },

      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择图片", trigger: "change" }],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    // 获取数据
    async getTrademarkList(page = 1) {
      this.page = page;
      try {
        const result = await this.$API.trademark.getTrademarkList(
          this.page,
          this.limit
        );
        if (result.code === 20000 || result.code === 200) {
          this.trademarkList = result.data.records;
          this.total = result.data.total;
        }
      } catch (error) {}
    },
    // 修改每页显示条数
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList()
    },
    // 点击显示添加品牌
    showAddTemplate() {
      this.dialogFormVisible = true;
      // 每次打开添加品牌重置tmFrom
      this.tmFrom = {
        tmName: "",
        logoUrl: "",
      };
    },

    // 上传相关
    // 上传成功的回调
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      this.tmFrom.logoUrl = res.data;
    },
    // 上传之前的回调
    beforeAvatarUpload(file) {
      const isJPGOrPNG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt500KB = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt500KB) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      console.log(isJPGOrPNG, isLt500KB);
      return isJPGOrPNG && isLt500KB;
    },
    // 点击显示修改
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      this.tmFrom = { ...row };
    },
    // 点击按钮添加或修改
    addOrUpdate() {
      // 收集数据
      let trademark = this.tmFrom;
      // 整理数据
      // 发请求

      this.$refs.tmFrom.validate(async (valid) => {
        if (valid) {
          try {
            await this.$API.trademark.addOrUpdate(trademark);
            // 成功干啥
            this.$message.success(this.tmFrom.id ? "修改成功" : "添加成功");
            // 关闭 Dialog 对话框
            this.dialogFormVisible = false;
            // 发请求更新页面
            this.getTrademarkList(this.tmFrom.id ? this.page : 1);
          } catch (error) {
            // 失败干啥
            // this.$message.error(this.tmFrom.id ? '修改失败' : '添加失败')
            this.$message.error(error.message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击删除品牌
    deleteTrademark(row) {
      this.$confirm(`请确认是否删除${row.tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$API.trademark.delete(row.id);
            this.$message.success('删除成功')
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button {
  margin: 10px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

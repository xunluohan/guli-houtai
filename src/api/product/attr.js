import request from '@/utils/request'

export default {
  // GET  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr){
    return request.post('/admin/product/saveAttrInfo',attr)
  }
}
import request from '@/utils/request'

export default {
  // DELETE  /admin/product/baseTrademark/remove/{id}
  // 删除BaseTrademark
  delete(id){
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark){
    if(trademark.id){
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else{
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
    
  },

  // GET /admin/product/baseTrademark/{page}/{limit}
  getTrademarkList(page,limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  // 获取所有品牌列表
  // GET /admin/product/baseTrademark/getTrademarkList
  getAllTrademarkList(){
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }
}
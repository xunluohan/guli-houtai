import store from '@/store'
// 管理按钮权限的函数
export default function btnBP(type){
  let buttons = store.getters.buttons
    return buttons.indexOf(type) !== -1
}
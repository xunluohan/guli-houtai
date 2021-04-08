import { login, logout, getInfo } from '@/api/acl/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { default as router , resetRouter,constantRoutes,allAsyncRoutes,anyRoutes } from '@/router'
import cloneDeep from 'lodash/cloneDeep'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// 根据请求返回的数据,过滤出来需要动态创建的数组
function AsyncRoutes(asyncRoutes,routeNames){
  return asyncRoutes.filter(item => {
    if(routeNames.indexOf(item.name) !== -1){
      if(item.children && item.children.length){
        item.children = AsyncRoutes(item.children,routeNames)
      }
      return true
    }
  })
}

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  buttons:[],
  roles: [],
  // 所有路由形成的数组
  routes: [],
  // 需要动态创建的路由形成的数组
  asyncRoutes: []
}

const mutations = {
  // RESET_STATE: (state) => {
  //   Object.assign(state, getDefaultState())
  // },
  RESET_STATE(state){
    state.token = ''
    state.name = ''
    state.avatar = ''
    state.buttons = []
    state.roles = []
    state.routes = []
    state.asyncRoutes = []
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  SET_USERINFO(state,userInfo){
    state.name = userInfo.name
    state.avatar = userInfo.avatar

    // 权限相关
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  SET_ROUTES(state,asyncRoutes){
    state.asyncRoutes = asyncRoutes
    state.routes = constantRoutes.concat(asyncRoutes,anyRoutes)
    // 动态添加路由
    router.addRoutes([...asyncRoutes,anyRoutes])
    
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, avatar } = data
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)

        commit('SET_USERINFO',data)
        commit('SET_ROUTES',AsyncRoutes(cloneDeep(allAsyncRoutes),data.routes))

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


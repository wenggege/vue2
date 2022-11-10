import router from './router'
import store from './store'
import { checkDataType } from '@/utils'
import { Loading } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

// NProgress Configuration
NProgress.configure({ showSpinner: false })

// no redirect whitelist (route name)
const whiteList = ['Login', 'LogsImportSystem']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  let authInfo = localStorage.getItem('LOCAL_OPERATIONS_AUTH')
    try {
      authInfo = JSON.parse(authInfo)
      authInfo = checkDataType(authInfo) === 'Object' ? authInfo : {}
    } catch (err) {
      authInfo = {}
    }

 
    const IS_LOGIN = !!store.getters.permissions
    console.log('IS_LOGIN:::', IS_LOGIN)
    // 当前已获得token 未获取客户使用权限
    if (!IS_LOGIN) {
    
      let accessRoutes
      await store.dispatch('user/getUserPerms').then(async () => {
        accessRoutes = await store.dispatch('permission/generateRoutes')
        await router.addRoutes(accessRoutes)

        if (!accessRoutes.length) {
          next({ name: 'Login' })
        } else {
          next({ ...to, replace: true })
        }
      }).catch(async (error) => {
        console.log('getUserPerms-error:::', error)
        await store.dispatch('user/resetToken')
        next({ name: 'Login' })
      }).finally(() => {
       
        NProgress.done()
      })
    }

    

    next()
})

router.afterEach(() => {
  NProgress.done()
})

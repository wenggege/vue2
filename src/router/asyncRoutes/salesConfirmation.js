import Layout from '@/layout'

export default {
  path: '/salesConfirmation',
  component: Layout,
  name: 'SalesConfirmation',
  redirect: { name: 'SalesConfirmation' },
  meta: {
    title: '销售确认',
    icon: 'tenantManage'
  },
  alwaysShow: true,
  children: [
    {
      path: 'salesConfirmation',
      component: () => import('@/views/salesConfirmation/salesConfirm'),
      name: 'SalesConfirmation',
      meta: {
        title: '销售确认'
      }
    },
    {
      path: 'productDetail',
      component: () => import('@/views/salesConfirmation/salesConfirm/productDetail'),
      name: 'ProductDetail',
      hidden: true,
      meta: {
        title: '产品类详情'
      },
    },
    {
      path: 'serviceDetail',
      component: () => import('@/views/salesConfirmation/salesConfirm/serviceDetail'),
      name: 'ServiceDetail',
      hidden: true,
      meta: {
        title: '服务类详情'
      },
    },
    {
      path: 'salesConfirmFileList/:SalesOrderNumber',
      component: () => import('@/views/salesConfirmation/salesConfirm/components/fileList'),
      name: 'SalesConfirmFileList',
      hidden: true,
      meta: {
        title: '文件'
      },
    },
    {
      path: 'shippingManagement',
      component: () => import('@/views/salesConfirmation/shippingManagement'),
      name: 'ShippingManagement',
      meta: {
        title: '发运管理'
      }
    },
    {
      path: 'fileList/:TrackingId',
      component: () => import('@/views/salesConfirmation/shippingManagement/fileList'),
      name: 'FileList',
      hidden: true,
      meta: {
        title: '文件管理'
      },
    },
  ]
}

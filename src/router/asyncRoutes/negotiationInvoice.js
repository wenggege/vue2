import Layout from '@/layout'

export default {
  path: '/negotiationInvoice',
  component: Layout,
  name: 'NegotiationInvoice',
  redirect: { name: 'NegotiationInvoice' },
  meta: {
    title: '议付开票',
    icon: 'tenantManage'
  },
  alwaysShow: true,
  children: [
    {
      path: 'negotiationInvoice',
      component: () => import('@/views/negotiationInvoice/invoiceApplication'),
      name: 'NegotiationInvoice',
      meta: {
        title: '发票申请'
      },
    },
    {
      path: 'invoiceApplicationDetail/:Id',
      component: () => import('@/views/negotiationInvoice/invoiceApplication/invoiceApplicationDetail'),
      name: 'InvoiceApplicationDetail',
      hidden: true,
      meta: {
        title: '增值税发票详情'
      },
    },
    {
      path: 'invoiceTradeDetail/:Id',
      component: () => import('@/views/negotiationInvoice/invoiceApplication/invoiceTradeDetail'),
      name: 'invoiceTradeDetail',
      hidden: true,
      meta: {
        title: '商业发票详情'
      },
    },
    {
      path: 'sterilisationcommerce/:Id',
      component: () => import('@/views/negotiationInvoice/invoiceApplication/sterilisation/commerce.vue'),
      name: 'sterilisationcommerce',
      hidden: true,
      meta: {
        title: '商业冲销详情'
      },
    },
    {
      path: 'sterilisation/:Id',
      component: () => import('@/views/negotiationInvoice/invoiceApplication/sterilisation/index.vue'),
      name: 'sterilisation',
      hidden: true,
      meta: {
        title: '增值冲销详情'
      },
    },
    {
      path: 'tax',
      component: () => import('@/views/negotiationInvoice/invoiceApplication/tax'),
      name: 'tax',
      hidden: true,
      meta: {
        title: '商业发票详情'
      },
    },
    {
      path: 'fileList/:SalesOrderNumber',
      component: () => import('@/views/negotiationInvoice/components/fileList'),
      name: 'FileList',
      hidden: true,
      meta: {
        title: '文件'
      },
    },
    {
      path: 'negotiationInvoiceList',
      component: () => import('@/views/negotiationInvoice/invoiceList'),
      name: 'NegotiationInvoiceList',
      meta: {
        title: '发票审批'
      }
    },
    {
      path: 'InvoicecommerceInfo',
      component: () => import('@/views/negotiationInvoice/invoiceList/commerce.vue'),
      name: 'InvoicecommerceInfo',
      hidden: true,
      meta: {
        title: '商业发票详情'
      }
    },
    {
      path: 'InvoiceInfo',
      component: () => import('@/views/negotiationInvoice/invoiceList/info.vue'),
      name: 'InvoiceInfo',
      hidden: true,
      meta: {
        title: '增值税发票详情'
      }
    },
    {
      path: 'editcommerce',
      component: () => import('@/views/negotiationInvoice/invoiceList/editcommerce.vue'),
      name: 'editcommerce',
      hidden: true,
      meta: {
        title: '修改发票'
      }
    },
    {
      path: 'edittax',
      component: () => import('@/views/negotiationInvoice/invoiceList/edittax.vue'),
      name: 'edittax',
      hidden: true,
      meta: {
        title: '增值税发票'
      }
    },
    {
      path: 'editsterilisation',
      component: () => import('@/views/negotiationInvoice/invoiceList/editsterilisation.vue'),
      name: 'editsterilisation',
      hidden: true,
      meta: {
        title: '商业冲销发票'
      }
    },
    {
      path: 'editTaxSterilisation',
      component: () => import('@/views/negotiationInvoice/invoiceList/editTaxSterilisation.vue'),
      name: 'editTaxSterilisation',
      hidden: true,
      meta: {
        title: '增值冲销发票'
      }
    },
    {
      path: 'vatInvoiceList',
      component: () => import('@/views/negotiationInvoice/vatInvoiceList'),
      name: 'VatInvoiceList',
      meta: {
        title: '增值税发票'
      }
    },
  ]
}

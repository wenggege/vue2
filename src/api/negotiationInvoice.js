import request from '@/utils/request/index'
import download from '@/utils/request/download'
// const BASE_URL1 = process.env.VUE_APP_BASE_API
// const BASE_URL2 = process.env.VUE_APP_BASE_API2

/**
 * @description  获取发票申请列表信息
 */
export function getApplylist(param) {
  return request.get('/api/invoice/applylist', param)
}

/**
 * @description  修改发票类型
 */
export function updateinvoicetype(param) {
  return request.post('/api/invoice/updateinvoicetype', param)
}

/**
 * @description  获取发票列表信息
 */
export function getRecordlist(param) {
  return request.get('/api/invoice/recordlist', param)
}
/**
 * @description  获取发票列表信息详情
 */
export function getRecordInfo(param) {
  return request.get('/api/invoice/recordinfo', param)
}
/**
 * @description  获取发票列表信息
 */
export function getApplyinfo(param) {
  return request.post('/api/invoice/applyinfo', param)

}
/**
 * @description  获取发票下拉
 */
export function getRate(param) {
  return request.get('/api/base/rate', param)

}
/**
 * @description  获取审核意见  
 */
export function getAudit(param) {
  return request.get('/api/invoice/getAudit', param)

}



/**
 * @description  文件上传
 */
export function fileUpload(param) {
  return request.upload('/api/base/file', param)
}

/**
 * @description  发票申请文件
 */
export function getFilelist(param) {
  return request.get('/api/invoice/filelist', param)
}

/**
<<<<<<< HEAD
 * @description  添加发票申请文件
 */
export function addorupdatefile(param) {
  return request.post('/api/invoice/addorupdatefile', param)
}

/**
 * @description  删除文件
 */
export function deletefile(param) {
  return request.post('/api/invoice/deletefile', param)
}

/**
 * @description  获取增值税发票列表信息
 */
export function getVatlist(param) {
  return request.get('/api/vat/getlist', param)
}
/**
 * @description  修改发票
 */
export function Updatarecord(param) {
  return request.post('/api/invoice/updatarecord', param)
}
/**
 * @description  修改发票11
 */
export function UpdatarecordData(param) {
  return request.post('/api/invoice/updataInvoicerecord', param)
}

/**
 * @description  获取发票关联
 */
export function Getunion(param) {
  return request.get('/api/invoice/getunion', param)
}

/**
 * @description  增值税发票导入
 */
export function vatfileUpload(param) {
  return request.upload('/api/vat/fileUpload', param)
}

/**
 * @description  删除增值税发票
 */
export function deletevatfile(param) {
  return request.post('/api/vat/delete', param)
}

/**
 * @description  作废发票
 */
export function Cancellation(param) {
  return request.post('/api/invoice/cancellation', param)
}

/**
 * @description  删除增值税发票关联
 */
export function deleteunion(param) {
  return request.post('/api/invoice/deleteunion', param)
}


/**
 * @description  提交发票
 */
export function getsubinvoice(param) {
  return request.post('/api/invoice/subinvoice', param)
}
/**
 * @description  品名
 */
export function getelab(param) {
  return request.get('/api/base/getelab', param)
}
/**
 * @description  交易类型
 */
export function gettransactionType(param) {
  return request.get('/api/base/transactionType', param)
}
///订单交易类型
export function getOrdertransactionType(param) {
  return request.get('/api/invoice/getOrdertypeList', param)
}


/**
 * @description  联系人
 */
export function gettbaseinfo(param) {
  return request.get('/api/base/getuser', param)
}

/**
 * @description  添加或者修改发票关联
 */
export function addunion(param) {
  return request.post('/api/invoice/union', param)
}

/**
 * @description  发票导出弹框
 */
export function recordexportList(param) {
  return request.get('/api/invoice/recordexportList', param)
}

/**
 * @description  发票导出
 */
export function recordexport(param) {
  return request.get('/api/invoice/recordexport', param)
}

/**
 * @description  文件预览接口
 */
 export function getFile(param) {
  return request.get('/api/base/getFile', param)
}
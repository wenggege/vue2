import request from '@/utils/request/index'
import download from '@/utils/request/download'

/**
 * @description  获取销售确认列表信息
 */
export function getsalelist(param) {
  return request.get('/api/sale/getsalelist', param)
}

/**
 * @description  获取销售确认列表详情信息
 */
export function getsalelinfo(param) {
  return request.get('/api/sale/getsalelinfo', param)
}

/**
 * @description  获取文件列表
 */
export function getFilelist(param) {
  return request.get('/api/sale/filelist', param)
}

/**
 * @description  添加文件关联状态
 */
export function saleAddorupdatefile(param) {
  return request.post('/api/sale/addorupdatefile', param)
}

/**
 * @description  删除文件
 */
export function deletefile(param) {
  return request.post('/api/sale/deletefile', param)
}

/**
 * @description  获取销售单
 */
export function getSaleOrder(param) {
  return request.get('/api/sale/GetSaleOrder', param)
}

/**
 * @description  订单明细/订单行项目
 */
export function getOrderInfo(param) {
  return request.get('/api/sale/GetOrderInfo', param)
}

/**
 * @description  添加销售确认（服务类型）
 */
export function addSale(param) {
  return request.post('/api/sale/addSale', param)
}

/**
 * @description  销售确认发票已关联列表
 */
export function getSaleUnionList(param) {
  return request.get('/api/sale/getSaleUnionList', param)
}

/**
 * @description  添加或者修改销售关联信息
 */
export function subSaleUnion(param) {
  return request.post('/api/sale/subSaleUnion', param)
}

/**
 * @description  发运管理 - 文件上传
 */
 export function fileUpload(param) {
  return request.upload('/api/base/addfile', param)
}

/**
 * @description  发运管理 - 获取文件列表
 */
 export function getTrackFilelist(param) {
  return request.get('/api/tracking/filelist', param)
}

/**
 * @description  发运管理 - 添加/修改文件
 */
 export function trackFilemodify(param) {
  return request.post('/api/tracking/trackingfilemodify', param)
}

/**
 * @description  发运管理 - 删除文件
 */
 export function trackDeletefile(param) {
  return request.post('/api/tracking/deletefile', param)
}

/**
 * @description  销售确认 - 详情审核
 */
 export function subSaleAuditDto(param) {
  return request.post('/api/sale/subSaleAuditDto', param)
}

/**
 * @description  销售确认 - 提交销售确认
 */
 export function subSale(param) {
  return request.post('/api/sale/subSale', param)
}


var invoiceModel=
    {
        Id: 0,
        DeliveryProjectID: 0,
        ElabCode: "",
        ElabName: "",     
        InvoicRemarks: '',
        InvoiceAmount: 0.00,
        InvoiceCode: '',
        InvoiceItemNumber: '',
        InvoiceNo: "",
        InvoiceRate: 0,
        InvoiceRecordNumber: '',
        InvoiceType: 0,
        IsDelete: 0,
        Advance: 0,
        Num: 0,
        TaxType: 0,/* 增值税发票类型：0 增值税普通发票，1增值税专用发票*/
        ProjectCode: "",
        ProjectNumber: 0,
        SalesOrderNumber: '',
        SAPSalesOrderNumber: '',
        Status: 0,
        Currency: '',
        Select: 1,/*是否选择 */
        TransactionType: "TAD",/** 'ZADS' 收费样品  'TAD' 服务'   'TAN' 产品交付  'ZADZ' 免费样品   */
        Unit: "次",
        TADCount:0,
        TANCount:0, 
      
      }
      var invoiceArry=[];

      export default {invoiceModel,invoiceArry};

 

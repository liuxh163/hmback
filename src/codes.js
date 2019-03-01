//订单目标类型编码
const OrderTargetCode = {
    Product:'01',
    Servant:'03',
    Imageology:'02'
}
const OrderTypeCode = {
    Product:'01',
    Servant:'03',
    Imageology:'02' 
}
const OrderStatus={
    SUCCESS:'99',
    CANCELED:'98'
}
const OrderProductStatus = {
    PREPAY:'01',
    PREPAID:'02',
    POSTPAY:'03',
    TOTRAVEL:'04',
    SUCCESS:OrderStatus.SUCCESS,
    CANCELED:OrderStatus.CANCELED
}
export  {OrderTargetCode,OrderTypeCode,OrderProductStatus}
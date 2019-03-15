class OLServiceController {
    async getAddress(ctx) {
        const query = ctx.query
        ctx.body = {
            'url':'https://kefu.easemob.com/webim/im.html?configId=00884670-7531-4c07-b527-afe97aa1a8ec'
        }
    }

}

export default OLServiceController

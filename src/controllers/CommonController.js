
class CommonController {
    async codesIndex(ctx) {
        console.log("in codes index")
        const codes = ctx.state.codes;
        if (!codes) {
            ctx.throw(400, 'NO_VALID_CODES')
        }
        ctx.body = {codes:codes}
    }
}

export default CommonController

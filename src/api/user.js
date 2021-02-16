import service from '@/utils/request'  //导入封装好的axios
// @Summary 用户登录
// @Produce  application/json
// @Param data body {username:"string",password:"string"}
// @Router /base/login [post]
export const login = (data) => {
    return service({
        url: "/base/login",
        method: 'post',
        data: data
    })
}

// @Summary 获取验证码
// @Produce  application/json
// @Param data body {username:"string",password:"string"}
// @Router /base/captcha [post]

export const captcha = (data) => {
    return service({
        url: "/base/captcha",
        method: 'post',
        data: data
    })

}

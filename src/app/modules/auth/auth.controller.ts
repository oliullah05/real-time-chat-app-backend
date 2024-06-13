import config from "../../config";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const login = catchAsync(async (req, res) => {
    const result = await AuthServices.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env==="production"
    })


    sendResponse(res, {
        success: true,
        message: "Logged in successfull!",
        statusCode: 200,
        data: {
            accessToken: result.accessToken,
            user:result.user
        }
    })
})


const refreshToken = catchAsync(async (req, res) => {
    const {refreshToken} = req.cookies
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        success: true,
        message: "Access token is retrieved successfully!",
        statusCode: 200,
        data: {
            accessToken: result.accessToken
        }
    })
})


export const AuthControllers = {
    login,
    refreshToken
}
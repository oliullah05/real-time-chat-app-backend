import dotenv from  'dotenv'
import path from "path"
dotenv.config({ path: path.join(process.cwd(), '.env') });

export  = {
node_env:process.env.NODE_ENV,
port:process.env.PORT,
bcrypt_salt_round:process.env.BCRYPT_SALT_ROUND,
jwt:{
    jwt_access_secret:process.env.JWT_ACCESS_SECRET,
    jwt_access_secret_expire_in:process.env.JWT_ACCESS_SECRET_EXPIRE_IN,
    jwt_refresh_secret:process.env.JWT_REFRESH_SECRET,
    jwt_refresh_secret_expire_in:process.env.JWT_REFRESH_SECRET_EXPIRE_IN
}

}

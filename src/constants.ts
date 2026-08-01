import dotenv from "dotenv"

dotenv.config()

export const BUCKET_NAME = "pipeline_oneminus"

export const CLOUD_CORS_RESPONSE_HEADERS = ["Content-Type","x-goog-meta-*","x-goog-storage-class","Content-Disposition"]
export const CLOUD_CORS_METHODS = ["GET","HEAD","OPTIONS","PUT"]

export const LOCAL_ENV_ORIGIN = "*"
export const DEV_ENV_ORIGIN = process.env.DEV_ENV_ORIGIN
export const PROD_ENV_ORIGIN = ""

export const LOCAL_ENV = "local"
export const DEV_ENV = "dev"
export const PROD_ENV = "prod"
export const ENVIRONMENT = process.env.ENV 
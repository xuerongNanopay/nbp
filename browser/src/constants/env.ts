const DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC = 300
export const RECOVER_TOKEN_TIME_OUT_SEC = 
              !process.env['RECOVER_TOKEN_TIME_OUT'] ? DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC : 
                isNaN(parseInt(process.env['RECOVER_TOKEN_TIME_OUT'])) ? DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC :
                  parseInt(process.env['RECOVER_TOKEN_TIME_OUT'])

export const JWT_SECRET = process.env['JWT_SECRET']
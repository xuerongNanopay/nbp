const DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC = 300
export const RECOVER_TOKEN_TIME_OUT_SEC = 
              !process.env['RECOVER_TOKEN_TIME_OUT'] ? DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC : 
                isNaN(parseInt(process.env['RECOVER_TOKEN_TIME_OUT'])) ? DEFAULT_RECOVER_TOKEN_TIME_OUT_SEC :
                  parseInt(process.env['RECOVER_TOKEN_TIME_OUT'])

export const JWT_SECRET = process.env['JWT_SECRET']

const DEFAULT_SESSION_AGE = 24 * 60 * 60
export const SESSION_AGE = 
              !process.env['SESSION_AGE'] ? DEFAULT_SESSION_AGE : 
              isNaN(parseInt(process.env['SESSION_AGE'])) ? DEFAULT_SESSION_AGE :
                parseInt(process.env['SESSION_AGE'])
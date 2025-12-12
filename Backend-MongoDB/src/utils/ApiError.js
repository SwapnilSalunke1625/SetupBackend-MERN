class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went Wrong",
        errors=[],
        statch=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=message
        this.success=false
        this.errors=errors

        if(statch){
            this.stack=statch
        } else{
            Error.captureStackTrace(this.constructor)
        }

    }
  
}

export {ApiError}
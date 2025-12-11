const asyncHandler=(requestHandler)=>{
    (req,res, next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((error)=>next(error))
    }

}

export {asyncHandler}

// we have made this for making all standard 
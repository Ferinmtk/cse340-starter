errorController.throwError = function(req, res, next) {
    try {
        throw new Error("Intentional 500 Error Triggered");
    } catch (error) {
        next(error); 
    }
};

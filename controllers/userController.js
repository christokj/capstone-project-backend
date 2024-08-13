import validateUserData from "../validations/signUpJoi.js";


export const userCreate = async ( req, res, next) => {
    console.log("User Create")
    const data = req.body
    const validatedData = await validateUserData(data);
    console.log(validatedData)
    console.log("final")
    
    // next();
}
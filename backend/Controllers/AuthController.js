const UserModel = require("../Models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const signup = async(req,res)=>{
     try{
        const{name,email,password}=req.body
        const user = await UserModel.findOne({email})
        if(user){
            return res.status(409).json({message:`user is already exist,you can login`,success:false})
        }
        const userModel = new UserModel({name,email,password})
        userModel.password= await bcrypt.hash(password,10)
        await userModel.save()
        res.status(201).json({
            message:"signup successfuly ",
            success: true
        })
     }catch(err){
        res.status(500)
        .json({
            message:"Inetrnal server error ",
            success: false
        })
     }
}

const login = async(req,res)=>{
    try{
       const{email,password}=req.body
       const user = await UserModel.findOne({email})
       const erroMsg ='Auth failed or password is wrong'
       if(!user){
           return res.status(409).json({message:`user is already exist,you can login`,success:false})
       }
       const isPassEqual = await bcrypt.compare(password,user.password)
       if(!isPassEqual){
        return res.status(403)
        .json({message:erroMsg,success:false})
       }
       const jwtToken=jwt.sign(
        {email:user.email, _id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"24h"}
    )
      
      
        res.status(200).json({
           message:"login successfuly ",
           success: true,
           jwtToken,
           email,
           name:user.name
       })
    }catch(err){
       res.status(500)
       .json({
           message:"Inetrnal server error ",
           success: false
       })
    }
}
module.exports={
    signup,
    login
}

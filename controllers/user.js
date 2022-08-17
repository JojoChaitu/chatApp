const User = require('../modal/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//Sign Up
const signUp = async (req,res) => {
        const { name,email,password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const user = await User.create({        
            name,
            email,
            password:hashedPassword
        })
        const token = jwt.sign({userId:user._id,name:user.name},'secret',{ expiresIn:'30d'})
        //  res.status(202).cookie("jwt",token)
        // req.cookie("jwt", token, {httpOnly: false,maxAge: (60 * 60 * 24 * 30) * 1000})
        res.cookie("username",name)
        // res.status(201).json({user:{name:user.name},token})
        res.send('signup succesfull')
}

//Login
const userLogin = async (req,res) => {
    const { email,password } = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.status(401).send('Invalid creadentails')
    }
    const result = await bcrypt.compare(password,user.password)

    if(!result){
        return res.status(401).send('Invalid password')
    }
    console.log('user login Succesful');
    const token = jwt.sign({userId:user._id,name:user.name},'secret',{ expiresIn:'30d'})   
    res.status(202).cookie("jwt",token)
    res.status(200).json({user:{name:user.name},token})
}
//Logout
const userLogout = (req,res) => {
        res.cookie('jwt','').send('logged out')
    }


module.exports = { signUp,userLogin,userLogout }

// const reqdata=req.body
//     const userdata=await users.findOne({userid:reqdata.userid})
//     try{
//         if(userdata)
//         {
//             const compare= await bcrypt.compare(reqdata.password.toString(),userdata.password) 
//             if(compare)
//             {
//                 const payload={
//                     userid:reqdata.userid,
//                     userName:reqdata.userName,
//                     role:userdata.role
//                 }
//                 const signinOptions ={
//                     expiresIn : "100h",
//                     issuer: "bookess.org",
//                     subject: userdata.userName
//                 }
//                 const token = jwt.sign(payload,privateKey,signinOptions)
//                 res.cookie("token", token)
//                 res.status(200).send({msg:"Login Successful",token:token,userName:userdata.userName,tokenUsage:"Set the token to browser local storage and send it to server here after, everytime for authorization. set the username in the website "})
//             }
//             else
//             {
//                 res.status(404).send({msg:"Incorrect passcode"})
//             }
//         }    
//         else
//         {
//             res.status(404).send({msg:"userid doesn't exist"})
//         }
//     }
//     catch(err)
//     { 
//         res.status(404).send(err)
//     }
//     return
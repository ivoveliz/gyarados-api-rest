var express = require('express');
var router = express.Router();
const { users } = require('../models/index')
var jwt=require('jsonwebtoken')
let response
const accessToken=""
const refreshToken=""
const jwtConfig = {
  secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
  refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767',
  expireTime: '10m',
  refreshTokenExpireTime: '10m',
}

/* GET users listing. */
router.post('/add', async function(req, res, next) {
  const SaveUser=new users({
    user:req.body.user,
    email:req.body.email,
    password:req.body.password,
    state:req.body.state,
    role:req.body.role,
    ability:req.body.ability,
    LevelAccess:req.body.LevelAccess
    })
  var searchedUser = await users.findOne({ user: req.body.user})

    // If the device already exists in the database, we add a error message to the session and redirect to the device list
    if(searchedUser){
        response={

            user:req.body.user,
        email:req.body.email,
        password:req.body.password,
        state:req.body.state,
        role:req.body.role,
        ability:req.body.ability,
        LevelAccess:req.body.LevelAccess,
            StatusUser:"exists"
    
        }
       
    }else{

        if((error = await saveSchema(SaveUser)) != true) {
            context.log("await")
            context.log(error)
            context.done()
            response ="Usuario no registrado"
        }
        response={

            user:req.body.user,
            email:req.body.email,
            password:req.body.password,
            state:req.body.state,
            role:req.body.role,
            ability:req.body.ability,
            LevelAccess:req.body.LevelAccess,
            StatusUser:"aggregate"
    
        }
    }
  res.send( response);
});

router.post('/update', async function(req, res, next) {
  const SaveUser=new users({
    user:req.body.user,
    email:req.body.email,
    password:req.body.password,
    state:req.body.state,
    role:req.body.role,
    ability:req.body.ability,
    LevelAccess:req.body.LevelAccess
    })
    const doc = await users.findOne({ NameGroup: req.body.user })
    doc.user=req.body.user,
    doc.email=req.body.email,
    doc.password=req.body.password,
    doc.state=req.body.state,
    doc.role=req.body.role,
    doc.ability=req.body.ability,
    doc.LevelAccess=req.body.LevelAccess,
    
    doc.markModified('use')
    doc.markModified('email')
    doc.markModified('password')
    doc.markModified('state')
    doc.markModified('role')
    doc.markModified('ability')
    doc.markModified('LevelAccess')
    doc.save()

    response={

        user:req.body.user,
        email:req.body.email,
        password:req.body.password,
        state:req.body.state,
        role:req.body.role,
        ability:req.body.ability,
        LevelAccess:req.body.LevelAccess,
        StatusUser:"update"

    }
    
  res.send( response);
});

router.get('/login', async function(req, res, next) {
  const SaveUser=new users({
    user:req.query.user,
    email:req.query.email,
    password:req.query.password,
    state:req.query.state,
    role:req.query.role,
    ability:req.body.ability,
    LevelAccess:req.body.LevelAccess
    })

    
 console.log(req.query)
    var searchedUser = await users.findOne({ email: req.query.email,password:req.query.password})

    // If the device already exists in the database, we add a error message to the session and redirect to the device list

    if(searchedUser){


      if(searchedUser.state=="activate"){
        try {
   
           accessToken = jwt.sign({ id: 1 }, jwtConfig.secret, { expiresIn: jwtConfig.expireTime })
           refreshToken = jwt.sign({ id: 1 }, jwtConfig.refreshTokenSecret, {
            expiresIn: jwtConfig.refreshTokenExpireTime,
          })
    // console.log("accesstoken",accessToken)
    // console.log("refreshToken ",refreshToken )
        } catch (e) {
          error = e
        }
        //response =`Usuario ${searchedUser.user} ya se encuentra registrado`
        response={
          userData: {
            id: 1,
            fullName: searchedUser.user,
            username: searchedUser.user,
            avatar: "require('@/assets/images/avatars/13-small.png')",
            email: searchedUser.email,
            role: searchedUser.role,
            LevelAccess: searchedUser.LevelAccess,
            ability: searchedUser.ability
        },
        accessToken:accessToken,
        refreshToken:refreshToken,
        access:"permited"
        // accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjczMzA1MTU2LCJleHAiOjE2NzMzMDU3NTZ9.GtJvLZvyaHC9SjG06gjYx55PJrhkCPb8PVm5NY5S8aU",
        // refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjczMzA1MTU2LCJleHAiOjE2NzMzMDU3NTZ9.7ppXQA-dJzAP8eA5dIs3yLZQmKZ74PMqJnonTmevF18"
        }
        
        
    }else{
        
        response={
            user:"",
            state:"",
            role:"",
            access:"locked"
            }



    }
    
    }else{
        
      response={
          user:"",
          state:"",
          role:"",
          access:"locked"
          }}
    
  res.send( response);
});

router.delete('/delete', async function(req, res, next) {
  if(req.query.confirmation == "true"){

    const doc = await users.findOneAndDelete({ user: req.query.user })

    response={
    NameUser:req.query.user,
    StateGroup:"Removed"
  }

  }else{

    response={
      NameUser:req.query.user,
      StateGroup:"Not-Removed"
    }

  }

 
  res.send( response);
});

module.exports = router;

saveSchema = async function(schema) {
  try {
          
      await schema.save()
      return true

  } catch (error) {
      
      return error

  }
}
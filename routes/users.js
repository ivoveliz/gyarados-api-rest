var express = require('express');
var router = express.Router();
const { users } = require('../models/index')
let response



/* GET users listing. */
router.post('/add', async function(req, res, next) {
  const SaveUser=new users({
    user:req.body.user,
    email:req.body.email,
    password:req.body.password,
    state:req.body.state,
    role:req.body.role
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
    role:req.body.role
    })
    const doc = await users.findOne({ NameGroup: req.body.user })
    doc.user=req.body.user,
    doc.email=req.body.email,
    doc.password=req.body.password,
    doc.state=req.body.state,
    doc.role=req.body.role
    
    doc.markModified('use')
    doc.markModified('email')
    doc.markModified('password')
    doc.markModified('state')
    doc.markModified('role')
    doc.save()

    response={

        user:req.body.user,
        email:req.body.email,
        password:req.body.password,
        state:req.body.state,
        role:req.body.role,
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
    role:req.query.role
    })
 console.log(req.query)
    var searchedUser = await users.findOne({ email: req.query.email,password:req.query.password})

    // If the device already exists in the database, we add a error message to the session and redirect to the device list

    if(searchedUser){


      if(searchedUser.state=="activate"){
        
        //response =`Usuario ${searchedUser.user} ya se encuentra registrado`
        response={
          userData: {
            id: 1,
            fullName: "Ivo Veliz",
            username: "Ivoveliz",
            avatar: "require('@/assets/images/avatars/13-small.png')",
            email: "admin@demo.com",
            role: "admin",
            ability: [
                {
                    action: "manage",
                    subject: "all"
                }
            ],
            extras: {
                "eCommerceCartItemsCount": 5
            }
        },
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjczMzA1MTU2LCJleHAiOjE2NzMzMDU3NTZ9.GtJvLZvyaHC9SjG06gjYx55PJrhkCPb8PVm5NY5S8aU",
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjczMzA1MTU2LCJleHAiOjE2NzMzMDU3NTZ9.7ppXQA-dJzAP8eA5dIs3yLZQmKZ74PMqJnonTmevF18"
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
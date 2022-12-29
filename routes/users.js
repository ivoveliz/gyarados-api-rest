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

    var searchedUser = await users.findOne({ user: req.query.user,password:req.query.password})

    // If the device already exists in the database, we add a error message to the session and redirect to the device list

    if(searchedUser){


      if(searchedUser.state=="activate"){
        //response =`Usuario ${searchedUser.user} ya se encuentra registrado`
        response={
        user:searchedUser.user,
        state:searchedUser.state,
        role:searchedUser.role,
        access:"permitted"
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
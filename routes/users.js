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
    user:req.body.user,
    email:req.body.email,
    password:req.body.password,
    state:req.body.state,
    role:req.body.role
    })
    var searchedUser = await users.findOne({ user: req.body.user,password:req.body.password})

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
module.exports = router;

saveSchema = async function(schema) {
  try {
          
      await schema.save()
      return true

  } catch (error) {
      
      return error

  }
}
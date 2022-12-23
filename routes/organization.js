var express = require('express');
var router = express.Router();
const {organization } = require('../models/index')
let response



/* GET home page. */
router.post('/add', async function(req, res, next) {
  const SaveOrganization=new organization({
    NamePrimaryGroup:req.body.NamePrimaryGroup,
    IdGroup:req.body.IdGroup,
    SecondaryGroups:req.body.SecondaryGroups
    })
    var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.NamePrimaryGroup,IdGroup:req.body.IdGroup})
    
    if(searchedOrganization){     
    response={
        NamePrimaryGroup:searchedOrganization.NamePrimaryGroup,
        IdGroup:searchedOrganization.IdGroup,
        StateGroup:"exists"

               }   
       
    }else{

        if((error = await saveSchema(SaveOrganization)) != true) {
            context.log("await")
            context.log(error)
            context.done()
            response ="primer grupo no registrado"
        }
        response ={
            NamePrimaryGroup: req.body.NamePrimaryGroup,
            IdGroup:req.body.IdGroup,
            SecondaryGroups:req.body.SecondaryGroups,
            StateGroup:"added"

        }
    }
  res.send( response);
});
router.post('/update', async function(req, res, next) {

  var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.NamePrimaryGroup,IdGroup:req.body.IdGroup})
        //console.log(req.body)
        if(searchedOrganization){
           
           if(searchedOrganization.NamePrimaryGroup!==req.body.NewNamePrimaryGroup ){
            searchedOrganization.NamePrimaryGroup=req.body.NewNamePrimaryGroup
           
            searchedOrganization.markModified('NamePrimaryGroup')
           }
           if(searchedOrganization.IdGroup!==req.body.NewIdGroup ){
            searchedOrganization.IdGroup=req.body.NewIdGroup
           
            searchedOrganization.markModified('IdGroup')
           }
           if(searchedOrganization.SecondaryGroups!==req.body.NewSecondaryGroups){
            searchedOrganization.SecondaryGroups=req.body.NewSecondaryGroups
            searchedOrganization.markModified('SecondaryGroups')
           }
           
          searchedOrganization.save()
 response={
            NamePrimaryGroup: req.body.NamePrimaryGroup,
                IdGroup:req.body.IdGroup,
                SecondaryGroups:req.body.SecondaryGroups,
                StateGroup:"updated"

                   }   
        }

        res.send( response);
});

router.get('/MainPage', async function(req, res, next) {
  let responseGet=[]
  var searchedOrganization = await organization.find()
  //var searchedOrganization1 = await organization.find()
  // console.log(searchedOrganization)
  searchedOrganization.forEach((rateName) => {   
  let NamePrimaryGroup=rateName.NamePrimaryGroup
  let IdGroup=rateName.IdGroup
  let SecondaryGroups=rateName.SecondaryGroups
  responseGet.push({NamePrimaryGroup,IdGroup,SecondaryGroups})
     });

     res.send( responseGet);
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

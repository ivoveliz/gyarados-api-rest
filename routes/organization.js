var express = require('express');
var router = express.Router();
const {organization } = require('../models/index')
let response



/* GET home page. */
router.post('/add', async function(req, res, next) {
  
  const data = req.body.MainGroupAdded.avatarGroup
  const split = data.split(','); // or whatever is appropriate here. this will work for the example given
  const base64string = split[1];
  const buffer = Buffer.from(base64string, 'base64');
  const buffer2= buffer.toString('base64')
  //category.img.data = buffer;
  //console.log(Buffer.from(buffer, 'base64').toString('ascii'))
  const SaveOrganization=new organization({
    NamePrimaryGroup:req.body.MainGroupAdded.NamePrimaryGroup,
    IdGroup:req.body.MainGroupAdded.IdGroup,
    AmountGroup:"3",
    SecondaryGroups:req.body.MainGroupAdded.SecondaryGroups,
    image:buffer
    })
    var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.NamePrimaryGroup,IdGroup:req.body.IdGroup})
    
    if(searchedOrganization){     
    response={
      NamePrimaryGroup:req.body.MainGroupAdded.NamePrimaryGroup,
      IdGroup:req.body.MainGroupAdded.IdGroup,
        StateGroup:"exists"

               }   
       
    }else{

        if((error = await saveSchema(SaveOrganization)) != true) {
            console.log("await")
            console.log(error)
            
            response ="primer grupo no registrado"
        }
        let buffer3='data:image/png;base64,'+buffer2
        response ={
          //buffer2:buffer3,
          //base:req.body.MainGroupAdded.avatarGroup,
            NamePrimaryGroup: req.body.NamePrimaryGroup,
            IdGroup:req.body.IdGroup,
            SecondaryGroups:req.body.SecondaryGroups,
            StateGroup:"added"

        }
    }
  res.send( response);
});
router.post('/update', async function(req, res, next) {
//console.log(req.body.MainGroupUpdate)
  var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.MainGroupUpdate.NamePrimaryGroup,IdGroup:req.body.MainGroupUpdate.IdGroup})
        //console.log(req.body)
        if(searchedOrganization){
           if(req.body.MainGroupUpdate.NewNamePrimaryGroup){

            if(searchedOrganization.NamePrimaryGroup!==req.body.MainGroupUpdate.NewNamePrimaryGroup ){
              searchedOrganization.NamePrimaryGroup=req.body.MainGroupUpdate.NewNamePrimaryGroup
             
              searchedOrganization.markModified('NamePrimaryGroup')
             }
           }
           if(req.body.MainGroupUpdate.NewIdGroup){
           if(searchedOrganization.IdGroup!==req.body.MainGroupUpdate.NewIdGroup ){
            searchedOrganization.IdGroup=req.body.MainGroupUpdate.NewIdGroup
           
            searchedOrganization.markModified('IdGroup')
           }
          }

           if(req.body.MainGroupUpdate.avatarGroup ){

            const data = req.body.MainGroupUpdate.avatarGroup
            const split = data.split(','); // or whatever is appropriate here. this will work for the example given
            const base64string = split[1];
            const buffer = Buffer.from(base64string, 'base64');
            searchedOrganization.image=buffer 
           
            searchedOrganization.markModified('image')
           }
          //  if(searchedOrganization.SecondaryGroups!==req.body.NewSecondaryGroups){
          //   searchedOrganization.SecondaryGroups=req.body.NewSecondaryGroups
          //   searchedOrganization.markModified('SecondaryGroups')
          //  }
           
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
router.delete('/delete', async function(req, res, next) {
//console.log(req)
  if(req.query.confirmation == "true"){

    const doc = await organization.findOneAndDelete({NamePrimaryGroup: req.query.NamePrimaryGroup})

    response={
      NamePrimaryGroup: req.query.NamePrimaryGroup,
      
        StateGroup:"removed"
  }

  }else{

    response={
      NamePrimaryGroup: req.query.NamePrimaryGroup,
     
      StateGroup:"Not-Removed"
    }

  }
        res.send( response);
});

router.get('/MainPage', async function(req, res, next) {
  let responseGet=[]
  let count=0
  let countsecondary=0
  var searchedOrganization = await organization.find()
  //var searchedOrganization1 = await organization.find()
  // console.log(searchedOrganization)
  searchedOrganization.forEach((rateName) => {   
  count++;
  
  let NamePrimaryGroup=rateName.NamePrimaryGroup
  let IdGroup=rateName.IdGroup
  let SecondaryGroups=rateName.SecondaryGroups
  let AmountGroup=rateName.AmountGroup
  let buffer4=rateName.image
  buffer4= buffer4.toString('base64')
  let buffer5='data:image/png;base64,'+buffer4
  responseGet.push({NamePrimaryGroup,IdGroup,SecondaryGroups,AmountGroup,id:count,buffer5})
     });

    
    //  var base64data =searchedOrganization[2]
    //  base64data.image.toString('base64')
   
     let data={
      data:responseGet,
      total:count,
   
    
     }
     res.send(data);
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

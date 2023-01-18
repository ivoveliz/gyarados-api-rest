var express = require('express');
var router = express.Router();
const {organization } = require('../models/index')
let response



/* GET home page. */
router.post('/addMainGroup', async function(req, res, next) {
  
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
    SecondaryGroups:[],
    image:buffer
    })
    var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.MainGroupAdded.NamePrimaryGroup,IdGroup:req.body.MainGroupAdded.IdGroup})
    console.log(searchedOrganization)
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
router.post('/addEntity', async function(req, res, next) {

  var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.AddEntity.MainGroupOrigin,IdGroup:req.body.AddEntity.IdGroupOrigin})

  
  const data = req.body.AddEntity.avatarEntity
  const split = data.split(','); // or whatever is appropriate here. this will work for the example given
  const base64string = split[1];
  const buffer = Buffer.from(base64string, 'base64');
  const buffer2= buffer.toString('base64')
  let EntityPass=false
  searchedOrganization.SecondaryGroups.forEach((rateName) => {  
   
  if(rateName.IdEntity==req.body.AddEntity.IdEntity){
console.log("se repite")
EntityPass=true
  } 

  })
  console.log(EntityPass)
  if(EntityPass==false){
 
            searchedOrganization.SecondaryGroups.push({IdEntity:req.body.AddEntity.IdEntity,DestinyEntity:req.body.AddEntity.DestinyEntity,OriginEntity:req.body.AddEntity.OriginEntity,avatarEntity:req.body.AddEntity.avatarEntity})
            searchedOrganization.markModified('SecondaryGroups')
            searchedOrganization.save()
            
            response={
              IdEntity:req.body.AddEntity.IdEntity,
              DestinyEntity:req.body.AddEntity.DestinyEntity,
              OriginEntity:req.body.AddEntity.OriginEntity,
              avatarEntity:req.body.AddEntity.avatarEntity,
              StateEntity:"Added"
            
             }

          }else{


            response={
              IdEntity:req.body.AddEntity.IdEntity,
              DestinyEntity:req.body.AddEntity.DestinyEntity,
              OriginEntity:req.body.AddEntity.OriginEntity,
              avatarEntity:req.body.AddEntity.avatarEntity,
              StateEntity:"Exists"
            
             }

          }
 
  res.send(response);
});
router.post('/addDevice', async function(req, res, next) {

  var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.AddEntity.MainGroupOrigin,IdGroup:req.body.AddEntity.IdGroupOrigin})

  
  const data = req.body.AddEntity.avatarEntity
  const split = data.split(','); // or whatever is appropriate here. this will work for the example given
  const base64string = split[1];
  const buffer = Buffer.from(base64string, 'base64');
  const buffer2= buffer.toString('base64')
  let EntityPass=false
  searchedOrganization.SecondaryGroups.forEach((rateName) => {  
   
  if(rateName.IdEntity==req.body.AddEntity.IdEntity){
console.log("se repite")
EntityPass=true
  } 

  })
  console.log(EntityPass)
  if(EntityPass==false){
 
            searchedOrganization.SecondaryGroups.push({IdEntity:req.body.AddEntity.IdEntity,DestinyEntity:req.body.AddEntity.DestinyEntity,OriginEntity:req.body.AddEntity.OriginEntity,avatarEntity:req.body.AddEntity.avatarEntity})
            searchedOrganization.markModified('SecondaryGroups')
            searchedOrganization.save()
            
            response={
              IdEntity:req.body.AddEntity.IdEntity,
              DestinyEntity:req.body.AddEntity.DestinyEntity,
              OriginEntity:req.body.AddEntity.OriginEntity,
              avatarEntity:req.body.AddEntity.avatarEntity,
              StateEntity:"Added"
            
             }

          }else{


            response={
              IdEntity:req.body.AddEntity.IdEntity,
              DestinyEntity:req.body.AddEntity.DestinyEntity,
              OriginEntity:req.body.AddEntity.OriginEntity,
              avatarEntity:req.body.AddEntity.avatarEntity,
              StateEntity:"Exists"
            
             }

          }
 
  res.send(response);
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
router.post('/updateEntity', async function(req, res, next) {
  //onsole.log(req.body.EntityEdit)
    var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.EntityEdit.MainGroupOrigin,IdGroup:req.body.EntityEdit.IdGroupOrigin})
    const data = req.body.EntityEdit.avatarEntity
    const split = data.split(','); // or whatever is appropriate here. this will work for the example given
    const base64string = split[1];
    const buffer = Buffer.from(base64string, 'base64');
    const buffer2= buffer.toString('base64')
 
    let arrayFilter =searchedOrganization.SecondaryGroups
    arrayFilter  = arrayFilter.filter(function( obj ) {
    return obj.IdEntity !== req.body.EntityEdit.IdEntity;
  });
  arrayFilter.push({IdEntity:req.body.EntityEdit.NewIdEntity,DestinyEntity:req.body.EntityEdit.NewDestinyEntity,OriginEntity:req.body.EntityEdit.NewOriginEntity,avatarEntity:req.body.EntityEdit.avatarEntity})
  searchedOrganization.SecondaryGroups=arrayFilter
            searchedOrganization.markModified('SecondaryGroups')
            searchedOrganization.save()  

  response={
              IdEntity:req.body.EntityEdit.NewIdEntity,
              DestinyEntity:req.body.EntityEdit.NewDestinyEntity,
              OriginEntity:req.body.EntityEdit.NewOriginEntity,
              avatarEntity:req.body.EntityEdit.avatarEntity,
              StateEntity:"Edited"
            
             }
             res.send(response);

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
router.delete('/DeleteEntity', async function(req, res, next) {
 

  // myArray = myArray.filter(function( obj ) {
  //   return obj.id !== id;
  // });
    if(req.query.confirmation == "true"){
      console.log("query",req.query.IdEntity)
      var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.query.MainGroupOrigin,IdGroup:req.query.IdGroupOrigin})
  let arrayRemoved =searchedOrganization.SecondaryGroups
  arrayRemoved = arrayRemoved.filter(function( obj ) {
    return obj.IdEntity !== req.query.IdEntity;
  });
  let count=0
  arrayRemoved.forEach((rateName) => { 
console.log(rateName.IdEntity)
count++
  })
  console.log(count)
  searchedOrganization.SecondaryGroups=arrayRemoved
            searchedOrganization.markModified('SecondaryGroups')
            searchedOrganization.save()
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

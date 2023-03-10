var express = require('express');
var router = express.Router();
const {organization } = require('../models/index')
let response



/* GET home page. */
router.post('/addMainGroup', async function(req, res, next) {
  //console.log(req.body.MainGroupAdded)
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
    //image:buffer
    })
    
    const Saveimages =new images({
      image:buffer,
      IdAsociate:req.body.MainGroupAdded.IdGroup,

      })
    var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.MainGroupAdded.NamePrimaryGroup,IdGroup:req.body.MainGroupAdded.IdGroup})
    //console.log(searchedOrganization)
    if(searchedOrganization){     
    response={
      NamePrimaryGroup:req.body.MainGroupAdded.NamePrimaryGroup,
      IdGroup:req.body.MainGroupAdded.IdGroup,
        StateGroup:"exists"

               }   
       
    }else{

        if((error = await saveSchema(SaveOrganization)) != true) {
          //console.log("await organization")
           //console.log(error)
            
            response ="primer grupo no registrado"
        }
        if((error = await saveSchema(Saveimages)) != true) {
           //console.log("await images")
           //console.log(error)
          
          response ="primer grupo no registrado"
      }
        // let buffer3='data:image/png;base64,'+buffer2
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
//console.log(req.body)
  var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.AddEntity.MainGroupOrigin,IdGroup:req.body.AddEntity.IdGroupOrigin})

  
  const data = req.body.AddEntity.avatarEntity
  const split = data.split(','); // or whatever is appropriate here. this will work for the example given
  const base64string = split[1];
  const buffer = Buffer.from(base64string, 'base64');
  const buffer2= buffer.toString('base64')

  let EntityPass=false
  searchedOrganization.SecondaryGroups.forEach((rateName) => {  
   
  if(rateName.IdEntity==req.body.AddEntity.IdEntity){
 //console.log("se repite")
EntityPass=true
  } 

  })
  // console.log(EntityPass)
  if(EntityPass==false){
 
    const Saveimages =new images({
      image:buffer,
      IdAsociate:req.body.AddEntity.IdEntity,

      })
      if((error = await saveSchema(Saveimages)) != true) {
        // console.log("await images")
        // console.log(error)
       
       response ="primer grupo no registrado"
   }
            searchedOrganization.SecondaryGroups.push({IdEntity:req.body.AddEntity.IdEntity,DestinyEntity:req.body.AddEntity.DestinyEntity,OriginEntity:req.body.AddEntity.OriginEntity})
            searchedOrganization.markModified('SecondaryGroups')
            //console.log(searchedOrganization.length)
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
//console.log(req.body.AddDevice)
  var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.body.AddDevice.MainGroupOrigin,IdGroup:req.body.AddDevice.IdGroupOrigin})

  
  const data = req.body.AddDevice.avatarDevice
  const split = data.split(','); // or whatever is appropriate here. this will work for the example given
  const base64string = split[1];
  const buffer = Buffer.from(base64string, 'base64');
  const buffer2= buffer.toString('base64')
  let DevicePass=false
  const Device=[]
  let arraySelector =searchedOrganization.SecondaryGroups
  let arrayFilter =searchedOrganization.SecondaryGroups

  arraySelector  = arraySelector.filter(function( obj ) {
  return obj.IdEntity == req.body.AddDevice.IdEntityOrigin;
});
//console.log(arraySelector[0].IdEntity)
if(arraySelector.device){

  // console.log("hayyyy")
}else{
Device.push({IdDevice:req.body.AddDevice.IdDevice,NameDevice:req.body.AddDevice.NameDevice,State:req.body.AddDevice.State,avatarDevice:req.body.AddDevice.avatarDevice})
arraySelector.Device=Device
arrayFilter = arrayFilter.filter(function( obj ) {
  return obj.IdEntity !== req.body.AddDevice.IdEntityOrigin;
});
arrayFilter.push({IdEntity:arraySelector[0].IdEntity,DestinyEntity:arraySelector[0].DestinyEntity,OriginEntity:arraySelector[0].OriginEntity,avatarEntity:arraySelector[0].avatarEntity,Device:Device})

  searchedOrganization.SecondaryGroups=arrayFilter
  searchedOrganization.markModified('SecondaryGroups')
  searchedOrganization.save()  
  
}
arrayFilter.forEach((rateName) => {  
   
//console.log(rateName)
//   if(rateName.IdEntity==req.body.AddEntity.IdEntity){
// console.log("se repite")
// EntityPass=true
//   } 

  })
 // console.log(DevicePass)
  // if(DevicePass==false){

  // searchedOrganization.SecondaryGroups=arrayFilter
  //           searchedOrganization.markModified('SecondaryGroups')
  //           searchedOrganization.save()  

  //           response={
  //             IdEntity:req.body.AddEntity.IdEntity,
  //             DestinyEntity:req.body.AddEntity.DestinyEntity,
  //             OriginEntity:req.body.AddEntity.OriginEntity,
  //             avatarEntity:req.body.AddEntity.avatarEntity,
  //             StateEntity:"Added"
            
  //            }

  //         }else{


  //           response={
  //             IdEntity:req.body.AddEntity.IdEntity,
  //             DestinyEntity:req.body.AddEntity.DestinyEntity,
  //             OriginEntity:req.body.AddEntity.OriginEntity,
  //             avatarEntity:req.body.AddEntity.avatarEntity,
  //             StateEntity:"Exists"
            
  //            }

  //         }
 
  res.send(response);
});
router.post('/updateMainGroup', async function(req, res, next) {
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
router.delete('/deleteMainGroup', async function(req, res, next) {
//console.log(req)
  if(req.query.confirmation == "true"){

    const doc = await organization.findOneAndDelete({NamePrimaryGroup: req.query.NamePrimaryGroup})
    const docImage = await await images.find({ IdAsociate:req.query.NamePrimaryGroup})

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
      // console.log("query",req.query.IdEntity)
      var searchedOrganization = await organization.findOne({ NamePrimaryGroup: req.query.MainGroupOrigin,IdGroup:req.query.IdGroupOrigin})
      const docImage = await await images.find({ IdAsociate:req.query.IdEntity})
  let arrayRemoved =searchedOrganization.SecondaryGroups
  arrayRemoved = arrayRemoved.filter(function( obj ) {
    return obj.IdEntity !== req.query.IdEntity;
  });
  let count=0
  arrayRemoved.forEach((rateName) => { 
// console.log(rateName.IdEntity)
count++
  })
  // console.log(count)
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
  let MOP1="MOP"
  var searchedOrganization = await organization.find()

  //var searchedOrganization1 = await organization.findOne({ NamePrimaryGroup:MOP1})
  //console.log(searchedOrganization1)
  //var searchedOrganization1 = await organization.find().findOne({ 
  // console.log(searchedOrganization)

  for (const item of searchedOrganization) 
  {
     
    count++;
   
    let NamePrimaryGroup=item.NamePrimaryGroup
    let IdGroup=item.IdGroup
    let SecondaryGroupImages=[]
    let SecondaryGroups=item.SecondaryGroups
    for (const item of SecondaryGroups) 
    {
      //console.log(item.ImageEntity)
//console.log(item)
// const ImagesSearchEntity = await images.find({ IdAsociate:item.IdEntity})
// let bufferEntity=ImagesSearchEntity[0].image

// bufferEntity= bufferEntity.toString('base64')
//    let bufferEntityFormat='data:image/png;base64,'+bufferEntity
let AvatarPrimaryGroupFolder="https://storageimagegyarados.blob.core.windows.net/imagesentity/1.png"
SecondaryGroupImages.push({IdEntity:item.IdEntity,DestinyEntity:item.DestinyEntity,OriginEntity:item.OriginEntity,ImageEntity:item.ImageEntity})//,avatarEntity:bufferEntityFormat


    }
  //   const ImagesSearch = await images.find({ IdAsociate:item.IdGroup})
  //   let buffer4=ImagesSearch[0].image
  //   //console.log(buffer4)
  //   buffer4= buffer4.toString('base64')
  //  let buffer5='data:image/png;base64,'+buffer4
  let AvatarPrimaryGroupFolder="https://storageimagegyarados.blob.core.windows.net/imagesentity/3.png"
   responseGet.push({NamePrimaryGroup,IdGroup,SecondaryGroups:SecondaryGroupImages,id:count,AvatarPrimaryGroup:item.AmountGroup})//,buffer5
    // searchedOrganization.forEach((rateName) => {   
    //   count++;
    //   let NamePrimaryGroup=rateName.NamePrimaryGroup
    
    //   let IdGroup=rateName.IdGroup
    //   let SecondaryGroups=rateName.SecondaryGroups
    //   let AmountGroup=rateName.AmountGroup
    //   let buffer4=rateName.image
    //   buffer4= buffer4.toString('base64')
    //   let buffer5='data:image/png;base64,'+buffer4
    //   //responseGet.push({NamePrimaryGroup,IdGroup,AmountGroup,id:count,buffer5})
    
    //      });

  //responseGet.push({NamePrimaryGroup,IdGroup,SecondaryGroups,AmountGroup,id:count,buffer5})
  }


    
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

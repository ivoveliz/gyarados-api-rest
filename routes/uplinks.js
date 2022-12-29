var express = require('express');
var router = express.Router();
const { uplink } = require('../models/index')
const moment = require( 'moment-timezone' )
let response
/* GET home page. */

router.post('/add', async function(req, res, next) {
  
    const Saveuplink=new uplink({
        deviceid:req.body.deviceid,
        payloadHex:req.body.payloadHex,
        ValueDecode:req.body.ValueDecode,
        Entity:req.body.Entity,
        State:req.body.State,
        VertionFirmware:req.body.VertionFirmware,
        AnalogSignal:req.body.AnalogSignal,
        RangeAnalogSignal:req.body.RangeAnalogSignal,
        DigitalSignal:req.body.DigitalSignal,
        ProcessVariable:req.body.ProcessVariable,
        RangeProcessVariable:req.body.RangeProcessVariable
        })

        if((error = await saveSchema(Saveuplink)) != true) {
            context.log("await")
            context.log(error)
            context.done()
            response ="primer grupo no registrado"
        }

        response ={
           deviceid:req.body.deviceid,
            payloadHex:req.body.payloadHex,
            ValueDecode:req.body.ValueDecode,
            Entity:req.body.Entity,
            State:req.body.State,
            VertionFirmware:req.body.VertionFirmware,
            AnalogSignal:req.body.AnalogSignal,
            RangeAnalogSignal:req.body.RangeAnalogSignal,
            DigitalSignal:req.body.DigitalSignal,
            created_at:req.body.created_at,
            StatusMessage:"Saved"

        }
    
        res.send( response);
  });
  
router.get('/tableValues', async function(req, res, next) {
    count=0
    responseValue=[]
    let TotalConsult

    if(req.query.page=="0"){
        TotalConsult =await uplink.find({ Entity: req.query.Entity }).countDocuments();
        
       }
    
const ResponseDB = await uplink.find({ Entity: req.query.Entity }).sort({ _id: -1 }).skip(req.query.page*req.query.perpage).limit(req.query.perpage)

for (const item of ResponseDB ) 
{
let fecha4 = item.created_at;
    
let ValueDecode=item.ValueDecode
    
fecha4= moment.utc(fecha4).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
responseValue.push({ValueDecode:ValueDecode,fecha:fecha4});  
count++;
    }
    
    

response={
Entity:ResponseDB[0].Entity,
deviceid:ResponseDB[0].deviceid,
State:ResponseDB[0].State,
AnalogSignal:ResponseDB[0].AnalogSignal,
RangeAnalogSignal:ResponseDB[0].RangeAnalogSignal,
ProcessVariable:ResponseDB[0].ProcessVariable,
RangeProcessVariable:ResponseDB[0].RangeProcessVariable,
LastDate:moment.utc(ResponseDB[0].created_at).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS'),
total:TotalConsult,
values:responseValue

}
       res.send( response);
  });

  router.get('/exportValues', async function(req, res, next) {
    count=0
responseValue=[]
let TotalConsult
    TotalConsult =await uplink.find({ Entity: req.query.Entity }).countDocuments();
            
    const ResponseDB = await uplink.find({ Entity: req.query.Entity }).sort({ _id: -1 })
    
    for (const item of ResponseDB ) 
    {
    let fecha4 = item.created_at;
        
    let ValueDecode=item.ValueDecode
        
    fecha4= moment.utc(fecha4).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    responseValue.push({ValueDecode:ValueDecode,fecha:fecha4});  
    count++;
        }
    
    
    response={
    Entity:ResponseDB[0].Entity,
    deviceid:ResponseDB[0].deviceid,
    State:ResponseDB[0].State,
    AnalogSignal:ResponseDB[0].AnalogSignal,
    RangeAnalogSignal:ResponseDB[0].RangeAnalogSignal,
    ProcessVariable:ResponseDB[0].ProcessVariable,
    RangeProcessVariable:ResponseDB[0].RangeProcessVariable,
    total:TotalConsult,
    values:responseValue
    
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
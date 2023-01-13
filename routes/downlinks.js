var express = require('express');
var router = express.Router();
const { downlink } = require('../models/index')
const moment = require( 'moment-timezone' )
let response
 
router.post('/SendDownlink', async function(req, res, next) {
  console.log(req.body.params)
    const Savedownlink=new downlink({
        deviceid:req.body.params.Device,
        payloadHex:req.body.params.DownlinkMessage,
        State:"active",
        VertionFirmware:"v1.0",
        })


        if((error = await saveSchema(Savedownlink)) != true) {
        
            response ="primer grupo no registrado"
        }

        response ={
            deviceid:req.body.params.Device,
            payloadHex:req.body.params.DownlinkMessage,
            State:"req.query.State",
            VertionFirmware:"req.query.VertionFirmware",
            StatusMessage:"Saved"

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
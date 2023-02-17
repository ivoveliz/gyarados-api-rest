var express = require('express');
var router = express.Router();
const { uplink,downlink } = require('../models/index')
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
    const DataExportPdf=[]
    const DataExportCsv=[]
    let DateDesde 
    let DateHasta
 
 
    console.log(req.query)
    //let DateExport =req.query.RangeDate
    if(req.query.rangeBefore){
        //DateExport = DateExport.split("to")
        //DateDesde=moment(req.query.rangeBefore).format('x');
        //console.log("desde",DateDesde)
        DateDesde=moment.tz(req.query.rangeBefore, "America/Santiago").format('x')
        //var b = Date.parse(moment.tz(req.query.rangeAfter, "America/Santiago").format('x'))
        DateHasta=moment.tz(req.query.rangeAfter, "America/Santiago").format('x')
        //DateHasta=moment(req.query.rangeAfter).format('x');
          
        // console.log("desde",DateDesde)
        //  console.log("hasta",DateHasta)
    }else{
        DateHasta = Date.now() 
        DateDesde= Math.round(DateHasta-86400000)  
      
      
        // console.log(DateHasta)
    }
   
    
    const keepAliveListTable = await uplink.find({created_at:{ "$gt": DateDesde, "$lt": DateHasta},Entity: req.query.Entity }).sort({ _id: -1 })
    //console.log(DateDesde)
    if(keepAliveListTable){     
        for (const item of keepAliveListTable) 
        {
            //count++;
        let fechaT = item.created_at;
            
        let ValueDecodeInstant  =Math.round(item.ValueDecodeInstant)
        let ValueDecodeTote =item.ValueDecodeTote*200
         
        let fechaC= moment.utc(fechaT).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    
        DataExportPdf.push([fechaC,ValueDecodeInstant,ValueDecodeTote])
        DataExportCsv.push({Date:fechaC,Instant:ValueDecodeInstant,Totalizer:ValueDecodeTote})
        //data2.push([fechaT, ValueDecodeTote])
        //TableValues.push({ date:fechaC, ValueDecodeInstant,ValueDecodeTote,count });
        //responseValue.push({ValueDecodeInstant,ValueDecodeTote,created_at:fecha4});  
  
            }
        }
        DateConsult = Date.now() 
        DateConsult =moment.utc(DateConsult ).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
         
         
        response={
            DataExportPdf:DataExportPdf,
            DataExportCsv:DataExportCsv,
            DateConsult:DateConsult
        }
       res.send(response);
  });

  router.get('/DailyValues', async function(req, res, next) {
    // console.log(req.query)
    count=0
    responseValue=[]
    let TotalConsult
    const series=[]
    const series2=[]
    const data1=[]
    const data2=[]
    const DataChart={}
    const DataChartTotalize={}
    const TableValues=[]
    const TimeStampToday=Date.now()
    const TimeStampYesterday= Math.round(TimeStampToday-86400000)

    const ConsultDateToday=moment.utc(TimeStampToday).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    const ConsultDateYesterday=moment.utc(TimeStampYesterday).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    
    //const keepAliveListTable = await uplink.find({created_at:{ "$gt": TimeStampYesterday, "$lt": TimeStampToday},Entity: req.query.Entity })
    const keepAliveListTable = await uplink.find({Entity: req.query.Entity })
  
    if(keepAliveListTable.length>0){     
        for (const item of keepAliveListTable) 
        {
            count++;
        let fechaT = item.created_at;
            
        let ValueDecodeInstant  =Math.round(item.ValueDecodeInstant)
        let ValueDecodeTote =item.ValueDecodeTote*200
         
        let fechaC= moment.utc(fechaT).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    
        data1.push([fechaT, ValueDecodeInstant])
        data2.push([fechaT, ValueDecodeTote])
        TableValues.push({ date:fechaC, ValueDecodeInstant,ValueDecodeTote,count });
        //responseValue.push({ValueDecodeInstant,ValueDecodeTote,created_at:fecha4});  
        
    
            }
        series.push({name: 'Value m3/h :', data:data1})
        series2.push({name: 'Value m3/h :', data:data2})
      
        DataChart.series=series
        DataChartTotalize.series=series2
        // const Entity=keepAliveListTable[0].Entity
        // const deviceid=keepAliveListTable[0].deviceid
        // const State=keepAliveListTable[0].State
        // const AnalogSignal=keepAliveListTable[0].AnalogSignal
        // const RangeAnalogSignal=keepAliveListTable[0].RangeAnalogSignal
        // const ProcessVariable=keepAliveListTable[0].ProcessVariable
        // const RangeProcessVariable=keepAliveListTable[0].RangeProcessVariable
        
        response={
        // Entity:Entity,
        // deviceid:deviceid,
        // State:State,
        // AnalogSignal:AnalogSignal,
        // RangeAnalogSignal:RangeAnalogSignal,
        // ProcessVariable:ProcessVariable,
        // RangeProcessVariable:RangeProcessVariable,
        ConsultDateToday:ConsultDateToday,
        ConsultDateYesterday:ConsultDateYesterday,
        total:count,
        TableValues:TableValues,
        DataChart:DataChart,
        DataChartTotalize:DataChartTotalize
        
        } 
           
        }else{
    
         
            response ={
             Error:"dont entity register"
    
            }
        }

       res.send( response);
  });
  router.get('/MobileDailyValues', async function(req, res, next) {
    // console.log(req.query)
    count=0
    responseValue=[]
    let TotalConsult
    const series=[]
    const series2=[]
    const data1=[]
    const data2=[]
    const DataChart={}
    const DataChartTotalize={}
    const TableValues=[]
    const TimeStampToday=Date.now()
    const TimeStampYesterday= Math.round(TimeStampToday-86400000)

    const ConsultDateToday=moment.utc(TimeStampToday).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    const ConsultDateYesterday=moment.utc(TimeStampYesterday).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    
    //const keepAliveListTable = await uplink.find({created_at:{ "$gt": TimeStampYesterday, "$lt": TimeStampToday},Entity: req.query.Entity })
    const keepAliveListTable = await uplink.find({Entity: req.query.Entity }).limit(20)
  
    if(keepAliveListTable.length>0){     
        for (const item of keepAliveListTable) 
        {
            count++;
        let fechaT = item.created_at;
            
        let ValueDecodeInstant  =Math.round(item.ValueDecodeInstant)
        let ValueDecodeTote =item.ValueDecodeTote*200
         
        let fechaC= moment.utc(fechaT).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    
        data1.push([fechaT, ValueDecodeInstant])
        data2.push([fechaT, ValueDecodeTote])
        TableValues.push({ date:fechaC, ValueDecodeInstant,ValueDecodeTote,count });
        //responseValue.push({ValueDecodeInstant,ValueDecodeTote,created_at:fecha4});  
        
    
            }
        series.push({name: 'Value m3/h :', data:data1})
        series2.push({name: 'Value m3/h :', data:data2})
      
        DataChart.series=series
        DataChartTotalize.series=series2
        // const Entity=keepAliveListTable[0].Entity
        // const deviceid=keepAliveListTable[0].deviceid
        // const State=keepAliveListTable[0].State
        // const AnalogSignal=keepAliveListTable[0].AnalogSignal
        // const RangeAnalogSignal=keepAliveListTable[0].RangeAnalogSignal
        // const ProcessVariable=keepAliveListTable[0].ProcessVariable
        // const RangeProcessVariable=keepAliveListTable[0].RangeProcessVariable
        
        response={
        // Entity:Entity,
        // deviceid:deviceid,
        // State:State,
        // AnalogSignal:AnalogSignal,
        // RangeAnalogSignal:RangeAnalogSignal,
        // ProcessVariable:ProcessVariable,
        // RangeProcessVariable:RangeProcessVariable,
        ConsultDateToday:ConsultDateToday,
        ConsultDateYesterday:ConsultDateYesterday,
        total:count,
        TableValues:TableValues,
        DataChart:DataChart,
        DataChartTotalize:DataChartTotalize
        
        } 
           
        }else{
    
         
            response ={
             Error:"dont entity register"
    
            }
        }

       res.send( response);
  });

  router.get('/exportDeviceValues', async function(req, res, next) {
    const DataExportPdf=[]
    const DataExportCsv=[]
    let DateDesde
    let DateHasta
    // console.log(req.query)
    let DateExport =req.query.RangeDate
    if(DateExport){
        DateExport = DateExport.split("to")
        DateDesde=moment(DateExport [0]).format('x');
        // console.log("desde",DateExport [0])
        DateHasta=moment(DateExport [1]).format('x');
        // console.log("hasta",DateExport [1])
        // console.log("desde",DateDesde)
        // console.log("hasta",DateHasta)
    }else{
        DateHasta = Date.now() 
        DateDesde= Math.round(DateHasta-86400000)  
      
      
        // console.log(DateHasta)
    }
   
    
    const keepAliveListTable = await uplink.find({created_at:{ "$gt": DateDesde, "$lt": DateHasta},deviceid: req.query.Device}).sort({ _id: -1 })
    //console.log(DateDesde)
    if(keepAliveListTable){     
        for (const item of keepAliveListTable) 
        {
            count++;
        let fechaT = item.created_at;
            
        let ValueDecodeInstant  =Math.round(item.ValueDecodeInstant)
        let ValueDecodeTote =item.ValueDecodeTote*200
         
        let fechaC= moment.utc(fechaT).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    
        DataExportPdf.push([fechaC,ValueDecodeInstant,ValueDecodeTote])
        DataExportCsv.push({Date:fechaC,Instant:ValueDecodeInstant,Totalizer:ValueDecodeTote})
        //data2.push([fechaT, ValueDecodeTote])
        //TableValues.push({ date:fechaC, ValueDecodeInstant,ValueDecodeTote,count });
        //responseValue.push({ValueDecodeInstant,ValueDecodeTote,created_at:fecha4});  
  
            }
        }
        DateConsult = Date.now() 
        DateConsult =moment.utc(DateConsult ).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
         
         
        response={
            DataExportPdf:DataExportPdf,
            DataExportCsv:DataExportCsv,
            DateConsult:DateConsult
        }
       res.send(response);
  });

  router.get('/DailyDeviceValues', async function(req, res, next) {
    // console.log(req.query)
    count=0
    countD=0
    responseValue=[]
    let TotalConsult
    const series=[]
    const series2=[]
    const data1=[]
    const data2=[]
    const DataChart={}
    const DataChartTotalize={}
    const TableValues=[]
    const TableValuesDownlinks=[]
    const TimeStampToday=Date.now()
    const TimeStampYesterday= Math.round(TimeStampToday-86400000)

    const ConsultDateToday=moment.utc(TimeStampToday).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    const ConsultDateYesterday=moment.utc(TimeStampYesterday).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    
    //const keepAliveListTable = await uplink.find({created_at:{ "$gt": TimeStampYesterday, "$lt": TimeStampToday},Entity: req.query.Entity })
    const keepAliveListTable = await uplink.find({deviceid: req.query.Device })
    const DownlinksListTable = await downlink.find({deviceid: req.query.Device })
    
    if(keepAliveListTable){     
        for (const item of keepAliveListTable) 
        {
            count++;
        let fechaT = item.created_at;
            
        let ValueDecodeInstant  =Math.round(item.ValueDecodeInstant)
        let ValueDecodeTote =item.ValueDecodeTote*200
         
        let fechaC= moment.utc(fechaT).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
    
        data1.push([fechaT, ValueDecodeInstant])
        data2.push([fechaT, ValueDecodeTote])
        TableValues.push({ date:fechaC, ValueDecodeInstant,ValueDecodeTote,count });
        //responseValue.push({ValueDecodeInstant,ValueDecodeTote,created_at:fecha4});  
            }

            if(DownlinksListTable){     
                for (const item of DownlinksListTable) 
                {
                    countD++;
                let fechaT = item.created_at;
                    
                let payloadHex =item.payloadHex
                let State =item.State
                let VertionFirmware =item.VertionFirmware
                 
                let fechaC= moment.utc(fechaT).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
            
                
                TableValuesDownlinks.push({ date:fechaC,State ,payloadHex ,countD,VertionFirmware });
                //responseValue.push({ValueDecodeInstant,ValueDecodeTote,created_at:fecha4});  
                    }
             
                   
                }else{
                    TableValuesDownlinks=[]
                }
        series.push({name: 'Value m3/h :', data:data1})
        series2.push({name: 'Value m3/h :', data:data2})
      
        DataChart.series=series
        DataChartTotalize.series=series2
        // const Entity=keepAliveListTable[0].Entity
        const deviceid=keepAliveListTable[0].deviceid
      
        const State=keepAliveListTable[0].State
        // const AnalogSignal=keepAliveListTable[0].AnalogSignal
        // const RangeAnalogSignal=keepAliveListTable[0].RangeAnalogSignal
        // const ProcessVariable=keepAliveListTable[0].ProcessVariable
        // const RangeProcessVariable=keepAliveListTable[0].RangeProcessVariable
        
        response={
        // Entity:Entity,
        deviceid:deviceid,
        State:State,
        // AnalogSignal:AnalogSignal,
        // RangeAnalogSignal:RangeAnalogSignal,
        // ProcessVariable:ProcessVariable,
        // RangeProcessVariable:RangeProcessVariable,
        ConsultDateToday:ConsultDateToday,
        ConsultDateYesterday:ConsultDateYesterday,
        total:count,
        totalD:countD,
        TableValues:TableValues,
        TableValuesDownlinks:TableValuesDownlinks,
        DataChart:DataChart,
        DataChartTotalize:DataChartTotalize
        
        } 
           
        }else{
            response ={
             Error:"dont entity register"
    
            }
        }

        //////////////////////////////////

       res.send( response);
  });
  router.post('/EntityPageValues', async function(req, res, next) {
    //console.log(req.body.MainGroupID)
    const MainGroupValues=[]
    

    let count=0
    let SearchValues=req.body.MainGroupID
    for (const item of SearchValues) 
    {
        const series=[]
        const data1=[]
        let ValueDecodeTote
        let ValueDecodeInstant
        let created_last
        let fechaC
        const MaingGroupValuesFinal = await uplink.find({ Entity:item.IdEntity  }).sort({ _id: -1 }).limit(6)
     
        if(MaingGroupValuesFinal.length>0){
        ValueDecodeTote= MaingGroupValuesFinal[0].ValueDecodeTote
        ValueDecodeInstant= Math.round(MaingGroupValuesFinal[0].ValueDecodeInstant)
        fechaC= MaingGroupValuesFinal[0].created_at
        created_last= moment.utc(fechaC).tz('America/Santiago').format('DD/MM/YYYY-HH:mm');
      
        } 

        MaingGroupValuesFinal.forEach((rateName) => { 
           
            let fechaT = rateName.created_at;
                        
            let ValueDecodeInstant =Math.round(rateName.ValueDecodeInstant)
                       
                         
                        let fechaC= moment.utc(fechaT).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
                    
                        data1.push([fechaT, ValueDecodeInstant])
                      
                 
                        //responseValue.push({ValueDecodeInstant,ValueDecodeTote,created_at:fechaC});  
                        //console.log(data1)  
                       
       



        })
           
        
          series.push({name: 'Value m3/h :', data:data1})
        //   console.log( item.IdEntity)
        //   console.log(series)
       
       let DataChart={
        series:series

       }
        MainGroupValues.push({IdEntity:item.IdEntity,DestinyEntity:item.DestinyEntity,OriginEntity:item.OriginEntity,ImageEntity:item.ImageEntity,Device:item.Device,series:DataChart,ValueDecodeTote:ValueDecodeTote,ValueDecodeInstant:ValueDecodeInstant,created_last:created_last})

    }
              
    // SearchValues.forEach((rateName) => { 

        // const MaingGroupValuesFinal = await uplink.find({ Entity:'L-500-POR-ANDINO' }).sort({ _id: -1 }).limit(6)
        // console.log(MaingGroupValuesFinal )
        //console.log(ResponseDB[0].ValueDecodeInstant)
            
                    // for (const item of ResponseDB) 
                    // {
             
                    // let fechaT = item.created_at;
                        
                    // let ValueDecodeInstant =Math.round(item.ValueDecodeInstant)
                   
                     
                    // let fechaC= moment.utc(fechaT).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
                
                    // data1.push([fechaT, ValueDecodeInstant])
                  
             
                    // //responseValue.push({ValueDecodeInstant,ValueDecodeTote,created_at:fecha4});  
                    // console.log(data1)
                
                    //     }
                    // series.push({name: 'Value m3/h :', data:data1})
       
      
        
        // console.log(rateName.IdEntity)
        //MainGroupValues.push({IdEntity:rateName.IdEntity,DestinyEntity:rateName.DestinyEntity,OriginEntity:rateName.OriginEntit,avatarEntity:rateName.avatarEntity,series:series})

    // })


       res.send(MainGroupValues);
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
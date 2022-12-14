/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Utilities {
    getDefaultOptionProperties(value,title){
        return {
                v:value,
                n:title,
                color:'#000000',
                backgroundColor:'#FFFFFF',
                fontFamily:''
            };
    }
    getDefaultList(list,exception){
        var value={};     
        for(const prop in list){
            if(list[prop].v!==exception){
                value[prop]=this.getDefaultOptionProperties(list[prop].v,list[prop].n);
            }
        }
        return value;
    }
    countObjectProp(obj){
        var i = 0;
        if(!typeof(obj)==='object'){return 0;}
        for (const p in obj){
            i++;
        }
        return i;
    }
    getLastProp(obj){
        //console.log(typeof(obj));
        var l = -1; 
        if(!typeof(obj)==='object'){return -1;}
        for (const p in obj){
            l = p;
        }
        return l;
    }
    setMmToPx(v){
        v = parseFloat(v);
        return v * 3.77952755906;
    }
    setCmToPx(v){
        //console.log('Utilities::setCmToPx()');
        /*
         * 1 cm = 37,795 275 590 551 pixel (X)
         */
        //console.log(v);
        v = parseFloat(v);
        //console.log(v);
        return v * 37.795275590551;
    }
    setPtToPx(v){
        //console.log('Utilities::setPtToPx()');
        /* pt - Point
            1 cm = 37,795275590551 pixel (X)
            1 pt = 0,013888888888889 Inch [in]
            1 pt = 0,035277777777778 Centymetr [cm]
            1 px = 0,026458333333333 Centymetr [cm]
         */
        //console.log(v);
        v = parseFloat(v);
        //console.log(v);
        return v * 1.3333333333;
    }
    setPktToPx(v){
    /*
        1cm = 28,35 pkt
        1mm ~ 2,85 pkt
        1pkt = 0,0352733686067019 cm
        1pkt = 1,333166687497388 px
    */
        v = parseFloat(v);
        return v * 1.333166687497388;
    }
    setPxToPx(v){
        return parseFloat(v);
    }
    setNaToPx(v){
        return parseFloat(v);
    }
    setInToPx(v){
        /* 1 in equal 2,54 cm */
        v=parseFloat(v)*2.54*37.795275590551;
        return v;
    }
    setPcToPx(v){
        /* 6 pc equal 2,54 cm, 1 pc ~ 0,4233333333333333 */
        v=parseFloat(v)*0.4233333333333333*37.795275590551;
        return v;
    }
    /* TO DO -> GET CLIENT RESOLUTION FOR BETTER PX CALCULATE */
    getValueInPx(value,inputMeasurement){
        //console.log('Utilities::getValueInPx()',value,inputMeasurement);
        var measurement={
            mm:'setMmToPx',
            cm:'setCmToPx',
            pt:'setPtToPx',
            pkt:'setPktToPx',
            px:'setPxToPx',
            in:'setInToPx',
            pc:'setPcToPx',
            'n/a':'setNaToPx'         
        }
        try{
            return this[measurement[inputMeasurement]](value);
        }
        catch(e){
            console.log("wrong measurement, return clear value\r",e);
            throw 'wrong measurement';
        }
    }
    cutName(value,max){
        if(value.length>max){
            return value.slice(0,max-3)+'...';
        }
        return value;
   };
   cloneProperty(newObject,o){
        //console.log('newObject:',newObject,"oldObject:",o);
        for(const prop in o){
            //console.log('Value:',o[prop],"Type:",typeof o[prop]);
            if(typeof o[prop] === 'object' ){
                //console.log('object');
                if(o[prop]===null){
                    //console.log('is null');
                    newObject[prop]=null;
                    this.cloneProperty(newObject[prop],o[prop]);
                    /* SKIP */
                    continue;
                }
                //console.log(o[prop].constructor);
                /* determine array and object */
                //if(!o[prop].hasOwnProperty('constructor')){
                   // console.log('constructor prop not exists');
                    /* SKIP */
                   // continue;
               // }
                
                if(o[prop].constructor===Array){
                    //console.log('Array');
                    newObject[prop]=new Array();
                }
                else{
                     //console.log('Object');
                    newObject[prop]=new Object(); 
                }
                this.cloneProperty(newObject[prop],o[prop]);
            }
            else{
                newObject[prop]=o[prop];
            }
        };
    }
    getUid(prefix){
        return prefix+(Math.floor(Math.random() * 10000000)).toString();
    }
    toggleField(field){
        if(field.classList.contains('d-none')){
            field.classList.remove('d-none');
        }
        else{
            field.classList.add('d-none');
        }
    }
    checkbox(ele){
        if(ele.value==='1'){
            ele.value='0';
            ele.checked=false;
        }
        else{
            ele.value='1';
            ele.checked=true;
        }
    }
}
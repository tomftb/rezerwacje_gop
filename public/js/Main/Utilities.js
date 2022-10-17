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
    setCmToPx(v){
        //console.log('Utilities::setCmToPx()');
        /*
         * 1 cm = 37.7952755906 pixel (X)
         */
        //console.log(v);
        v = parseFloat(v);
        //console.log(v);
        v = v * 37.7952755906;
        //console.log(v);
        return v;
    }
    setPtToPx(v){
        //console.log('Utilities::setPtToPx()');
        /*
         * 1 cm = 37.7952755906 pixel (X)
         */
        //console.log(v);
        v = parseFloat(v);
        //console.log(v);
        v = v * 1.3333333333;
        //console.log(v);
        return v;
    }
    cutName(value,max){
        if(value.length>max){
            return value.slice(0,max-3)+'...';
        }
        return value;
   };
   cloneProperty(newObject,o){
        console.log(o);
        for(const prop in o){
            //console.log(typeof o[prop]);
            if(typeof o[prop] === 'object' ){
                newObject[prop]=new Object();
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
}
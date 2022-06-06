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
                backgroundcolor:'#FFFFFF',
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
        var l = ''; 
        if(!typeof(obj)==='object'){return l;}
        for (const p in obj){
            l = p;
        }
        return l;
    }
}
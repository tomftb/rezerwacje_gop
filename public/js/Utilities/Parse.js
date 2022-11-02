class Parse{
    constructor(){
            //console.log('Parse.constructor()');
        }
     getJson(response){
         //console.log('Parse.check()');
         //console.log(response);
        //console.log('Parse.response()');
        var data={
            error:'',
            value:new Object()
        };
        try {
            data.value=JSON.parse(response);  
        }
        catch (e){
            console.log('RESPONSE:');
            console.log(response);
            console.log('ERROR:');
            console.log(e);
            //this.ErrorStack.add('main','Application error occurred! Contact with Administrator!');
            //data.error=true;
            //data.error='JSON.parse ERROR!';
            console.log('JSON.parse ERROR!');
            data.error='Application error occurred! Contact with Administrator!';
            //throw 'Application error occurred! Contact with Administrator!';
            return data;
        }
        if(!data.value.hasOwnProperty('status')){
            console.log('Response does not have `status` property');
            data.error='Application error occurred! Contact with Administrator!';
        }
        if(!data.value.hasOwnProperty('info')){
            console.log('Response does not have `info` property');
            data.error='Application error occurred! Contact with Administrator!';
        }
        if(!data.value.hasOwnProperty('data')){
            console.log('Response does not have `data` property');
            data.error='Application error occurred! Contact with Administrator!';
        }
        if(data.value.status===1){
            data.error=data.value.info;
        }
        return data;
    }
    parse(response){
        //console.log('ProjectItems::parseResponse()');
        try {
            var json=this.getJson(response); 
        }
        catch (e){
            console.log('Parse.parse()');
            console.log(response);
            console.log('ERROR:');
            console.log(e);
            throw 'Application error occurred! Contact with Administrator!';
        }
        if(json.error!==''){
            console.log(json.error);
            throw 'Application error occurred! Contact with Administrator!';
        }
        return json.value;
    }
    getSimpleJson(response){
        console.log('ProjectItems::getSimpleJson()');
        //console.log(response);
        try {
            var json=JSON.parse(response);
                //console.log(json);
        }
        catch (e){
            console.log(e);
            throw 'Application error occurred! Contact with Administrator!';
        }
        if(!json.hasOwnProperty('data')){
            console.log('Response does not have `data` property');
            throw 'Application error occurred! Contact with Administrator!';
        }
        if(!json.hasOwnProperty('info')){
            console.log('Response does not have `info` property');
            throw 'Application error occurred! Contact with Administrator!';
        }
        if(!json.hasOwnProperty('status')){
            console.log('Response does not have `status` property');
            throw 'Application error occurred! Contact with Administrator!';
        }
        if(json.status!==0){
            throw json.info;
        }
        return json.data;
    }
}
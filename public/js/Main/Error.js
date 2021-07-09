class Error
{
    static error=true;
    static div='';
    
    constructor() 
    {
        console.log('Error::constructor()');
    }
    static checkStatusExist = function(s)
    {
        /*
         * s => status
         */
        var e=false;
        console.log('Error::checkStatusExist()\n STATUS: '+s);
        console.log(s);
        //this.clearError();
        if(s==='undefined')
        {
            e=true;
            alert('Error::ERROR OCCURED!');
        }
        return e;
    }
    static checkStatusResponse = function (d)
    {
        /*
         * d => data
         * d['status'] => status
         */
        //console.log(d);
        console.log('Error::checkStatusResponse()\n STATUS: '+d['status']);
        //console.log(d);
        //this.clearError();
        if(d['status']===1)
        {
            Error.parseType(d);
        }
        else if(d['status']===0)
        {
            /*
             * check type if POST, close modal, if get do nothing
             */
            Error.parseType(d);
        }
        else
        {
            console.log('Error::checkStatusResponse() => wrong status => '+d['status']);
            alert('Error::ERROR OCCURED!');
            Error.error=true;
        }
        return Error.error;
    }
    static checkInfoResponse = function (d)
    {
        console.log('Error::checkInfoResponse()');
        if(d['info']==='undefined')
        {
            console.log('Error::checkInfoResponse() => wrong info => '+d['info']);
            alert('Error::ERROR OCCURED!');
        }
        else if(d['info']==='')
        {
            /*
             * check type if POST, close modal, if get do nothing
             */
            console.log('INFO EMPTY');
            
        }
        else
        {
            console.log(d['info']);
            //Error.parseType(d);
        }
    }
    static clearError = function ()
    {
         Error.error=false;
    }
    static parseType = function(d)
    {
        console.log('Error::parseType()');
        if(d['type']==='undefined')
        {
            console.log('Error::parseType() => wrong type => '+d['type']);
            Error.error=true;
            alert('Error::ERROR OCCURED!'); 
            
        }
        else if(d['type']==='POST' && d['status']===1)
        {
            /*
             * close modal
             */
            console.log('type="POST" && status=1');
            Error.error=true;
            Error.checkInfoResponse(d);
            Error.show(d['info']);
        }
        else if(d['type']==='POST' && d['status']===0)
        {
            /*
             * close modal
             */
            console.log('type="POST" && status=0');
            Error.clear();
            Error.error=false;
        }
        // Error.checkInfoResponse(d);
        else if(d['type']==='GET' && d['status']===1)
        {
            Error.error=true;
            Error.checkInfoResponse(d);
            alert(d['info']);
            
        }
        else if(d['type']==='GET' && d['status']===0)
        {
            /*
             * do nothing
             */
            Error.error=false;
        }
        else
        {
            /*
             * ERROR => WRONG OR UNDEFINED STATUS
             */
            Error.error=true;
            console.log('Error::parseType() => wrong type => '+d['type']);
            alert('Error::ERROR OCCURED!'); 

        }
    }
    static set = function (id)
    {
        console.log('Error::set()');
        console.log(id);
        Error.div=document.getElementById(id);
        console.log(Error.div);
    }
    static show = function (value)
    {
        console.log('Error::show()');
        //console.log(Error.div);
        Error.div.innerHTML=value;
        Error.div.classList.remove("d-none");
        Error.div.classList.add("d-block");
    }
    static clear = function ()
    {
        console.log('Error::clear()');
        Error.div.innerText='';
        Error.div.classList.add("d-none");
        Error.div.classList.remove("d-block");
    }
}


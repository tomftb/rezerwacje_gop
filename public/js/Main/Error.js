class Error
{
    static error=true;
    static div='';
    static divId='';
    
    constructor() 
    {
        console.log('Error::constructor()');
    }
    checkStatusExist(d)
    {
        console.log('Error::checkStatusExist()');
        if (!d.hasOwnProperty("status")) {
            throw 'Key `status` not exist';
        }
    }
    checkStatusResponse  (d)
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
            Error.show(d['info']);
            Error.error=true;
        }
        else if(d['status']===0)
        {
            Error.clear();
            Error.error=false;
        }
        else
        {
            console.log('Error::checkStatusResponse() => wrong status => '+d['status']);
            //console.log(d);
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
    set(id)
    {
        console.log('Error::set()');
        Error.divId=id;
        console.log(Error.divId);
    }
    static show(value)
    {
        console.log('Error::show()');
        Error.getDiv();
        console.log(Error.div);
        Error.div.innerHTML=value;
        Error.div.classList.remove("d-none");
        Error.div.classList.add("d-block");
    }
    static clear = function ()
    {
        console.log('Error::clear()');
        Error.getDiv();
        Error.div.innerText='';
        Error.div.classList.add("d-none");
        Error.div.classList.remove("d-block");
    }
    static getDiv(){
        Error.div=document.getElementById(Error.divId);
    }
}


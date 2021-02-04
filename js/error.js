class Error
{
    static error=true;
    static div='';
    static modal='';
    static modalId='';
    
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
        error=false;
    }
    static parseType = function(d)
    {
        console.log('Error::parseType()');
        if(d['type']==='undefined')
        {
            console.log('Error::parseType() => wrong type => '+d['type']);
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
            Error.showDiv(d['info']);
        }
        else if(d['type']==='POST' && d['status']===0)
        {
            /*
             * close modal
             */
            console.log('type="POST" && status=0');
            Error.clearDiv();
            Error.hideModal();
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
    static setDiv = function (id)
    {
        console.log('Error::setDiv()');
        console.log(id);
        Error.div=document.getElementById(id);
        console.log(Error.div);
    }
    static setModal = function (id)
    {
        console.log('Error::setModal()');
        console.log(id);
        Error.modal=document.getElementById(id);
        Error.modalId=id;
        console.log(Error.modal);
    }
    static showDiv = function (value)
    {
        console.log('Error::showDiv()');
        console.log(Error.div);
        Error.div.innerHTML=value;
        Error.div.style.display = "block";
    }
    static clearDiv = function ()
    {
        console.log('Error::clearDiv()');
        Error.div.innerText='';
        Error.div.style.display = "none";
    }
    static hideModal = function ()
    {
        console.log('Error::hideModal()');
        $('#'+Error.modalId).modal('hide');

        
    }
}


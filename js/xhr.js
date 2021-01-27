/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
console.log('xhr.js => AJAX');
class Ajax
{
    link='';
    type="POST";
    
    constructor() 
    { 
        //console.log('Ajax::constructor()');
        //console.log(this);
        this.setUrl();
    }
    setUrl()
    {
        //console.log('AJAX::setUrl()');
        var currentLocation = window.location;
        this.link=currentLocation.protocol+"//"+currentLocation.host+"/";
        //console.log(this.link);
        //return (link);
    }
    sendData(formName,type)
    {
        //console.log('AJAX::sendData()\n'+formName);
        var form=document.getElementById(formName);
        //console.log(form);
        this.type=type;
        if(form===null)
        {
            //console.log('FORM NOT FOUND => getElementById => '+form);
            alert('ERROR OCURRED!');
            return '';
        }
        var fd = new FormData(form);
        /*
         * WE WANT TEXT TO CHECK RETURNED VALUE
         */
        //console.log(fd);
        this.runXhr(fd,'router.php?task='+formName);
    }
    getData (task)
    {
        //console.log('AJAX::getData()');
        //console.log("TASK : "+task);
        this.type='GET';
        this.runXhr(null,'router.php?task='+task);
    }
    runXhr(fd,task)
    {
        var xhr=new XMLHttpRequest();
        //console.log('AJAX::runXhr()'); 
        xhr.addEventListener("error",this.xhrError,false);
        xhr.addEventListener("load", this.xhrLoad, false);
        xhr.addEventListener("progress",this.xhrProgress,false);
        xhr.addEventListener("timeout", this.xhrTimeout, false);
        xhr.addEventListener("loadstart",this.xhrLoadStart,false);
        xhr.addEventListener("loadend", this.xhrLoadEnd, false);
        xhr.open(this.type, this.link+task, true);
        console.log(this.type,this.link+task);
        //xhr.open(type, this.url, true);
        //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(fd);
        //xmlhttp.send(createDataToSend(nameOfForm));
    }
    xhrProgress()
    {
        //console.log('AJAX::xhrProgress()'); 
    }
    xhrTimeout()
    {
        //console.log('AJAX::xhrTimeout()'); 
    }
    xhrLoadStart()
    {
        //console.log('AJAX::xhrLoadStart()'); 
    }
    xhrLoadEnd()
    {
        //console.log('AJAX::xhrLoadEnd()'); 
    }
    xhrError()
    {
        //console.log('AJAX::xhrError()'); 
        //console.log("error:: Niestety nie udało się nawiązać połączenia");
    }
    xhrLoad()
    {
        //console.log('AJAX::xhrLoad()'); 
        var r= new Response();
        switch(this.status)
        {
            case 200:
                    //console.log("AJAX::runXhr() => 200");
                    //console.log(this.response);
                    //console.log(this.status);
                    r.runTask(this.response);
                    break;
            default:
                    //console.log("AJAX::runXhr() =>"+this.status);
                    //console.log(this.response);
                    r.runTask(this.response);
                    break;
        }
    }
}
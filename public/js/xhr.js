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
    form='';
    formName='';
    static runTask='';
    static runObject;
    
    constructor() 
    { 
        console.log('Ajax::constructor()');
        //console.log(this);
        this.setUrl();
    }
    setModul(object){
        Ajax.runObject=object;
        console.log(Ajax.runObject);
    }
    setModulTask(task){
        Ajax.runTask=task;
        console.log(Ajax.runTask);
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
        
        this.checkType(formName);
       
        //console.log(form);
        this.type=type;
        
        var fd = new FormData(this.form);
        /*
         * WE WANT TEXT TO CHECK RETURNED VALUE
         */
        //console.log(fd);
        this.runXhr(fd,'router.php?task='+this.formName);
    }
    checkType(formName)
    {
        //console.log('AJAX::checkType()\n'+formName);
        //console.log(typeof(formName));
        if(typeof(formName)==='string')
        {
            this.form=document.getElementById(formName);
            this.formName=formName;
        }
        else if(typeof(formName)==='object')
        {
            this.form=formName;
            this.formName=this.form.name;
        }
        else
        {
            //console.log('FORM NOT FOUND => getElementById => '+form);
            alert('FORM ERROR OCURRED!');
            return '';
        }
        if(this.form===null)
        {
            //console.log('FORM NOT FOUND => getElementById => '+form);
            alert('FORM ERROR OCURRED!');
            return '';
        }
    }
    getData (task){
        console.log('AJAX::getData('+task+')');
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
            r.setFunctionToRun();
        switch(this.status)
        {
            case 200:
                    
                    //console.log("AJAX::runXhr() => 200");
                    //console.log(this.response);
                    //console.log(this.status);
                    if(Ajax.runObject!==undefined){
                        Ajax.runObject[Ajax.runTask](this.response);
                    }
                    else{
                        r.runTask(this.response);
                    }
                    break;
            default:
                    //console.log("AJAX::runXhr() =>"+this.status);
                    //console.log(this.response);
                    r.runTask(this.response);
                    break;
        }
    }
}
console.log('Xhr::');
/* STATIC VERSION */
class Xhr{
    static runObject;
    static runMethod;
    static block=false;
    static load='';
    static run(type,fd,task){
        console.log('Xhr::run()');
        console.log(fd);
        if(Xhr.block){
            console.log('Already running task, try again later');
            alert('Already running task. Wait.');
            return false;
        }
        //console.log("TASK:\r\n"+task);
       
        //console.log("FULL TASK:\r\n"+task);
        /* 
         * XML HTTP REQUEST 
         */
        var xhr=new XMLHttpRequest();
            xhr.timeout =0 ; // 5000 => 5s time in milliseconds => DEFAULT 0
            //console.log(xhr);
            xhr.addEventListener("error",Xhr.setError,false);
            //xhr.addEventListener("load", ProjectConst.runMethod, false);
            //xhr.addEventListener("progress",this.xhrProgress,false);
            xhr.addEventListener("timeout", Xhr.setError, false);
            xhr.addEventListener("loadstart",Xhr.loadStart,false);
            xhr.addEventListener("loadend", Xhr.loadEnd, false); 
            //xhr.addEventListener("abort", transferCanceled);
            xhr.open(type, task, true);
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //xhr.send(fd,task);
            xhr.send(fd);
            //console.log(type,task);
    }
    static loadStart(){
        console.log('Xhr::loadStart()');
        Xhr.block=true;
        if(Xhr.load!=='' && Xhr.load!==null && Xhr.load!==undefined){
            console.log(Xhr.load);
            Xhr.load.classList.remove('d-none');
            Xhr.load.classList.add('d-block');
            //$(Xhr.load).modal('show');
        }
    }
    static setError(){
        console.log('Xhr::setError()');
        console.log(response);
    }
    static loadEnd(){
        console.log('Xhr::loadEnd()');
        //console.log('CLASS:');
        //console.log(Xhr.runObject);
        //console.log('TASK:');
        //console.log(Xhr.runMethod);
        Xhr.block=false;
        if(Xhr.load!=='' && Xhr.load!==null && Xhr.load!==undefined ){
            console.log(Xhr.load);
            Xhr.load.classList.remove('d-block');
            Xhr.load.classList.add('d-none');
            //$(Xhr.load).modal("hide");
        }
        /*
         * DISABLE LOAD GIF
         */
        //Xhr.loadNotify.innerHTML=''; 
        //Modal.link['extra'].innerHTML=''; 
        /*
         * RUN TASK
         */
        //ProjectConst.runMethod(this.response);
        //console.log(Xhr.runObject);
        //console.log(Xhr.runMethod);
        Xhr.runObject[Xhr.runMethod](this.response);
    }
    static setRun(object,method){
        console.log('Xhr::setRun()');
        Xhr.runObject=object;
        Xhr.runMethod=method;
        //console.log( Xhr.runObject);
        //console.log(Xhr.runMethod);
    }
}
/* NON STATIC VERSION */
class Xhr2 {
    onError=new Object();
    LoadEnd;
    LoadStart;
    uid=0;
    constructor(){
        console.log('Xhr2::constructor()\r\nUID:');
        this.uid=Math.random();
        console.log(this.uid);
    }
    run(property){
        console.log('Xhr2::run()\r\nUID:');
        console.log(this.uid);
        console.log('TYPE:');
        console.log(property.t);
        /*
         * property:
         * t = type GET/POST 
         * u = url
         * c = capture
         * d = data
         * o = object
         * m = method
         */      
       
        var Error=this.onError;
        var LoadEnd = this.LoadEnd;
        var LoadStart = this.LoadStart;
        //console.log(LoadStart);   
        var req=new XMLHttpRequest();
            req.timeout =0 ; // 5000 => 5s time in milliseconds => DEFAULT 0
            
            //console.log(req);
            
            req.open(property.t, property.u, property.c);
            
            req.onloadstart = function (e){
                //console.log('Xhr2::onloadstart()');   
                /*Request started transferring data! - TURN OF*/
                LoadStart();
            };
                  
            req.onprogress = function (e){
                var percentComplete = 100;
                /*
                console.log('Xhr2::onprogress()');  
                console.log(e);
                console.log('loaded');
                console.log(e.loaded);
                console.log('total');
                console.log(e.total);
                */
                if(e.total>0){
                    percentComplete = (e.loaded / e.total)*100;
                }
                /*
                console.log('percentComplete'); 
                console.log(percentComplete); 
                */
            };
            req.onloadend =  function(e){
                /* Occurs when the request has finish, regardless if it was successful or not*/
                //console.log('Xhr2::onloadend()');   
                LoadEnd(); 
                
            };
            req.ontimeout = function (e){
                console.log("The request took too long!");
            };  
            req.onload = function(e) {
                console.log('Xhr2::onload()');
                //console.log(property);
                if(typeof property.o[property.m] !=='function'){
                    console.log("Xhr2::onload() Wrong Object or Method!");
                    console.log("Xhr2::onload() Object:");
                    console.log(property.o);
                    console.log("Xhr2::onload() Method:");
                    console.log(property.m);
                    console.log("Xhr2::onload() Method TYPE:");
                    console.log(Error);
                    console.log(typeof property.o[property.m]);
                    Error.o[Error.m]('Xhr2::onload() An Application Error Has Occurred!');
                }
                else{
                    property.o[property.m](this.response);
                }
            };
            req.onerror =  function(e){
                console.log('Xhr2::onerror()');
                console.log("Podczas pobierania dokumentu wystąpił błąd " + e.target.status + ".");   
                Error.o[Error.m](e);
            };
            req.onabort = function (e){
                console.log("Xhr2::onabort() Request aborted!");
            };
            req.onreadystatechanged  = function() {
                console.log('Xhr2::onreadystatechanged()');
                console.log(req.readyState);
                if (req.readyState == req.DONE) {
                    if (req.status == 200){ console.log("Request finished successfully!");}
                        else {console.log("Request failed!");}
                }
            } ;
            req.send(property.d); 
    }  
    setOnError(property){
        /*
         * property:
         * o = object
         * m = method
         */    
        
        if(typeof property.o[property.m] !=='function'){  
                    console.log(property.o);
                    console.log(property.m);
                    console.log(typeof property.o[property.m]);
                    Error.o[Error.m]('Hxr2::onload() An Application Error Has Occurred!');
                    //throw 'An Application Error Has Occurred!';
                    alert('Xhr2::setOnError() An Application Error Has Occurred!');
        }
        else{
            this.onError=property;
        }
    }
    setOnLoadEnd(f){
        console.log('Xhr2::setOnLoadEnd()');
        this.LoadEnd=f;
    }
    setOnLoadStart(f){
        console.log('Xhr2::setOnLoadStart()');
        this.LoadStart=f;
    }
}
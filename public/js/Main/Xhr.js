console.log('Xhr::');
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
class Xhr2 {
    construct(){
        console.log('Xhr2::construct()');
    }
    run(property){
        console.log('Xhr2::run(p)');
        /*
         * property:
         * t = type GET/POST 
         * u = url
         * c = capture
         * d = data
         * o = object
         * m = method
         */      
        var req=new XMLHttpRequest();
            req.timeout =0 ; // 5000 => 5s time in milliseconds => DEFAULT 0
            req.open(property.t, property.u, property.c);
            req.ontimeout = function (e){
                console.log("The request took too long!");
            }; 
            req.onprogress = function (e){
                console.log(e);
                console.log(e.position);
                console.log(e.totalSize);
                var percentComplete = (e.position / e.totalSize)*100;
                console.log(percentComplete); 
            };
            req.onload = function(e) {
                console.log('Xhr2::onload()');
                property.o[property.m](this.response);
            };
            req.onerror =  function(e){
                console.log('Xhr2::onload()');
                console.log("Podczas pobierania dokumentu wystąpił błąd " + e.target.status + ".");    
            };
            req.onloadend =  function(e){
                /* Occurs when the request has finish, regardless if it was successful or not*/
                console.log('oneloadend');   
            };
            req.onloadstart = function (e){
                console.log("Request started transferring data!");
            };
            req.onabort = function (e){
                console.log("Request aborted!");
            };
            req.onreadystatechanged  = function() {
                console.log(req.readyState);
                if (req.readyState == req.DONE) {
                    if (req.status == 200){ console.log("Request finished successfully!");}
                        else {console.log("Request failed!");}
                }
            } ;
            req.send(property.d); 
    }  
}
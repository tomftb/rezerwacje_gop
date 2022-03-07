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
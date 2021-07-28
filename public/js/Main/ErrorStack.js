class ErrorStack{
    
    static stack=new Object();
    static name='';
    
    constructor() {
        console.log('ErrorStack::constructor()');
    }
    static add(id,info){
        console.log('ErrorStack::add(id,info)');
        console.log(id);
        console.log(info);
        if(!ErrorStack.stack.hasOwnProperty(ErrorStack.name)){  
            alert('ErrorStack::Set ErrorStack name!');
            return false;
        }
        ErrorStack.stack[ErrorStack.name][id]=info;
        console.log(ErrorStack.stack);
        console.log(Object.keys(ErrorStack.stack[ErrorStack.name]).length);
        console.log(ErrorStack.get());
    }
    static remove(id){
        console.log('ErrorStack::remove(id)');
         //ErrorStack.stack[id]
         console.log(id);
        if(!ErrorStack.stack.hasOwnProperty(ErrorStack.name)){  
            alert('ErrorStack::Set ErrorStack name!');
            return false;
        }
        if(id===undefined || id === null){
            alert('ErrorStack::Wrong id!');
            return false;
        }
        if(id.trim()===''){
            alert('ErrorStack::Wrong id.trim()!');
            return false;
        }
        console.log(ErrorStack.stack[ErrorStack.name]);
        console.log(Object.keys(ErrorStack.stack[ErrorStack.name]).length);
        //if(ErrorStack.stack.[id]!==undefined && ErrorStack.stack[id]!==null){
        if(ErrorStack.stack[ErrorStack.name].hasOwnProperty(id)){  
            delete ErrorStack.stack[ErrorStack.name][id];  
        }
    }
    static check(){
        console.log('ErrorStack::check()');
        console.log(Object.keys(ErrorStack.stack[ErrorStack.name]).length);
        if(Object.keys(ErrorStack.stack[ErrorStack.name]).length>0){
            return true;
        }
        return false;
    }
    static get(){
        console.log('ErrorStack::get()');
        var info='';
        for(const prop in ErrorStack.stack[ErrorStack.name]){
            //console.log(prop);
            //console.log(ErrorStack.stack[ErrorStack.name][prop]);
            info+=ErrorStack.stack[ErrorStack.name][prop];
        }
        return info;
    }
    static setBlock(){
        
    }
    static setStackName(name){
        console.log('ErrorStack::setStackName(name)');
         if(name===undefined || name === null){
            alert('ErrorStack::setStackName() Wrong name!');
            return false;
        }
        if(name.trim()===''){
            alert('ErrorStack::setStackName() Wrong name.trim()!');
            return false;
        }
        if(ErrorStack.stack.hasOwnProperty(name)){  
            console.log('ErrorStack::setStackName '+name+' exist => delete');
            delete ErrorStack.stack[name];  
        }
        ErrorStack.stack[name]=new Object();
        ErrorStack.name=name;
        console.log(ErrorStack.stack);
    }
}


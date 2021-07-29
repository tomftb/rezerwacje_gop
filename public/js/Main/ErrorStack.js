class ErrorStack{
    
    static stack=new Object();
    static name='';
    static blockBtn;
    
    constructor() {
        console.log('ErrorStack::constructor()');
    }
    static add(name,id,info){
        console.log('ErrorStack::add(name,id,info)');
        console.log(name);
        console.log(id);
        console.log(info);
        
        if(!ErrorStack.stack.hasOwnProperty(name)){  
            alert('ErrorStack::Set ErrorStack name!');
            return false;
        }
        ErrorStack.stack[name][id]=info;
        console.log(ErrorStack.stack);
        console.log(Object.keys(ErrorStack.stack[name]).length);
        console.log(ErrorStack.get(name));
        ErrorStack.block(name);  
    }
    static remove(name,id){
        console.log('ErrorStack::remove(id)');
         //ErrorStack.stack[id]
         console.log(id);
        if(!ErrorStack.stack.hasOwnProperty(name)){  
            alert('ErrorStack::remove() ErrorStack name!');
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
        console.log(ErrorStack.stack[name]);
        console.log(Object.keys(ErrorStack.stack[name]).length);
        //if(ErrorStack.stack.[id]!==undefined && ErrorStack.stack[id]!==null){
        if(ErrorStack.stack[name].hasOwnProperty(id)){  
            delete ErrorStack.stack[name][id];  
        }
        if(!ErrorStack.check(name)){
            ErrorStack.unblock(name);
        }
    }
    static check(name){
        console.log('ErrorStack::check()');
        if(!ErrorStack.stack.hasOwnProperty(name)){  
            alert('ErrorStack::check() ErrorStack name!');
            return false;
        }
        console.log(Object.keys(ErrorStack.stack[name]).length);
        if(Object.keys(ErrorStack.stack[name]).length>0){
            return true;
        }
        return false;
    }
    static get(name){
        console.log('ErrorStack::get()');
        if(!ErrorStack.stack.hasOwnProperty(name)){  
            alert('ErrorStack::get() ErrorStack name!');
            return false;
        }
        var info='';
        for(const prop in ErrorStack.stack[name]){
            //console.log(prop);
            //console.log(ErrorStack.stack[ErrorStack.name][prop]);
            info+=ErrorStack.stack[name][prop];
        }
        return info;
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
        console.log(ErrorStack.stack);
    }
    static setBlockBtn(btn){
        console.log('ErrorStack::setBlockBtn(btn)');
        console.log();
        if(typeof btn !== 'object'){
            alert('ErrorStack::setBlockBtn() Wrong btn!');
            return false; 
        }
        console.log(btn);
        ErrorStack.blockBtn=btn;
    }
    static block(name){
        if(typeof ErrorStack.blockBtn !== 'object'){
            console.log('ErrorStack::block():');
            console.log(typeof ErrorStack.blockBtn);
            alert('ErrorStack::block() Wrong btn!');
            return false; 
        }
        ErrorStack.blockBtn.classList.add("disabled");
        ErrorStack.blockBtn.setAttribute("disabled",'');
       
    }
    static unblock(name){
        if(typeof ErrorStack.blockBtn !== 'object'){
            console.log('ErrorStack::unblock():');
            console.log(typeof ErrorStack.blockBtn);
            alert('ErrorStack::unblock() Wrong btn!');
            return false; 
        }
        ErrorStack.blockBtn.classList.remove("disabled");
        ErrorStack.blockBtn.removeAttribute('disabled');
    }
}
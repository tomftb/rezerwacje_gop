class ErrorStack{
    
    stack=new Object();
    
    constructor() {
        console.log('ErrorStack::constructor()');
        this.setStack();
    }
    add(id,info){
        console.log('ErrorStack::add(id,info)');
        console.log(id);
        console.log(info);
        this.stack.info[id]=info;
        console.log(this.stack);
        this.block();  
    }
    remove(id){
        console.log('ErrorStack::remove(id)');
        console.log(id);
        if(id===undefined || id === null){
            alert('ErrorStack::remove() Wrong id!');
            return false;
        }
        if(id.trim()===''){
            alert('ErrorStack::remove() Wrong id.trim()!');
            return false;
        }
        //if(ErrorStack.stack.[id]!==undefined && ErrorStack.stack[id]!==null){
        if(this.stack.info.hasOwnProperty(id)){  
            delete this.stack.info[id];  
        }
        if(!this.check()){
            this.unblock();
        }
    }
    check(){
        console.log('ErrorStack::check()');
        if(Object.keys(this.stack.info).length>0){
            return true;
        }
        return false;
    }
    get(){
        console.log('ErrorStack::get()');
        var info='';
        for(const prop in this.stack.info){
            //console.log(prop);
            //console.log(ErrorStack.stack[ErrorStack.name][prop]);
            info+=this.stack.info[prop];
        }
        return info;
    }
    setStack(){
        this.stack={
            info:{},
            block:new Object()
        };
        console.log(this.stack);
    }
    setBlock(btn){
        console.log('ErrorStack::setBlockBtn(btn)');
        if(typeof btn !== 'object'){
            alert('ErrorStack::setBlockBtn() Wrong btn!');
            return false; 
        }
        console.log(btn);
        this.stack.block=btn;
    }
    block(){
        var type=typeof this.stack.block;
        if( type !== 'object'){
            console.log('ErrorStack::block():');
            console.log(type);
            alert('ErrorStack::block() Wrong block element!');
            return false; 
        }
        this.stack.block.classList.add("disabled");
        this.stack.block.setAttribute("disabled",'');
       
    }
    unblock(){
        var type=typeof this.stack.block;
        if(type !== 'object'){
            console.log('ErrorStack::unblock():');
            console.log(type);
            alert('ErrorStack::unblock() Wrong block element!');
            return false; 
        }
        this.stack.block.classList.remove("disabled");
        this.stack.block.removeAttribute('disabled');
    }
}
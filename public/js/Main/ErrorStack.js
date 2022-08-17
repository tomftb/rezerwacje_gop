class ErrorStack{
    
    block=new Array();
    info=new Object();
    Html = new Object();
    
    constructor() {
        console.log('ErrorStack::constructor()');
        this.Html = new Html();
        this.clearStack();
    }
    add(id,info){
        console.log('ErrorStack::add(id,info)');
        console.log(id);
        console.log(info);
        this.info[id.toString()]=info;
        this.setBlock();  
    }
    remove(id){
        console.log('ErrorStack::remove(id)');
        console.log(id);
        id=id.toString();
        if(id===undefined || id === null){
            console.log('Wrong id!');
            console.log(id);
            alert('ErrorStack::remove() Application error occurred! Contact with Administrator!');
            return false;
        }
        if(id.trim()===''){
            console.log('Wrong id.trim()!');
            console.log(id);
            alert('ErrorStack::remove() Application error occurred! Contact with Administrator!');
            return false;
        }
        //if(ErrorStack.stack.[id]!==undefined && ErrorStack.stack[id]!==null){
        if(this.info.hasOwnProperty(id)){  
            delete this.info[id];  
        }
        if(!this.check()){
            this.unsetBlock();
        }
    }
    check(){
        //console.log('ErrorStack::check()');
        if(Object.keys(this.info).length>0){
            return true;
        }
        return false;
    }
    get(){
        //console.log('ErrorStack::get()');
        var info='';
        for(const prop in this.info){
            //console.log(prop);
            //console.log(ErrorStack.[ErrorStack.name][prop]);
            info+=this.info[prop];
        }
        return info;
    }
    clearStack(){
        this.info={};
        this.block=new Array();
    }
    setBlockEle(ele){
        //console.log('ErrorStack::setBlockBtn()');
        if(typeof ele !== 'object'){
            //console.log('Wrong ele');
            //console.log(ele);
            alert('ErrorStack::setBlock() Application error occurred! Contact with Administrator!');
            return false; 
        }
        //console.log(ele);
        this.block.push(ele);
    }
    setBlock(){
        console.log('ErrorStack::block()');
        var action = function(t,b){
                t.Html.addClass(b,"disabled");
                b.setAttribute("disabled",'');
        };
        this.manageBlock(action);
    }
    unsetBlock(){
        //console.log('ErrorStack::unsetBlock()');
        var action = function(t,b){
                t.Html.removeClass(b,"disabled");
                b.removeAttribute("disabled",'');
        };
        this.manageBlock(action);
    }
    manageBlock(action){
        if(typeof this.block !== 'object'){
            console.log('Wrong this.block element');
            console.log(this.block);
            alert('ErrorStack::manageBlock() Application error occurred! Contact with Administrator!');
            return false; 
        }
        try{
            for(let i=0;i<this.block.length;i++){
                action(this,this.block[i]);
            }
        }
        catch (e){
            console.log('Wrong this.block element');
            console.log(this.block);
            alert('ErrorStack::manageBlock() Application error occurred! Contact with Administrator!');
        }
    }
}
class ToolFields{
    
    Tool = new Object();
    Main = new Object();
    Html = new Object();
    
    constructor(Size){
        this.Html = new Html();
        this.Main=this.Html.getRow();
        for(var i= 0;i<Size.length;i++){     
            this.Tool[i]=this.Html.getCol(Size[i]);
            this.Main.appendChild(this.Tool[i]);
        }
    }
    get(prop){
        this.check(prop);
        return this.Tool[prop];
    }
    getMain(){
        return this.Main;
    }
    set(prop,ele){
        this.check(prop);
        this.Tool[prop].appendChild(ele);
    }
    check(prop){
        if(!this.Tool.hasOwnProperty(prop)){
            throw 'ToolFields::set() Error - proeprty not exists';
        }
    }
}
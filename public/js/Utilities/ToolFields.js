class ToolFields{
    
    Field = new Object();
    Main = new Object();
    Html = new Object();
    
    constructor(Size){
        this.Html = new Html();
        this.Main=this.Html.getRow();
        for(var i= 0;i<Size.length;i++){     
            this.Field[i]=this.Html.getCol(Size[i]);
            this.Main.appendChild(this.Field[i]);
        }
    }
    get(prop){
        this.check(prop);
        return this.Field[prop];
    }
    getMain(){
        return this.Main;
    }
    set(prop,ele){
        this.check(prop);
        this.Field[prop].appendChild(ele);
    }
    check(prop){
        if(!this.Field.hasOwnProperty(prop)){
            throw 'ToolFields::set() Error - proeprty not exists';
        }
    }
}
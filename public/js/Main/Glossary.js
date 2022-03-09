class Glossary{
    /* ES6 PRAIVATE => # ON START */
    item={}
    /* GLOSSARY TEXT KEYS:
        color={},
        fontfamily:{},
        decoration:{},
        align:{},
        measurement:{},
        parameter:{}
     */
    
    constructor(){ 
        console.log('Glossary::constructor()');
    }
    
    add(key,value){
        /*
        console.log('Glossary::add()\r\n KEY => ');
        console.log(key); 
        console.log('VALUE => ');
        console.log(value); 
         * 
         */
        this.item[key]=value;
    }
    clear(){
        /*
        console.log('Glossary::remove()'); 
         * 
         */
        this.item={};
    }
    removeKey(key){
        /*
        console.log('Glossary::removeKey()\r\n KEY => '); 
        console.log(key); 
         * 
         */
        delete this.item[key];
    }
    getKey(key){
        /*
        console.log('Glossary::getKey()\r\n KEY => '); 
        console.log(this.item[key]);   
         * 
         */
        return this.item[key];
    }
    getKeyCount(key){
        /*
        console.log('Glossary::getKeyCount()\r\n KEY => '); 
        console.log(this.item[key]);  
         * 
         */ 
        return this.item[key].length;
    }
    get(){
        /*
        console.log('Glossary::get()'); 
         * 
         */
        return this.item;
    }
    getKeyProperty(key,property){
        /*
        console.log('Glossary::getKeyProperty()\r\n KEY => '); 
         * 
         */
        var k=this.getKey(key);
        /*
        console.log(k[property]); 
         * 
         */
        return k[property];
    }
    getKeyPropertyAttribute(key,property,attribute){
        /*
        console.log('Glossary::getKeyPropertyAttribute()\r\n KEY => '); 
        console.log(key); 
         * 
         */
        var k=this.getKeyProperty(key,property);
        /*
         console.log(k[attribute]); 
         */
        return k[attribute];
    }
    exist(key){
        /*
        console.log('Glossary::exist()\r\n KEY => '); 
        console.log(key); 
         * 
         */
        //if(Object.keys(this.item).length > 0){
        if(this.item.hasOwnProperty(key)){
            console.log('Glossary::exist() TRUE');
            return true;
        }
        console.log('Glossary::exist() FALSE');
        return false;
    }
}

class ManageGlossary{
    
    Glossary=new Object();

    constructor(){ 
        /*
        console.log('ManageGlossary::constructor()');
         * 
         */
    }
    create(id){
        /*
        console.log('ManageGlossary::create()');
        console.log(id);
         * 
         */
        this.Glossary[id]=new Glossary();
        /*
        console.log(this.Glossary);
         * 
         */
        return this.Glossary[id];
    }
    exist(id){
        /*
        console.log('ManageGlossary::exist()\r\n ID => '); 
        console.log(id); 
         * 
         */
        if(this.Glossary.hasOwnProperty(id)){
            console.log('ManageGlossary::exist() TRUE');
            return true;
        }
        console.log('ManageGlossary::exist() FALSE');
        return false;
    }
}
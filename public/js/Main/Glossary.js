class Glossary{
    /* ES6 PRAIVATE => # ON START */
    item={}
    filled=false;
    /* GLOSSARY TEXT KEYS:
        color={},
        fontfamily:{},
        decoration:{},
        align:{},
        measurement:{},
        parameter:{}
     */
    
    constructor(){ 
        //console.log('Glossary::constructor()');
    }
    create(){
        return this;
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
        //this[key]=value;
        this.filled=true;
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
        if(!this.item.hasOwnProperty(key)){
            console.log('Glossary::getKeyCount() KEY NOT EXISTS:');
            console.log(key);
            throw 'ERROR in Glossary::removeKey()';
        }
        delete this.item[key];
    }
    getKey(key){
        /*
        console.log('Glossary::getKey()\r\n KEY => '); 
        console.log(this.item[key]);   
         * 
         */
        if(!this.item.hasOwnProperty(key)){
            console.log('Glossary::getKey() KEY NOT EXISTS:');
            console.log(key);
            throw 'ERROR in Glossary::getKey()';
        }
        return this.item[key];
    }
    getKeyCount(key){
        /*
        console.log('Glossary::getKeyCount()\r\n KEY => '); 
        console.log(this.item[key]);  
         * 
         */ 
        if(!this.item.hasOwnProperty(key)){
            console.log('Glossary::getKeyCount() KEY NOT EXISTS:');
            console.log(key);
            throw 'ERROR in Glossary::getKeyCount()';
        }
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
        if(!k.hasOwnProperty(property)){
            console.log('Glossary::getKeyCount() KEY PROPERTY NOT EXISTS:');
            console.log(this);
            console.log('key:');
            console.log(key);
            console.log('property:');
            console.log(property);
            throw 'ERROR in Glossary::getKeyProperty()';
        }
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
        if(!k.hasOwnProperty(attribute)){
            console.log('Glossary::getKeyCount() KEY PROPERTY ATTRIBUTE NOT EXISTS:');
            console.log(key);
            console.log(property);
            throw 'ERROR in Glossary::getKeyPropertyAttribute()';
        }
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
            //console.log('Glossary::exist() TRUE');
            return true;
        }
        //console.log('Glossary::exist() FALSE');
        return false;
    }
    itemCount(){
        var i=0;
        for (const prop in this.item){
           i++;
        }
       return i;
    }
    fill(items){
        /* ALL GLOSSARY DIRECT FROM DB */
        this.item=items;
        this.filled=true;
    }
    like(key,pattern){
        var p = new Object();
        var regex=new RegExp(pattern, 'i');
        if(!this.filled){
            //console.log('EMPTY GLOSSARY');
            return null;
        }
        if(!this.item.hasOwnProperty(key)){
            /*
            console.log('KEY:');
            console.log(key);
            console.log('NO EXISTS IN GLOSSARY');
             */
            return null;
        }
        for (const prop in this.item[key]){   
            if(prop.match(regex)){
                p[prop]=this.item[key][prop];
            }
        }
        return p;
    }
    getItem(item,f,p,r){
        /*
         * item 
         * f - field value to find
         * p - property to compare
         * r - property to return
         */
        if(!this.item.hasOwnProperty(item)){
            console.log('Glossary::getKeyCount() PROPERTY NOT EXISTS:');
            console.log(item);
            throw 'ERROR in Glossary::getItem()';
        }
        for(const prop in this.item[item]){
            //console.log();
            if(this.item[item][prop][p]===f){            
                return this.item[item][prop][r];
                break;
            }
        }
        console.log('Glossary::getKeyCount() VALUE NOT FOUND:');
        console.log(f);
        throw 'ERROR in Glossary::getItem()';
    }
    getItemName(item,value){
        return this.getItem(item,value,'v','n');
    }
    getItemValue(item,name){
        return this.getItem(item,name,'n','v');
        
    }
}
class Item{
    /* TO DO - SET GLOSSARY TO ITEMS */
    item={};
    set(items){
        
    }
    get(){
        return this.item;
    }
}
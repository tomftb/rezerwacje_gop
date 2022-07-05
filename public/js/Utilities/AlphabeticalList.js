/* 
 * Alphabetical List
 * Author: Tomasz Borczynski
 */
class AlphabeticalList{
    lowerList=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    upperList=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    
    lowerExtend(counter,addition){
        console.log('AlphabeticalList::lowerExtend()');
        return document.createTextNode(this.set(counter,this.lowerList)+addition);
    }
    lower(counter){
        console.log('AlphabeticalList::lower()');
        return document.createTextNode(this.set(counter,this.lowerList));
    }
    upperExtend(counter,addition){
        console.log('AlphabeticalList::upperExtend()');
        return document.createTextNode(this.set(counter,this.upperList)+addition);
    }
    upper(counter){
        console.log('AlphabeticalList::upper()');
        return document.createTextNode(this.set(counter,this.upperList));
    }
    set(c,l){
        console.log('AlphabeticalList::set()');
        console.log(c);
        
        /* EXCEPTION - NOT NUMBER*/
        if(typeof(c)!=='number'){
            return 'E-TYPE';
        }
         /* EXCEPTION LOWER COUNTER*/
        if(c<1){
            return 'E-COUNTER';
        }
         /* optimalisation */
         /* INDEX IN ARRAY START FROM 0 */
        if(c<27){
            return l[c-1].toString();
        }
        /* 26 */
        var total = parseInt(c/26,10);
        console.log(total);
        var rest = c%26;
        console.log(rest);
        /* EXCEPTION */
        if(rest===0){
            /* INDEX */
            var all = l[25].repeat(total);
        }
        else{
            var all = l[rest-1].repeat(total+1);
        }
        console.log(all);
        return all.toString();
        //return document.createTextNode(all.toString());
    }

}
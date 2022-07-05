/* 
 * Roman List
 * Author: Tomasz Borczynski
 */
class AlphabeticalList{
    lower(counter){
        console.log('AlphabeticalList::lower()');
        var basic=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        return this.set(counter,basic);
    }
    upper(counter){
        console.log('AlphabeticalList::upper()');
        var basic=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        return this.set(counter,basic);
    }
    set(c,bR){
        console.log('AlphabeticalList::set()');
        console.log(c);
        
        /* EXCEPTION - NOT NUMBER*/
        if(typeof(c)!=='number'){
            return document.createTextNode('E-TYPE');
        }
         /* EXCEPTION LOWER COUNTER*/
        if(c<1){
            return document.createTextNode('E-COUNTER');
        }
         /* optimalisation */
         /* INDEX IN ARRAY START FROM 0 */
        if(c<27){
            return document.createTextNode(bR[c-1]);
        }
        /* 26 */
        var total = parseInt(c/26,10);
        console.log(total);
        var rest = c%26;
        console.log(rest);
        /* EXCEPTION */
        if(rest===0){
            /* INDEX */
            var all = bR[25].repeat(total);
        }
        else{
            var all = bR[rest-1].repeat(total+1);
        }
        console.log(all);
        return document.createTextNode(all);
    }

}
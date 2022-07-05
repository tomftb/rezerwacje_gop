/* 
 * Roman List
 * Author: Tomasz Borczynski
 */
class AlphabeticalList{
    lower(counter){
        console.log('AlphabeticalList::lower()');
        var basic=["","a",'b','c','d','e','f','g','h',"i"];
        var advanced=["x","xl","l","xc","c","cd","d","cm","m","mmmcmxcix"];
        /*
         * x - 10
         * xl - 40
         * l - 50
         * xc - 90
         * c - 100
         * cd - 400
         * d - 500
         * cm - 900
         * m - 1000
         * mmmcmxcix - 3999
         */
        return this.set(counter,basic,advanced);
    }
    upper(counter){
        console.log('AlphabeticalList::upper()');
        var basic=["","A",'B','C','D','E','F','G','H',"I"];
        var advanced=["X","XL","L","XC","C","CD","D","CM","M","MMMCMXCIX"];
        /*
         * X - 10
         * XX - 20
         * XXX - 30
         * XL - 40
         * L - 50
         * LX - 60
         * LXX - 70
         * LXXX - 80
         * XC - 90
         * C - 100
         * CC - 200
         * CCC - 300
         * CD - 400
         * D - 500
         * DC - 600
         * DCC - 700
         * DCCC - 800
         * CM - 900
         * M - 1000
         * MD - 1500
         * MM - 2000
         * MMM - 3000
         */
        return this.set(counter,basic,advanced);
    }
    set(c,bR,aR){
        console.log('AlphabeticalList::set()');
        /* TEST VALUE
            c = 1156;
         */
        /*
            console.log('COUNTER START:');
            console.log(c); // COUNTER
            console.log('BASIC ROMAN:');
            console.log(bR); // BASIC ROMAN
            console.log('ADVANCED ROMAN:');
            console.log(aR); // ADVANCED ROMAN
        */
         
         /* optimalisation */
        if(c<10){
            return document.createTextNode(bR[c]);
        }
        /* the maximum has been reached */
        if(c>3999){
            return document.createTextNode(aR[9]);
        }
        /* NEW ROMAN OBJECT VALUE */
        var r={
            all:''
        };
        /* 1000 */
        c=this.setValue(c,999,1000,aR[8],r);
        /* 900 */
        c=this.setValue(c,899,900,aR[7],r);
        /* 500 */
        c=this.setValue(c,499,500,aR[6],r);
        /* 400 */
        c=this.setValue(c,399,400,aR[5],r);
        /* 100 */
        c=this.setValue(c,99,100,aR[4],r);
        /* 90 */
        c=this.setValue(c,89,90,aR[3],r);
        /* 50 */
        c=this.setValue(c,49,50,aR[2],r);
        /* 40 */
        c=this.setValue(c,39,40,aR[1],r);
        /* 10 */
        c=this.setValue(c,9,10,aR[0],r);    
        /* RETURN NEW ROMAN VALUE */
        console.log(r);
        return document.createTextNode(r.all+bR[c]);
    }
    setValue(c,max,minus,v,roman){
        /*
        console.log('AlphabeticalList::setValue()');
        console.log(counter);
        console.log(max,);
        console.log(minus);
        console.log(v);
        console.log(roman);
        console.log(roman.all);
        */
        while (c>max) {
            c-=minus;
            roman.all+=v;
        }
        return c;
    } 
}
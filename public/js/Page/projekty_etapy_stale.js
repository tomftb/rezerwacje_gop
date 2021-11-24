console.log('stageconst');
class StageConst{
    static publicPerson={
        imie:{
           label:'Imię:'
        },
        nazwisko:{
           label:'Nazwisko:'
        },
        dzial:{
           label:'Dział:'
        },
        budynek:{
           label:'Budynek:'
        },
        pokoj:{
           label:'Dział:'
        },
        dostepny_pod:{
           label:'Dostępny pod:'
        },
        email:{
           label:'<span class="h6"><i class="fa fa-envelope-o text-primary"></i></span> E-mail:'
        },
        stacjonarny:{
           label:'<span class="h5"><i class="fa fa-phone text-success"></i></span> Telefon stacjonarny:'
        },
        komorkowy:{
           label:'<span class="h5"><i class="fa fa-mobile-phone text-warning"></i></span> Telefon komórkowy:'
        }
    }
    static link={
        'head':'',
        'body':'',
        'error':'',
        'footer':''
    }
    static mainDiv='';
    
    static setBtn(){
        
    }
    static setLink(){
        console.log('---static setLink()---');
        console.log(StageConst.mainDiv);
        StageConst.head=StageConst.mainDiv.childNodes[0].childNodes[0].childNodes[0];
        console.log(StageConst.head);
    }
    static setHead(){
        StageConst.head.removeAttribute('class');
        StageConst.head.setAttribute('class','modal-header bg-warning');
        StageConst.head.childNodes[0].childNodes[0].innerText='Stałe';
    }
    static show(){
        console.log('---static show()---');
        StageConst.mainDiv = document.getElementById('AdaptedModal').cloneNode(true);
        StageConst.setLink();
        StageConst.setHead();
        
        $(StageConst.mainDiv).modal('show');
        /* SET TITLE */
        /* SET BODY */
        /* SET FOOTER */
        /* GET DATA */
        /* AJAX GET */
       var xhr=new XMLHttpRequest();
            //xhr.addEventListener("error",PersonShow.runErrorView,false);
            //xhr.addEventListener("load", PersonShow.runView, false);
            //xhr.addEventListener("progress",this.xhrProgress,false);
            //xhr.addEventListener("timeout", this.xhrTimeout, false);
            //xhr.addEventListener("loadstart",this.xhrLoadStart,false);
            //xhr.addEventListener("loadend", PersonShow.runView, false);
            //xhr.open('POST', APP_URL+LANG+'/showperson', true);
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //xhr.send('id='+PersonId);
    }
    static runView(response){//can be var response
        console.log('---static runView()---\r\nID:');
        //console.log(response);
        //console.log(response.currentTarget.response);
        console.log(this.response);
        try {
            var json=JSON.parse(response.currentTarget.response);
            console.log(json);     
            //PersonShow.runPublic(json);
        }
        catch (error) {
            console.log(error); 
            /* show error modal */
           // PersonShow.runErrorView(error);
        } 
    }
    static runErrorView(){   
        var errDiv = document.getElementById('vError').cloneNode(true);
            $(errDiv).modal('show');
    }
    static runPublic(person){
        var div = document.getElementById('vAdaptedModal').cloneNode(true);
            /* set title */
           // PersonShow.createModalHeader(div.childNodes[0].childNodes[0].childNodes[0],person);
            /* set body */
            //PersonShow.createModalBody(div.childNodes[0].childNodes[0].childNodes[1],PersonShow.publicPerson,person);
           // console.log(div.childNodes[0].childNodes[0].childNodes[1]);
           // $(div).modal('show');
    }
    static createModalBody(ele,personProperty,personData){
        for (const property in personProperty)
        {
            //PersonShow.parseModalBodyField(ele,);
            /* cretate row */
            var row=document.createElement('DIV');
                row.setAttribute('class','row mt-2');
            var col1=document.createElement('DIV');
                col1.setAttribute('class','col-4 text-right font-weight-normal');
                col1.innerHTML=personProperty[property].label;
          
            row.appendChild(col1);
            row.appendChild(PersonShow.parseModalBodyField(property,personData[property]));
            ele.appendChild(row);
        }
    }
    static createModalHeader(ele,personData){
        console.log(ele);
        console.log(personData.obecny);
        switch (personData.obecny) {
            case 't':
                ele.classList.add('bg-success');  
                break;
            case 'p':
                ele.classList.add('bg-primary');  
                break;
            case 'k':
                ele.classList.add('bg-warning');  
                break;
            default:
                ele.classList.add('bg-secondary');
                break;
        }
        ele.childNodes[0].innerHTML='Karta kontaktu';
    }
    static parseModalBodyField(property,propertyData){
        console.log('PersonShow::parseModalBodyField()');
        console.log(property);
        console.log(propertyData);
        var col2=document.createElement('DIV');
        switch (property) {
            case 't':
                
                break;
            case 'p':
                
                break;
            case 'k':
                 
                break;
            default:
                
                    col2.setAttribute('class','col-8 ');
                    col2.innerText=propertyData;
                break;
        }
        return col2;
    }
}
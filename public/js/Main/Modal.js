class Modal{
    link={
        'head':'',
        'body':'',
        'error':'',
        'footer':'',
        'adapted':'',
        'form':'',
        'main':'',
        'button':'',
        'buttonConfirm':'',
        'extra':'',
        'info':'',
        'close':''
    }
    Html;
    loadNotify='';
    exist = false;
    constructor() {
        console.log('Modal::construct()'); 
        this.Html = new Html();

    }
    getModal(){
        //console.log('Modal::getModal()'); 
        //console.log(document.getElementById('AdaptedModal'));
        this.link['main'] = document.getElementById('AdaptedModal');
        //console.log( this.link['main']);
        if( this.link['main']!==null && this.link['main']!==undefined){
            //console.log('set true');
            this.exist=true;
        }
        else{
            //console.log('set false');
            this.exist=false;
        }
    }
    closeModal(){
        $(this.link['main']).modal('hide');
        this.clearData();
    }
    setLink(){
        //console.log('Modal::setLink()');
        this.getModal();
        if(!this.exist){ return false; };
        this.link['head']=this.link['main'].childNodes[0].childNodes[0].childNodes[0]; 
        this.link['error']=this.link['main'].childNodes[0].childNodes[0].childNodes[1].childNodes[3];
        this.link['adapted']=this.link['main'].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0];
        this.link['button']=this.link['main'].childNodes[0].childNodes[0].childNodes[1].childNodes[2].childNodes[0].childNodes[0];
        this.link['extra']=this.link['main'].childNodes[0].childNodes[0].childNodes[1].childNodes[4];
        this.link['info']=this.link['main'].childNodes[0].childNodes[0].childNodes[2].childNodes[0];
        this.link['close']=this.link['main'].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0];
        /* 
        console.log(this.link['main']);
        console.log(this.link['close']);
        */
    }
    clearData(){
        console.log('Modal::clearData()');
        this.Html.removeChilds(this.link['error']);
        this.Html.hideField(this.link['error']);
        this.Html.removeChilds(this.link['adapted']);
        this.Html.removeChilds(this.link['button']);
        this.Html.removeChilds(this.link['extra']);
        this.Html.removeChilds(this.link['info']);
        /* REMOVE CLOSE BTN ACTION */
        this.link['close'].removeAttribute('onclick');
        /* REMOVE ONCLICK ACTION ON MAIN MODAL CLOSE BTN ACTION */
        this.link['main'].removeAttribute('onclick');
        //console.log( this.link['close']);
        /* CLEAR HEAD */
        this.setHead('','');
    }
    setHead(title,color){
        /*
        console.log('Modal::setHead()');
        console.log(title);
        console.log(color);
         */
        this.link['head'].removeAttribute('class');
        this.link['head'].setAttribute('class','modal-header '+color);
        this.link['head'].childNodes[0].childNodes[0].innerHTML=title;
        //console.log(this.link['head']);
    }
    showLoad(){
        console.log('Modal::showLoad()');
        if(this.loadNotify!==''){
            this.Html.showField(this.link['extra'],this.loadNotify);
        }
    }
    hideLoad(){
        console.log('Modal::hideLoad()');
        if(this.loadNotify!==''){
            this.Html.hideField(this.link['extra']);
        }
    }
    setInfo(value){
        console.log('Modal::setInfo()');
        var textInfo=document.createElement('small');
            textInfo.setAttribute('class','text-left text-secondary ml-1');
            textInfo.innerHTML=value;
            this.link['info'].appendChild(textInfo);
    }
}
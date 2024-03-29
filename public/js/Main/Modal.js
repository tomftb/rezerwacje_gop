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
        //console.log('Modal::construct()'); 
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
    addLink(label,ele){
        this.link[label]=ele;
    }
    clearData(){
        //console.log('Modal::clearData()');
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
        //console.log('Modal::showLoad()');
        if(this.loadNotify!==''){
            this.Html.showField(this.link['extra'],this.loadNotify);
        }
    }
    hideLoad(){
        //console.log('Modal::hideLoad()');
        if(this.loadNotify!==''){
            this.Html.hideField(this.link['extra']);
        }
    }
    setInfo(value){
        //console.log('Modal::setInfo()');
        var textInfo=document.createElement('small');
            textInfo.setAttribute('class','text-left text-secondary ml-1');
            textInfo.innerHTML=value;
            this.link['info'].appendChild(textInfo);
    }
    setError(e){
        //console.log(e);
        //console.log(this.link);
        this.Html.removeClass(this.link['error'],['d-none','alert-success']);
        this.Html.addClass(this.link['error'],['alert-danger']);
        this.link.error.innerHTML=e;
    }
    unsetError(){
        this.Html.addClass(this.link['error'],'d-none');
        this.link.error.innerHTML='';
    }
    setSuccess(i){
        this.Html.removeClass(this.link['error'],['d-none','alert-danger']);
        this.Html.addClass(this.link['error'],['alert-success']);
        this.link.error.innerHTML=i;
    }
    setLoad(Xhr,appUrl){
           //setLoadModalInfo(Xhr){
        //console.log('ProjectItems::setLoadModalInfo()');
        //var M = this.Modal;
        var self=this;
            this.loadNotify='<img src="'+appUrl+'/img/loading_60_60.gif" alt="load_gif">';
        var start = function(){
                self.showLoad(); 
            };
        var end = function(){
                self.hideLoad();
            };
        Xhr.setOnLoadStart(start);
        Xhr.setOnLoadEnd(end);
    //} 
    }
    setLoadError(){
        //console.log('ProjectItems::modalXhrError()');
         var xhrError={
            o:this,
            m:'setError'
        };
        return xhrError;
    }
    //setModalError(response){
      //  console.log('ProjectItems::setModalError()');
       // console.log(response);
       // this.Html.showField(this.Modal.link['error'],response);
    //}
}
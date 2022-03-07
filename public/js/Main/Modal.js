class Modal{
    static link={
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
    static Html;
    static loadNotify='';
    static exist = false;
    constructor() {}
    static getModal(){
        //console.log('Modal::getModal()'); 
        //console.log(document.getElementById('AdaptedModal'));
        Modal.link['main'] = document.getElementById('AdaptedModal');
        //console.log( Modal.link['main']);
        if( Modal.link['main']!==null && Modal.link['main']!==undefined){
            //console.log('set true');
            Modal.exist=true;
        }
        else{
            //console.log('set false');
            Modal.exist=false;
        }
    }
    static closeModal(){
        $(Modal.link['main']).modal('hide');
        Modal.clearData();
    }
    static setLink(){
        //console.log('Modal::setLink()');
        Modal.getModal();
        if(!Modal.exist){ return false; };
        Modal.link['head']=Modal.link['main'].childNodes[0].childNodes[0].childNodes[0]; 
        Modal.link['error']=Modal.link['main'].childNodes[0].childNodes[0].childNodes[1].childNodes[3];
        Modal.link['adapted']=Modal.link['main'].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0];
        Modal.link['button']=Modal.link['main'].childNodes[0].childNodes[0].childNodes[1].childNodes[2].childNodes[0].childNodes[0];
        Modal.link['extra']=Modal.link['main'].childNodes[0].childNodes[0].childNodes[1].childNodes[4];
        Modal.link['info']=Modal.link['main'].childNodes[0].childNodes[0].childNodes[2].childNodes[0];
        Modal.link['close']=Modal.link['main'].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0];
        /* 
        console.log(Modal.link['main']);
        console.log(Modal.link['close']);
        */
    }
    static clearData(){
        console.log('Modal::clearData()');
        Modal.Html.removeChilds(Modal.link['error']);
        Modal.Html.hideField(Modal.link['error']);
        Modal.Html.removeChilds(Modal.link['adapted']);
        Modal.Html.removeChilds(Modal.link['button']);
        Modal.Html.removeChilds(Modal.link['extra']);
        Modal.Html.removeChilds(Modal.link['info']);
        /* REMOVE CLOSE BTN ACTION */
        Modal.link['close'].removeAttribute('onclick');
        /* REMOVE ONCLICK ACTION ON MAIN MODAL CLOSE BTN ACTION */
        Modal.link['main'].removeAttribute('onclick');
        //console.log( Modal.link['close']);
        /* CLEAR HEAD */
        Modal.setHead('','');
    }
    static setHead(title,color){
        /*
        console.log('Modal::setHead()');
        console.log(title);
        console.log(color);
         */
        Modal.link['head'].removeAttribute('class');
        Modal.link['head'].setAttribute('class','modal-header '+color);
        Modal.link['head'].childNodes[0].childNodes[0].innerHTML=title;
        //console.log(Modal.link['head']);
    }
    static showLoad(){
        //console.log('Modal::showLoad()');
        if(Modal.loadNotify!==''){
            Modal.Html.showField(Modal.link['extra'],Modal.loadNotify);
        }
    }
    static hideLoad(){
        //console.log('Modal::hideLoad()');
        if(Modal.loadNotify!==''){
            Modal.Html.hideField(Modal.link['extra']);
        }
    }
}
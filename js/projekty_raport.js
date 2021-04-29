/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Report
{
    modal;
    form;
    static stageData=new Array();
    stageFunction='';
    static fieldCounter=0;
    static actStage={
        'i':0,
        'n':0,
        't':'',
        'v':new Array()
    };
    
    constructor(projectStageData) {
        console.log('Report::constructor()');
        /* TO DO => PARSE RESPONSE STATUS */
        Report.stageData=projectStageData['data']['value'];
        this.stageFunction=projectStageData['data']['function'];
    }
    create(){
        console.log('Report::create()');
        prepareModal('Raport:','bg-primary');
        this.setModal(document.getElementById('AdaptedModal'));
        this.setForm(createForm('POST',this.stageFunction,'form-horizontal','OFF'));
        var dynamicData=document.getElementById('AdaptedDynamicData');
    
   
    
    var rowDiv=createTag('','div','row');/* ALL */
    
    var optionDiv=createTag('','div','col-md-6');
    var rowLabel=createTag('','div','row pl-1 pr-1');
    var rowData=createTag('','div','row pl-1 pr-1');
    var optionLabel=createTag('Dostępne etapy projektu:','h5','text-info');
        rowLabel.appendChild(optionLabel);

        optionDiv.appendChild(rowLabel);
     
        this.createAvaliableStage(rowData);
        optionDiv.appendChild(rowData);
        
    var dataDiv=createTag('','div','col-md-6');
    var dataDivRowLabel=createTag('','div','row pl-1 pr-1');//align-content-right
    var dataDivRow=createTag('','div','row pl-1 pr-1');
    var dataLabel=createTag('Aktualny raport:','h5','text-center text-info'); 
        dataDivRowLabel.appendChild(dataLabel);
        dataDiv.appendChild(dataDivRowLabel);
        dataDiv.appendChild(dataDivRow);
        
        rowDiv.appendChild(optionDiv);
        
        rowDiv.appendChild(dataDiv);
        dynamicData.appendChild(rowDiv);
        console.log(rowDiv);
    }
    setModal(modal){
        console.log('Report::setModal()');
        this.modal=modal;
        //console.log(this.modal);
    }
    setForm(form){
        console.log('Report::setForm()');
        this.form=form;
    }
    createAvaliableStage(ele){
        for(const prop in Report.stageData){
            var divRowStage=createTag('','div','col-12 border border-info mt-1 mb-1 rounded');
            this.createStageHead(divRowStage,prop);
            for(const propBody in Report.stageData[prop]['v']){
                this.createStageBody(divRowStage,prop,propBody);
            }
            this.createStageFooter(divRowStage,prop);
            ele.appendChild(divRowStage);
        }
    }
    createStageHead(ele,prop){
        //console.log('Report::createStageHead()');
        var divRow=createTag('','div','row'); 
        var divRowHeadN=createTag('','div','col-1 bg-info text-white border-bottom border-info text-center pt-3');  
        var divRowHeadT=createTag('','div','col-10 border-bottom border-info pt-3'); 
        var divRowHeadA=createTag('','div','col-1 border-bottom border-info pl-1'); 
        var number=createTag(Report.stageData[prop]['n'],'span',''); 
        //var pMain=createTag('','p','');    
            divRowHeadN.appendChild(number);
            divRowHeadT.innerHTML=Report.stageData[prop]['t'];
            divRowHeadA.appendChild(this.addBtn(Report.stageData[prop]['i']));
            //divRowHead.appendChild(pMain);
        divRow.appendChild(divRowHeadN);
        divRow.appendChild(divRowHeadT);
        divRow.appendChild(divRowHeadA);
        ele.appendChild(divRow);
    }
    createStageBody(ele,prop,propBody){
        //console.log('Report::createStageBody()');
        var divRowBody=createTag('','div','row');
        //var pMain=createTag('','p','');    
            divRowBody.innerHTML=Report.stageData[prop]['v'][propBody]['v'];
            //divRowBody.appendChild(pMain);
            ele.appendChild(divRowBody);
    }
    createStageFooter(ele,prop){
        //console.log('Report::createStageFooter()');
        var div=createTag('','div','row border-top border-info text-secondary');     
            div.innerHTML='<small>Stage ID: '+Report.stageData[prop]['i']+', Create user: '+Report.stageData[prop]['cu']+'</small>';
        ele.appendChild(div);
    }

    addStage(){
        
    }
    static addStageData(ele,idp){
        Report.getStageData(idp);
        console.log(ele);
       
        ele.appendChild(Report.editedStageField());
    }
    static getStageData(idp){
        console.log('Report::getStageData('+idp+')');
        console.log(Report.stageData);
         /* GET NUMBER, TITLE, VALUE */
        for(const prop in Report.stageData){
            if(parseInt(Report.stageData[prop]['i'],10)===parseInt(idp,10)){
                console.log('FOUND');
                Report.setActStageData(idp,Report.stageData[prop]['n'],Report.stageData[prop]['t'],Report.stageData[prop]['v']);
                return true;
            }
        }
        /* SET DEFAULT */
        var emptyArr=new Array();
        Report.setActStageData(0,0,'ERROR - ELEMENT NOT FOUND',emptyArr);
        return true;
    }
    static setActStageData(i,n,t,v){
        Report.actStage={
            'i':i,
            'n':n,
            't':t,
            'v':v
        };
    }
    static editedStageField(){

        var divInput=createTag('','div','col-12');
            divInput.setAttribute('id','div-'+Report.fieldCounter);
        var divInputRow=createTag('','div','row border border-primary rounded mt-1 mb-1 pt-2 pb-2');  
        var div0=createTag('','div','col-1 pr-0 pl-2');  
        var div1=createTag('','div','col-2  pl-1 pr-1');    
        var div2=createTag('','div','col-8  pl-0 pr-1');
        var div3=createTag('','div','col-1 pl-0');
            div0.appendChild(Report.mvBtn());
            div1.appendChild(createInput('number','n-'+Report.actStage.i,Report.actStage.n,'form-control ','','n'));
            div2.appendChild(createInput('text','t-'+Report.actStage.i,Report.actStage.t,'form-control ','','n'));
            div3.appendChild(Report.rmBtn(divInput));
            
        divInputRow.appendChild(div0);
        divInputRow.appendChild(div1);
        divInputRow.appendChild(div2);
        divInputRow.appendChild(div3);
        divInput.appendChild(divInputRow);
        for(const prop in Report.actStage.v){
            var textarea=createTag(Report.actStage.v[prop]['v'],'textarea','form-control w-100 mt-2 ml-2 mr-2'); //form-control    
            //var textarea=createTag('','div',' w-100'); //form-control
            textarea.setAttribute('name',Report.fieldCounter+'-value');
            textarea.setAttribute('id',Report.fieldCounter+'-data-stage-value');
            textarea.setAttribute('style','height:200px; ');//
            textarea.setAttribute('contenteditable','true');
            divInputRow.appendChild(textarea);
        }
        //divInput.appendChild(createInput('hidden',Report.fieldCounter+'-id',idv,'form-check-input','',''));
        Report.fieldCounter++;
        console.log(divInput);
        return divInput;
    }
    static rmBtn(ele){
    var i=createTag('','i','fa fa-minus');
        i.setAttribute('aria-hidden','true');
        i.setAttribute('style','color:#ffffff;');
    var div=createTag('','div','btn btn-danger');
        div.onclick=function()
        {
            ele.remove();
        };
        div.appendChild(i);
        return(div); 
    }
    static mvBtn(){
    var i=createTag('','i','fas fa-long-arrow-alt-up text-dark text-center ml-2 ml-1 ');
        i.setAttribute('aria-hidden','true');
        Report.changeArrow(i);
        Report.mvUp(i);
    var i1=createTag('','i','fas fa-long-arrow-alt-down text-dark text-center ml-1 mr-1 ');
        i1.setAttribute('aria-hidden','true');
        Report.changeArrow(i1);
        Report.mvDown(i1);
    var div=createTag('','div',' mt-2');
        
        div.appendChild(i);
        div.appendChild(i1);
        return(div); 
    }
    addBtn(idp){
        var btn=createTag('','button','btn  btn-success mt-2 mb-2');
            btn.setAttribute('type','button');
            btn.setAttribute('id',idp);
            btn.onclick = function(){    
                //console.log(this);
                //console.log(this.parentNode.parentNode.parentNode.parentNode.children[1]);
                Report.addStageData(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].childNodes[1],this.id);
            }; 
        var text=document.createTextNode(' ');
        var arrow=createTag('','i','fas fa-caret-right');
            btn.appendChild(text);
           btn.appendChild(arrow);
            return (btn);
    }
    static changeArrow(ele){
        ele.onmouseover = function (){
            this.classList.remove("text-dark");
            this.classList.add("text-info");
            this.style.cursor='pointer';
            //console.log(this);
        };
        ele.onmouseleave = function (){
            this.classList.remove("text-info");
            this.classList.add("text-dark");
            this.style.cursor='auto';
        };
    }
    static mvUp(ele){
        
        ele.onclick=function()
        {
            //console.log(this.parentNode.parentNode.parentNode.parentNode);
            if(this.parentNode.parentNode.parentNode.parentNode.previousSibling!==null)
            {
                console.log('previousSibling exist');
                console.log(this.parentNode.parentNode.parentNode.parentNode.previousSibling);
                this.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(this.parentNode.parentNode.parentNode.parentNode,this.parentNode.parentNode.parentNode.parentNode.previousSibling);
            }
            else{
                console.log('previousSibling NOT exist');
            }
           
        };
    }
    static mvDown(ele){
        ele.onclick=function()
        {
            if(this.parentNode.parentNode.parentNode.parentNode.nextSibling!==null)
            {
                console.log('nextSibling exist');
                this.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(this.parentNode.parentNode.parentNode.parentNode.nextSibling,this.parentNode.parentNode.parentNode.parentNode);
            }
            else{
                console.log('nextSibling NOT exist');
            }
           
        };
    }
}
var ajax = new Ajax();
var error = new Error();
    Error.setDiv('errDiv-Adapted-overall');
    Error.setModal('AdaptedModal');
var table=new Table();
var defaultTask='getprojectsstagelike';
var fieldDisabled='y';
var projectData=new Object();
var actDay = getActDate();
var actData=new Object();
var actData={ 
            data: {},
            info: '',
            modul: '',
            status:0,
            type:'POST'
    };


var inputFieldCounter=0;
setButtonDisplay(document.getElementById('createData'),'ADD_PROJ_STAGE');
//console.log(loggedUserPerm);
var mainTableColumns={
    ID:{
        style:'width:70px;',
        scope:'col'
    },
    Numer:{
        style:'width:70px;',
        scope:'col'
    },
    Tytuł:{
        style:'',
        scope:'col'
    },
    Zawartość:{
        style:'',
        scope:'col'
    },
    "":{
        style:'width:200px;',
        scope:'col'
    }
};

/* OBJECT ELEMENT IS A NAME OF PERMISSION */
var defaultTableBtnConfig=
        {
        SHOW_STAGE : {
            label : 'Wyświetl',
            task : 'psDetails',
            class : 'btn-info',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        HIDE_STAGE : {
            label : 'Ukryj',
            task : 'getProjectStageHideSlo',
            class : 'btn-secondary',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        DEL_STAGE : {
            label : 'Usuń',
            task : 'getProjectStageDelSlo',
            class : 'btn-danger',
            perm :true,
            attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        }
    };
var defaultTableExceptionCol=new Array();

setButtonAvaliable();  
table.setIdFiled(0);
table.setButtons(defaultTableBtnConfig);
table.setColumns(mainTableColumns);
table.setColExceptions(defaultTableExceptionCol);
table.setButtonsType('btn-group');

function runFunction(d)
{
    /* d => array response */
    /* TO DO document.getElementById('AdaptedModalDialog'); */
    console.log('===runFunction()===');
    console.log(d);
    // RUN FUNCTION
    if(Error.checkStatusExist(d['status'])) { return ''; };
    actData=d;
    console.log('FUNCTION TO RUN:\n'+d['data']['function']);
    switch(d['data']['function'])
    {
        case 'psCreate':
                inputFieldCounter=0;
                fieldDisabled='n';
                actData['data']={
                    'value':{
                        'head':{
                            t:'',
                            n:0,
                            i:'0',
                            id:'n/a',
                            cu:'n/a',
                            cd:'n/a',
                            cul:'n/a',
                            md:'n/a',
                            mu:'n/a'
                        },
                        'body':new Array ({
                                            i:'0',
                                            f:'0',
                                            fp:'top',
                                            'v':'',
                                            wsk_v:'1'
                                        }
                                           )
                                
                    }
                };
                manageData('Dodaj','Dodaj etap projektu:','info','psCreate');
                break;
        case 'psDetails':   
                fieldDisabled='y';
                inputFieldCounter=0;
                manageData('Edytuj','Szczegóły etapu projektu:','info','edit');
            break;
        case 'psEdit':
                fieldDisabled='n';
                inputFieldCounter=0;
                //clearAdaptedModalData();
                manageData('Zatwierdź','Edycja etapu projektu:','info','psEdit');
                break;
        case 'cModal':
                cModal(defaultTask,d);
            break;
        case 'psHide':
                removeHideData('Ukryj','UKRYJ ETAP PROJEKT:','secondary');
            break;
        case 'psDelete':
                removeHideData('Usuń','USUŃ ETAP PROJEKT:','danger');
            break;
        default:
                displayAll(d);
            break;
    }
}
function manageData(btnLabel,title,titleClass,task)
{
    console.log('===manageData()===\n'+btnLabel);
    //Error.checkStatusResponse(actData);
    prepareModal(title,'bg-'+titleClass);  

    var form=createForm('POST',task,'form-horizontal','OFF');
    var dynamicData=document.getElementById('AdaptedDynamicData'); 
    var inputRow=createTag('','div','row');
    var inputDynamicData=createTag('','div','col-12');
        inputDynamicData.setAttribute('id','dynamicInput');
    
    var resultRow=createTag('','div','row');

    var pLabel1=createTag('Podaj numer:','h5','text-left font-weight-normal');
    var pLabel2=createTag('Wprowadź tytuł:','h5','text-left font-weight-normal');
    var pTagHelperLabel=createTag('Link pomocniczy: ','h7','text-left font-weight-normal');
    var pTagHelper=createTag('https://www.w3schools.com/tags/default.asp','a','');
        pTagHelper.setAttribute('href','https://www.w3schools.com/tags/default.asp');
        pTagHelper.setAttribute('target','_blank');
    var pTagHelperLegend=createTag('Legenda:','h7','text-left font-weight-normal');
    var pTagHelperLegendValue=createTag('b - <b>pogrubienie</b>,</br>u - <u>podkreślenie</u><br/>i - <i>kursywa</i><br/>p - nowy akapit','p','');
        
    var pLabelResult=createTag('Podgląd:','h5','text-left font-weight-normal');
    var divInput0=createTag('','div','col-2');
    var divInput1=createTag('','div','col-10');
    
    var divResult=createTag('','div','col-12');

    
    var p=createTag('','p','');
        p.setAttribute('id','data-stage-result');
    var input1=createInput('number','number',actData['data']['value']['head']['n'],'form-control','',fieldDisabled);
    var input2=createInput('text','title',actData['data']['value']['head']['t'],'form-control','',fieldDisabled);
  
        divInput0.appendChild(pLabel1);
        divInput0.appendChild(input1);
        divInput1.appendChild(pLabel2);
        divInput1.appendChild(input2);
         //divInput.appendChild(input1);
        // divInput.appendChild(input2);
       
        inputRow.appendChild(divInput0);
        inputRow.appendChild(divInput1);
        var firstLabel='Edytor HTML:';
        var firstDescriptionHeight=200;
        for (const property in actData['data']['value']['body'])
        {
            inputDynamicData.appendChild(createInputTextField(firstLabel,firstDescriptionHeight));
            firstLabel='Wprowadź opis::';
            firstDescriptionHeight=50;
        } 
        inputRow.appendChild(inputDynamicData);
        //inputRow.appendChild(p);
        
        divResult.appendChild(pTagHelperLegend);
        divResult.appendChild(pTagHelperLegendValue);
        divResult.appendChild(pTagHelperLabel);
        divResult.appendChild(pTagHelper);
        divResult.appendChild(pLabelResult);
        divResult.appendChild(p);
        resultRow.appendChild(divResult);
        form.appendChild(createInput('hidden','id',actData['data']['value']['head'].i,'form-check-input','',''));
        form.appendChild(inputRow);
        form.appendChild(createNewField(inputDynamicData));
        form.appendChild(resultRow);
    
    dynamicData.appendChild(form);
    
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('psShowStage',createBtn('Podgląd','btn btn-info','psShowStage'),'psShowStage'));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(task,createBtn(btnLabel,'btn btn-info',task),task));
        /* INFO */
    document.getElementById('AdaptedModalInfo').appendChild(createTag("Project Stage ID: "+actData['data']['value']['head'].i+", Create user: "+actData['data']['value']['head'].cu+" ("+actData['data']['value']['head'].cul+"), Create date: "+actData['data']['value']['head'].cd,'small','text-left text-secondary ml-1'));
}
function createInputTextField(title,height)
{
    /*
     * 
     * REMOVE BUTTON
     */
    //console.log(this);
     var divInput=createTag('','div','row ml-1 mr-1');
     
    var rmBTN=createRmBtn(fieldDisabled,divInput);
        
    var pLabel=createTag(title,'h5','text-left font-weight-normal mt-2 ml-3');
    var textAreaValue='';
    var fileSelected='0';
    var filePosition='top';
    var idv=inputFieldCounter;
        if(actData['data']['value']['body'].hasOwnProperty(inputFieldCounter)){
            textAreaValue=actData['data']['value']['body'][inputFieldCounter].v;
            fileSelected=actData['data']['value']['body'][inputFieldCounter].f;
            filePosition=actData['data']['value']['body'][inputFieldCounter].fp;
            idv=actData['data']['value']['body'][inputFieldCounter].i;
        }

    var textarea=createTag(textAreaValue,'textarea','form-control w-100'); //form-control    
    //var textarea=createTag('','div',' w-100'); //form-control
        textarea.setAttribute('name',inputFieldCounter+'-value');
        textarea.setAttribute('id',inputFieldCounter+'-data-stage-value');
        textarea.setAttribute('style','height:'+height+'px; ');//
        textarea.setAttribute('contenteditable','true');
        if(fieldDisabled==='y')
        {
            textarea.setAttribute('disabled','');
        }
        //textarea.innerHTML='sdfsdf<b>TT  asd  TT<p style="font-weight:bold;">o</p><span>m</span>asz</b> pracuje na <i>projektem.</i> technicznym';
        //textarea.innerHTML='sdfsdf<u>TT  asd  TT<p style="font-weight:bold;">o</p><span>m</span>asz</u> pracuje na <i>projektem.</i> technicznym';
        //textarea.innerHTML='<p style="font-size:24px;"><b><u><i>ALA</i> MA <i>KOTA</i></u></b></p>';
        //textarea.innerHTML='<p style="font-size:24px;"><b><r>test</r><r>test2</r><u><i>ALA MA KOTA</i></u></b></p>';
        //textarea.innerHTML='<p style="font-size:24px;"><b><u><i>ALA <r><s>MA </s></r>KOTA</i></u></b></p>';
        //textarea.innerHTML='<p><i>ALA </i><b>MA </b><u>KOTA</u></p>';
        //textarea.innerHTML='<p><i><u><b>ALA </b><i>MA </i><u>KOTA</u></u></i></p>';
        //textarea.innerHTML='<i><b>ALA <h> JADZIA <s> MAŁOLATA</s></h></b><b>KARA </b><r><l><y> YTEST </y><z>MA</z><w> HA HA HA</w></l></r> <u>KOTA<z> 22<g> LAT </g></z> </u><i>TEST</i></i>';
        //textarea.onblur=function(){   fixText(this.id);   };
    var divOption=createTag('','div','row');
    var optionRow=createTag('','div','col-12');
    
    var divFile=createTag('','div','col-12');
    var divFormFile=createTag('','div','form-check form-check-inline mt-1 mb-1');
    var inputCheckBoxFile=createCheckBox('Czy do opisu ma być zawarty obraz? ',inputFieldCounter+'-file',fieldDisabled,fileSelected);
   
    var inputFileLabel=createTag('&nbsp;Wskaż pozycję dla obrazu:','label','form-check-label');
        inputFileLabel.setAttribute('for',inputFieldCounter+'-file');
    var btnGroup=createTag('','div','btn-group pull-left');
    var btnBold=createTag('B','button','btn btn-dark');
        btnBold.setAttribute('id',inputFieldCounter+'-B');
        btnBold.onclick=function(){   fixText(this.id);   };
    var btnItalic=createTag('I','button','btn btn-dark');
        btnItalic.setAttribute('id',inputFieldCounter+'-I');
        btnItalic.onclick=function(){   fixText(this.id);   };
    var btnUnderline=createTag('U','button','btn btn-dark');
        btnUnderline.setAttribute('id',inputFieldCounter+'-U');
        btnUnderline.onclick=function(){   fixText(this.id);   };
    var btnLeft=createTag('LEFT','button','btn btn-dark');
        btnLeft.setAttribute('id',inputFieldCounter+'-text-left');
        btnLeft.onclick=function(){   fixText(this.id);   };
    var btnRight=createTag('RIGHT','button','btn btn-dark');
        btnRight.setAttribute('id',inputFieldCounter+'-text-right');
        btnRight.onclick=function(){   fixText(this.id);   };
    var btnCenter=createTag('CENTER','button','btn btn-dark');
        btnCenter.setAttribute('id',inputFieldCounter+'-text-center');
        btnCenter.onclick=function(){   fixText(this.id);   };
      
        btnGroup.appendChild(btnBold);
        btnGroup.appendChild(btnItalic);
        btnGroup.appendChild(btnUnderline);
        btnGroup.appendChild(btnLeft);
        btnGroup.appendChild(btnRight);
        btnGroup.appendChild(btnCenter);   
    
    
    
        divOption.appendChild(btnGroup);
        optionRow.appendChild(divOption);

        divInput.appendChild(createInput('hidden',inputFieldCounter+'-id',idv,'form-check-input','',''));
        
       
        divInput.appendChild(rmBTN);
        divInput.appendChild(pLabel);
        divInput.appendChild(textarea);
        divInput.appendChild(optionRow);
        
        divFormFile.appendChild(inputCheckBoxFile);
        divFormFile.appendChild(inputFileLabel);
        divFile.appendChild(divFormFile);
        /*
         * FILE POSITION
         */
        var filePositionData={
            top:'Góra',
            bottom:'Dół',
            left:'Lewo',
            right:'Prawo'
        };
        for (const property in filePositionData)
        {   
            divFile.appendChild(createFilePosition(property,filePositionData[property],filePosition));
        }
        divInput.appendChild(divFile);
    inputFieldCounter++;
    return divInput;
}
function createFilePosition(property,value,checked)
{
    var divFormFile=createTag('','div','form-check form-check-inline mt-1 mb-1');
        var inputRadioFileTop=createInput('radio',inputFieldCounter+'-fileposition',property,'form-check-input','',fieldDisabled);
        inputRadioFileTop.setAttribute('id',inputFieldCounter+'-fileposition-'+property);
        if(checked===property)
        {
            inputRadioFileTop.setAttribute('checked','checked');
        }
        
    var inputRadioFileTopLabel=createTag(value,'label','form-check-label');
        inputRadioFileTopLabel.setAttribute('for',inputFieldCounter+'-fileposition-'+property);
        divFormFile.appendChild(inputRadioFileTop);
        divFormFile.appendChild(inputRadioFileTopLabel);
    return divFormFile;
}
function createInputFileField()
{
    
}
function fixText(id)
{
    console.log('fixText()');
    var sStart=0;
    var sEnd=0;
    //var vLength=document.getElementById('data-stage-value').innerHTML.length;
    var ta=document.getElementById('data-stage-value');
    var vLength=0;
    //var p=document.getElementById('data-stage-result');  
    var selected;
    var selectedParent;
    var parent=new Object();
        parent.ele=new Object();
        parent.selected=new Object();
        parent.foundSearchTag='n';
        parent.stop='data-stage-value';
        parent.sibiling='';
        parent.sibilingLength=0;
        parent.htmlTag=id;
        parent.tmpHtmlTag=id;
        parent.tagRemove='y';
        parent.selectedStart=0;
        parent.selectedEnd=0;
        parent.tmpTag=document.createElement("h");
        parent.tagStart='';
        parent.tagEnd='';
        parent.tagAtr='';
        parent.selectedStart=0;
        parent.selectedEnd=0;
        parent.selectedText='';
        parent.textBefore='';
        parent.textAfter='';
        parent.tmpText='';
        parent.tmpNode=new Array();
        parent.tmpNodeObject=new Object();
        parent.outerValue='';
        parent.tmpTagArray=new Array();
        parent.previousSibling='';
        parent.nextSibling='';
        parent.theSameTagStack=
        {
            open:'',
            close:''
        };
        parent.theDifferentTagStackOpen='';
        parent.theDifferentTagStackClose='';
        //parent.tmpNode=
          //      {
            //        0:new Object(), /* BEFORE */
              //      1:new Object(), /* SELECTED */
                //    2:new Object() /* AFTER */
                //};
        parent.tmpNodeCounter=1;   
        parent.tmpNodeType=0; /* SELECTET */
        
        parent.setNodeTag=function(ele)
        {
            console.log('# setNodeTag()');
            /* CLEAR DATA */
            
            this.tagAtr='';
            this.previousSibling='';
            this.nextSibling='';
            var text='';
            var remove='n';

             /* NO CHECK FOR SIBILING */
                
            this.checkPreviousSibling(ele.previousSibling);    
            this.checkNextSibling(ele.nextSibling);
                    
            if(ele.nodeType===3)
            {
                text=ele.wholeText;
              
            }
            else if(ele.nodeType===1)
            {
                this.setTagAttributes(ele.attributes);      
                text=ele.outerText;
            }
            else
            {
                /* TO DO */
            }
            /* CHECK TAG */
            if(ele.nodeName===this.tmpHtmlTag)
            {
                remove='y';
                console.log('# FOUND HTML TAG => SET TO REMOVE');
            }
            else
            {
                remove='n';
            }
            
            this.tmpTagArray.push({'tag':ele.nodeName,'rm':remove,'tagAtr':this.tagAtr,'prvSib':this.previousSibling,'nxtSib':this.nextSibling,'text':text});   
           
        };
        parent.checkParent=function(ele)
        {
            console.log('# checkParent()');
            console.log(ele);
            
            if(ele===null)
            {
                /* END OF DOCUMENT */  
                console.log('# checkParent() => END OF DOCUMENT');
            }
            else if(ele.id===this.stop)
            {
                /* END OF FORM */
                console.log('# checkParent() => END OF FORM');
            }
            else
            {             
                this.setNodeTag(ele);  
                this.checkParent(ele.parentNode);
            };
        };
        parent.checkSibling=function(ele)
        {
            /* DODAJ REKURENCJE */
            console.log('checkSbiling()');
            console.log(ele);
            if(ele)
            {
                console.log('sibiling exist');
                /* CHECK TYPE OF SIBLING */
                console.log('NODE TYPE => '+ele.nodeType);
                /*
                    Node.ELEMENT_NODE == 1
                    Node.ATTRIBUTE_NODE == 2
                    Node.TEXT_NODE == 3
                    Node.CDATA_SECTION_NODE == 4
                    Node.ENTITY_REFERENCE_NODE == 5
                    Node.ENTITY_NODE == 6
                    Node.PROCESSING_INSTRUCTION_NODE == 7
                    Node.COMMENT_NODE == 8
                    Node.DOCUMENT_NODE == 9
                    Node.DOCUMENT_TYPE_NODE == 10
                    Node.DOCUMENT_FRAGMENT_NODE == 11
                    Node.NOTATION_NODE == 12
                 */
                if(ele.nodeType===3)
                {
                    //console.log(ele.textContent);
                    //console.log(ele.wholeText);
                    return ele.wholeText;
                }
                else if(ele.nodeType===1)
                {
                    //console.log(ele.innerHTML);
                    //console.log(ele.outerHTML);
                    return ele.outerHTML;
                }
                else
                {
                    /* TO DO */
                }    
            }
            else
            {
                console.log('NO sibiling exist');
            }
            return '';
        };
        parent.checkPreviousSibling=function(ele)
        {
            console.log('# checkPreviousSibling()');
            console.log(ele);
            /* check and set value depend of type */
            this.previousSibling=this.checkSibling(ele)+this.previousSibling;
            if(ele)
            {
                this.checkPreviousSibling(ele.previousSibling);
            }
            else
            {
                /* NO PreviousSibling */
            }
        };
        parent.checkNextSibling=function(ele)
        {
            console.log('# checkNextSibling()');
            console.log(ele);
             /* check and set value depend of type */
            this.nextSibling=this.nextSibling+this.checkSibling(ele);
            if(ele)
            {
                this.checkNextSibling(ele.nextSibling);
            }
            else
            {
                /* NO NextSibling */
            }
        };
        parent.setTagAttributes=function(ele)
        {
            for (var i=0; i<ele.length;i++)
            {
                //console.log(ele[i]);
                this.tagAtr=this.tagAtr+" "+ele[i]['nodeName']+"=\""+ele[i]['nodeValue']+"\"";
                /* textContent */
            }
        };
        parent.setSelectedText=function()
        {
            this.found='n';
            var tmp='';
            /*

            According to MDN

            Selection.anchorNode - Returns the Node in which the selection begins.

            Selection.focusNode - Returns the Node in which the selection ends.

            because there were debates on naming, baseNode is alias for anchorNode, extentNode for focusNode

            */
            console.log(this.selected);
            console.log('#### CHECK anchorNode ####');
            this.checkParent(this.selected.anchorNode);
            console.log('#### CHECK focusNode ####');
            this.checkParent(this.selected.focusNode);
            /*
            var tmpText=this.selected.anchorNode.data;
            console.log('setSelectedText()');
            console.log(tmpText);
            //this.outerValue=this.selected.toString();
            this.selectedText=this.selected.toString();
            this.tmpText=this.selectedText;
            this.selectedStart=this.selected.anchorOffset;
            this.selectedEnd=this.selected.extentOffset;
            console.log('SELECTED TEXT => '+ this.selectedText);
            console.log('SELECTTED TEXT LENGTH => '+ this.selectedText.length);
            if(this.selectedStart>this.selectedEnd)
            {
                console.log('SELECTED ALL TEXT IN TAG => SWAP');
                tmp=this.selectedStart;
                this.selectedStart=this.selectedEnd;
                this.selectedEnd=tmp;
            }
            else if(this.selectedStart===this.selectedEnd)
            {
                console.log('NOTHING SELECTED');
            }
            else
            {
                console.log('SELECTED PART OF THE TEXT');
            }
            console.log('SELECTED START => '+ this.selectedStart);
            console.log('SELECTED END => '+ this.selectedEnd);
            this.textBefore=tmpText.substring(0,this.selectedStart);
            this.textAfter=tmpText.substring(this.selectedEnd,tmpText.length);
            console.log('TEXT BEFORE => '+ this.textBefore);
            console.log('TEXT AFTER => '+ this.textAfter);
            //parent.checkSibling(this.selected.anchorNode.previousSibling);
            */
        };
        parent.getNewValue=function()
        {
            console.log('===getNewValue()===');
            console.log(this.selected);
            console.log('===selectedTag===');
            console.log(this.tmpHtmlTag);
            this.tmpNodeType=0;
            this.tmpNodeCounter=0;
            this.tagRemove='n';

            /*
             * CLEAR DATA
             */
            this.previousSibling='';
            this.nextSibling='';
            this.foundSearchTag='n';
                     
            this.checkPreviousSibling(this.selected.anchorNode.previousSibling);
            this.textBefore=this.previousSibling+this.textBefore;
            
            this.checkNextSibling(this.selected.anchorNode.nextSibling);  
            this.textAfter=this.textAfter+this.nextSibling;
            
            /* BEFOR SELECTED */
            console.log('===== AFTER =====');
            
            this.checkParent(this.selected.anchorNode.parentNode);
            
            this.tmpNode.push({
                text:this.textBefore,
                tags:this.tmpTagArray,
                diff_open:'',
                diff_close:'',
                diff_atr:''
            });
            this.tmpTagArray=[];
            
            /* SELECTED */
            console.log('===== SELECTED =====');
            this.tmpNodeType=1;
            this.tmpNodeCounter=1;
            this.tagRemove='y';
            /* SET HTML TAG TO ADD/REMOVE */
            this.tmpHtmlTag=this.htmlTag;
            this.tmpText=this.selectedText;


            this.checkParent(this.selected.anchorNode.parentNode);          
            
            this.tmpNodeObject={
                textBefore:this.textBefore,
                textAfter:this.textAfter,
                selected:this.selectedText,
                selectedNew:'<'+this.tmpHtmlTag+'>'+this.selected+'</'+this.tmpHtmlTag+'>',
                tags:this.tmpTagArray,
                diff_open:'',
                diff_close:'',
                diff_atr:''
            };
            
            this.tmpNode.push({
                text:this.textBefore,
                tags:this.tmpTagArray,
                diff_open:'',
                diff_close:'',
                diff_atr:''
            });
            
   

            this.tmpTagArray=[];
            
            /* AFTER SELECTED */
            //console.log('===== AFTER =====');
            this.tmpNodeType=2;
            this.tmpNodeCounter=1;
            this.tmpText=this.textAfter;
            parent.checkParent(this.selected.anchorNode.parentNode);
            
           
            
            this.tmpNode.push({
                text:this.textAfter,
                tags:this.tmpTagArray,
                diff_open:'',
                diff_close:'',
                diff_atr:''
            });
            
            //this.tmpNode.set(this.tmpNodeType,{text:this.textAfter,tag:this.tmpTagArray});
            //this.tmpTagArray=[];
            //this.outerValue=this.outerValue+this.tmpText;
            
            //console.log('NODE COUNTER => '+this.tmpNodeCounter);
            console.log('### NODE OBJECT: ###');
            console.log(this.tmpNodeObject);
            console.log('### NODE ARRAY: ###');
            console.log(this.tmpNode);
            //console.log(this.tmpNode.length);
            /* COMBINE ALL */
            //this.combineAll();
            this.combineAll2();
        };
        parent.combineAll2=function()
        {
            console.log('# combineAll2'); 
            this.tmpNodeObject.tags.reverse();
            for(const property in this.tmpNode)
            {
                    
            }
        };
        parent.combineAll=function()
        {
            /* CHECK LAST TAG OF ALL OF THE TAG ARRAY 
             * IF THE SAME CREATE ONE OPEN AND CLOSE TAG
             * if DIFFERENT
             * 
             * 
             * */
            /* SET MAX TAG LENGTH */
            var depth = this.setGraphDepth();
            var tmpTag='';
            var tmpTagArray=new Array();
            var tmpTagArrayRow=new Array();
            var tmpTagArrayRowOpen=new Array();
            var tmpTagArrayRowClose=new Array();
            
            var firstTag=false;
            var theSameTag=true;
            var theSameTagOpen='';
            var theSameTagClose='';
            var newTextToReturn='';
                    
            for(var d=0;d<depth;d++)
            {
                console.log('#### DEPTH => '+d+' ####');
                for(const property in this.tmpNode)
                {
                    console.log('#['+property+']TEXT: '+this.tmpNode[property]['text']);                                 
                    if(this.tmpNode[property].hasOwnProperty('tags'))
                    {
                        console.log('#TAG EXIST');
                        //console.log(this.tmpNode[property]['tags']);
                        if(this.tmpNode[property]['tags'].hasOwnProperty(d))
                        {
                            console.log('#TAG DEPTH EXIST');
                            theSameTagOpen=this.tmpNode[property]['tags'][d]['tag']+this.tmpNode[property]['tags'][d]['tagAtr'];
                            theSameTagClose=this.tmpNode[property]['tags'][d]['tag'];
                            /* CHECK AND SET FIRST TAG */
                            
                            if(!firstTag)
                            {
                                console.log('FIRST TAG => '+this.tmpNode[property]['tags'][d]['tag']);
                                tmpTag=this.tmpNode[property]['tags'][d]['tag'];
                                tmpTagArrayRow.push(this.tmpNode[property]['tags'][d]['tag']);
                                tmpTagArrayRowOpen.push(this.tmpNode[property]['tags'][d]['tag']+this.tmpNode[property]['tags'][d]['tagAtr']);
                                
                                firstTag=true;
                                /* JUMP */
                                continue;
                            }
                            if(tmpTag!==this.tmpNode[property]['tags'][d]['tag'])
                            {
                                
                                console.log('DIFFERENT TAG => '+this.tmpNode[property]['tags'][d]['tag']);
                                
                                tmpTag=tmpTag+this.tmpNode[property]['tags'][d]['tag'];
                                tmpTagArrayRow.push(this.tmpNode[property]['tags'][d]['tag']);
                                tmpTagArrayRowOpen.push(this.tmpNode[property]['tags'][d]['tag']+this.tmpNode[property]['tags'][d]['tagAtr']);
                                theSameTag=false;
                            }
                            else
                            {
                                console.log('THE SAME TAG');
                            }
                            
                        }
                        else
                        {
                            console.log('#TAG DEPTH NOT EXIST');
                            tmpTag=tmpTag+null;
                            /* PUSH TEXT */
                            tmpTagArrayRow.push(null);
                            tmpTagArrayRowOpen.push(null);
                            //tmpTagArrayRow.push(this.tmpNode[property]['text']);
                            theSameTag=false;
                            theSameTagOpen='';
                            theSameTagClose='';
                        }
                        
                    }
                    else
                    {
                        console.log('#TAG NOT EXIST');
                    }
                   
                }
                if(!theSameTag)
                {
                    console.log('#NOT THE SAME TAG!');
                    for(const property in this.tmpNode)
                    {
                        console.log(tmpTagArrayRow[property]);
                        if(tmpTagArrayRow[property])
                        {
                            this.tmpNode[property]['diff_open']= this.tmpNode[property]['diff_open']+'<'+tmpTagArrayRowOpen[property]+'>';
                            this.tmpNode[property]['diff_close']='</'+tmpTagArrayRow[property]+'>'+this.tmpNode[property]['diff_close']; 
                        }
                        
                    }
                    
                }
                console.log(tmpTagArrayRow);
                tmpTagArray.push(tmpTagArrayRow);
                tmpTag='';
               
                firstTag=false;
                
                this.setTheSameTagStack(theSameTag,theSameTagOpen,theSameTagClose);
                this.differentTagStack(theSameTag,tmpTagArrayRow);
                theSameTag=true;
                tmpTagArrayRow=[];
                tmpTagArrayRowOpen=[];
                
            }
            console.log(tmpTagArray);
            console.log('#LIST OF THE SAME TAG STACK');
            console.log(this.theSameTagStack);
            console.log('#LIST OF DIFFERENT TAG STACK');
            console.log(this.theDifferentTagStackOpen);
            console.log(this.theDifferentTagStackClose);
            console.log('#NEW NODE:');
            console.log(this.tmpNode);
            this.outerValue=this.theSameTagStack.open;
            for(const property in this.tmpNode)
            {
                this.outerValue=this.outerValue+this.tmpNode[property].diff_open+this.tmpNode[property].text+this.tmpNode[property].diff_close;
            }
            this.outerValue=this.outerValue+this.theSameTagStack.close;
            console.log('#NEW TEXT:');
            console.log(newTextToReturn);
            
            //this.createNewTagGraph(tmpTagArray);
        };
        parent.setTheSameTagStack=function(theSameTag,open,close)
        {
            if(theSameTag)
            {
                console.log('THE SAME TAG => '+open+close);
                
                //this.theSameTagStack.open=this.theSameTagStack.open+"<"+tag+">";
                this.theSameTagStack.open=this.createOpenHtmlTag(this.theSameTagStack.open,open);
                this.theSameTagStack.close=this.createCloseHtmlTag(this.theSameTagStack.close,close);
                //this.theSameTagStack.close="</"+tag+">"+this.theSameTagStack.close;       
            }
            //this.theSameTagStack
        };
        parent.differentTagStack=function(theSameTag,tmpTagArrayRow)
        {
            //this.theDifferentTagStack
            if(!theSameTag)
            {
                for(const property in tmpTagArrayRow)
                {
                    this.theDifferentTagStackOpen=this.theDifferentTagStackOpen+'<'+tmpTagArrayRow[property]+'>';
                    this.theDifferentTagStackClose='</'+tmpTagArrayRow[property]+'>'+this.theDifferentTagStackClose;
                };
            };
        };
        parent.createOpenHtmlTag=function(actTag,newTag)
        {
            return actTag+"<"+newTag+">";
        };
        parent.createCloseHtmlTag=function(actTag,newTag)
        {
            return "</"+newTag+">"+actTag;
        };
        parent.setGraphDepth=function()
        {
            var d=0;
            for(const property in this.tmpNode)
            {
                //console.log(property);
                if(this.tmpNode[property].hasOwnProperty('tags'))
                {
                    //console.log('PROPERTY TAG EXIST');
                    //console.log('TAG ELEMENTS => '+this.tmpNode[property]['tag'].length);
                    if(d<this.tmpNode[property]['tags'].length)
                    {
                        d=this.tmpNode[property]['tags'].length;
                    }
                    /* REVERSE ARRAY */
                    this.reverseArray(this.tmpNode[property]['tags']);
                }
            };
            console.log('#MAX DEPTH => '+d);
            return d;
        };
        parent.reverseArray=function(arr)
        {
            arr.reverse();
        };
        parent.createNewTagGraph=function(arr)
        {
            console.log(arr);
            //arr.reverse();
            //console.log(arr);
            var tmpTag=new Array();
            var tmpTagOpenClose=new Array();
            
            var first=false;
            for(var t=0;t<arr.length;t++)
            {
                console.log(arr[t]);
                console.log('LENGTH =>'+arr[t].length);
                for(const property in arr[t])
                {
                    console.log(arr[t][property]);
                    tmpTagOpenClose.push('<'+arr[t][property]+'>');
                    tmpTagOpenClose.push('</'+arr[t][property]+'>');
                    //arr[t][property]='<'+arr[t][property]+'><'+arr[t][property]+'>';
                    //tmpTag=tmpTag+arr[t][property];
                };
                console.log(tmpTagOpenClose);
                
               if(!first)
               {
                    first=true;
                    tmpTag=tmpTagOpenClose;
                }
                else
                {
                    if(arr[t].length===1)
                    {
                        // and one on end and one on front
                        //tmpTag
                    }
                    else if (arr[t].length===3)
                    {
                        
                    };
                };
                tmpTagOpenClose=[];
            };
            // console.log(arr);
            console.log(tmpTag);
        };

    console.log(ta.innerHTML);
    
    if (window.getSelection)
    {
        //console.log('window.getSelected');
        
        selected=window.getSelection();
        //console.log(selected);
        //console.log(selected.anchorNode.data);
        //console.log(selected.extentNode.data);
        //console.log(selected.anchorNode.parentElement.innerHTML);
        //console.log("VALUE LENGTH => "+selected.anchorNode.parentElement.innerHTML.length);
        selectedParent=window.getSelection().anchorNode.parentElement;
        //console.log(selectedParent);
        vLength=selectedParent.innerHTML.length;
        //console.log("ALL VALUE LENGTH => "+vLength);
        //console.log(selected.toString());


        //console.log(parent);
        /* SET SELECTED TEXT */
        parent.selected=window.getSelection();
        parent.setSelectedText();
        
        /* GET NEW VALUE */
        //parent.getNewValue();
            
        
        console.log(parent.found);
        if(parent.found==='y')
        {
            console.log('OUTER:');
            console.log(parent.outerValue);
            /* UPDATE TEXTAREA */
            ta.innerHTML=parent.outerValue;
        }
       
        /* CHECK SIBILING */
        //parent.checkSibling(parent.selected.anchorNode.previousSibling);
        //parent.checkSibling(selected.anchorNode.previousSibling);
        
        //console.log('SELECTTED TEXT => '+selected.toString());
        //console.log('SELECTTED TEXT LENGTH => '+selected.toString().length);
       // console.log(selected.anchorNode.parentElement);
        sStart=selected.anchorOffset;
        sEnd=selected.extentOffset;
       // console.log('MOVE START AND END => '+parent.sibilingLength);
        sStart=sStart+parent.sibilingLength;
        /* WRONG, SELECTED IS LIMITED TO NEXT SIBLING */
        sEnd=sEnd+parent.sibilingLength;
        //* ADD ONE EXTRA, BECAUS LENGTH IS NOT THA SAME AS BOUNDARY
        //sEnd=selected.toString().length+parent.sibilingLength;
        //console.log('SELECTED START => '+sStart);
        //console.log('SELECTED END => '+sEnd);
        //console.log(selected.toString());
        if(sStart===sEnd)
        {
            /* nothing to do selected the same range */
            //console.log('selected the same range');
        }
        else if(selected.toString().trim()==='')
        {
            /* nothing to do = selected empty value*/ 
             //console.log('selected is empty');
        }
        else  
        {
            //parseStyleText(id,sStart,sEnd,vLength,selectedParent);
            //ta.innerHTML=parseStyleText(id,sStart,sEnd,vLength,ta.innerHTML);
        } 
    }
    else if (document.selection)
    {
        console.log('document.selection');
        console.log(document.selection.createRange().text);
        //vSelected=document.selection.createRange().text;
    }
    return '';
    
    /* check parent is corect div element */
}

function parseStyleText(id,sStart,sEnd,vLength,parent)
{
    console.log('parseStyleText()\nSTART => '+sStart+'\nEND => '+sEnd);
    console.log('HTML TAG => '+id);
    console.log(parent);
    
    console.log(parent.nodeName);
    //var parentTag=parent
    var value=parent.innerHTML.toString();
    console.log(value);
    var tmp=0;
    var tagS='';
    var tagE='';
    if(sStart>sEnd)
    {
        tmp=sStart;
        sStart=sEnd;
        sEnd=tmp;
    }
    switch(id)
    {
        case 'b':   
                tagS='<b>';
                tagE='</b>';
                break;
        case 'i':   
                tagS='<i>';
                tagE='</i>';
                break;
        case 'u':  
                tagS='<u>';
                tagE='</u>';
            break;
        case 'text-left':  
                tagS='<p class="text-left">';
                tagE='</p>';
            break;
        case 'text-right': 
                tagS="<p class=\"text-right\">";
                tagE='</p>';
                
            break;
        case 'text-center':  
                tagS="<p class=\"text-center\">";
                tagE='</p>';
            break;
        default:   
            break;
    }
    parent.innerHTML=value.substring(0,sStart)+tagS+value.substring(sStart,sEnd)+tagE+value.substring(sEnd,vLength);
    console.log("VALUE LENGTH AFTER => "+parent.innerHTML.length);
}
function createTable(colTitle,tBody)
{
    console.log('---createTable()---');
    var table=createTag('','table','table');
    var tHead=document.createElement("thead");
    var tr=document.createElement("tr");
    for(var i=0;i<colTitle.length;i++)
    {
        var th=createTag(colTitle[i],'th','');
            th.setAttribute('scope','col');
            tr.appendChild(th);
    }
    tHead.appendChild(tr);
    table.appendChild(tHead);
    table.appendChild(tBody);
    return table;
}

function removeHideData(btnLabel,title,titleClass)
{
    console.log('===removeHideData()===');
     /*
        * SLOWNIKI:
        * data[0] = DATA
        * data[1] = SLO
    */
    prepareModal(title,'bg-'+titleClass);
    var form=createForm('POST',actData['data']['function'],'form-horizontal','OFF');
    var add=document.getElementById('AdaptedDynamicData'); 
    removeFields(form);
    add.appendChild(createTag(actData['data']['value']['head'].t,'h5','text-'+titleClass+' mb-3 text-center font-weight-bold'));
    add.appendChild(form);
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn('cancel',createBtn('Anuluj','btn btn-dark','cancelBtn'),''));
    document.getElementById('AdaptedButtonsBottom').appendChild(functionBtn(actData['data']['function'],createBtn(btnLabel,'btn btn-'+titleClass,actData['data']['function']),actData['data']['function']));
    /* INFO */
    document.getElementById('AdaptedModalInfo').appendChild(createTag("Project Stage ID: "+actData['data']['value']['head'].i+", Create user: "+actData['data']['value']['head'].cu+" ("+actData['data']['value']['head'].cul+"), Create date: "+actData['data']['value']['head'].cd,'small','text-left text-secondary ml-1'));
}
function removeFields(ele)
{ 
    console.log('---removeFields()---');
    ele.appendChild(createInput('hidden','id',actData['data']['value']['head'].i,'','','n'));
    var p=createTag('Podaj Powód: ','p','text-left');
    var inp=createInput('text','extra','','form-control mb-1','Wprowadź powód','n');
        inp.style.display = "none";
    actData['data']['value']['slo'].push({
                                                'ID' : "0",
                                                'Nazwa' : 'Inny:'
                                            });
    var select=createSelectFromObject(actData['data']['value']['slo'],'Nazwa','reason','form-control mb-1');
        select.onchange = function() { checkReason(this,'extra'); };
    ele.appendChild(p); 
    ele.appendChild(select); 
    ele.appendChild(inp); 
    return '';
}
function checkReason(t,id)
{
    console.log('---checkReason()---');
    var splitValue=t.value.split("|");
    if(splitValue[0]==='0')
    {
        document.getElementById(id).style.display = "block";
    }
    else
    {
         document.getElementById(id).style.display = "none";
    };
}

function displayAll(d)
{
    console.log('===displayAll()===');
    if(Error.checkStatusResponse(d)) { return ''; };
    console.log(Error.checkStatusResponse(d));
    /* SETUP DEFAULT TABLE COLUMN */
    table.showTable(d);  
}

function createProjectInput(type,value,label)
{
    console.log('===createProjectInput()===');
    var divAll=document.createElement('div');
    var divErr=createTag('','div','col-auto alert alert-danger mb-1');
        divErr.setAttribute('id','errDiv-'+label);
        divErr.setAttribute('style','display:none;');
    var inp=createInput(type,label,value,'form-control mb-1','',fieldDisabled);
        inp.onblur=function ()
        {
            parseFieldValue(this,null,null);
            checkIsErr(document.getElementById('sendDataBtn'));
        };
    divAll.appendChild(inp);
    divAll.appendChild(divErr);
    return divAll;
}
function functionBtn(f,btn,task)
{
    console.log('---functionBtn()---');
    console.log(f);
    switch(f)
    {
        case 'psShowStage':
                btn.onclick = function(){ 
                    //var ta=document.getElementById('data-stage-value');
                    console.log(document.querySelectorAll('[id$="-data-stage-value"]'));
                    var ta=document.querySelectorAll('[id$="-data-stage-value"]');
                    console.log(ta.length);
                    var value='';
                    for(var i=0;i<ta.length;i++){
                        console.log(ta[i].value);
                        value+=ta[i].value+'<br/>';
                    }
                    var p=document.getElementById('data-stage-result');
                    p.innerHTML=value;
                };
                break;
        case 'cancel':
                btn.onclick = function()
                {
                    closeModal('AdaptedModal'); 
                    ajax.getData(defaultTask);
                };
            break;
        case 'edit':               
                btn.onclick = function()
                {
                    clearAdaptedModalData();
                    actData['data']['function']='psEdit';
                    actData['data']['task']='psEdit';
                    runFunction(actData);
                };
                break;
        case 'psHide':
                assignConfirmBtn(btn,"Potwierdź ukrycie etapu projektu",task);
                break;
        case 'psDelete':
                assignConfirmBtn(btn,"Potwierdź usunięcie etapu projektu",task);
                break;
        case 'psEdit':
        case 'psCreate':
        //case 'psDelete':
            btn.onclick = function() { postData(this,task); };
            break;
        default: 
            break;
    }
    return btn;
}
function assignConfirmBtn(btn,confirmlabel,task){
    btn.onclick = function() {
        if(confirm(confirmlabel))
        {   
            postData(this,task); 
        };
    };
}
function postData(btn,nameOfForm)
{
    console.log('---postData()---');
    console.log(nameOfForm);
    var err=false;
    switch(nameOfForm)
    {
        case 'pCreate':
            parseFieldValue( document.getElementById('temat_umowy').value,"temat_umowy","errDiv-temat_umowy");
            parseFieldValue( document.getElementById('numer_umowy').value,"numer_umowy","errDiv-numer_umowy");
            parseFieldValue( document.getElementById('klient').value,"klient","errDiv-klient");
            err=checkIsErr(btn);
            break;
        default:
            break;
    }; 
    if (!err)
    {
        ajax.sendData(nameOfForm,'POST');
    };   
}
function setButtonAvaliable()
{
    console.log('setButtonAvaliable()');
    for (const property in defaultTableBtnConfig)
    {     
        
        //console.log(property);
        //console.log(loggedUserPerm.includes(property));
        if(loggedUserPerm.includes(property))
        {
            /* NOTHNG TO DO */
            //console.log(defaultTableBtnConfig[property]);
        }
        else
        {
            defaultTableBtnConfig[property].perm=false;
            defaultTableBtnConfig[property].class=defaultTableBtnConfig[property].class+" disabled";
            defaultTableBtnConfig[property]['attributes'].disabled="disabled";
            //console.log(defaultTableBtnConfig[property]);
        }
    }
}
function createProjectStageRow(ele,pFields)
{
    for (const property in pFields)
    {        
        var l=createTag(pFields[property].label,'label','text-right font-weight-bold col-8 pt-2'); 
        var dCol2=createTag('','div','col-4');
        if(pFields[property].hasOwnProperty('input'))
        {
            setFieldDisabled(fieldDisabled,pFields[property].input);
            dCol2.appendChild(pFields[property].input);
        }     
        var dRow=document.createElement('div');
        dRow.setAttribute('class','row');
        dRow.appendChild(l);
        dRow.appendChild(dCol2);
        ele.appendChild(dRow);  
    }
}
function createUnsignedNumber(q,inputName)
{
    var input=createInput('number',inputName,q,'form-control mb-1','',fieldDisabled);
        input.setAttribute('min','1');
        input.onblur=function(){checkNumber(this);};
        return input;
}
function createNewField(dynamicField)
{
    console.log('===createNewField()===');
    console.log(dynamicField);
    var divAll=createTag('','div','col-auto');
    var divBtn=createTag('','div','row');
    var divInput=document.createElement('div'); 

    // ADD BUTTON
    var addBtn=createAddButton('addBtn',fieldDisabled);
        if(fieldDisabled!=='y')
        {
            addBtn.onclick=function()
            {
                //inputFieldCounter++;
                dynamicField.appendChild(createInputTextField('Wprowadź opis:',100,inputFieldCounter));
            };
        }
    divBtn.appendChild(addBtn);
    divAll.appendChild(divInput);
    divAll.appendChild(divBtn);
    console.log(divAll);
    return (divAll);
}
function findData(value)
{
    ajax.getData(defaultTask+'&filter='+value);
}
function createData()
{
    clearAdaptedModalData();
    ajax.getData('getNewStageSlo');
}
function showHidden(ele)
{
    console.log('===showHidden()===\n'+ele.value);
    changeBoxValue(ele);
    defaultTask='getprojectsstagelike&v='+ele.value;
    findData(document.getElementById('findData').value);
}
ajax.getData(defaultTask);
//document.getElementById('closeModal').onclick = function(){ reloadData(defaultTask); };
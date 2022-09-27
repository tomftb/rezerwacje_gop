class ProjectReportView{
    Html = new Object();
    Modal=new Object();
    constructor(){
        console.log('ProjectReportView::constructor()');
        this.Html = new Html();
        this.Modal = new Modal();
        console.log(this);
    }
    test(){
        console.log('ProjectReportView::test()');
    }
    getHead(){
        //console.log('ProjectReportView::getReportHead()');
        var row=this.Html.getRow();
            this.Html.addClass(row,['border','m-1']);
            row.appendChild(this.getHeadDocType());
            row.appendChild(this.getHeadVariable());
        return row;
    }
    getHeadData(){
        //console.log('ProjectReportView::getReportHeadData()');
        var row=this.Html.getRow();
            this.Html.addClass(row,['ml-1','mr-1','mt-1','border-top','border-right','border-left','bg-info']);
            row.appendChild(this.getHeadAvailableStages());
            row.appendChild(this.getHeadChosenStages());
        return row;
    }
    getHeadEle(linkName,labelValue,labelClass){
        var main=this.Html.getCol(6);
        var ele1=this.Html.getRow();  
        var ele1Col=this.Html.getCol(12);
        var ele2=this.Html.getRow();
        var ele2Col=this.Html.getCol(12);
        var label = document.createElement('h5');
            this.Html.addClass(label,labelClass);
        var text = document.createTextNode(labelValue);
            label.append(text);
            ele1Col.append(label);
            ele1.append(ele1Col);
            ele2.append(ele2Col);
            main.append(ele1);
            main.append(ele2);
            this.Modal.addLink(linkName,ele2Col);
        return main;
    }
    getHeadDocType(){
        /* DOCUMENT TYPE */
        var main =  this.getHeadEle('docType','Rodzaj dokumentu: PL/EN',['font-weight-normal','text-white','text-left']);
             this.Html.addClass(main,['border-right']);
             this.Html.addClass(main.childNodes[0],['bg-info']);
             this.Html.addClass(main.childNodes[0].childNodes[0],['pt-1']);
             var ul=document.createElement('ul');
                this.Html.addClass(ul,['pl-2','mt-2','mb-2','text-dark']);
                ul.style.listStyleType='none';
                main.childNodes[1].childNodes[0].append(ul);
             var type=['PTP 2D','Sprawozdanie końcowe 2D','PTP 3D','Sprawozdanie końcowe 3D'];
             for (const prop in type){
                 let li=document.createElement('li');
                 let input=document.createElement('input');
                 let span=document.createElement('span');
                    this.Html.addClass(span,['ml-2']);
                    span.append(document.createTextNode(type[prop]));
                    input.type='checkbox';
                    li.append(input);
                    li.append(span);
                    ul.append(li);
             };
             this.Modal.addLink('docType',ul);
        return main;
    }
    getHeadVariable(){
         /* Variables */
        var main = this.getHeadEle('variables','Wstępne zmienne',['font-weight-normal','text-white','text-left']);
       // console.log(main);
        //console.log(main.childNodes[1].childNodes[0]);
        //throw 'aaaa';
        var ul=document.createElement('ul');
            this.Html.addClass(ul,['pl-2','mt-2','mb-2','text-info','d-none']);
            ul.style.listStyleType='number';
            main.childNodes[1].childNodes[0].append(ul);
            this.Modal.addLink('variables',ul);
            this.Html.addClass(main.childNodes[0],['bg-info']);
            this.Html.addClass(main.childNodes[0].childNodes[0],['pt-1']);
        return main;
    }
    getHeadDynamicVariable(){
        var self=this;
        var row=this.Html.getRow();
            this.Html.addClass(row,['ml-1','mr-1','d-none']);
        var col=this.Html.getCol(12);
            this.Html.addClass(col,['border','border-purple']);
        
        /* LABEL VARIABLE NAME */
        var span=document.createElement('span');
        //var t2=document.createTextNode('Zmienna:');
            this.Html.addClass(span,[,'text-dark','font-weight-normal']);
        /* LABEL */
        var p=document.createElement('p');
        var t=document.createTextNode('Zmienna ');
            this.Html.addClass(p,['h4','text-purple','m-0']);
            p.append(t,span,document.createTextNode(' :'));
            //p.append(t);
           // p.append(span);
            //p.append(document.createElement(' :'));
        
            //p2.append(t2);
        /* TEXTAREA */
        var input=document.createElement('textarea');
            this.Html.addClass(input,['form-control','mb-1']);
            input.setAttribute('rows','4');

        /* BUTTONS */
        var divRowButton=this.Html.getRow();
             this.Html.addClass(divRowButton,['ml-1','mt-1','mb-1','mr-0']);
        var divColButton=this.Html.getCol(12);
            this.Html.addClass(divColButton,['text-right','pr-0']);
        var divButton=document.createElement('div');
            this.Html.addClass(divButton,['btn-group']);
            divButton.setAttribute('role','group');
            divButton.setAttribute('aria-label','BTN-VARIABLE-GROUP');
        var buttonCancel=document.createElement('button');
            buttonCancel.setAttribute('type','button');
            this.Html.addClass(buttonCancel,['btn','btn-dark']);
        var cancelText=document.createTextNode('Anuluj');  
            buttonCancel.append(cancelText);
            buttonCancel.onclick = function(){
                self.Html.addClass(row,'d-none');  
                self.Html.removeChilds(span);
            };
        var buttonSave=document.createElement('button');
            buttonSave.setAttribute('type','button');
            this.Html.addClass(buttonSave,['btn','btn-purple']);
            divButton.append(buttonCancel,buttonSave);

        var saveText=document.createTextNode('Zapisz');  
            buttonSave.append(saveText);
            divColButton.append(divButton);
            divRowButton.append(divColButton);
            col.append(p,input,divRowButton);
            row.append(col);

        /* SET LINKS */
        this.Modal.addLink('variablesLabel',span);
        this.Modal.addLink('variablesEle',row);
        this.Modal.addLink('variablesInput',input);
        this.Modal.addLink('variablesSaveButton',buttonSave);
        return row;
    }
    getHeadDynamicImage(){
        var row=this.Html.getRow();
            this.Html.addClass(row,['ml-1','mr-1','mt-1','d-none']);
        var col=this.Html.getCol(12);
            this.Html.addClass(col,['border','border-warning']);
        /* LABEL */
        var p=document.createElement('p');
        var t=document.createTextNode('Obraz:');
            this.Html.addClass(p,['h4','text-warning']);
            p.append(t);
            /* TEXTAREA */
        var input=document.createElement('input');
            this.Html.addClass(input,['form-control-file','mb-1']);
            input.setAttribute('type','file');
            col.append(p);
            col.append(input);
            row.append(col);
        /* SET LINKS */
        this.Modal.addLink('imageEle',row);
        this.Modal.addLink('imageInput',input);
        return row;
    }
    getHeadAvailableStages(){
        var main = this.getHeadEle('availableHead','Dostępne etapy projektu:',['font-weight-normal','text-white','text-left','pt-1']);
            this.Html.addClass(main,['border-right']);
        return main;
    }
    getHeadChosenStages(){
         var main = this.getHeadEle('chosenHead','Wybrane etapy projektu:',['font-weight-normal','text-white','text-left','pt-1']);
            return main;
    }
    getDataBody(){
        console.log('ProjectReport::getReportDataBody()');
        /* */
        var rowDiv=this.Html.getRow();
             this.Html.addClass(rowDiv,['border-left','border-right','border-bottom','ml-1','mr-1','mt-0','mb-1','pt-0']);
        /* */
        var optionDiv=this.Html.getCol(6);
             this.Html.addClass(optionDiv,['border-right']);
            optionDiv.setAttribute('id','staticData');
        var rowData=this.Html.getRow();  
        var rowDataCol=this.Html.getCol(12);
            rowData.append(rowDataCol);
            optionDiv.appendChild(rowData);
        /* */
        var dataDiv=this.Html.getCol(6);
            dataDiv.setAttribute('id','dynamicData');
                    
        var rowDataValue=this.Html.getRow();
        var rowDataValueCol=this.Html.getCol(12);
            rowDataValue.append(rowDataValueCol);
            dataDiv.append(rowDataValue);
            /* APPEND */
            rowDiv.appendChild(optionDiv);
            rowDiv.appendChild(dataDiv); 
            console.log(rowDiv);
             /* APPEND AVAILABLE STAGE DATA */
            this.Modal.addLink('availableStages',optionDiv);
             /* APPEND CURRENT STAGE DATA */
            this.Modal.addLink('selectedStages',dataDiv);
             /* ADD DYNAMIC STAGE SHORTCUT */
            this.Modal.addLink('dynamic',rowDataValueCol);
            /* ADD AVAILABLE DATA */
            this.Modal.addLink('availableData',rowDataCol);
            return rowDiv;
    }
    getFormName(){
        /* SIMILAR TO CONST */
        return 'setProjectReport';
    }
    appendVariable(Stage,ulVariable){
        this.Html.removeClass(this.Modal.link['variables'],'d-none');
        var li=document.createElement('li');
        var spanTitle=document.createElement('span');
            this.Html.addClass(spanTitle,['text-dark','font-weight-bold']);
            spanTitle.append(document.createTextNode(Stage.data.title));
            li.append(spanTitle);
            li.append(ulVariable);
            this.Modal.link['variables'].append(li);
    }
    move(){
        var span=document.createElement('div');
            this.Html.addClass(span,['float-left','pt-1']);
            span.append(this.getArrow(['fa-long-arrow-up']),this.getArrow(['fa-long-arrow-down','mr-1']));
            return(span); 
    }
    getArrow(c){
        var i=document.createElement('i');
            this.Html.addClass(i,['fa','text-dark','text-center','ml-1'].concat(c));
            i.setAttribute('aria-hidden','true');
            i.style.cursor='pointer';
            i.onmouseover = function (){
                this.classList.remove("text-dark");
                this.classList.add("text-white");
            };
            i.onmouseleave = function (){
                this.classList.remove("text-white");
                this.classList.add("text-dark");
            };
            return i;
    }
    remove(){
        var i=createTag('','i','fa fa-minus');
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');
        var div=document.createElement('button');
            this.Html.addClass(div,['btn','btn-danger','btn-sm','float-right']);
            div.appendChild(i);
            return(div); 
    }
    getChosenStageRow(){
        var link={
            all:{},
            mvUp:{},
            mvDown:{},
            rm:{},
            tx:{}
        };
        var self=this;
        /* SPAN BULL ICON */
        var spanBull=document.createElement('div');
            this.Html.addClass(spanBull,['text-primary','float-left','pt-1']);
            spanBull.innerHTML='&bull;&nbsp;';
        /* SPAN TEXT */
        var spanText=document.createElement('div');     
            this.Html.addClass(spanText,['pt-1','float-left']);
        /* MOVE */
        var move=this.move();
        /* REMOVE */
        var remove=this.remove();
        /* DIV ROW */
        var row=this.Html.getRow();
        var col=this.Html.getCol(12);
            this.Html.addClass(row,['mt-1','mb-0']);
            row.onmouseover = function (){
                self.Html.removeClass(this,"text-dark");
                self.Html.addClass(this,"text-white");
                self.Html.removeClass(this,"bg-white");
                self.Html.addClass(this,"bg-primary");
                self.Html.removeClass(spanBull,'text-primary');
                self.Html.addClass(spanBull,'text-white');
            };
            row.onmouseleave = function (){
                self.Html.removeClass(this,"text-white");
                self.Html.addClass(this,"text-dark");
                self.Html.removeClass(this,"bg-primary");
                self.Html.addClass(this,"bg-white");
                self.Html.removeClass(spanBull,'text-white');
                self.Html.addClass(spanBull,'text-primary');
            };
            
            col.append(spanBull,move,spanText,remove);
            row.append(col);
            /* SET ELE LINK */ 
            link.all=row;
            link.tx=spanText;
            link.rm=remove;
            link.mvUp=move.childNodes[0];
            link.mvDown=move.childNodes[1];
            
        return link;
    }
}

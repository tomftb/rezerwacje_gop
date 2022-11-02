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
        var row=document.createElement('div');
            row.classList.add('row','ml-1','mr-1','d-none');
        this.Modal.addLink('variableShiftField',row);
        return row;
    }
    getHeadDynamicImage(){
        var row=document.createElement('div');
            row.classList.add('row','ml-1','mr-1','mt-1','d-none');
        this.Modal.addLink('imageShiftField',row);
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
        console.log('ProjectReportView::getReportDataBody()');
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
            //console.log(rowDiv);
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
    getVariableEle(Stage,ulVariable){
        var li=document.createElement('li');
        var spanTitle=document.createElement('span');
            this.Html.addClass(spanTitle,['text-dark','font-weight-bold']);
            spanTitle.append(document.createTextNode(Stage.data.title));
            li.append(spanTitle);
            li.append(ulVariable);
        return li;
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
        var i=document.createElement('i');
            this.Html.addClass(i,['fa','fa-minus']);
            i.setAttribute('aria-hidden','true');
            i.setAttribute('style','color:#ffffff;');
        var div=document.createElement('button');
            this.Html.addClass(div,['btn','btn-danger','btn-sm','float-right']);
            div.appendChild(i);
            return(div); 
    }
    getChosenStageRow(){
        console.log('ProjectReportView::getChosenStageRow()');
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
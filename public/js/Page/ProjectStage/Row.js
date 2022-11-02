
/* TO DO */

class Row{
    /* MAIN OBJECT */
    Html=new Object();
    Utilities=new Object();
    /* ROW DATA */
    iSection=0;
    iSub=0;
    iSubRow=0;
    SubSectionRow=new Object();
    Helplink=new Object();
    ProjectStageTool=new Object();
    TabStop=new Object();
    VariableList=new Object();
    constructor(Html,Utilities,ProjectStageTool,TabStop,VariableList){
        this.Html=Html;
        this.Utilities=Utilities;
        this.ProjectStageTool=ProjectStageTool;
        this.TabStop=TabStop;
        this.VariableList=VariableList;
    }
    setData(iSection,iSub,iSubRow,SubSectionRow,Helplink){
        this.iSection=iSection;
        this.iSub=iSub;
        this.iSubRow=iSubRow;
        this.SubSectionRow=SubSectionRow;
        this.Helplink=Helplink;
    }
    getHelpLink(){
        return {
            all:{},
            value:{},
            error:{}
        };
    }
    getSimple(){
        //console.log('Row.getSimple()');
        /* SET NEW HELPLINK SUBSECTION ROW */
        this.Helplink[this.iSubRow]=this.getHelpLink();
        var mainDiv=this.Html.getRow();
        /* SET SUBSECTION ROW */
        mainDiv.append(this.getRow());//this.iSection,this.iSub,this.iSubRow,this.SubSectionRow,this.Helplink
        /* CREATE ERROR DIV */
        mainDiv.append(this.createTextError(this.Helplink[this.iSubRow]));  
        this.ProjectStageTool.getControlTool(this.iSection,this.iSub,this.iSubRow,this.SubSectionRow[this.iSubRow],this.Helplink[this.iSubRow],mainDiv,this.TabStop,this.VariableList);
        /* SETUP HELPLINK */
        this.Helplink[this.iSubRow]['all']=mainDiv;
        return mainDiv;
    }
    getExtended(){
        //console.log('Row.getExtended()');
        /* SET NEW HELPLINK SUBSECTION ROW */
        //HelplinkRow[iSubRow]=this.Row.getHelpLink(); 
        var mainDiv=this.getSimple();//iSection,iSub,iSubRow,subsectionrow,HelplinkRow
            mainDiv.childNodes[3].append(this.ProjectStageTool.createExtendedTextTool(this.iSection,this.iSub,this.iSubRow,this.SubSectionRow[this.iSubRow],this.Helplink[this.iSubRow]));  
        return mainDiv; 
    }
    getRow(){
        /* console.log('ProjectStageCreate::createSubsectionRow()'); */
        /*
         * SET DEFAULT ATTRIBUTE d-none
         */
        var self=this;
        var mainDivCol=this.Html.getCol(12);
        var mainDiv=this.Html.getRow();
        
        var mainDivSectionLabel=this.Html.getRow();
        var sectionLabel=document.createElement('h4');
            sectionLabel.setAttribute('class','text-center w-100');
            sectionLabel.innerHTML='<span class="text-muted">[KOLUMNA]</span> Podsekcja - '+this.iSub+' wiersz - '+this.iSubRow;
        var labelDiv=this.Html.getCol(1);
            labelDiv.classList.add('mr-0','pr-0');
        var valueDiv=this.Html.getCol(10);
        var removeDiv=this.Html.getCol(1);
            removeDiv.append(this.getRemoveButton());
        var v = document.createTextNode(this.SubSectionRow[this.iSubRow].paragraph.property.value.toString());
        /* LABEL */
        var label=document.createElement('LABEL');
            label.setAttribute('class','col-form-label');
            label.setAttribute('for','value-'+this.iSection+'-'+this.iSub+'-'+this.iSubRow);
            label.innerHTML='<b>Wartość:</b><br/><small class=" text-muted ">['+'value-'+this.iSection+'-'+this.iSub+'-'+this.iSubRow+']</small>';
        //var input=document.createElement('input');
        var input=document.createElement('textarea');
            input.setAttribute('class','form-control border-1 border-info');
            input.setAttribute('placeholder','Write...');
            input.setAttribute('name','value-'+this.iSection+'-'+this.iSub+'-'+this.iSubRow);
            input.appendChild(v);
            input.setAttribute('rows','1');
            
            input.oninput = function(){
                self.SubSectionRow[self.iSubRow].paragraph.property.value=this.value;
            };
            /* SET INPUT TEXT STYLE FROM PARAMETER */
            input.style.fontSize=this.SubSectionRow[this.iSubRow].paragraph.style.fontSize+this.SubSectionRow[this.iSubRow].paragraph.style.fontSizeMeasurement;  
            input.style.color=this.SubSectionRow[this.iSubRow].paragraph.style.color;
            input.style.backgroundColor=this.SubSectionRow[this.iSubRow].paragraph.style.backgroundColor;
            input.style.fontFamily=this.SubSectionRow[this.iSubRow].paragraph.style.fontFamily;
            input.style.fontWeight=this.setFontStyle(this.SubSectionRow[this.iSubRow].paragraph.style.fontWeight,'BOLD','NORMAL');
            input.style.fontStyle=this.setFontStyle(this.SubSectionRow[this.iSubRow].paragraph.style.fontStyle,'ITALIC','');
            input.style.textDecoration=this.setFontStyle(this.SubSectionRow[this.iSubRow].paragraph.style.underline,'UNDERLINE','')+" "+this.setFontStyle(this.SubSectionRow[this.iSubRow].paragraph.style['line-through'],'line-through','');
            input.style.textAlign=this.SubSectionRow[this.iSubRow].paragraph.style.textAlign;
            /* SETUP HELPLINK TO FIELD INPUT */
            this.Helplink[this.iSubRow]={
                text:{
                    value:input
                },
                list:{
                    /* FAKE */
                    value:document.createElement('span')
                },
                image:{
                },
                table:{
                }
            };
            labelDiv.append(label);
            valueDiv.append(input);
            mainDivSectionLabel.append(sectionLabel);
            mainDiv.append(labelDiv,valueDiv,removeDiv);
            mainDivCol.append(mainDivSectionLabel,mainDiv);
            return mainDivCol;
    }
    getRemoveButton(){//iSubRow,subsectionrow,helplink
        //this.iSubRow,this.SubSectionRow,this.Helplink
        /* console.log('ProjectStageCreate::getRemoveButton()'); */
        var self=this;
        var div=this.Html.removeButton();
            /* CLOSURE */
            div.onclick=function(){
                /* console.log('ProjectStageCreate::getRemoveButton() onclick()'); */
                /* TO DO */
                if (confirm('Potwierdź usunięcie podsekcji') === true) {
                    self.Helplink[self.iSubRow].all.remove();
                    /* NEED FOR STRICT MODE - NOT ALLOWED delete helplink */
                    delete self.Helplink[self.iSubRow];
                    delete self.SubSectionRow[self.iSubRow];
                } else {
                    // NOTHING TO DO
                }
            };
        
        return(div); 
    }
    setFontStyle(value,trueValue,falseValue){
        if(value==='1'){
            return trueValue;
        }
        return falseValue;
    }
    createTextError(helplink){
        /* console.log('ProjectStageCreate::createTextError()'); */
        var mainDiv=this.Html.getCol(12); 
        var errorDiv=this.Html.getRow();
            errorDiv.classList.add('alert','alert-danger','d-none','mt-1','mb-0');//d-block
            errorDiv.innerText='Test ERROR';
            helplink.error=errorDiv;
            mainDiv.append(errorDiv);  
        return mainDiv;
    }
}
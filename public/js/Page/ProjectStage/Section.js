

/* TO DO */

class Section{
    Link={
        head:new Object(),
        body:new Object(),
        footer:new Object(),
        main:new Object()
    };
    Html=new Object();
    Tool=new Object();
    Utilities=new Object();
    sectionColumn=0;
    //ToolFields=new Object();
    constructor(Html,Utilities,sectionColumn){
        this.Html=Html;
        this.Tool=new Tool();
        this.Utilities=Utilities;
        this.sectionColumn=sectionColumn;
        //this.ToolFields=ToolFields();
        //console.log(this);
        //throw 'saaa';
    }
    create(iSection,section,Helplink){
        console.log('Section.create()');
        console.log('iSection');
        console.log(iSection);
        console.log('helplink:');
        console.log(Helplink);
        console.log('iSection (iSectionField):');
        console.log(iSection);
        console.log('stageData:');
        console.log(section);
        
        //var mainDiv=this.Html.getRow(); 
        this.Link.main=this.Html.getRow(); 
        //var mainDivHeader=this.creteSectionHead(iSection); 
        this.Link.head=this.getHead(iSection); 
        //var mainDivBody=this.Html.getCol(12); 
        this.Link.body=this.Html.getCol(12); 
            Helplink.section[iSection]={
                main:this.getHelpLinkSectionMain()
            };
            this.Link.head.append(this.getHeadTool(iSection,section,Helplink,this)); 
            this.helplink.section[iSection].main.head=this.Link.head;
            this.helplink.section[iSection].main.body=this.Link.body;
            this.Link.main.append(this.Link.head,this.Link.body);   
            this.helplink.section[iSection].main.all=this.Link.main;
            console.log(this.Link.main);
            this.Link.main.append(this.getFooterTool(iSection,section[iSection]));
            //return mainDiv;
            return this.Link;
    }
    getHead(isection){
        var mainDivHeader=this.Html.getCol(12); 
        var hr=document.createElement('hr');
            hr.setAttribute('class','w-100 border-1 border-secondary mt-2');//
        var h=document.createElement('h3');    
            h.setAttribute('class','w-100 text-center bg-info text-white');//
            h.innerHTML='<span class="text-muted">[WIERSZ]</span> Sekcja  nr '+isection;
            mainDivHeader.appendChild(hr);
            mainDivHeader.appendChild(h);
        return mainDivHeader;
    }
    getHelpLinkSectionMain(){
        return {
                all:{},
                head:{},
                body:{}
        };
    }
    getHeadTool(iSection,section,helplink,ProjectStageCreate){// isection
        /* */
        console.log('Section.getHeadTool()');
        console.log('section');
        console.log(section);
        var Tool = new ToolFields([3,3,3,3]);      
            Tool.set(0,this.setSectionSubSection(iSection,section[iSection].subsection,helplink.section[iSection].subsection,ProjectStageCreate));
            Tool.set(3,this.createRemoveSectionButton(iSection,section,helplink.section));
        return Tool.getMain();
    }
    getFooterTool(iSection,section){
        console.log('Section.getFooterTool()');
        //console.log('iSection');
        //console.log(iSection);
        console.log('section');
        console.log(section);
        console.log('section');
        //throw 'stop';
        var mainDivCol=this.Html.getCol(12);
            mainDivCol.classList.add('bg-light','mt-1');
            mainDivCol.style.backgroundColor='#e6e6e6';
        var mainDiv=this.Html.getRow();

        var Tool3 = new ToolFields([3,3,3,3]);
        var h5=document.createElement('h5');
            h5.setAttribute('class','w-100 text-center text-bold pt-0 pb-1 mt-0 bg-secondary');//  text-center
            //h5.style.backgroundColor='#e6e6e6';
            h5.innerHTML='<small class="text-white">Opcje odnoszące się do całej sekcji:</small>';//text-info
 
            Tool3.set(0,this.getSimpleBackgroundColor(section.style));
        var newPage = this.createTextToolRadioButton('valunewline-'+iSection,'Sekcja od nowej strony?',this.Tool.getYesNowRadio());
        var run=false;
                                        
        /* SET BUTTON RADIO TO PROPER VALUE */
        this.setRadioButtonExtend(newPage.childNodes[1],section,run);
 
        Tool3.set(0,newPage);    
        
        mainDiv.appendChild(h5);
        
        mainDivCol.appendChild(mainDiv);
        mainDivCol.appendChild(Tool3.getMain());
        return mainDivCol;
    }
    setSectionSubSection(iSection,subsection,helplinkSubsection,self){
        console.log('ProjectStageCreate.setSectionSubSection()');
        var subSectionCount = Object.keys(subsection).length;
        var data={
            0:{
                default:{
                    0:this.Utilities.getDefaultOptionProperties(subSectionCount-1,subSectionCount)
                },
                all:this.getSectionCount(subSectionCount,self.sectionColumn),
                self:self,
                subsection:subsection,
                iSection:iSection,
                helplinkSubsection:helplinkSubsection,
                oldValue:0,
                oldIndex:0,
                glossary:this.Glossary.text,
                /* Anonymous Function */
                onchange:function(t){
                    console.log('ProjectStageCreate.setSectionSubSection().onchange()');
                    /* t - this */
                    this.oldValue=parseInt(this.oldValue,10);
                    var newValue=parseInt(t.value,10);
                        if(this.oldValue<newValue){
                            for(var i = this.oldValue+1; i<newValue+1 ;i++ ){
                                this.subsection[i]=this.self.StageData.createSubsection(i);
                                /* FIRST ALWAYS NEW LINE */
                                //subsection[i].subsectionrow[0].data.valuenewline='n';
                                this.subsection[i].subsectionrow[0].paragraph.property.valuenewline='y';
                                /* CREATE NEW DOM ELEMENT */
                                this.self.helplink.section[this.iSection].main.body.appendChild(this.self.createSubsection(this.iSection,i,this.subsection[i],this.helplinkSubsection));
                            }             
                            return true;
                        }
                        if (confirm('Potwierdź zmianę ilości kolumn. Zostaną bezpowrotnie usunięte kolumny!') === true) {                   
                            for(var i = Object.keys(this.subsection).length-1; i>newValue ;i-- ){
                                delete this.subsection[i];
                                this.helplinkSubsection[i].all.remove();
                                delete this.helplinkSubsection[i];
                            }
                            return true;
                        }
                        else{
                            this.selectedIndex = oldIndex;
                            this.value = oldValue;
                        }
                },
                onfocus:function(t){
                    /* t - this */
                    this.oldIndex = t.selectedIndex;
                    this.oldValue = t.value;
                },
                type:'select',
                attributes:{
                    class:'w-50'
                }
            }
        };
        return  this.Tool.create('Wskaż ilość podsekcji <small class="text-muted">[KOLUMN]</small>:',data);
    }
    getSectionCount(exception,max){
        exception=parseInt(exception,10);
        var value={};
        var j=1;
        for(var i=0;i<max;i++){
            if(exception!==j){
                value[i]=this.Utilities.getDefaultOptionProperties(i,j);
            }
            j++;
        }
        return value;
    }
}
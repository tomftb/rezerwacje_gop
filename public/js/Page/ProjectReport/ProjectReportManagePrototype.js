class ProjectReportManagePrototype{
    Html=new Object();
    Xhr=new Object();
    Utilities=new Object();
    Parse=new Object();
    router='';
    Button={
        main:{
            color:'btn-brown'
        }
    };
    Label={
        m:'Nagłówek',
        s:'Wskaż stopke:',
        e:'(brak zdefiniowanych stopek)',
        c:'Nagłówek:',
        p:'Wykluczone strony:',
        o:'Aktualnie ustawiony',
        n:'Nowa'
    };
    Data={
        Report:new Object(),
        Available:new Object(),
        Tmp:new Object(),
        Last:0,
        Default:new Object()
    };
    optionNoValue=new Object();
    selectOptionKey=1;
    Link={
        error:new Object(),
        button:{
                main:new Object(),
                cancel:new Object(),
                save:new Object() 
        },
        chosen:new Object(),
        chosenselect:new Object(),
        selectnovalue:new Object()
    };
    Field={
        ele:new Object(),
        c:'d-none',
        m:'show',
        t:'heading'
    };
    constructor(Html,Xhr,Utilities,router,Parse){
        console.log('ProjectReportManagePrototype::constructor()');
        this.Html = Html;
        this.Xhr=Xhr;
        this.Utilities=Utilities;
        this.router=router;
        this.Parse=Parse;
    }
    setSelectNoValueForm(ele){
        console.log('ProjectReportManagePrototype::setSelectNoValueForm()');
       
        var formGroup=document.createElement('div');
            formGroup.classList.add('form-group');
        var label = document.createElement('label');
            label.setAttribute('for',this.Label.c);
        var labelTitle=document.createTextNode(this.Label.c);
            label.append(labelTitle);
        this.selectnovalue=document.createElement('select');
        this.selectnovalue.classList.add('form-control','font-weight-bold','border',this.optionNoValue[this.selectOptionKey].c,this.optionNoValue[this.selectOptionKey].b);
        this.setSelectNoValue();
            formGroup.append(label,this.selectnovalue);
            ele.append(formGroup);
    }
    setSelectNoValue(){
        var self=this;
        var act={
                color:'',
                border:''
        };
        this.selectnovalue.setAttribute('id','selectNo'+this.Field.t);    
        
        for(const prop in this.optionNoValue){
            this.selectnovalue.append(this.getOption(this.optionNoValue[prop].v,this.optionNoValue[prop].l,this.optionNoValue[prop].c));
        }

        this.selectnovalue.onclick=function(){
            //console.log('select on click');
            //console.log(this);
            //console.log(this.classList);
            act={
                color:this.classList[3],
                border:this.classList[4]
            };
        };
            this.selectnovalue.onchange=function(){
                //console.log('act');
                //console.log(act);
                //console.log(this);
                self.Data.Report.data.change='y';
                self[self.optionNoValue[this.value].m](self,self.optionNoValue[this.value]);
                this.classList.remove(act.color,act.border);
                this.classList.add(self.optionNoValue[this.value].c,self.optionNoValue[this.value].b);
                self.Link.chosen.classList[self.optionNoValue[this.value].a]('d-none');
            };
    }
    setSelectValueForm(ele){
        this.Link.chosen=document.createElement('div');
        this.Link.chosen.classList.add('form-group','d-none');
        var label = document.createElement('label');
            label.setAttribute('for','select'+this.Field.t);
            label.append(document.createTextNode(this.Label.s));
        this.Link.chosenselect=document.createElement('select');
        this.Link.chosenselect.classList.add('form-control');
        this.Link.chosenselect.setAttribute('id','select'+this.Field.t);

            this.setToChooseOption();//,all,
            /* SET ERROR LABEL */
        var labelTitle1=document.createTextNode(this.Label.e);
        var labelTitleP=document.createElement('p');
            labelTitleP.classList.add('text-danger','text-center');
            labelTitleP.append(labelTitle1);      
            /* SET ACTION */
            this.setToChooseAction();
            this.Link.chosen.append(label,this.Link.chosenselect,labelTitleP);
            ele.append(this.Link.chosen);
    }
    getData(self,value){
        console.log('ProjectReportManagePrototype::getData()');
        self.Data.Last=value;
        self.Xhr.run({
                t:'GET',
                u:self.router+'psShortDetails&id='+value,
                c:true,
                d:null,
                o:self,
                m:'setTmp'
            }); 
    }
    setTmp(response){
        console.log('ProjectReportManagePrototype::setTmp()');
        try{
            //throw 'test';
            this.Data.Tmp[0]=this.Parse.getSimpleJson(response);
            /* SET TMP ordinal_number */
            this.Data.Tmp[0].data['ordinal_number']=1;
            console.log(this.Data.Tmp);
            this.Link.error.classList.add('d-none');
            this.Link.button.save.classList.remove('disabled');
        }
        catch(e){
            console.log(e);
            this.Html.removeChilds(this.Link.error);
            this.Link.error.classList.remove('d-none');
            this.Link.error.append(document.createTextNode(e));
            this.Link.button.save.classList.add('disabled');
            this.Link.button.save.onclick=function(){
                console.log('NO SAVE');
            };
            this.Link.chosenselect.setAttribute('disabled','');
            console.log(this.Link.button);
        }
    }
    setChosenFirst(self){
        console.log('ProjectReportManagePrototype::setChosenFirst()');
        console.log(self);
        console.log(self.Data.Last);
        self.getData(self,self.Data.Last);
    }
    setFirst(self,optionData){
        console.log('ProjectReportManagePrototype::setFirst()');
        /* SET FIRST ON A LIST */
        for(const p in self.Data.Available){
            /* IF EXISTS SET ... */
            /* CHANGE ACTION */
            optionData.m='setChosenFirst';
            self.Data.Report.data.change='y';    
            console.log(self.Data.Available[p]);
            /* GET FULLDATA */
            self.getData(self,self.Data.Available[p].i);
            break;
        }
    }
    setFirstDb(self,optionData){
        console.log('ProjectReportManagePrototype::setFirstDb()');
        //optionData.m='setChosenFirst';
        self.Data.Report.data.change='y';
        self.Data.Tmp[0]=this.Data.Default;
    }
    unsetData(self,optionData){
        self.Data.Tmp=new Object();
        self.Data.Report.data.change='y';
    }
    getOption(value,label,color){
        var option=document.createElement('option');
            option.classList.add('bg-white',color);
            option.value=value;
            option.append(document.createTextNode(label));
        return option;
    }
    setDataChosenPart(){
        console.log('ProjectReportManagePrototype::setDataChosenPart()');
        for(const p in this.Data.Report[this.Field.t]){
            console.log(this.Data.Report[this.Field.t][p]);
            this.Data.Tmp[0]=this.Data.Report[this.Field.t][p];
            this.Data.Default=this.Data.Report[this.Field.t][p];
            this.optionNoValue[0]={
                l:this.Label.o,
                c:'text-success',
                b:'border-success',
                a:'add',
                m:'setFirstDb',
                v:0
            };
            this.optionNoValue[2].l=this.Label.n;
            this.optionNoValue[1].l='Brak';
            this.selectOptionKey=0;
            break;
        }
    }
    setDefaultData(ChosenReport,Available){
        console.log('ProjectReportManage::setDefaultData()');
        this.Data.Available=Available;
        this.Data.Report=ChosenReport;
        this.setDefaultNoValue();        
        this.setDataChosenPart();
    }
    updateDefaultData(){
        console.log('ProjectReportManage::updateDefaultData()');
        //console.log(this.Data.Report);
        this.setDefaultNoValue();
        this.setDataChosenPart();
        //console.log(this.selectnovalue);
        this.Html.removeChilds(this.selectnovalue);
        var act={
             color:this.selectnovalue.classList[3],
             border:this.selectnovalue.classList[4]
        };
        this.selectnovalue.classList.remove(act.color,act.border);
        this.selectnovalue.classList.add(this.optionNoValue[this.selectOptionKey].c,this.optionNoValue[this.selectOptionKey].b);
        //console.log(this.selectnovalue);
        this.setSelectNoValue();
        this.Link.chosen.classList[this.optionNoValue[this.selectOptionKey].a]('d-none');
    }
    setDefaultNoValue(){
        this.optionNoValue={
            1:{
              l:'Nie',
              c:'text-danger',
              b:'border-danger',
              a:'add',
              m:'unsetData',
              v:1
            },
            2:{
                l:'Tak',
                c:'text-primary',
                b:'border-primary',
                a:'remove',
                m:'setFirst',
                v:2
            }
        };
        this.selectOptionKey=1;
    }
    getButtonGroup(){
        var group=document.createElement('div');
            group.classList.add('btn-group');
            group.setAttribute('role','group');
            group.setAttribute('aria-label','Cancel Save '+this.Field.t);
        return group;
    }
    getFieldButton(){
        console.log('ProjectreportManagePrototype::getFieldButton()');
        var self=this;
        var row=this.Html.getRow();
            row.classList.add('float-right');//,'pt-1'
        /* ALL BUTTONS GROUP */
        var group=this.getButtonGroup();
            group.classList.add('m-1');
        /* CANCEL BUTTON */
        this.Link.button.cancel=this.getButton('Ukryj','btn-dark');
        this.Link.button.cancel.onclick=function(){
            self.Field.ele.classList.add('d-none');
            self.Field.m='show'; 
        };
        /* SAVE BUTTON */
        this.Link.button.save=this.getButton('Zapisz','btn-brown');
        this.Link.button.save.onclick=function(){
            console.log('SAVE');
            console.log('Report - '+self.Field.t);
            console.log(self.Data.Report[self.Field.t]);
            console.log('Tmp - '+self.Field.t);
            console.log(self.Data.Tmp);
            /* CLEAR */
            self.Data.Report[self.Field.t]=new Object();
            /* SETUP NEW VALUE */
            self.Utilities.cloneProperty(self.Data.Report[self.Field.t],self.Data.Tmp);
            /* FIX IMAGE tmpid */
            self.setImageNewTmpId(self);
        };
            group.append(this.Link.button.cancel,this.Link.button.save);
            row.append(group);
        return row;
    }
    setToChooseAction(){
        console.log('ProjectReportManagePrototype::setToChooseAction()');
        var self=this;
        this.Link.chosenselect.onchange = function(){
            console.log('ProjectReportManagePrototype::setToChooseAction().onchange()');
            self.getData(self,this.value);
         };
    }
    setToChooseOption(){
        //console.log('ProjectReportManagePrototype::setToChooseOption()');
        //console.log(this.Link);
        for(const p in this.Data.Available){            
            this.Label.e='';
            let option=this.getOption(this.Data.Available[p].i,this.Data.Available[p].t,'text-dark');
                this.Link.chosenselect.append(option);
        }
    }
    getButton(label,color){
        var button=document.createElement('button');
            button.classList.add('btn',color);
            button.setAttribute('type','button');
            button.append(document.createTextNode(label));
        return button;
    }
    getMainButton(){
        var self=this;
        var button=this.getButton(this.Label.m,this.Button.main.color);
            button.onclick=function(){
                self[self.Field.m](self);
            };
        return button;
    }
    getField(){
        this.Field.ele=this.Html.getRow();
        this.Field.ele.classList.add('border','border-brown','m-1',this.Field.c);
        var col=this.Html.getCol(12);
            col.append(this.getTitle(),this.getBody(),this.getError(),this.getFieldButton());
        this.Field.ele.append(col);
        return this.Field.ele;
    }
    getTitle(){
        var row=this.Html.getRow();
            row.classList.add('bg-brown');
        var col=this.Html.getCol(12);
            col.classList.add('pt-1');
        var h=document.createElement('h5');
            h.classList.add('text-white');
            h.append(document.createTextNode(this.Label.m));
            col.append(h);
            row.append(col);
        return row;
    }
    getBody(){
        var row=this.Html.getRow();
            row.classList.add('pt-2');
        var col1=this.Html.getCol(4);
        var col2=this.Html.getCol(4);
        var col3=this.Html.getCol(4); 
            /* SELECT VALUE */
            this.setSelectValueForm(col2);//col2
            /* SET NO VALUE - TURN OFF */
            this.setSelectNoValueForm(col1);
            row.append(col1,col2,col3);
        return row;
    }
    getError(){
        var row=this.Html.getRow();
            row.classList.add('pl-1','pr-1');
        this.Link.error=this.Html.getCol(12);
        this.Link.error.classList.add('d-none','alert','alert-danger','mb-0');
            row.append(this.Link.error);
        return row;
    }
    show(self){
            self.Field.ele.classList.remove('d-none');
            self.Field.m='hide'; 
        };
    hide(self){
            self.Field.ele.classList.add('d-none');
            self.Field.m='show'; 
    };
    setImageNewTmpId(self){
        console.log(self.Data.Report[self.Field.t]);
        for(const f in self.Data.Report[self.Field.t]){  
            for(const s in self.Data.Report[self.Field.t][f].section){     
                    for(const su in self.Data.Report[self.Field.t][f].section[s].subsection){  
                        for(const r in self.Data.Report[self.Field.t][f].section[s].subsection[su].subsectionrow){
                            /* IMAGE */
                            for(const i in self.Data.Report[self.Field.t][f].section[s].subsection[su].subsectionrow[r].image){
                                /* SET tmpid */
                                self.Data.Report[self.Field.t][f].section[s].subsection[su].subsectionrow[r].image[i].property.tmpid=i;  
                            }
                        }
                    }
                }
            }
    }
}
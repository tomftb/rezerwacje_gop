class ProjectReportVariableAction{
    Helplink={
       main:new Object(),
       label:new Object(),
       input:new Object(),
       button:new Object()
    }
    constructor(field){
        this.Helplink.main=field;
        this.setField(this);
    }
    setField(self){
        var col=document.createElement('DIV');
            col.classList.add('col-12','border','border-purple','p-0'); 
            /* LABEL VARIABLE NAME */
        var span=document.createElement('span');
            span.classList.add('text-dark','font-weight-normal');
            /* LABEL */
        var p=document.createElement('p');
            p.classList.add('h4','bg-purple','text-white');
        var t=document.createTextNode('Zmienna ');
            p.append(t,span,document.createTextNode(' :'));
            /* TEXTAREA */
        var input=document.createElement('textarea');
            input.classList.add('form-control');
            //this.Html.addClass(input,['form-control','mb-1']);
            input.setAttribute('rows','4');
            /* BUTTONS */
        var divRowButton=document.createElement('DIV');
            divRowButton.classList.add('row','m-1');
        var divColButton=document.createElement('DIV');
            divColButton.classList.add('col-12','text-right','pr-0');
        var divButton=document.createElement('div');
            divButton.classList.add('btn-group');
            divButton.setAttribute('role','group');
            divButton.setAttribute('aria-label','BTN-VARIABLE-GROUP');
        var buttonCancel=document.createElement('button');
            buttonCancel.setAttribute('type','button');
            buttonCancel.classList.add('btn','btn-dark');
        var cancelText=document.createTextNode('Anuluj');  
            buttonCancel.append(cancelText);
            buttonCancel.onclick = function(){
                self.Helplink.main.classList.add('d-none');
                self.clearEle(span);
            };
        var buttonSave=document.createElement('button');
            buttonSave.setAttribute('type','button');
            buttonSave.classList.add('btn','btn-purple');
            divButton.append(buttonCancel,buttonSave);
        var saveText=document.createTextNode('Zapisz');  
            buttonSave.append(saveText);
            divColButton.append(divButton);
            divRowButton.append(divColButton);
            col.append(p,input,divRowButton);
            self.Helplink.main.append(col);
        /* SET LINKS */
        self.Helplink.label=span;
        self.Helplink.input=input;
        self.Helplink.button=buttonSave;
    }
    change(Report,ParagraphVariable,v){
        console.log('ProjectReportVariableAction.change()');
        console.log(ParagraphVariable);
        var self=this;
        /* SET VARIABLE NAME */
        this.clearEle(this.Helplink['label']);
        this.Helplink['label'].append(document.createTextNode(ParagraphVariable[v].name));
        /* SET VARIABLE VALUE */
        this.Helplink['input'].value=ParagraphVariable[v].value;
        /* SHOW DIV */
        this.Helplink['main'].classList.remove('d-none');
        /* SET ONCLICK ACTION */
        this.Helplink['button'].onclick=function(){
            if(self.Helplink['input'].value!==ParagraphVariable[v].value){
                /* SET CHANGE */
                Report.data.change='y';
            };
            self.Helplink['main'].classList.add('d-none');
            //self.clearEle(self.Helplink['label']);           
            ParagraphVariable[v].value=self.Helplink['input'].value;
        };     
    }
    clearEle(ele){
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        };
    }
}


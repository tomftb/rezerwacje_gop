class ProjectReportManageFooter extends ProjectReportManagePrototype{
    
    constructor(Html,Xhr,Utilities,router,Parse){
        super(Html,Xhr,Utilities,router,Parse);
        console.log('ProjectReportManageFooter::constructor()');
        this.set();
    }
    set(){
       this.Label.m='Stopka';
       this.Label.e='(brak zdefiniowanych stopek)';
       this.Label.c='Stopka:';
       this.Label.o='Aktualnie ustawiona';
       this.Label.n='Nowa';
       this.Field.t='footer';
    }
}



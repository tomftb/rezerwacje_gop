class ProjectReportManageHeading extends ProjectReportManagePrototype{
    constructor(Html,Xhr,Utilities,router,Parse){
        super(Html,Xhr,Utilities,router,Parse);
        console.log('ProjectReportManageHeading::constructor()');
        this.set();       
    }
    set(){
        //super.setMainButton(Nagłówek);
        this.Label.m='Nagłówek';
        this.Label.e='(brak zdefiniowanych nagłówków)';
        this.Label.c='Nagłówek:';
        this.Label.o='Aktualnie ustawiony';
        this.Label.n='Nowy';
        this.Field.t='heading';
    }
}
class ProjectConstTable{
    static Table;
    static Xhr;
    static Modal;
    static Html;
    static Items;
    static Const;
    /*
     * 
     * TABLE
     */
    static defaultTask='';

    static tableHead={
            ID:{
                style:'width:70px;',
                scope:'col'
            },
            Nazwa:{
                style:'width:200px;',
                scope:'col'
            },
            Wartość:{
                style:'',
                scope:'col'
            },
            "":{
                style:'width:200px;',
                scope:'col'
            }
    };
    static tableBtn=
        {
        SHOW_STAGE : {
            label : 'Wyświetl',
            task : 'getProjectConstDetails',
            class : 'btn-warning',
            perm :true,
            //attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        HIDE_STAGE : {
            label : 'Ukryj',
            task : 'getProjectConstHideSlo',
            class : 'btn-secondary',
            perm :true,
            //attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        DEL_STAGE : {
            label : 'Usuń',
            task : 'getProjectConstDelSlo',
            class : 'btn-danger',
            perm :true,
            //attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        }
    };
    static tableColException=new Array('bl');
    static runTable(response){
        console.log('ProjectConst::runTable()');
        try {
            ProjectConstTable.Table.setLink();        
            ProjectConstTable.Table.clearData();
        }
        catch (error) {
            alert('ProjectStageTable::runTable() Error occured!');
            console.log(error);
        } 
        /*
         * SET TO JSON RESPONSE
         */
        var json=ProjectConstTable.Items.getJsonResponse(ProjectConstTable.Table.link['error'],response);
        //return true;
        if(!json){ 
            ProjectConstTable.Table.link['error'].innerHTML='Error occured!';
            return false;
        };
        try {
            /*
             * SET PAGE TITLE
             */
            console.log(json);
            console.log(json.data);
            /* 
             * SET TABLE
             */
            if (!('status' in json) || !('info' in json)){
                    ProjectConstTable.Items.setError(ProjectConstTable.Table.link['error'],'Application error occurred! Contact with Administrator!');
                    return false;
                }
                else if(json.status===1){
                    ProjectConstTable.Items.setError(ProjectConstTable.Table.link['error'],json.info);
                }
                else{
                    /* SET TABLE ACTION */
                    document.getElementById('headTitle').innerHTML=json.data.value.headTitle;
                    ProjectConstTable.Xhr.setRun(ProjectConstTable.Const,json.data['function']);
                    ProjectConstTable.Table.setButtons('btn-group',ProjectConstTable.tableBtn);
                    ProjectConstTable.Table.setHead(ProjectConstTable.tableHead);
                    ProjectConstTable.Table.setBtnInfo('<i class="fa fa-info"></i> Actual blocked by user: ','small','text-danger');
                    ProjectConstTable.Table.setbtnInfoCol('bl');
                    ProjectConstTable.Table.setBtnInfoEle(createTag('asdasd','p'));
                    ProjectConstTable.Table.data=json['data']['value']['data'];
                    ProjectConstTable.Table.columnsExceptions=ProjectConstTable.tableColException;
                    ProjectConstTable.Table.setBody();
                } 
        }
        catch (error) {
            ProjectConstTable.Xhr.runObject=ProjectConstTable;
            ProjectConstTable.Items.setError(ProjectConstTable.Table.link['error'],error);
        } 
    }
}
 
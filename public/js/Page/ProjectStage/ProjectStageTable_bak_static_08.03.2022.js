class ProjectStageTable{
    static Table;
    static Xhr;
    static Modal;
    static Html;
    static Items;
    static Stage;
    /*
     * 
     * TABLE
     */
    /* FROM ProjectConst 'getprojectsconstslike&u=0&v=1&b=' */
    static defaultTask='';

    static tableHead={
        ID:{
            style:'width:70px;',
            scope:'col'
        },
        /*
        Numer:{
            style:'width:70px;',
            scope:'col'
        },
        */
        Tytuł:{
            style:'',
            scope:'col'
        },
        /*
        Zawartość:{
            style:'',
            scope:'col'
        },
        */
        "":{
            style:'width:200px;',
            scope:'col'
        }};
    static tableBtn=
        {
        SHOW_STAGE : {
            label : 'Wyświetl',
            task : 'psDetails',
            class : 'btn-info',
            perm :true
            //attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        HIDE_STAGE : {
            label : 'Ukryj',
            task : 'getProjectStageHideSlo',
            class : 'btn-secondary',
            perm :true
            //attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        },
        DEL_STAGE : {
            label : 'Usuń',
            task : 'getProjectStageDelSlo',
            class : 'btn-danger',
            perm :true
            //attributes : { 'data-toggle' : 'modal', 'data-target': '#AdaptedModal' }
        }
    };
    static tableColException=new Array('bl');
    static tableBody;
    static runTable(response){
        console.log('ProjectConst::runTable()');
        try {
            ProjectStageTable.Table.setLink();        
            ProjectStageTable.Table.clearData();
        }
        catch (error) {
            alert('ProjectStageTable::runTable() Error occured!');
            console.log(error);
        } 
        /*
         * SET TO JSON RESPONSE
         */
        var json=ProjectStageTable.Items.getJsonResponse(ProjectStageTable.Table.link['error'],response);
        //return true;
        if(!json){ 
            ProjectStageTable.Table.link['error'].innerHTML='Error occured!';
            return false;
        };
        try {
            /*
             * SET PAGE TITLE
             */
            console.log(json);  
            /* 
             * SET TABLE
             */
            if (!('status' in json) || !('info' in json)){
                    ProjectStageTable.Items.setError(ProjectStageTable.Table.link['error'],'Application error occurred! Contact with Administrator!');
                    return false;
                }
                else if(json.status===1){
                    ProjectStageTable.Items.setError(ProjectStageTable.Table.link['error'],json.info);
                }
                else{
                    /* SET TABLE ACTION */
                    document.getElementById('headTitle').innerHTML=json.data.value.headTitle;
                    ProjectStageTable.Xhr.setRun(ProjectStageTable.Stage,json.data['function']);
                    ProjectStageTable.Table.setButtons('btn-group',ProjectStageTable.tableBtn);
                    ProjectStageTable.Table.setHead(ProjectStageTable.tableHead);
                    ProjectStageTable.Table.setBtnInfo('<i class="fa fa-info"></i> Actual blocked by user: ','small','text-danger');
                    ProjectStageTable.Table.setbtnInfoCol('bl');
                    ProjectStageTable.Table.setBtnInfoEle(createTag('asdasd','p'));
                    ProjectStageTable.Table.data=json['data']['value']['data'];
                    ProjectStageTable.Table.columnsExceptions=ProjectStageTable.tableColException;
                    ProjectStageTable.Table.setBody();
                } 
        }
        catch (error) {
            ProjectStageTable.Xhr.runObject=ProjectStageTable;
            ProjectStageTable.Items.setError(ProjectStageTable.Table.link['error'],error);
        } 
    }
}
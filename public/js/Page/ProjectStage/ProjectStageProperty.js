class ProjectStageProperty{
    text={};
    department = {};
  
    constructor() {}
    
    setData(data){
        //console.log(data);        
        this.setText(data);
        //throw 'stop-tet';
        this.setDepartment(data);
    }
    setText(data){
         /* SHORTCUT */
        this.text={  
            sectionMin:data.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SECTION_MIN','v'),
            sectionMax:data.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SECTION_MAX','v'),
            subsectionMin:data.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_MIN','v'),
            subsectionMax:data.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_MAX','v'),
            subsectionRowMin:data.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_ROW_MIN','v'),
            subsectionRowMax:data.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_ROW_MAX','v'),
            /* NEW LINE SUBSECTION ROW PARAMETER */
            subsectionRowNewLine:this.getValueChar(data.text.getKeyPropertyAttribute('parameter','STAGE_TEXT_SUBSECTION_ROW_NEW_LINE','v'))
        }; 
    }
    getText(){
        return this.text;
    }
    setDepartment(data){
        this.department={
             /* SETUP DEFAULT DEPARTMENT */
            defaultDepartment:this.getDefaultDepartment(data),
            /* SETUP DEPARTMENT LIST */
            departmentListNames:new Array(),
            avaDepartmentList:data.text.item.department
        };
         /* SETUP DEPARTMENT LIST */
        this.setUpDepartmentListNames(data);
    }
    getDepartment(){
        return this.department;
    }
    setUpDepartmentListNames(data){
        for (const prop in this.department.defaultDepartment){
            this.department.departmentListNames.push(this.department.defaultDepartment[prop].n);
        }
        /* SET DEPARTMENT NAMES LIST */
        /* FIX */
        for (const prop in data.text.item.department){
             this.department.departmentListNames.push(data.text.item.department[prop].n);
        }
    }
    getValueChar(value){
        switch(value){
            case 0:
            case '0':
                return 'n';
            case 1:
            case '1':
                return 'y';
            default:
                return 'n';
        }
    }
    getDefaultDepartment(data){
        var defaultDepartment={
            0:{
                n:'',
                v:''
            }
        };
        for (const prop in data.text.item.department){
            /* SET FIRST */
            defaultDepartment[0] = data.text.item.department[prop];
            /* DELETE FROM AVA */
            //delete this.Glossary.item.department[prop];
            break;
        };
        return defaultDepartment;
    }
}
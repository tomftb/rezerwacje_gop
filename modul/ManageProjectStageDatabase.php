<?php
/**
 * Description of ManageProjectConstsDatabase
 *
 * @author tborczynski
 * 
 * MANAGE PROJECT CONSTS DATABASE QUERY
 */
abstract class ManageProjectStageDatabase {
    private $dbLink;
    private $dbUtilities;
    protected $Log;
    //protected $inpArray=array();
    protected $data=array();
    protected $error='';
    
    public function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->dbUtilities=new DatabaseUtilities();
    }
    public function __destruct(){}
    protected function getStageGlossaryText(){
        $this->Log->log(0,"[".__METHOD__."]");
        return [
            'color'=>$this->dbUtilities->getColor(),
            'fontFamily'=>$this->dbUtilities->getFontFamily(),
            'decoration'=>$this->dbUtilities->getStyle(0),
            'textAlign'=>$this->dbUtilities->getStyle(1),
            'measurement'=>$this->dbUtilities->getStyle(2),
            'department'=>$this->dbUtilities->getUserDepartment($_SESSION['userid']),
            'leading'=>$this->dbUtilities->getSloList('l'),
            'indentationSpecial'=>$this->dbUtilities->getSloList('s'),
            'listMeasurement'=>$this->dbUtilities->getSloList('m'),
            'leadingSign'=>$this->dbUtilities->getSloList('ls'),
            'tabStopAlign'=>$this->dbUtilities->getSloList('a')
        ];
    }
    protected function getStageGlossaryList(){
        $this->Log->log(0,"[".__METHOD__."]");
        return [
            'listType'=>$this->dbUtilities->getListType()
            
        ];
    }
    protected function getStageParameters($parm='STAGE_%'){
        return $this->dbUtilities->getParam($parm);
    }
    protected function getStages($where='',$parm=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        $select="SELECT s.`id` as 'i',s.`title` as 't',b.`login` as 'bl' FROM `slo_project_stage` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        
        //$select="SELECT s.`id` as 'i',s.`number` as 'n',s.`title` as 't',(select e.`value` FROM `slo_projekt_etap_ele` as e WHERE e.`id_projekt_etap`=s.`id` and `wsk_u`='0' and `wsk_v`='0' ORDER BY e.`id` ASC LIMIT 0,1) as `v`,b.`login` as 'bl' FROM `slo_projekt_etap` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $data=[];
         /* */
        foreach($this->dbLink->squery($select.$where,$parm) as $v){
            //array_push($data,array($v['i'],$v['n'],html_entity_decode($v['t']),html_entity_decode($v['v']),'bl'=>$v['bl']));
            array_push($data,['i'=>$v['i'],'t'=>html_entity_decode($v['t']),'bl'=>$v['bl']]);
        }
        return $data;
    }
    protected function getStageFullData($id=0){
        $this->Log->log(0,"[".__METHOD__."] ID => ".$id);
        //$parm[':id']=[$id,'INT'];
        /* GET STAGE */
        
        $data=[];
        foreach($this->dbLink->squery("SELECT s.`id`,s.`departmentId`,s.`departmentName`,s.`title`,s.`new_page` as valuenewline FROM `slo_project_stage` s WHERE s.id IN (:id)",[':id'=>[$id,'INT']]) as $k => $v){
            $data[$k]['data']=$v;
            $data[$k]['style']=$this->dbLink->squery("SELECT * FROM `slo_project_stage_style` WHERE `id_stage`=".$v['id']);
            $data[$k]['property']=$this->dbLink->squery("SELECT * FROM `slo_project_stage_property` WHERE `id_stage`=".$v['id']);
            /* ADD EMPTY SECTION KEY => NO SECTION KEY => PROBLEM ON FRONT ADD NEW */
            $data[$k]['section']=[];
            self::getStageSection($id,$data[$k]);
        }
        return $data;
    }
    private function getStageSection($id=0,&$data){
        /* GET SECTION*/
        foreach($this->dbLink->squery("SELECT `id`,`new_line` as valuenewline FROM `slo_project_stage_section` WHERE id_stage=".$id." AND wsk_u='0'") as $k => $v){
            $data['section'][$k]['data']=$v;
            $data['section'][$k]['style']=$this->dbLink->squery("SELECT * FROM `slo_project_stage_section_style` WHERE `id_section`=".$v['id']);
            $data['section'][$k]['property']=$this->dbLink->squery("SELECT * FROM `slo_project_stage_section_property` WHERE `id_section`=".$v['id']);
             /* ADD EMPTY SECTION KEY => NO SECTION KEY => PROBLEM ON FRONT ADD NEW */
            $data['section'][$k]['subsection']=[];
            self::getStageSubsection($v['id'],$data['section'][$k]);
        }
    }
    private function getStageSubsection($id=0,&$data){
        /* GET SUBSECTION */
        foreach($this->dbLink->squery("SELECT * FROM `slo_project_stage_subsection` WHERE `id_section`=".$id." AND wsk_u='0'") as $k => $v){
            $data['subsection'][$k]['data']=$v;
            $data['subsection'][$k]['style']=$this->dbLink->squery("SELECT * FROM `slo_project_stage_subsection_style` WHERE `id_subsection`=".$v['id']);
            $data['subsection'][$k]['property']=$this->dbLink->squery("SELECT * FROM `slo_project_stage_subsection_property` WHERE `id_subsection`=".$v['id']);
             /* ADD EMPTY SECTION KEY => NO SECTION KEY => PROBLEM ON FRONT ADD NEW */
            $data['subsection'][$k]['subsectionrow']=[];
            self::getStageSubsectionRow($v['id'],$data['subsection'][$k]);
        }
    }
    private function getStageSubsectionRow($id=0,&$data){
        /* GET SUBSECTION ROW */
        foreach($this->dbLink->squery("SELECT `id`,`value`,`new_line` as valuenewline FROM `slo_project_stage_subsection_row` WHERE `id_subsection`=".$id." AND wsk_u='0'") as $k => $v){
            $data['subsectionrow'][$k]['data']=$v;
            //$data['subsectionrow'][$k]['style']=$this->dbLink->squery("SELECT * FROM `slo_project_stage_subsection_row_style` WHERE `id_subsection_row`=".$v['id']);
            //$data['subsectionrow'][$k]['style']=array_map([$this,'getStyleProperty'],$this->dbLink->squery("SELECT `property`,`value` FROM `slo_project_stage_subsection_row_style` WHERE `id_subsection_row`=".$v['id']." AND wsk_u='0'"));
            $data['subsectionrow'][$k]['style']=self::getStyleProperty($v['id']);
            //self::getStyleProperty($v['id']);
            $data['subsectionrow'][$k]['property']=$this->dbLink->squery("SELECT * FROM `slo_project_stage_subsection_row_property` WHERE `id_subsection_row`=".$v['id'].";");
        }
    }
    private function getStyleProperty($id = 0){
        $style=[];
        foreach($this->dbLink->squery("SELECT `property`,`value` FROM `slo_project_stage_subsection_row_style` WHERE `id_subsection_row`=".$id.";") as $v){
            $style[$v['property']]=$v['value'];
       }
       return $style;
    }
    protected function getStage($id=0){
        $this->Log->log(0,"[".__METHOD__."] ID => ".$id);
        /* GET STAGE */ 
        $data=$this->dbLink->squery("SELECT s.`id` as 'i',s.`title` as 't',d.`name` as 'd',s.`create_user_full_name` as 'cu',s.`create_user_login` as 'cul',s.`create_date` as 'cd',s.`mod_user_login` as 'mu',s.`mod_date` as 'md',s.`buffer_user_id` as 'bu',s.`wsk_u` as 'wu',b.`login` as 'bl' FROM `slo_project_stage` as s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`, `department` as d WHERE s.`departmentId`=d.`id` AND s.`id`=:id LIMIT 0,1",[':id'=>[$id,'INT']]);
        return $data[0];
    }
    protected function hideStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$this->data);
        $this->dbLink->query("UPDATE `slo_project_stage` SET `wsk_v`=:wsk,`hide_reason`=:reason,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id",
            array_merge(self::setChangeStageParm(),$this->dbUtilities->getAlterParm()));
    }
    protected function deleteStage(){
        $parm=self::setChangeStageParm();
        $parm[':delete_date']=[$this->dbUtilities->getDate(),'STR'];
        $this->dbLink->query("UPDATE `slo_project_stage` SET `wsk_u`=:wsk,`delete_reason`=:reason,`delete_date`=:delete_date,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id",
                array_merge($parm,$this->dbUtilities->getAlterParm()));
    }
    private function deleteSection($id = 0){  
        $parm=[
            ':id'=>[$id,'INT'],
            ':dat_u'=>[$this->dbUtilities->getDate(),'STR']
        ];
        $this->dbLink->query("UPDATE `slo_project_stage_section` SET `wsk_u`='1',`delete_reason`='Removed by edit',`dat_u`=:dat_u,".$this->dbUtilities->getAlterSql()." WHERE `id_stage`=:id AND `wsk_u`='0'",
                array_merge($parm,$this->dbUtilities->getAlterParm()));
    }
    private function deleteSubsection($id = 0){
        $parm=[
            ':id'=>[$id,'INT'],
            ':dat_u'=>[$this->dbUtilities->getDate(),'STR']
        ];
        $this->dbLink->query("UPDATE `slo_project_stage_subsection` SET `wsk_u`='1',`delete_reason`='Removed by edit',`dat_u`=:dat_u,".$this->dbUtilities->getAlterSql()." WHERE `id_section`=:id AND `wsk_u`='0'",
                array_merge($parm,$this->dbUtilities->getAlterParm()));
    }
    private function deleteSubsectionRow($id = 0){
        $parm=[
            ':id'=>[$id,'INT'],
            ':dat_u'=>[$this->dbUtilities->getDate(),'STR']
        ];
        $this->dbLink->query("UPDATE `slo_project_stage_subsection_row` SET `wsk_u`='1',`delete_reason`='Removed by edit',`dat_u`=:dat_u,".$this->dbUtilities->getAlterSql()." WHERE `id_subsection`=:id AND `wsk_u`='0'",
                array_merge($parm,$this->dbUtilities->getAlterParm()));
    }
    private function setChangeStageParm(){
        return [
            ':id'=>[$this->data['id'],'INT'],
            ':wsk'=>['1','STR'],
            ':reason'=>[$this->data['reason'],'STR']
        ];
    }
    protected function manageStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        /* START TRANSACTION - must by outside of try catch */
        $this->dbLink->beginTransaction(); //PHP 5.1 and new
        try{
            /* CHECK DEPARTMENT EXIST */
            $this->dbUtilities->exist('department',"id=".$this->data->data->departmentId);
            
            //self::runQuery();
            $this->data->data->id=intval($this->data->data->id,10);
            self::setStage();
            $this->dbLink->commit();  //PHP 5 and new
        }
        catch (PDOException $e){
            $this->dbLink->rollback(); 
            Throw New Exception("[".__METHOD__."] DATABASE ERROR: ".$e->getMessage(),1);
        }
        finally{
            //$this->queryList=[];
        }
    }
    private function setStage(){
        $this->Log->log(0,"[".__METHOD__."]\r\nID DB - ".$this->data->data->id);    
        /* ADD/UPDATE STAGE */
        if($this->data->data->id===0){
            $this->Log->log(0,"INSERT STAGE"); 
            /* SQL INSERT STAGE */
            self::insertStage();
            /* SQL INSERT STAGE SECTION */
            foreach($this->data->section as $v){
                self::insertSection($this->dbLink->lastInsertId(),$v);
            }
        }
        else{
            /* ADD TO JS NEW PAGE!!!!*/
            $this->Log->log(0,"UPDATE STAGE"); 
            /* SQL UPDATE STAGE */
            self::updateStage();
            /* SQL UPDATE (DELETE) STAGE SECTION wsk_u, update section wil set wsk_u=0 */
            self::deleteSection($this->data->data->id);
            /* SQL UPDATE STAGE SECTION */
            array_map([$this,'manageSection'],$this->data->section);
        }
    }
    private function insertStage(){
        $this->Log->log(0,"[".__METHOD__."]");  
        $this->dbLink->query2(
                "INSERT INTO `slo_project_stage` (`departmentId`,`departmentName`,`title`,`type`,`new_page`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:departmentId,:departmentName,:title,:type,:new_page,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                ,array_merge(self::sqlStageParm(), $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm()));
    }
    private function updateStage(){
        $this->Log->log(0,"[".__METHOD__."]");  
         /* SQL INSERT STAGE */
        $this->dbLink->query2(
                "UPDATE `slo_project_stage` SET "
                . "`departmentId`=:departmentId"
                . ",`departmentName`=:departmentName"
                . ",`title`=:title"
                . ",`type`=:type"
                . ",`new_page`=:new_page"
                . ",".$this->dbUtilities->getAlterSql().""
                . " WHERE"
                . "`id`=:id;"
                ,array_merge(self::sqlStageParm(),[':id'=>[$this->data->data->id,'INT']],$this->dbUtilities->getAlterParm())
        );
    }
    private function sqlStageParm() : array{
        return [
                ':departmentId'=>[$this->data->data->departmentId,'INT'],
                ':departmentName'=>[$this->data->data->departmentName,'STR'],
                ':title'=>[$this->data->data->title,'STR'],
                ':type'=>['tx','STR'],
                ':new_page'=>[$this->data->data->valuenewline,'STR']
        ];
    }
    private function insertSection($idStage=0,$section=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB STAGE - ".$idStage);
        $this->Log->log(0,$section);
        $parm=[
            ':id'=>[$idStage,'INT'],
            ':valuenewline'=>[$section->property->valuenewline,'STR']
        ];
        /* INSERT SECTION */
        $this->dbLink->query2(
            "INSERT INTO `slo_project_stage_section` (`id_stage`,`new_line`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,:valuenewline,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
            ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm()));
        /* INSERT SUBSECTION [COLUMNS] */
        $idSection = $this->dbLink->lastInsertId();
        foreach($section->subsection as $v){
            self::insertSubsection($idSection,$v); 
        }
    }
    private function updateSection($v = []){
        $this->Log->log(0,"[".__METHOD__."]");   
        $parm=[
            ':id'=>[$v->data->id,'INT'],
            ':valuenewline'=>[$v->property->valuenewline,'STR']
        ];
        $this->dbLink->query2(
                "UPDATE `slo_project_stage_section` SET "
                . "`new_line`=:valuenewline"
                . ",`delete_reason`=''"
                . ",`wsk_u`='0'"
                . ",".$this->dbUtilities->getAlterSql().""
                . " WHERE"
                . "`id`=:id;"
                ,array_merge($parm,$this->dbUtilities->getAlterParm())
        );
         /* SQL UPDATE (DELETE) STAGE SECTION ROW wsk_u, update subsection row wil set wsk_u=0 */
        self::deleteSubsection($v->data->id);
        /* MANAGE SUBSETION */
        self::manageSubSection($v->data->id,$v->subsection);
    }
    private function manageSection($v=[]){
        $this->Log->log(0,"[".__METHOD__."]");   
        /* 
         * v - SECTION
         */
        if(is_null($v)){
            /* SECTION REMOVED */
            return false;
        }
        /*
         * v -> data
         * v -> style
         * v -> property
         * v -> subsection
         */
        $v->data->id = intval($v->data->id,10);
        if($v->data->id>0){
            /* SQL UPDATE SECTION */
            self::updateSection($v);
        }
        else{
            /* SQL INSERT STAGE SECTION */
            self::insertSection($this->data->data->id,$v);
        }
    }
    private function insertSubsection($idSection=0,$v=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SECTION - ".$idSection);
        /*
         * v -> data
         * v -> style
         * v -> property
         * v -> subsectionrow
        */
        $this->dbLink->query2(
                    "INSERT INTO `slo_project_stage_subsection` (`id_section`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge([':id'=>[$idSection,'INT']], $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm()));
        /* INSERT SUBSECTION ROW [COLUMNS] */
        $lastId=$this->dbLink->lastInsertId();
        foreach($v->subsectionrow as $v){
            self::insertSubsectionRow($lastId,$v); 
        }
    }
    private function insertSubsectionRow($idSubsection=0,$data=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION - ".$idSubsection);
        $parm=[
            ':id'=>[$idSubsection,'INT']
        ];
        /*
         * ,
            ':valuenewline'=>[$data->data->valuenewline,'STR'],
            ':value'=>[$data->data->value,'STR'] 
             ,`new_line`,`value`
         * ,:valuenewline,:value
         */
        /* INSERT SUBSECTION ROWA DATA */
        $this->dbLink->query2(
            "INSERT INTO `slo_project_stage_subsection_row` (`id_subsection`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
            ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm()));
        $lastId=$this->dbLink->lastInsertId();
        /* INSERT SUBSECTION ROW STYLE */
        //print_r($data);
        //throw new Exception(__LINE__);
        /*
         * INSERT paragraph
         */
        /* INSERT SUBSECTION ROW paragraph STYLE */
        self::insertSubsectionRowAttributes($lastId,$data->paragraph->style,'slo_project_stage_subsection_row_p_style');
        /* INSERT SUBSECTION ROW paragraph PROPERTIES */
        self::insertSubsectionRowAttributes($lastId,$data->paragraph->property,'slo_project_stage_subsection_row_p_prop'); 
        /* INSERT SUBSECTION ROW TABSTOP */
        self::insertTabStop($lastId,$data->paragraph->tabStop);
        /*
         * INSERT list
         */
        /* INSERT SUBSECTION ROW list STYLE */
        self::insertSubsectionRowAttributes($lastId,$data->list->style,'slo_project_stage_subsection_row_l_style');
        /* INSERT SUBSECTION ROW list PROPERTIES */
        self::insertSubsectionRowAttributes($lastId,$data->list->property,'slo_project_stage_subsection_row_l_prop'); 
        /*
         * INSERT table
         */
        /* INSERT SUBSECTION ROW list STYLE */
        self::insertSubsectionRowAttributes($lastId,$data->table->style,'slo_project_stage_subsection_row_t_style');
        /* INSERT SUBSECTION ROW list PROPERTIES */
        self::insertSubsectionRowAttributes($lastId,$data->table->property,'slo_project_stage_subsection_row_t_prop'); 
        /*
         * INSERT image
         */
        /* INSERT SUBSECTION ROW image STYLE */
        self::insertSubsectionRowAttributes($lastId,$data->image->style,'slo_project_stage_subsection_row_i_style');
        /* INSERT SUBSECTION ROW image PROPERTIES */
        self::insertSubsectionRowAttributes($lastId,$data->image->property,'slo_project_stage_subsection_row_i_prop'); 
        return false;
        
    }
    
    private function insertSubsectionRowAttributes($id=0,$data=[],$table='slo_project_stage_subsection_row_p_style'){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION ROW - ".$id);
        $parm[':id']=[$id,'INT'];
        foreach($data as $k => $v){
                $this->Log->log(0,$k);
                $this->Log->log(0,$v);
                $parm[':property']=[$k,'STR']; 
                $parm[':value']=[$v,'STR']; 
                $this->dbLink->query2(
                    "INSERT INTO `".$table."` (`id_subsection_row`,`property`,`value`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,:property,:value,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
                );
        }
    }
    private function insertTabStop($id=0,$data=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION ROW - ".$id);
        $parm[':id']=[$id,'INT'];
        $value=[];
        foreach($data as $k => $v){
                //print_r($v);
                //throw new exception('aaaaa');
                $value=[
                    'lp'=>[$k,'INT'],
                    'position'=>[$v->position,'STR'],/* PDO NOT ACCEPT FLOAT */
                    'measurement'=>[$v->measurement,'STR'],
                    'measurementName'=>[$v->measurementName,'STR'],
                    'alignment'=>[$v->alignment,'STR'],
                    'alignmentName'=>[$v->alignmentName,'STR'],
                    'leadingSign'=>[$v->leadingSign,'STR'],
                    'leadingSignName'=>[$v->leadingSignName,'STR']
                ];
                $this->dbLink->query2(
                    "INSERT INTO `slo_project_stage_subsection_row_p_tabstop` (`id_subsection_row`,`lp`,`position`,`measurement`,`measurementName`,`alignment`,`alignmentName`,`leadingSign`,`leadingSignName`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,:lp,:position,:measurement,:measurementName,:alignment,:alignmentName,:leadingSign,:leadingSignName,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm,$value,$this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
                );
        }
    }
    private function manageSubSection($idSection,$subsection=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->log(0,"ID SECTION - ".$idSection);
        foreach($subsection as $v){
            /*
            * v -> data
            * v -> style
            * v -> property
            * v -> subsectionrow
            */
            //$this->Log->log(0,"[".__METHOD__."] TYPE - ".gettype($v));
            if(is_null($v)){
                /* SUBSECTION ROW REMOVED */
                continue;
            }
            $this->Log->log(0,$v->data);
            $v->data->id = intval($v->data->id,10);
            $this->Log->log(0,'ID SUBSECTION - '.$v->data->id);
            if($v->data->id>0){
                /* SQL UPDATE SUB SECTION */
                self::updateSubSection($v);  
            }
            else{
                /* INSERT SUBSECTION [COLUMNS] */
                self::insertSubsection($idSection,$v);  
            } 
        }
         /* LOOP FOR DELETE */
    }
    private function updateSubSection($v = []){
        $this->Log->log(0,"[".__METHOD__."]");
        $parm=[
            ':id'=>[$v->data->id,'INT']          
        ];
        $this->dbLink->query2(
                "UPDATE `slo_project_stage_subsection` SET "
                . "".$this->dbUtilities->getAlterSql().""
                .",`delete_reason`=''"
                .",`wsk_u`='0'"
                . " WHERE"
                . "`id`=:id;"
                ,array_merge($parm,$this->dbUtilities->getAlterParm())
        );
        /* SQL UPDATE (DELETE) STAGE SECTION ROW wsk_u, update subsection row wil set wsk_u=0 */
        self::deleteSubsectionRow($v->data->id);
        /* */
        self::manageSubSectionRow($v->data->id,$v->subsectionrow);
    }
    private function manageSubSectionRow($idSubSection=0,$subSectionRow=[]){
        $this->Log->log(0,"[".__METHOD__."]");        
        foreach($subSectionRow as $v){
            /*
            * v -> data
            * v -> style
            * v -> property
            * v -> subsectionrow 
            */
            //$this->Log->log(0,"[".__METHOD__."] TYPE - ".gettype($v));
            if(is_null($v)){
                /* SUBSECTION ROW REMOVED */
                continue;
            }
            $v->data->id = intval($v->data->id,10);
            $this->Log->log(0,'ID SUBSECTION ROW - '.$v->data->id);
            $this->Log->log(0,$v);
            if($v->data->id>0){
                /* SQL UPDATE SUB SECTION */
                self::updateSubSectionRow($v);  
            }
            else{
                /* INSERT SUBSECTION [COLUMNS] */
                self::insertSubsectionRow($idSubSection,$v);  
            } 
        }
        /* LOOP FOR DELETE */
    }
    private function updateSubSectionRow($v = []){
        $parm=[
            ':id'=>[$v->data->id,'INT'] 
        ];
        /*
         * ,
            ':valuenewline'=>[$v->data->valuenewline,'STR'],
                ':value'=>[$v->data->value,'STR']    
         * 
         *                 . "value=:value"  
         *    . ",new_line=:valuenewline"
         */
        $this->dbLink->query2(
                "UPDATE `slo_project_stage_subsection_row` SET "
                ."`delete_reason`=''"
                .",`wsk_u`='0'"
                . ",".$this->dbUtilities->getAlterSql().""
                . " WHERE"
                . "`id`=:id;"
                ,array_merge($parm,$this->dbUtilities->getAlterParm()));
         /* DELETE AND INSTERT - STYLE AND PROEPRTY ONLY DATA, IT PRVENT FOR CHANGES ON FRONT-END WHEN NEW STYLES OR PROPERTY APPEAR */
        
        self::updateSubsectionRowAttributes($v->data->id,$v->style,'slo_project_stage_subsection_row_style');
        /* DELETE AND INSTERT - STYLE AND PROEPRTY ONLY DATA, IT PRVENT FOR CHANGES ON FRONT-END WHEN NEW STYLES OR PROPERTY APPEAR */
        self::updateSubsectionRowAttributes($v->data->id,$v->property,'slo_project_stage_subsection_row_property'); 
    }
    private function updateSubsectionRowAttributes($idRow=0,$data=[],$table=''){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION ROW - ".$idRow);
        /* DELETE */
        $this->dbLink->query2("DELETE FROM `".$table."` WHERE `id_subsection_row`=:id",[':id'=>[$idRow,'INT']]);
        /* INSERT */
        self::insertSubsectionRowAttributes($idRow,$data,$table);
    }
}
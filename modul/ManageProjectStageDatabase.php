<?php
/**
 * Description of ManageProjectConstsDatabase
 *
 * @author tborczynski
 * 
 * MANAGE PROJECT CONSTS DATABASE QUERY
 */
//abstract
class ManageProjectStageDatabase {
    private $dbLink;
    protected $DatabaseUtilities;
    protected $Log;
    //protected $inpArray=array();
    protected $data=array();
    protected $error='';
    protected $stage;
    
    public function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->DatabaseUtilities=new DatabaseUtilities();
    }
    public function __destruct(){}
    protected function getStageGlossaryText(){
        $this->Log->log(0,"[".__METHOD__."]");
        return [
            'color'=>$this->DatabaseUtilities->getColor(),
            'fontFamily'=>$this->DatabaseUtilities->getFontFamily(),
            'decoration'=>$this->DatabaseUtilities->getStyle(0),
            'textAlign'=>$this->DatabaseUtilities->getStyle(1),
            'measurement'=>$this->DatabaseUtilities->getStyle(2),
            'department'=>$this->DatabaseUtilities->getUserDepartment($_SESSION['userid']),
            'leading'=>$this->DatabaseUtilities->getSloList('l'),
            'indentationSpecial'=>$this->DatabaseUtilities->getSloList('s'),
            'listMeasurement'=>$this->DatabaseUtilities->getSloList('m'),
            'leadingSign'=>$this->DatabaseUtilities->getSloList('ls'),
            'tabstopAlign'=>$this->DatabaseUtilities->getSloList('a')
        ];
    }
    protected function getStageGlossaryList(){
        $this->Log->log(0,"[".__METHOD__."]");
        return [
            'listType'=>$this->DatabaseUtilities->getListType()
            
        ];
    }
    protected function getStageGlossaryImage(){
        $this->Log->log(0,"[".__METHOD__."]");
        return [
            'wrapping'=>$this->DatabaseUtilities->getSloList('w'),
            'order'=>$this->DatabaseUtilities->getSloList('o')
        ];
    }
    protected function getStageParameters($parm='STAGE_%'){
        return $this->DatabaseUtilities->getParam($parm);
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
    public function getStageImageProperty(&$data,$tablePrefix,$id=0){
        
        foreach($this->dbLink->squery("SELECT `id` FROM `".$tablePrefix."` WHERE `id_parent`=:id AND wsk_u='0';",[':id'=>[$id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
            $data->{$k}=new stdClass();
            //print_r($v);
            //echo $v->id;
            $data->{$k}->data=new stdClass();
            $data->{$k}->data->id=intval($v->id,10);
            $data->{$k}->data->tmp='n'; // FOR run function getTmpStageImage or getStageImage
            self::assignAllProperty($data->{$k},$tablePrefix,$v->id);
        }
    }
    public function assignAllProperty(&$Data,$tablePrefix='',$id=0){
        self::assignProperty($Data,$tablePrefix,'property',$id);
        self::assignProperty($Data,$tablePrefix,'style',$id);
    }
    private function assignProperty(&$data,$tablePrefix = '',$key='property',$id = 0){
        $data->{$key}=new stdClass();
        foreach($this->dbLink->squery("SELECT `property`,`value` FROM `${tablePrefix}_${key}` WHERE `id_parent`=:id;",[':id'=>[$id,'INT']],'FETCH_OBJ','fetchAll') as $v){
            $data->{$key}->{$v->property} = $v->value;
        }
    }
    public function assignTabStopProperty(&$data,$id=0,$table='slo_project_stage_subsection_row_p_tabstop'){
        $data->tabstop=new stdClass();
        foreach($this->dbLink->squery("SELECT `lp`,`position`,`measurement`,`measurementName`,`alignment`,`alignmentName`,`leadingSign`,`leadingSignName` FROM `".$table."` WHERE `id_parent`=:id ORDER BY `lp` asc;",[':id'=>[$id,'INT']],'FETCH_OBJ','fetchAll') as $v){
            //$data->{$key}->{$v->property} = $v->value;
            $data->tabstop->{$v->lp} = (object) array(
                    'position'=>floatval($v->position),
                    'measurement'=>$v->measurement,
                    'measurementName'=>$v->measurementName,
                    'alignment'=>$v->alignment,
                    'alignmentName'=>$v->alignmentName,
                    'leadingSign'=>$v->leadingSign,
                    'leadingSignName'=>$v->leadingSignName
                );
        }
    }
    
    public function assignVariableProperty(&$data,$id=0,$table='slo_project_stage_subsection_row_p_variable'){
        $data->variable=$this->dbLink->squery("SELECT `id_variable`,`name`,`value`, (CASE WHEN `type`='v' THEN 'zmienna' WHEN `type`='t' THEN 'tekst' ELSE 'error_type' END) as 'type' FROM `".$table."` WHERE `id_parent`=:id ORDER BY `id` ASC;",[':id'=>[$id,'INT']],'FETCH_OBJ','fetchAll');        
    }
    protected function getStageFullData($id=0){
        $this->Log->log(0,"[".__METHOD__."] ID => ".$id);
        //$parm[':id']=[$id,'INT'];
        /* GET STAGE */
        $this->stage = new stdClass();
        //$this->stage = (object)[];
        //$data=[];
        $this->stage->data=$this->dbLink->squery("SELECT s.`id`,s.`departmentId`,s.`departmentName`,s.`title`,s.`new_page` as valuenewline FROM `slo_project_stage` s WHERE s.id=:id",[':id'=>[$id,'INT']],'FETCH_OBJ','fetch');
        /* FIX STRING TO INT */
        $this->stage->data->id=intval($this->stage->data->id,10);
        /* SET STAGE STYLE AND PROPERTY */
        self::assignAllProperty($this->stage,'slo_project_stage',$this->stage->data->id);
        /* SET STAGE SECTION */
        self::getStageSection($this->stage,$id);
        return $this->stage;
    }
    private function getStageSection(&$data,$id=0){
        $data->section=new stdClass();
        /* GET SECTION*/
        foreach($this->dbLink->squery("SELECT `id` FROM `slo_project_stage_section` WHERE id_parent=:id AND wsk_u='0';",[':id'=>[$id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
            $data->section->{$k} = (object) array(
                    'data'=>new stdClass(),
                    'subsection'=>new stdClass()
                );
            $data->section->{$k}->data->id=intval($v->id,10);
            self::assignAllProperty($data->section->{$k},'slo_project_stage_section',$data->section->{$k}->data->id);
            self::getStageSubsection($data->section->{$k}->subsection,$data->section->{$k}->data->id);
        }
    }
    private function getStageSubsection(&$data,$id=0){
        //$data->subsection=new stdClass();
        /* GET SUBSECTION */
        foreach($this->dbLink->squery("SELECT `id` FROM `slo_project_stage_subsection` WHERE `id_parent`=:id AND wsk_u='0';",[':id'=>[$id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
            $data->{$k} = (object) array(
                    'data'=>new stdClass(),
                    'subsectionrow'=>new stdClass()
                );
            $data->{$k}->data->id=intval($v->id,10);
            self::assignAllProperty($data->{$k},'slo_project_stage_section',$data->{$k}->data->id);
            self::getStageSubsectionRow($data->{$k}->subsectionrow,$data->{$k}->data->id);
        }
    }
    private function getStageSubsectionRow(&$data,$id=0){

        foreach($this->dbLink->squery("SELECT `id` FROM `slo_project_stage_subsection_row` WHERE `id_parent`=:id AND wsk_u='0';",[':id'=>[$id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
             $data->{$k}= (object) array(
                    'data'=>new stdClass(),
                    'image'=>new stdClass(),
                    'list'=>new stdClass(),
                    'paragraph'=>new stdClass(),
                    'table'=>new stdClass(),
                );
            $data->{$k}->data->id=intval($v->id,10);
            self::getStageImageProperty($data->{$k}->image,'slo_project_stage_subsection_row_i',$data->{$k}->data->id);
            self::assignAllProperty($data->{$k}->list,'slo_project_stage_subsection_row_l',$data->{$k}->data->id);
            self::assignAllProperty($data->{$k}->paragraph,'slo_project_stage_subsection_row_p',$data->{$k}->data->id);
            self::assignAllProperty($data->{$k}->table,'slo_project_stage_subsection_row_t',$data->{$k}->data->id);
            /* SET TAB STOP */
            self::assignTabStopProperty($data->{$k}->paragraph,$data->{$k}->data->id,'slo_project_stage_subsection_row_p_tabstop');
            /* SET VARIABLE */
            self::assignVariableProperty($data->{$k}->paragraph,$data->{$k}->data->id,'slo_project_stage_subsection_row_p_variable');
        }
    }
    
    private function getStyleProperty($id = 0){
        $style=[];
        foreach($this->dbLink->squery("SELECT `property`,`value` FROM `slo_project_stage_subsection_row_style` WHERE `id_parent`=".$id.";") as $v){
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
        $this->dbLink->query("UPDATE `slo_project_stage` SET `wsk_v`=:wsk,`hide_reason`=:reason,".$this->DatabaseUtilities->getAlterSql()." WHERE `id`=:id",
            array_merge(self::setChangeStageParm(),$this->DatabaseUtilities->getAlterParm()));
    }
    protected function deleteStage(){
        $parm=self::setChangeStageParm();
        $parm[':delete_date']=[$this->DatabaseUtilities->getDate(),'STR'];
        $this->dbLink->query("UPDATE `slo_project_stage` SET `wsk_u`=:wsk,`delete_reason`=:reason,`delete_date`=:delete_date,".$this->DatabaseUtilities->getAlterSql()." WHERE `id`=:id",
                array_merge($parm,$this->DatabaseUtilities->getAlterParm()));
    }
    private function deleteSection($id = 0){  
        $parm=[
            ':id'=>[$id,'INT'],
            ':dat_u'=>[$this->DatabaseUtilities->getDate(),'STR']
        ];
        $this->dbLink->query("UPDATE `slo_project_stage_section` SET `wsk_u`='1',`delete_reason`='Removed by edit',`dat_u`=:dat_u,".$this->DatabaseUtilities->getAlterSql()." WHERE `id_parent`=:id AND `wsk_u`='0'",
                array_merge($parm,$this->DatabaseUtilities->getAlterParm()));
    }
    private function deleteSubsection($id = 0){
        $parm=[
            ':id'=>[$id,'INT'],
            ':dat_u'=>[$this->DatabaseUtilities->getDate(),'STR']
        ];
        $this->dbLink->query("UPDATE `slo_project_stage_subsection` SET `wsk_u`='1',`delete_reason`='Removed by edit',`dat_u`=:dat_u,".$this->DatabaseUtilities->getAlterSql()." WHERE `id_parent`=:id AND `wsk_u`='0'",
                array_merge($parm,$this->DatabaseUtilities->getAlterParm()));
    }
    private function deleteSubsectionRow($id = 0){
        $parm=[
            ':id'=>[$id,'INT'],
            ':dat_u'=>[$this->DatabaseUtilities->getDate(),'STR']
        ];
        $this->dbLink->query("UPDATE `slo_project_stage_subsection_row` SET `wsk_u`='1',`delete_reason`='Removed by edit',`dat_u`=:dat_u,".$this->DatabaseUtilities->getAlterSql()." WHERE `id_parent`=:id AND `wsk_u`='0'",
                array_merge($parm,$this->DatabaseUtilities->getAlterParm()));
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
            $this->DatabaseUtilities->exist('department',"id=".$this->data->data->departmentId);
            
            //self::runQuery();
            $this->data->data->id=intval($this->data->data->id,10);
            $id=self::setStage();
            $this->dbLink->commit();  //PHP 5 and new
        }
        catch (PDOException $e){
            //$this->Log->log(0,$e);
            $this->dbLink->rollback(); 
            Throw New Exception("[".__METHOD__."] DATABASE ERROR: ".$e->getMessage(),1);
        }
        finally{
            //$this->queryList=[];
            return $id;
        }
    }
    private function setStage(){
        $this->Log->log(0,"[".__METHOD__."]\r\nID DB - ".$this->data->data->id);    
        /* ADD/UPDATE STAGE */
        if($this->data->data->id===0){
            $this->Log->log(0,"INSERT STAGE"); 
            /* SQL INSERT STAGE */
            self::insertStage();
            $lastStage = $this->dbLink->lastInsertId();
            /* SQL INSERT STAGE SECTION */
            foreach($this->data->section as $v){
                self::insertSection($lastStage,$v);
            }
            return $lastStage;
        }
        else{
            /* ADD TO JS NEW PAGE!!!!*/
            $this->Log->log(0,"UPDATE STAGE"); 
            /* SQL UPDATE STAGE */
            self::updateStage();
            /* SQL UPDATE (DELETE) STAGE SECTION wsk_u, update section wil set wsk_u=0 */
            self::deleteSection($this->data->data->id);
            /* SQL UPDATE STAGE SECTION */
            foreach($this->data->section as $v){
                self::manageSection($v);
            }
            return $this->data->data->id;
        }
    }
    private function insertStage(){
        $this->Log->log(0,"[".__METHOD__."]");  
        $this->dbLink->query2(
                "INSERT INTO `slo_project_stage` (`departmentId`,`departmentName`,`title`,`type`,`new_page`,".$this->DatabaseUtilities->getCreateSql()[0].",".$this->DatabaseUtilities->getCreateAlterSql()[0].") VALUES (:departmentId,:departmentName,:title,:type,:new_page,".$this->DatabaseUtilities->getCreateSql()[1].",".$this->DatabaseUtilities->getCreateAlterSql()[1].");"
                ,array_merge(self::sqlStageParm(), $this->DatabaseUtilities->getCreateParm(),$this->DatabaseUtilities->getAlterParm()));
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
                . ",".$this->DatabaseUtilities->getAlterSql().""
                . " WHERE"
                . "`id`=:id;"
                ,array_merge(self::sqlStageParm(),[':id'=>[$this->data->data->id,'INT']],$this->DatabaseUtilities->getAlterParm())
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
            ':id'=>[$idStage,'INT']
        ];
        /* INSERT SECTION */
        $this->dbLink->query2(
            "INSERT INTO `slo_project_stage_section` (`id_parent`,".$this->DatabaseUtilities->getCreateSql()[0].",".$this->DatabaseUtilities->getCreateAlterSql()[0].") VALUES (:id,".$this->DatabaseUtilities->getCreateSql()[1].",".$this->DatabaseUtilities->getCreateAlterSql()[1].");"
            ,array_merge($parm, $this->DatabaseUtilities->getCreateParm(),$this->DatabaseUtilities->getAlterParm()));   
         /* INSERT SUBSECTION [COLUMNS] */
        $idSection = $this->dbLink->lastInsertId();
        self::insertAttributes($idSection,$section,'slo_project_stage_section');    
        foreach($section->subsection as $v){
            self::insertSubsection($idSection,$v); 
        }
    }
    private function updateSection($v = []){
        $this->Log->log(0,"[".__METHOD__."]");   
        $parm=[
            ':id'=>[$v->data->id,'INT']
        ];
        $this->dbLink->query2(
                "UPDATE `slo_project_stage_section` SET "
                . "`delete_reason`=''"
                . ",`wsk_u`='0'"
                . ",".$this->DatabaseUtilities->getAlterSql().""
                . " WHERE"
                . "`id`=:id;"
                ,array_merge($parm,$this->DatabaseUtilities->getAlterParm())
        );
        self::deleteAttributes($v->data->id,'slo_project_stage_section');  
        self::insertAttributes($v->data->id,$v,'slo_project_stage_section');  

       
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
                    "INSERT INTO `slo_project_stage_subsection` (`id_parent`,".$this->DatabaseUtilities->getCreateSql()[0].",".$this->DatabaseUtilities->getCreateAlterSql()[0].") VALUES (:id,".$this->DatabaseUtilities->getCreateSql()[1].",".$this->DatabaseUtilities->getCreateAlterSql()[1].");"
                    ,array_merge([':id'=>[$idSection,'INT']], $this->DatabaseUtilities->getCreateParm(),$this->DatabaseUtilities->getAlterParm()));
        /* INSERT SUBSECTION ROW [COLUMNS] */
        $lastId=$this->dbLink->lastInsertId();
        
        self::insertAttributes($lastId,$v,'slo_project_stage_subsection');
        //self::insertAttributes($lastId,$v->style,'slo_project_stage_subsection_style');
        //self::insertAttributes($lastId,$v->property,'slo_project_stage_subsection_property');
        
        foreach($v->subsectionrow as $v){
            self::insertSubsectionRow($lastId,$v); 
        }
    }
    private function insertSubsectionRow($idSubsection=0,$data=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION - ".$idSubsection);
        /* INSERT SUBSECTION ROWA DATA */
        $this->dbLink->query2(
            "INSERT INTO `slo_project_stage_subsection_row` (`id_parent`,".$this->DatabaseUtilities->getCreateSql()[0].",".$this->DatabaseUtilities->getCreateAlterSql()[0].") VALUES (:id,".$this->DatabaseUtilities->getCreateSql()[1].",".$this->DatabaseUtilities->getCreateAlterSql()[1].");"
            ,array_merge([':id'=>[$idSubsection,'INT']], $this->DatabaseUtilities->getCreateParm(),$this->DatabaseUtilities->getAlterParm()));
        $IdRow=$this->dbLink->lastInsertId();
        /*
         * INSERT paragraph
         */
        $this->Log->log(0,"paragraph");
        self::insertAttributes($IdRow,$data->paragraph,'slo_project_stage_subsection_row_p');
        /* INSERT SUBSECTION ROW TABSTOP */
        self::insertExtendedTabStop($IdRow,$data->paragraph->tabstop,'slo_project_stage_subsection_row_p_tabstop');
        self::insertExtendedVariable($IdRow,$data->paragraph->variable,'slo_project_stage_subsection_row_p_variable');
        /*
         * INSERT list
         */
        $this->Log->log(0,"list");
        self::insertAttributes($IdRow,$data->list,'slo_project_stage_subsection_row_l');
        /*
         * INSERT table
         */
        $this->Log->log(0,"table");
        self::insertAttributes($IdRow,$data->table,'slo_project_stage_subsection_row_t');
        /*
         * INSERT image
         */
        $this->Log->log(0,"image");
        /* REMOVE OLD */
         ////$parm[':id']=[$id,'INT'];
        //$this->dbLink->query2("DELETE FROM `".$table."_style` WHERE `id_parent`=:id;",$parm);
        /* ADD NEW */
        foreach($data->image as $v){
            self::insertExtendedSubsectionRowImage($IdRow,$v,'slo_project_stage_subsection_row_i');
        }
    }
    public function insertExtendedSubsectionRowImage($IdRow,$v,$table){
        $this->Log->log(0,"[".__METHOD__."]");
        $run = function($IdRow,$table,$t,$v){
            /*
             * t - $this
             */
            //$this->dbLink,$this->DatabaseUtilities
            $t->dbLink->query2(
                "INSERT INTO `".$table."` (`id_parent`,".$t->DatabaseUtilities->getCreateSql()[0].",".$t->DatabaseUtilities->getCreateAlterSql()[0].") VALUES (:id,".$t->DatabaseUtilities->getCreateSql()[1].",".$t->DatabaseUtilities->getCreateAlterSql()[1].");"
                ,array_merge([':id'=>[$IdRow,'INT']], $t->DatabaseUtilities->getCreateParm(),$t->DatabaseUtilities->getAlterParm())); 
            /* INSERT IMAGE STYLE AND PROPERTIES */
            $t->insertAttributes($t->dbLink->lastInsertId(),$v,$table);
            /* MOVE FILE from tmp_uplad to upload */
            File::moveFile(TMP_UPLOAD_DIR.$v->property->uri,UPLOAD_DIR,$v->property->uri);
        };
        self::insertSubsectionRowImage($IdRow,$v,$table,$run);
    }
    public function insertSimpleSubsectionRowImage($IdRow,$v,$table){
        $this->Log->log(0,"[".__METHOD__."]");
        $run = function($IdRow,$table,$t,$v){
             $t->dbLink->query2("INSERT INTO `".$table."` (`id_parent`) VALUES (:id);",[':id'=>[$IdRow,'INT']]); 
              /* INSERT IMAGE STYLE AND PROPERTIES */
            $t->insertSimpleAttributes($t->dbLink->lastInsertId(),$v,$table);
             /* MOVE FILE from tmp_uplad to upload IF CHANGED !!!! */
            //File::moveFile(TMP_UPLOAD_DIR.$v->property->uri,UPLOAD_DIR,$v->property->uri);
        };
        self::insertSubsectionRowImage($IdRow,$v,$table,$run);
    }
    private function insertSubsectionRowImage($IdRow=0,$v,$table,$run){
        /* INSERT IMAGE */
        $run($IdRow,$table,$this,$v);
      
    }
    public function insertAttributes($id=0,$data=[],$table='slo_project_stage_subsection_row_p'){
        $this->Log->log(0,"[".__METHOD__."]\r\nID - ".$id."\r\nTABLE: ".$table);
        $parm[':id']=[$id,'INT'];
        self::insertAttributesProperty($parm,$data->style,$table.'_style');
        self::insertAttributesProperty($parm,$data->property,$table.'_property'); 
    }
    public function deleteAttributes($id=0,$table='slo_project_stage_section'){
        $this->Log->log(0,"[".__METHOD__."]\r\nID - ".$id."\r\nTABLE: ".$table."\r\n_style _property");
        $parm[':id']=[$id,'INT'];
        $this->dbLink->query2("DELETE FROM `".$table."_style` WHERE `id_parent`=:id;",$parm);
        $this->dbLink->query2("DELETE FROM `".$table."_property` WHERE `id_parent`=:id;",$parm);
    }
    private function insertAttributesProperty($parm=[],$data=[],$table='slo_project_stage_subsection_row_p_style'){
        foreach($data as $k => $v){
            $parm[':property']=[$k,'STR']; 
            $parm[':value']=[$v,'STR']; 
            //$this->Log->log(0,$k);
            //$this->Log->log(0,$v);
            $this->dbLink->query2(
                 "INSERT INTO `".$table."` (`id_parent`,`property`,`value`,".$this->DatabaseUtilities->getCreateSql()[0].",".$this->DatabaseUtilities->getCreateAlterSql()[0].") VALUES (:id,:property,:value,".$this->DatabaseUtilities->getCreateSql()[1].",".$this->DatabaseUtilities->getCreateAlterSql()[1].");"
                  ,array_merge($parm, $this->DatabaseUtilities->getCreateParm(),$this->DatabaseUtilities->getAlterParm())
            );
        }
    }
    public function insertSimpleAttributes($id=0,$data,$table=''){
        $this->Log->log(0,"[".__METHOD__."]\r\nID - ".$id."\r\nTABLE: ".$table);
        $parm[':id']=[$id,'INT'];
        self::inserSimpletAttributesProperty($parm,$data->style,$table.'_style');
        self::inserSimpletAttributesProperty($parm,$data->property,$table.'_property'); 
    }
    private function inserSimpletAttributesProperty($parm=[],$data=[],$table='slo_project_stage_subsection_row_p_style'){
        foreach($data as $k => $v){
            $parm[':property']=[$k,'STR']; 
            $parm[':value']=[$v,'STR']; 
            $this->dbLink->query2("INSERT INTO `".$table."` (`id_parent`,`property`,`value`) VALUES (:id,:property,:value);",$parm);
        }
    }
    public function insertSimpleTabStop($id=0,$data=[],$table='slo_project_stage_subsection_row_p_tabstop'){
        $this->Log->log(0,"[".__METHOD__."]");
        $run = function($parm,$table,$dbLink,$dbUtilities){
            $dbLink->query2(
                    "INSERT INTO `".$table."` (`id_parent`,`lp`,`position`,`measurement`,`measurementName`,`alignment`,`alignmentName`,`leadingSign`,`leadingSignName`) VALUES (:id_parent,:lp,:position,:measurement,:measurementName,:alignment,:alignmentName,:leadingSign,:leadingSignName);"
                    ,$parm);
        };
         self::insertTabStop($id,$data,$table,$run);
    }
    public function insertExtendedTabStop($id=0,$data,$table='slo_project_stage_subsection_row_p_tabstop'){
         $this->Log->log(0,"[".__METHOD__."]");
         $this->Log->log(0,$data);
        //var_dump($data);
        $run = function($parm,$table,$dbLink,$dbUtilities){
            $dbLink->query2(
                    "INSERT INTO `".$table."` (`id_parent`,`lp`,`position`,`measurement`,`measurementName`,`alignment`,`alignmentName`,`leadingSign`,`leadingSignName`,".$dbUtilities->getCreateSql()[0].",".$dbUtilities->getCreateAlterSql()[0].") VALUES (:id_parent,:lp,:position,:measurement,:measurementName,:alignment,:alignmentName,:leadingSign,:leadingSignName,".$dbUtilities->getCreateSql()[1].",".$dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm,$dbUtilities->getCreateParm(),$dbUtilities->getAlterParm())
                );
        };
        self::insertTabStop($id,$data,$table,$run);
    }
    private function insertTabStop($id=0,$data=[],$table='slo_project_stage_subsection_row_p_tabstop',$run){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION ROW - ".$id);
        $parm=[];
        foreach($data as $k => $v){
            $this->Log->log(0,$k);
            $this->Log->log(0,$v);
                $parm=[
                    ':id_parent'=>[$id,'INT'],
                    ':lp'=>[$k,'INT'],
                    ':position'=>[$v->position,'STR'],/* PDO NOT ACCEPT FLOAT */
                    ':measurement'=>[$v->measurement,'STR'],
                    ':measurementName'=>[$v->measurementName,'STR'],
                    ':alignment'=>[$v->alignment,'STR'],
                    ':alignmentName'=>[$v->alignmentName,'STR'],
                    ':leadingSign'=>[$v->leadingSign,'STR'],
                    ':leadingSignName'=>[$v->leadingSignName,'STR']
                ];
                $run($parm,$table,$this->dbLink,$this->DatabaseUtilities);
        }
    }
    public function insertSimpleVariable($id=0,$data=[],$table='project_report_stage_subsection_row_p_variable'){
         $run = function($parm,$table,$dbLink,$dbUtilities){
            $dbLink->query2(
                    "INSERT INTO `".$table."` (`id_parent`,`id_variable`,`name`,`value`,`type`) VALUES (:id,:id_variable,:name,:value,:type);"
                    ,$parm);
        };
        self::insertVariable($id,$data,$table,$run);
    }
    public function insertExtendedVariable($id=0,$data=[],$table='slo_project_stage_subsection_row_p_variable'){
         $run = function($parm,$table,$dbLink,$dbUtilities){
            $dbLink->query2(
                    "INSERT INTO `".$table."` (`id_parent`,`id_variable`,`name`,`value`,`type`,".$dbUtilities->getCreateSql()[0].",".$dbUtilities->getCreateAlterSql()[0].") VALUES (:id,:id_variable,:name,:value,:type,".$dbUtilities->getCreateSql()[1].",".$dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm,$dbUtilities->getCreateParm(),$dbUtilities->getAlterParm())
                );
        };
        self::insertVariable($id,$data,$table,$run);
    }
    private function insertVariable($id=0,$data=[],$table,$run){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION ROW - ".$id);
        foreach($data as $v){
                $parm=[
                    ':id'=>[$id,'INT'],
                    ':id_variable'=>[$v->id_variable,'INT'],/* PDO NOT ACCEPT FLOAT */
                    ':name'=>[$v->name,'STR'],
                    ':value'=>[$v->value,'STR'],
                    ':type'=>[self::parseVariableType($v->type),'STR'] /* TO DO IN FUTURE v - variable, t - text */
                ];
                $run($parm,$table,$this->dbLink,$this->DatabaseUtilities);
        }
    }
    private function parseVariableType($v=''){
        switch ($v){
            case 'zmienna':
                return 'v';
            case 'tekst':
                return 't';
            default :
                Throw New Exception ('Wrong variable type!',0);
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
                . "".$this->DatabaseUtilities->getAlterSql().""
                .",`delete_reason`=''"
                .",`wsk_u`='0'"
                . " WHERE"
                . "`id`=:id;"
                ,array_merge($parm,$this->DatabaseUtilities->getAlterParm())
        );
        self::deleteAttributes($v->data->id,'slo_project_stage_subsection');
        self::insertAttributes($v->data->id,$v,'slo_project_stage_subsection');
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
            //$this->Log->log(0,$v);
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
        $this->Log->log(0,"[".__METHOD__."]");       
        $parm=[':id'=>[$v->data->id,'INT'] ];
        $this->dbLink->query2(
                "UPDATE `slo_project_stage_subsection_row` SET "
                ."`delete_reason`=''"
                .",`wsk_u`='0'"
                . ",".$this->DatabaseUtilities->getAlterSql().""
                . " WHERE"
                . "`id`=:id;"
                ,array_merge($parm,$this->DatabaseUtilities->getAlterParm()));
        /* DELETE AND INSTERT - STYLE AND PROPERTY TEXT,LIST,TABLE,LIST, IT PREVENT FOR CHANGES ON FRONT-END WHEN NEW STYLES OR PROPERTY APPEARS */    
        /*
         * INSERT paragraph
         */
        self::deleteAttributes($v->data->id,'slo_project_stage_subsection_row_p');
        self::insertAttributes($v->data->id,$v->paragraph,'slo_project_stage_subsection_row_p');
        /* INSERT SUBSECTION ROW TABSTOP */
        $this->dbLink->query2("DELETE FROM `slo_project_stage_subsection_row_p_tabstop` WHERE `id_parent`=:id;",$parm);
        self::insertExtendedTabStop($v->data->id,$v->paragraph->tabstop,'slo_project_stage_subsection_row_p_tabstop');
        /* INSERT SUBSECTION ROW VARIABLE */
        $this->dbLink->query2("DELETE FROM `slo_project_stage_subsection_row_p_variable` WHERE `id_parent`=:id;",$parm);
        self::insertExtendedVariable($v->data->id,$v->paragraph->variable,'slo_project_stage_subsection_row_p_variable');
        /*
         * INSERT list
         */
        self::deleteAttributes($v->data->id,'slo_project_stage_subsection_row_l');
        self::insertAttributes($v->data->id,$v->list,'slo_project_stage_subsection_row_l');
        /*
         * INSERT table
         */
        self::deleteAttributes($v->data->id,'slo_project_stage_subsection_row_t');
        self::insertAttributes($v->data->id,$v->table,'slo_project_stage_subsection_row_t');
        /*
         * INSERT image
         */
        
        //
        
        /* SET wsk_u to OLD IMAGE */
        array_walk($v->image,['self','updateSubSectionRowImage'],$v->data->id);
    }
    private function updateSubSectionRowImage($v,$key=0,$IdRow=0){
        $this->Log->log(0,"[".__METHOD__."]");  
        $this->Log->log(0,$v->data->id);  
        $this->Log->log(0,$v->data->tmp);  
        if($v->data->id>0 && $v->data->tmp==='y'){
            $this->Log->log(0,"UPDATE IMAGE - TO DO");      
            /* OLD FILE STAY FOR BACK FUNCTION IN FUTUTRE -> TO DO */
            self::deleteAttributes($v->data->id,'slo_project_stage_subsection_row_i');
            /* INSERT NEW ATTRBIUTES */
            self::insertAttributes($v->data->id,$v,'slo_project_stage_subsection_row_i');
            /* MOVE FILE */
            File::moveFile(TMP_UPLOAD_DIR.$v->property->uri,UPLOAD_DIR,$v->property->uri);
        }
        else if($v->data->id>0 && $v->data->tmp==='n'){
            $this->Log->log(0,"UPDATE ONLY IMAGE ATTRIBUTES");  
            self::deleteAttributes($v->data->id,'slo_project_stage_subsection_row_i');
            self::insertAttributes($v->data->id,$v,'slo_project_stage_subsection_row_i');
        }
        else if($v->data->id>0 && $v->data->tmp==='d'){
            $this->Log->log(0,"REMOVE IMAGE");  
            self::updateImageWskU($IdRow);
            //self::deleteAttributes($v->data->id,'slo_project_stage_subsection_row_i');
            //self::insertAttributes($v->data->id,$v,'slo_project_stage_subsection_row_i');
        }
        else{
            $this->Log->log(0,"INSERT IMAGE");
            self::insertExtendedSubsectionRowImage($IdRow,$v,'slo_project_stage_subsection_row_i');
        }
    }
    private function updateImageWskU($imageId=0){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->log(0,$imageId);
        
           $this->dbLink->query2(
                "UPDATE `slo_project_stage_subsection_row_i` SET "
                ."`delete_reason`='REMOVED'"
                .",`wsk_u`='1'"
                . ",".$this->DatabaseUtilities->getAlterSql().""
                . " WHERE"
                . "`id_parent`=:id_parent;"
                ,array_merge([':id_parent'=>[$imageId,'INT']],$this->DatabaseUtilities->getAlterParm()));
        return true;
    }
}
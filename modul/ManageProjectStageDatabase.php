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
    protected function getStageGlossary(){
        $this->Log->log(0,"[".__METHOD__."]");
        $glossary['color']=$this->dbUtilities->getColor();
        $glossary['fontFamily']=$this->dbUtilities->getFontFamily();
        $glossary['decoration']=$this->dbUtilities->getStyle(0);
        $glossary['textAlign']=$this->dbUtilities->getStyle(1);
        $glossary['measurement']=$this->dbUtilities->getStyle(2);
        $glossary['department']=$this->dbUtilities->getUserDepartment($_SESSION['userid']);
        
        return $glossary;
    }
    protected function getStageParameters(){
        return $this->dbUtilities->getParam('STAGE_%');
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
        foreach($this->dbLink->squery("SELECT s.`id`,s.`departmentId`,s.`departmentName`,s.`title`,s.`new_page` as valuenewline FROM `SLO_PROJECT_STAGE` s WHERE s.id IN (:id)",[':id'=>[$id,'INT']]) as $k => $v){
            $data['stage'][$k]['data']=$v;
            $data['stage'][$k]['style']=$this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_STYLE` WHERE `id_stage`=".$v['id']);
            $data['stage'][$k]['property']=$this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_PROPERTY` WHERE `id_stage`=".$v['id']);
            self::getStageSection($id,$data['stage'][$k]);
        }
        return $data;
    }
    private function getStageSection($id=0,&$data){
        /* GET SECTION*/
        foreach($this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SECTION` WHERE id_stage=".$id) as $k => $v){
            $data['section'][$k]['data']=$v;
            $data['section'][$k]['style']=$this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SECTION_STYLE` WHERE `id_section`=".$v['id']);
            $data['section'][$k]['property']=$this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SECTION_PROPERTY` WHERE `id_section`=".$v['id']);
            self::getStageSubsection($v['id'],$data['section'][$k]);
        }
    }
    private function getStageSubsection($id=0,&$data){
        /* GET SUBSECTION */
        foreach($this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SUBSECTION` WHERE `id_section`=".$id) as $k => $v){
            $data['subsection'][$k]['data']=$v;
            $data['subsection'][$k]['style']=$this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SUBSECTION_STYLE` WHERE `id_subsection`=".$v['id']);
            $data['subsection'][$k]['property']=$this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SUBSECTION_PROPERTY` WHERE `id_subsection`=".$v['id']);
            self::getStageSubsectionRow($v['id'],$data['subsection'][$k]);
        }
    }
    private function getStageSubsectionRow($id=0,&$data){
        /* GET SUBSECTION ROW */
        foreach($this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SUBSECTION_ROW` WHERE `id_subsection`=".$id) as $k => $v){
            $data['subsectionrow'][$k]['data']=$v;
            $data['subsectionrow'][$k]['style']=$this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SUBSECTION_ROW_STYLE` WHERE `id_subsection_row`=".$v['id']);
            $data['subsectionrow'][$k]['property']=$this->dbLink->squery("SELECT * FROM `SLO_PROJECT_STAGE_SUBSECTION_ROW_PROPERTY` WHERE `id_subsection_row`=".$v['id']);
        }
    }
    protected function getStage($id=0){
        $this->Log->log(0,"[".__METHOD__."] ID => ".$id);
        /* GET STAGE */ 
        $data=$this->dbLink->squery("SELECT s.`id` as 'i',s.`title` as 't',d.`name` as 'd',s.`create_user_full_name` as 'cu',s.`create_user_login` as 'cul',s.`create_date` as 'cd',s.`mod_user_login` as 'mu',s.`mod_date` as 'md',s.`buffer_user_id` as 'bu',s.`wsk_u` as 'wu',b.`login` as 'bl' FROM `SLO_PROJECT_STAGE` as s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`, `department` as d WHERE s.`departmentId`=d.`id` AND s.`id`=:id LIMIT 0,1",[':id'=>[$id,'INT']]);
        return $data[0];
    }
    protected function hideStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$this->data);
        $this->dbLink->query("UPDATE `SLO_PROJECT_STAGE` SET `wsk_v`=:wsk,`hide_reason`=:reason,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id",
            array_merge(self::setChangeStageParm(),$this->dbUtilities->getAlterParm()));
    }
    protected function deleteStage(){
        $parm=self::setChangeStageParm();
        $parm[':delete_date']=[$this->dbUtilities->getDate(),'STR'];
        $this->dbLink->query("UPDATE `SLO_PROJECT_STAGE` SET `wsk_u`=:wsk,`delete_reason`=:reason,`delete_date`=:delete_date,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id",
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
        try{
            /* CHECK DEPARTMENT EXIST */
            $this->dbUtilities->exist('DEPARTMENT',"id=".$this->data->data->departmentId);
            /* START TRANSACTION */
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            //self::runQuery();
            self::setStage();
            //$this->Log->log(0,$k);
             
            //foreach($this->data as $k => $v){
                
                /* ADD SECTION */
                /* ADD ON TOP INFO ABOUT STAGE TO JS !!!!*/
                
            //}
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
        if(intval($this->data->data->id,10)===0){
            $this->Log->log(0,"INSERT STAGE"); 
            /* SQL INSERT STAGE */
            self::insertStage();
            /* SQL INSERT STAGE SECTION */
            self::insertSection($this->dbLink->lastInsertId(),$this->data->section);
        }
        else{
            /* ADD TO JS NEW PAGE!!!!*/
            $this->Log->log(0,"UPDATE STAGE"); 
            /* SQL UPDATE STAGE */
            self::updateStage();
            /* SQL UPDATE STAGE SECTION */
            self::updateSection($this->data->section);
        }  
    }
    private function insertStage(){
       
        $this->Log->log(0,"[".__METHOD__."]");  
         /* SQL INSERT STAGE */
        $parm=[
                ':departmentId'=>[$this->data->data->departmentId,'INT'],
                ':departmentName'=>[$this->data->data->departmentName,'STR'],
                ':title'=>[$this->data->data->title,'STR'],
                ':type'=>['tx','STR'],
                ':new_page'=>[$this->data->data->valuenewline,'STR']
        ];
        $this->dbLink->query2(
                "INSERT INTO `SLO_PROJECT_STAGE` (`departmentId`,`departmentName`,`title`,`type`,`new_page`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:departmentId,:departmentName,:title,:type,:new_page,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
        );
    }
    private function updateStage(){
        $this->Log->log(0,"[".__METHOD__."]");  
    }
    private function insertSection($id=0,$data=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB STAGE - ".$id);
        $parm[':id']=[$id,'INT'];
        foreach($data as $k => $v){
                $this->Log->log(0,$k);
                $this->Log->log(0,"ID DB SECTION - ".$v->data->id);
                /* TO DO ON JS */
                $parm[':valuenewline']=['y','STR']; 
                $this->dbLink->query2(
                    "INSERT INTO `SLO_PROJECT_STAGE_SECTION` (`id_stage`,`new_line`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,:valuenewline,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
                );
                /* INSERT SUBSECTION [COLUMNS] */
                self::insertSubsection($this->dbLink->lastInsertId(),$v->subsection);  
        }
    }
    private function updateSection($data=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        
        foreach($data as $k => $v){
                $this->Log->log(0,$k);
                //$this->Log->log(0,$v);
                die(__LINE__);
                /* ADD/UPDATE SECTION */
                
                /* ADD/UPDATE SUBSECTION */
                self::setSubsection($v);  
        }
      
    }
    private function insertSubsection($id=0,$data=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SECTION - ".$id);
        $parm[':id']=[$id,'INT'];
        foreach($data as $k => $v){
                $this->Log->log(0,$k);
                $this->Log->log(0,"ID DB SUBSECTION - ".$v->data->id);
                $this->dbLink->query2(
                    "INSERT INTO `SLO_PROJECT_STAGE_SUBSECTION` (`id_section`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
                );
                /* INSERT SUBSECTION [COLUMNS] */
                self::insertSubsectionRow($this->dbLink->lastInsertId(),$v->subsectionrow);  
        }
    }
    private function insertSubsectionRow($id=0,$data=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION - ".$id);
        $parm[':id']=[$id,'INT'];
        $lastId=0;
        foreach($data as $k => $v){
                $this->Log->log(0,$k);
                $this->Log->logMulti(0,$v);
                $this->Log->log(0,"ID DB SUBSECTION ROW - ".$v->data->id);
                $parm[':valuenewline']=[$v->data->valuenewline,'STR']; 
                $parm[':value']=[$v->data->value,'STR']; 
                $this->dbLink->query2(
                    "INSERT INTO `SLO_PROJECT_STAGE_SUBSECTION_ROW` (`id_subsection`,`new_line`,`value`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,:valuenewline,:value,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
                );
                $lastId=$this->dbLink->lastInsertId();
                /* INSERT SUBSECTION ROW STYLE */
                self::insertSubsectionRowAttributes($lastId,$v->style,'SLO_PROJECT_STAGE_SUBSECTION_ROW_STYLE');
                /* INSERT SUBSECTION ROW PROPERTIES */
                self::insertSubsectionRowAttributes($lastId,$v->property,'SLO_PROJECT_STAGE_SUBSECTION_ROW_PROPERTY');
                //self::insertSubsectionRow($this->dbLink->lastInsertId(),$v->subsectionrow);  
        }
    }
    private function insertSubsectionRowAttributes($id=0,$data=[],$table='SLO_PROJECT_STAGE_SUBSECTION_ROW_STYLE'){
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
    private function setSubsection($data=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        
        
        foreach($data as $k => $v){
                $this->Log->log(0,$k);
                /* ADD/UPDATE SUBSECTION */
                
                /* ADD/UPDATE SUBSECTION ROW */
                self::setSubsectionRow($v);  
        }  
    }
    private function setSubsectionRow($data=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        /* ADD/UPDATE SUBSECTION ROW ATTRIBUTES*/
        $this->Log->log(0,"[".__METHOD__."]\r\n NEW LINE - ".$data->newline);
        /* ADD/UPDATE SUBSECTION ROW STYLE*/
        self::setSubsectionRowStyle($data->style);  
        /* ADD/UPDATE SUBSECTION ROW PROPERTY (INCLUDE VALUE)*/
        self::setSubsectionRowProperty($data->property);  
    }
    private function setSubsectionRowStyle($data=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        foreach($data as $k => $v){
            /* ADD/UPDATE STYLE */
            $this->Log->log(0,$k." - ".$v);     
        }  
     }
    private function setSubsectionRowProperty($data=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        foreach($data as $k => $v){
            /* ADD/UPDATE PROPERTY */
            //$this->Log->log(0,$k.' - '.$v);
            //$this->Log->log(0,$k.' - '.$v);
            $this->Log->log(0,$k);
            
        }  
      }
}

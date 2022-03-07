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
        $glossary['fontfamily']=$this->dbUtilities->getFontFamily();
        $glossary['decoration']=$this->dbUtilities->getStyle(0);
        $glossary['align']=$this->dbUtilities->getStyle(1);
        $glossary['measurement']=$this->dbUtilities->getStyle(2);
        $glossary['parameter']=$this->dbUtilities->getParam('STAGE_%');
        return $glossary;
    }
    protected function getStages($where='',$parm=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        $select="SELECT s.`id` as 'i',s.`title` as 't',b.`login` as 'bl' FROM `slo_project_stage` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        
        //$select="SELECT s.`id` as 'i',s.`number` as 'n',s.`title` as 't',(select e.`value` FROM `slo_projekt_etap_ele` as e WHERE e.`id_projekt_etap`=s.`id` and `wsk_u`='0' and `wsk_v`='0' ORDER BY e.`id` ASC LIMIT 0,1) as `v`,b.`login` as 'bl' FROM `slo_projekt_etap` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $data=[];
         /* */
        foreach($this->dbLink->squery($select.$where,$parm) as $v){
            //array_push($data,array($v['i'],$v['n'],html_entity_decode($v['t']),html_entity_decode($v['v']),'bl'=>$v['bl']));
            array_push($data,array($v['i'],html_entity_decode($v['t']),'bl'=>$v['bl']));
        }
        return $data;
    }
    protected function manageStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        try{
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
        $this->Log->log(0,"[".__METHOD__."]\r\nID DB - ".$this->data->db);    
        /* ADD/UPDATE STAGE */
        if(intval($this->data->db,10)===0){
            $this->Log->log(0,"INSERT STAGE"); 
            /* SQL INSERT STAGE */
            self::insertStage();
            /* SQL INSERT STAGE SECTION */
            self::insertSection($this->dbLink->lastInsertId(),$this->data->sec);
        }
        else{
            /* ADD TO JS NEW PAGE!!!!*/
            $this->Log->log(0,"UPDATE STAGE"); 
            /* SQL UPDATE STAGE */
            self::updateStage();
            /* SQL UPDATE STAGE SECTION */
            self::updateSection($this->data->sec);
        }  
    }
    private function insertStage(){
        $this->Log->log(0,"[".__METHOD__."]");  
         /* SQL INSERT STAGE */
        $parm=[
                ':id_department'=>[$this->data->department,'INT'],
                ':title'=>[$this->data->title,'STR'],
                ':type'=>['tx','STR'],
                ':new_page'=>['y','STR']
        ];
        $this->dbLink->query2(
                "INSERT INTO `SLO_PROJECT_STAGE` (`id_department`,`title`,`type`,`new_page`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id_department,:title,:type,:new_page,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
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
                $this->Log->log(0,"ID DB SECTION - ".$v->db);
                /* TO DO ON JS */
                $parm[':new_line']=['y','STR']; 
                $this->dbLink->query2(
                    "INSERT INTO `SLO_PROJECT_STAGE_SECTION` (`id_stage`,`new_line`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,:new_line,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
                );
                /* INSERT SUBSECTION [COLUMNS] */
                self::insertSubsection($this->dbLink->lastInsertId(),$v->sub);  
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
                $this->Log->log(0,"ID DB SUBSECTION - ".$v->db);
                $this->dbLink->query2(
                    "INSERT INTO `SLO_PROJECT_STAGE_SUBSECTION` (`id_section`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                    ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
                );
                /* INSERT SUBSECTION [COLUMNS] */
                self::insertSubsectionRow($this->dbLink->lastInsertId(),$v->row);  
        }
    }
    private function insertSubsectionRow($id=0,$data=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION - ".$id);
        $parm[':id']=[$id,'INT'];
        $lastId=0;
        foreach($data as $k => $v){
                $this->Log->log(0,$k);
                $this->Log->log(0,"ID DB SUBSECTION ROW - ".$v->db);
                $parm[':new_line']=[$v->newline,'STR']; 
                $this->dbLink->query2(
                    "INSERT INTO `SLO_PROJECT_STAGE_SUBSECTION_ROW` (`id_subsection`,`new_line`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:id,:new_line,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
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

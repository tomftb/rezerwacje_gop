<?php
class ManageProjectReportDatabase{
    private $dbLink;
    protected $Utilities;
    private $Log;
    private $stageDbId=0;
    private $projectStage;
    private $projectStageDb=[];
    private $stageValueDbId=0;
    private $idProject=0;
    private $Report;
    protected $DatabaseUtilities;
    private $StageDatabase;
    
    protected function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Utilities=NEW Utilities();
        $this->DatabaseUtilities=new DatabaseUtilities();
        $this->StageDatabase = new ManageProjectStageDatabase();
    }
    protected function addReport($ProjectId=0,$ProjectData=[]){
        $this->Log->log(0,"[".__METHOD__."]"); 
        try{
            /* GET ALL STAGE VALUE */
            $this->Log->LogMulti(0,$ProjectId,'PROJECT ID');
            $sql[':idp']=[$ProjectId,'INT'];
            $this->idProject=$ProjectId;
            self::getProjectStage($sql);
            self::setAddOns($sql);
            /* LOOP EVERY PROJCT STAGE */
            array_walk($ProjectData,array($this,'manageStage'),$sql);
        }
	catch (PDOException $e){
            $this->dbLink->rollback(); 
            $this->Log->logMulti(0,$e->errorInfo);
            throw New Exception("DATABASE ERROR: ".$e->getMessage()."\nIN".$e->getTraceAsString(),1); 
	} 
    }
    /*
     * ADD SQL USER FIELDS
     */
    private function setAddOns(&$data){
        $this->Utilities->mergeArray($data,[
                ':userid'=>[$_SESSION["userid"],'INT'],
                ':userlogin'=>[$_SESSION["username"],'STR'],
                ':userfullname'=>[$_SESSION["nazwiskoImie"],'STR'],
                ':useremail'=>[$_SESSION["mail"],'STR'],
                ':date'=>[CDT,'STR'],
                ':host'=>[RA,'STR']
        ]);
    }
    /*
     * GET PROJECT ALL STAGE AND STAGE VALUE FROM DATABASE
     */
    public function updateReport($Report){
        $LastInserted='';
         try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            foreach($Report as $r){
                //$this->Log->log(0,$r->data);
                $this->Log->log(0,"[".__METHOD__."] ID Report:".$r->data->id);
                
                /* ADD CHANGE ONLY DEPARTMENT */
                
                /* ADD CHANGE ONLY VARIABLRE */
                         
                /* CHANGE ALL */
                if($r->data->change==='n'){
                    $this->Log->log(0,"[".__METHOD__."] NO CHANGE");
                    /* NO CHANGE -> EXIT */
                    $this->Log->log(0,"[".__METHOD__."] NO CHANGE -> EXIT");
                    $LastInserted=$r->data->id;
                    break;
                }
                /* SET OLD REPORT wsk_u = 1 */
                $this->dbLink->query("UPDATE `project_report` SET `wsk_u`='1',`delete_reason`='NEW VERSION',".$this->DatabaseUtilities->getAlterSql()." WHERE `id`=:id", 
                        array_merge(['id'=>[$r->data->id,'INT']],$this->DatabaseUtilities->getAlterParm()));
                /* INSERT NEW REPORT */
                $LastInserted=self::insertReport($r->data);
                self::insertReportStage($r->stage,$LastInserted);
            }
            $this->dbLink->commit();  //PHP 5 and new
        }
        catch (PDOException $e){
            $this->dbLink->rollback(); 
            //die();
            Throw New Exception("[".__METHOD__."] DATABASE ERROR: ".$e->getMessage(),1);
        }
        finally{
            
        }
        return $LastInserted;
    }
    private function insertReport($ReportData){
        $this->Log->log(0,"[".__METHOD__."]");
        $parm=[
            ':id_project'=>[$ReportData->id_project,'INT'],
            ':departmentId'=>[$ReportData->departmentId,'INT'],
            ':departmentName'=>[$ReportData->departmentName,'STR']
        ];
        $this->dbLink->query2(
                "INSERT INTO `project_report` (`id_project`,`departmentId`,`departmentName`,".$this->DatabaseUtilities->getCreateSql()[0].",".$this->DatabaseUtilities->getCreateAlterSql()[0].") VALUES (:id_project,:departmentId,:departmentName,".$this->DatabaseUtilities->getCreateSql()[1].",".$this->DatabaseUtilities->getCreateAlterSql()[1].");"
                ,array_merge($parm, $this->DatabaseUtilities->getCreateParm(),$this->DatabaseUtilities->getAlterParm()));
        return $this->dbLink->lastInsertId();
    }
    private function insertReportStage($ReportStage,$ReportId){
        $this->Log->log(0,"[".__METHOD__."]");
        foreach($ReportStage as $s){
             $this->Log->log(0,'Report stage:');
             //$this->Log->log(0,$s); 
            /* INSERT DATA */
            $LastInserted=self::insertReportStageData($s->data,$ReportId);
            $this->StageDatabase->insertSimpleAttributes($LastInserted,$s,$table='project_report_stage');
            /* INSERT SECTION */
            self::insertReportSection($s->section,$LastInserted);
        }
    }
    private function insertReportStageData($ReportStageData,$ReportId){
         $parm=[
            ':id_parent'=>[$ReportId,'INT'],
            ':ordinal_number'=>[$ReportStageData->ordinal_number,'INT'],
            ':title'=>[$ReportStageData->title,'STR'],
            ':new_page'=>[$ReportStageData->valuenewline,'STR']
        ];
        $this->dbLink->query2(
                "INSERT INTO `project_report_stage` (`id_parent`,`ordinal_number`,`title`,`new_page`,".$this->DatabaseUtilities->getCreateSql()[0].",".$this->DatabaseUtilities->getCreateAlterSql()[0].") VALUES (:id_parent,:ordinal_number,:title,:new_page,".$this->DatabaseUtilities->getCreateSql()[1].",".$this->DatabaseUtilities->getCreateAlterSql()[1].");"
                ,array_merge($parm, $this->DatabaseUtilities->getCreateParm(),$this->DatabaseUtilities->getAlterParm()));
        return $this->dbLink->lastInsertId();
    }
    private function insertReportSection($ReportStageSection,$StageId){
        foreach($ReportStageSection as $s){
             $this->Log->log(0,'Report stage section :');
             //$this->Log->log(0,$s); 
             /* INSERT DATA */
            $LastInserted=self::insertReportStageSectionData($StageId);
            $this->StageDatabase->insertSimpleAttributes($LastInserted,$s,$table='project_report_stage_section');
            /* INSERT SUBSECTION */
            self::insertReportSubsection($s->subsection,$LastInserted);
        }
    }
    private function insertReportStageSectionData($StageId){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->dbLink->query2("INSERT INTO `project_report_stage_section` (`id_parent`) VALUES (:id_parent);"
                ,[':id_parent'=>[$StageId,'INT']]);
            return $this->dbLink->lastInsertId();
    }
    private function insertReportSubsection($ReportStageSubsection,$SectionId){
        foreach($ReportStageSubsection as $s){
            $this->Log->log(0,'Report stage section :');
            //$this->Log->log(0,$s); 
             /* INSERT DATA */
            $LastInserted=self::insertReportStageSubsectionData($SectionId);
            $this->StageDatabase->insertSimpleAttributes($LastInserted,$s,$table='project_report_stage_subsection');
            /* INSERT SUBSECTION */
            foreach($s->subsectionrow as $r){
                self::insertSubsectionRow($LastInserted,$r); 
            }
        }
    }
    private function insertReportStageSubsectionData($SectionId){
        $this->dbLink->query2("INSERT INTO `project_report_stage_subsection` (`id_parent`) VALUES (:id_parent);"
                ,[':id_parent'=>[$SectionId,'INT']]);
            return $this->dbLink->lastInsertId();
    }
    private function insertSubsectionRow($idSubsection=0,$data=[]){
        $this->Log->log(0,"[".__METHOD__."]\r\n ID DB SUBSECTION - ".$idSubsection);
        /* INSERT SUBSECTION ROWA DATA */
        $this->dbLink->query2(
            "INSERT INTO `project_report_stage_subsection_row` (`id_parent`) VALUES (:id);"
            ,[':id'=>[$idSubsection,'INT']]);
        $IdRow=$this->dbLink->lastInsertId();
        /*
         * INSERT paragraph
         */
        $this->Log->log(0,"paragraph");
        $this->StageDatabase->insertSimpleAttributes($IdRow,$data->paragraph,'project_report_stage_subsection_row_p');
        /* INSERT SUBSECTION ROW TABSTOP */
        $this->StageDatabase->insertSimpleTabStop($IdRow,$data->paragraph->tabstop,'project_report_stage_subsection_row_p_tabstop');
        /* INSERT SUBSECTION ROW VARIABLE */
        $this->StageDatabase->insertSimpleVariable($IdRow,$data->paragraph->variable,'project_report_stage_subsection_row_p_variable');
        /*
         * INSERT list
         */
        $this->Log->log(0,"list");
        $this->StageDatabase->insertSimpleAttributes($IdRow,$data->list,'project_report_stage_subsection_row_l');
        /*
         * INSERT table
         */
        $this->Log->log(0,"table");
        $this->StageDatabase->insertSimpleAttributes($IdRow,$data->table,'project_report_stage_subsection_row_t');
        /*
         * INSERT image
         */
        $this->Log->log(0,"image");
        /* REMOVE OLD */
         ////$parm[':id']=[$id,'INT'];
        //$this->dbLink->query2("DELETE FROM `".$table."_style` WHERE `id_parent`=:id;",$parm);
        /* ADD NEW */
        foreach($data->image as $v){
             $this->StageDatabase->insertSimpleSubsectionRowImage($IdRow,$v,'project_report_stage_subsection_row_i');
        }
    }
    public function getReport($parm=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Report=new stdClass();
        /* LIMIT 0,1 */
        foreach($this->dbLink->squery("SELECT `id`,`id_project`,`departmentId`,`departmentName`,`buffer_user_id`,'n' as 'change' FROM `project_report` WHERE `id_project`=:id_project AND wsk_u='0' ORDER BY `id` ASC Limit 0,1",$parm,'FETCH_OBJ','fetchAll') as $k => $v){
            $this->Report->{$k}=new stdClass();
            $this->Report->{$k}->data=$v;
            self::getReportStage($this->Report->{$k});          
        }
        return $this->Report;
    }
    private function getReportStage(&$Report){
        $this->Log->log(0,"[".__METHOD__."]");
        $Report->stage=new stdClass();
        foreach($this->dbLink->squery("SELECT `id`,`id_parent`,`ordinal_number`,`title`,`new_page` as 'valuenewline' FROM `project_report_stage` WHERE `id_parent`=:id_parent AND wsk_u='0' ORDER BY `ordinal_number` ASC",['id_parent'=>[$Report->data->id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
            //$Report->stage->data=new stdClass();
            $Report->stage->{$k}=new stdClass();
            $Report->stage->{$k}->data=$v;
            $this->StageDatabase->assignAllProperty($Report->stage->{$k},'project_report_stage',$v->id);
            self::getReportSection($Report->stage->{$k});
        }
    }
        /*
     * GET REPORT PROJECT STAGE SECTION DATA
     */
    private function getReportSection(&$ReportStage){
        $this->Log->log(0,"[".__METHOD__."]");
        $ReportStage->section=new stdClass();
        foreach($this->dbLink->squery("SELECT `id` FROM `project_report_stage_section` WHERE `id_parent`=:id_parent",['id_parent'=>[$ReportStage->data->id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
            $ReportStage->section->{$k}=new stdClass();
            $ReportStage->section->{$k}->data=$v;
            $this->StageDatabase->assignAllProperty($ReportStage->section->{$k},'project_report_stage_section',$v->id);
             /* ASSIGN STAGE SECTION */
            self::getReportSubsection($ReportStage->section->{$k});
        }
    }
    /*
     * GET REPORT PROJECT STAGE SECTION SUBSECTIONS DATA
     */
    private function getReportSubsection(&$ReportSection){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $ReportSection->subsection=new stdClass();
        foreach($this->dbLink->squery("SELECT `id` FROM `project_report_stage_subsection` WHERE `id_parent`=:id_parent",['id_parent'=>[$ReportSection->data->id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
            $ReportSection->subsection->{$k}=new stdClass();
            $ReportSection->subsection->{$k}->data=$v;
            $this->StageDatabase->assignAllProperty($ReportSection->subsection->{$k},'project_report_stage_subsection',$v->id);
            /* ASSIGN SUBSECTION ROW */
            self::getReportRow($ReportSection->subsection->{$k});
        }
    }
     /*
     * GET REPORT PROJECT STAGE SECTION SUBSECTION ROWS DATA
     */
    private function getReportRow(&$ReportSubsection){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $ReportSubsection->subsectionrow=new stdClass();
        foreach($this->dbLink->squery("SELECT `id`,`type` FROM `project_report_stage_subsection_row` WHERE `id_parent`=:id_parent",['id_parent'=>[$ReportSubsection->data->id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
            $ReportSubsection->subsectionrow->{$k}=new stdClass();
            /* PARAGRAPH */
            $ReportSubsection->subsectionrow->{$k}->paragraph=new stdClass();
            $ReportSubsection->subsectionrow->{$k}->data=$v;
            $ReportSubsection->subsectionrow->{$k}->data->id=intval($v->id,10);
            $this->StageDatabase->assignAllProperty($ReportSubsection->subsectionrow->{$k}->paragraph,'project_report_stage_subsection_row_p',$ReportSubsection->subsectionrow->{$k}->data->id);
             /* SET TAB STOP */
            $this->StageDatabase->assignTabStopProperty($ReportSubsection->subsectionrow->{$k}->paragraph,$ReportSubsection->subsectionrow->{$k}->data->id,'project_report_stage_subsection_row_p_tabstop');
            /* SET VARIABLE */
            $this->StageDatabase->assignVariableProperty($ReportSubsection->subsectionrow->{$k}->paragraph,$ReportSubsection->subsectionrow->{$k}->data->id,'project_report_stage_subsection_row_p_variable');   
            /* LIST */
            $ReportSubsection->subsectionrow->{$k}->list=new stdClass();
            $this->StageDatabase->assignAllProperty($ReportSubsection->subsectionrow->{$k}->list,'project_report_stage_subsection_row_l',$ReportSubsection->subsectionrow->{$k}->data->id);
            /* TABLE */
            $ReportSubsection->subsectionrow->{$k}->table=new stdClass();
            $this->StageDatabase->assignAllProperty($ReportSubsection->subsectionrow->{$k}->table,'project_report_stage_subsection_row_t',$ReportSubsection->subsectionrow->{$k}->data->id);
            /* IMAGE */
            $ReportSubsection->subsectionrow->{$k}->image=new stdClass();
            //self::getReportRowImage($ReportSubsection->subsectionrow->{$k});
            $this->StageDatabase->getStageImageProperty($ReportSubsection->subsectionrow->{$k}->image,'project_report_stage_subsection_row_i',$ReportSubsection->subsectionrow->{$k}->data->id);
        }
    }
    private function getReportRowImage(&$ReportRow){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $ReportRow->image=new stdClass();
        foreach($this->dbLink->squery("SELECT `id` FROM `project_report_stage_subsection_row_i` WHERE `id_parent`=:id_parent",['id_parent'=>[$ReportRow->data->id,'INT']],'FETCH_OBJ','fetchAll') as $k => $v){
            $ReportRow->image->{$k}=new stdClass();
            $ReportRow->image->{$k}->data=$v;
            self::assignAllProperty($ReportRow->image->{$k},'project_report_stage_subsection_row_i',$v->id);
        }
    }
     /*
     * CHECK AND UPDATE OR INSERT STAGE TO PROJECT
     */
    private function manageStage($ProjectDataValue,$ProjectDataId,$sql){
        $this->Log->log(0,"[".__METHOD__."][POST] PROJECT STAGE ID ${ProjectDataId}"); 
        $sql[':i']=[$ProjectDataId,'INT'];
        $sql[':n']=[$ProjectDataValue['n'],'INT'];
        $sql[':t']=[$ProjectDataValue['t'],'STR'];
        /* CHECK PROJECT REPORT STAGE EXIST IN DATABASE => IF EXIST => UPDATE OTHERWISE => INSERT*/
        /* SET DEFUALT Stage Db id */
        $this->stageDbId=0;
        self::checkStageExist($ProjectDataId,$ProjectDataValue);
        if($this->stageDbId){
            self::updateStage($ProjectDataValue,$ProjectDataId,$sql);
        }
        else{
            self::insertStage($ProjectDataValue,$ProjectDataId,$sql);
        }
        $this->Log->logMulti(0,$this->projectStageDb,__METHOD__); 
        //Throw new ErrorException('test stop',0);
    }
    private function checkStageExist($PostStageId,$PostStageData){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $this->Log->logMulti(0,$PostStageData['d'],"POST PROJECT STAGE DATA"); 
        $iStage=0;

        $idStageValue=0;
        /* LOOP OVER DATABASE PROJECT STAGE DATA */ 
        foreach($this->projectStageDb as $k => $v){
            if(intval($PostStageId,10)===intval($v['i'],10)){
                $this->Log->log(0,"PROJECT DB FOUND POST STAGE ID => ".$PostStageId." (UPDATE)");
                $this->Log->log(0,"DB ID => ".$v['id']);
                $iStage++;
                /* FOUND AND SETUP */
                $this->stageDbId=$v['id'];
                /* CHECK STAGE VALUE */
                self::checkStageValueExist($v,$PostStageData['d']);
            }
        }
 
        //Throw new ErrorException('test stop',0);
        $this->Log->log(0,"[".__METHOD__."] iStage => ".$iStage); 
        self::checkFound($iStage,"THERE IS MORE THAT ONE STAGE IN PROJECT => ".$this->idProject." WITH STAGE ID ".$PostStageId);
    }
    private function checkStageValueExist($v,$PostStageData){
        $this->Log->log(0,"[".__METHOD__."]LOOP OVER STAGE DATA VALUE");
        $TestStageValue=[];
        foreach($v['data'] as $vData){
            //$this->Log->logMulti(0,$vData,"[".__METHOD__."]"); 
            $this->Log->log(0,"STAGE VALUE ID => ".$vData['valueId']);
            self::updateCheckStageValueArray($TestStageValue,$vData['valueId'],$PostStageData);
            
        }
    }
    private function updateCheckStageValueArray(&$TestStageValue,$valueId,$PostStageData){
        if(!array_key_exists($valueId,$PostStageData)){
            return false;
        }
        $this->Log->log(0,"FOUND VALUE FOR PROJECT STAGE ID => ".$valueId);
        if(in_array($valueId,$TestStageValue)){
            Throw New Exception ("THERE IS MORE THAT ONE STAGE VALUE ID => ".$valueId." IN PROJECT STAGE => ".$this->idProject,1);
        }
        /* FILL TEST ARRAY */
        array_push($TestStageValue,$valueId);
    }
    private function checkFound($iFound,$info=''){
        if($iFound>1){
            throw New Exception("RESULT COUNT = ".$iFound.". ${info} AND WSK U = 0",1);  
        }
    }
    private function setUpStageId($sql,$projectId,$stageId,&$idDb){
        $this->Log->log(0,"[".__METHOD__."]"); 
        //$projectId=[11111,'INT'];
        $result=$this->dbLink->squery($sql,[':id1'=>$projectId,":id2"=>$stageId]);
        $resultCount=count($result);

        //$this->Log->logMulti(0,$result[0]['id']);
        if($resultCount>1){
            throw New Exception('RESULT COUNT = '.$resultCount.'. THERE IS MORE THAT ONE STAGE WITH PROJECT ID => '.$projectId[0]." AND STAGE ID => ".$stageId[0]." AND WSK U = 0",1);  
        }
        else if($resultCount===1){
            $this->Log->log(2,"[".__METHOD__."] RESULT COUNT === 1 => UPDATE => ".$result[0]['id']);
            $idDb=$result[0]['id'];
            return true;
        }
        else{
            $this->Log->log(2,"[".__METHOD__."] RESULT COUNT === 0 => INSERT"); 
            return false;
        } 
    }
    private function insertStage($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]KEY => ${key}");
        $this->Log->logMulti(0,$sql);
        $this->dbLink->beginTransaction(); //PHP 5.1 and new
        $this->dbLink->query("INSERT INTO `projekt_etap` ("
                . "`idProject`,"
                . "`stageId`,"
                . "`number`,"
                . "`title`,"
                . "`create_user_id`,"
                . "`create_user_login`,"
                . "`create_user_full_name`,"
                . "`create_user_email`,"
                . "`create_date`,"
                . "`create_host`"
                . ") VALUES ("
                . ":idp,"
                . ":i,"
                . ":n,"
                . ":t,"
                . ":userid,"
                . ":userlogin,"
                . ":userfullname,"
                . ":useremail,"
                . ":date,"
                . ":host)"
                ,$sql);
        self::addReportStageValue($value['d'],$this->dbLink->lastInsertId());
        $this->dbLink->commit();  //PHP 5 and new
    }
    private function updateStage($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]KEY => ${key}");
        $this->dbLink->beginTransaction(); //PHP 5.1 and new //(`idProject`,`stageId`,
        $this->dbLink->query("UPDATE `projekt_etap` SET "
                . "`number`=:n,"
                . "`title`=:t,"
                . "`mod_user_id`=:userid,"
                . "`mod_user_login`=:userlogin,"
                . "`mod_user_full_name`=:userfullname,"
                . "`mod_user_email`=:useremail,"
                . "`mod_date`=:date,"
                . "`mod_host`=:host "
                . "WHERE "
                . "`idProject`=:idp "
                . "AND `stageId`=:i"
                ,$sql);
        self::manageStageValue($value['d'],$this->stageDbId);
        $this->dbLink->commit();  //PHP 5 and new
    }
    private function addReportStageValue($value,$stageId){
        $this->Log->log(0,"[".__METHOD__."]");
        $sql[':idProjectStage']=[$stageId,'INT'];/* public PDO::lastInsertId ( string $name = null ) : string */
        self::setAddOns($sql);
        array_walk($value,array($this,'insertStageValue'),$sql);      
    }
    private function manageStageValue($value,$stageId){
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->Log->LogMulti(0,$value);
        $sql[':idProjectStage']=[$stageId,'INT'];/* public PDO::lastInsertId ( string $name = null ) : string */
        self::setAddOns($sql);
        foreach($value as $k => $v){
            if(self::setUpStageId("SELECT `id` FROM `projekt_etap_wartosc` WHERE "
                    . "`idProjectStage`=:id1 "
                    . "AND valueId=:id2 "
                    . "AND wsk_u='0'"
                    ,$sql[':idProjectStage'],[$k,'INT'],$this->stageValueDbId)){
                self::updateStageValue($v,$k,$sql);
            }
            else{
                /* FEATURE => FOR NEW STAGE VALUE */
                $this->Log->log(0,"[".__METHOD__."] INSERT STAGE VALUE");
                self::insertStageValue($v,$k,$sql);
            }
        }
    }
    private function insertStageValue($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]KEY => ${key}");
        $this->Log->LogMulti(0,$value,'VALUE');
        self::addValueAddOns($value,$key,$sql);
        $this->Log->LogMulti(0,$sql,"SQL");
        $this->dbLink->query("INSERT INTO `projekt_etap_wartosc` ("
                . "`idProjectStage`,"
                . "`valueId`,"
                . "`value`,"
                . "`create_user_id`,"
                . "`create_user_login`,"
                . "`create_user_full_name`,"
                . "`create_user_email`,"
                . "`create_date`,"
                . "`create_host`"
                . ") VALUES ("
                . ":idProjectStage,"
                . ":valueId,"
                . ":v,"
                . ":userid,"
                . ":userlogin,"
                . ":userfullname,"
                . ":useremail,"
                . ":date,"
                . ":host)"
                ,$sql);
        /*
         *  . "`fileposition`,"
            . "`file`,"
         * . ":fp,"
                . ":f,"
         */
        $this->stageValueDbId=$this->dbLink->lastInsertId();
        $this->Log->log(0,"[".__METHOD__."]INSERTED STAGE VALUE DB ID => ".$this->stageValueDbId);
        
        self::insertStageValueFile($this->stageValueDbId,$value,$sql);
    }
    private function insertStageValueFile($id=0,$value,$sql){
        $this->Log->log(0,"[".__METHOD__."]");
        if(!is_array($value['fileData'])){
            $this->Log->log(0,"[".__METHOD__."] FILE NOT PRESENT FOR STAGE DB ID => ".$id);
            return '';
        }
        UNSET($sql[':idProjectStage']);
        UNSET($sql[':valueId']);
        UNSET($sql[':v']);
        self::addValueFileAddOns($value,$id,$sql);
        $this->Log->logMulti(0,$sql,__METHOD__);
        $this->dbLink->query("INSERT INTO `projekt_etap_wartosc_plik` ("
                . "`idProjectStageValue`,"
                . "`fileId`,"
                . "`filename`,"
                . "`fileposition`,"
                . "`originalname`,"
                . "`size`,"
                . "`type`,"
                . "`create_user_id`,"
                . "`create_user_login`,"
                . "`create_user_full_name`,"
                . "`create_user_email`,"
                . "`create_date`,"
                . "`create_host`"
                . ") VALUES ("
                . ":idProjectStageValue,"
                . ":fid,"
                . ":f,"
                . ":fp,"
                . ":o,"
                . ":s,"
                . ":t,"
                . ":userid,"
                . ":userlogin,"
                . ":userfullname,"
                . ":useremail,"
                . ":date,"
                . ":host)"
                ,$sql);
    }
    private function updateStageValue($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]STAGE VALUE ID => ".$this->stageValueDbId." KEY => ${key}");
        $this->Log->logMulti(2,$sql);
        $this->Log->logMulti(2,$value);
        self::addValueAddOns($value,$key,$sql);
        $this->dbLink->query("UPDATE `projekt_etap_wartosc` SET "
                . "`value`=:v,"
                . "`mod_user_id`=:userid,"
                . "`mod_user_login`=:userlogin,"
                . "`mod_user_full_name`=:userfullname,"
                . "`mod_user_email`=:useremail,"
                . "`mod_date`=:date,"
                . "`mod_host`=:host "
                . "WHERE `"
                . "idProjectStage`=:idProjectStage "
                . "AND `valueId`=:valueId"
                ,$sql);   
        
        /* ADD CHECK KEY actFile exists */
        self::updateWskStageValueFile($key,$value,$sql);
        /* $this->stageValueDbId=$this->dbLink->lastInsertId(); */
        $this->Log->log(0,"[".__METHOD__."]UPDATED STAGE VALUE DB ID => ".$this->stageValueDbId);
        /* IN FUTERE DO UPDATE NOW INSERT, DB RETURN LAST */
       
        
        self::insertStageValueFile($this->stageValueDbId,$value,$sql);
    }
    private function updateWskStageValueFile($key,$value,$sql){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$value,"VALUE");
        UNSET($sql[':idProjectStage']);
        UNSET($sql[':valueId']);
        UNSET($sql[':v']);
        $sql[':idProjectStageValue']=[$this->stageValueDbId,'INT'];
        $this->Log->logMulti(0,$sql,"SQL");
        
        /* IN FUTURE CHECK id projekt_etap_wartosc_plik, NOW SET WSK_U ON ALL STAgE VALUE */
        
        if(array_key_exists('actFileRemove', $value)){
            $this->Log->log(0,"KEY actFileRemove exist => SET WSK_U = 1");
            $this->dbLink->query("UPDATE `projekt_etap_wartosc_plik` SET "
                . "`wsk_u`='1',"
                . "`mod_user_id`=:userid,"
                . "`mod_user_login`=:userlogin,"
                . "`mod_user_full_name`=:userfullname,"
                . "`mod_user_email`=:useremail,"
                . "`mod_date`=:date,"
                . "`mod_host`=:host "
                . "WHERE `"
                . "idProjectStageValue`=:idProjectStageValue"
                ,$sql);    
        }
    }
    private function addValueAddOns($v,$k,&$sql){
        $sql[':valueId']=[$k,'INT'];
        $sql[':v']=[$v['value'],'STR'];
    }
    private function addValueFileAddOns($v,$id,&$sql){
        $this->Log->logMulti(0,$v,'FILE');
        $sql[':idProjectStageValue']=[$id,'INT'];
        $sql[':fid']=[$v['fileId'],'STR']; 
        $sql[':fp']=[$v['fileposition'],'STR'];
        $sql[':f']=[$v['fileName'],'STR']; 
        $sql[':o']=[$v['fileData']['name'],'STR'];
        $sql[':s']=[$v['fileData']['size'],'INT']; 
        $sql[':t']=[$v['fileData']['type'],'STR']; 
    }
}
<?php
class DatabaseProjectReport{
    private $dbLink;
    private $utilities;
    private $Log;
    private $stageDbId=0;
    private $projectStageDb=[];
    private $stageValueDbId=0;
    private $idProject=0;
    
    protected function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->utilities=NEW Utilities();
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
        $this->utilities->mergeArray($data,[
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
    public function getProjectStage($sql){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $this->projectStageDb=$this->dbLink->squery("SELECT `id`,`stageId` as 'i',`number` as 'n',`title` as 't' FROM `projekt_etap` WHERE idProject=:idp AND wsk_u='0'",$sql);
        array_walk($this->projectStageDb,[$this,'getProjectStageValue']);
        $this->Log->logMulti(2,$this->projectStageDb,__METHOD__); 
        return $this->projectStageDb;
    }
    /*
     * GET PROJECT ALL STAGE VALUE FROM DATABASE
     */
    private function getProjectStageValue(&$stage){
        /* GET VALUE AND LAST IMAGE */
        $this->Log->log(2,"[".__METHOD__."]"); 
        $sql[':id']=[$stage['id'],'INT'];
        $stage['data']=$this->dbLink->squery("SELECT 
                `w`.`id`,
		`w`.`idProjectStage`,
                `w`.`valueId`,
                `w`.`value` as v,
                `pl`.`fileposition` as fp,
                `pl`.`filename` as f,
                `pl`.`originalname` as fo
                 FROM 
                `projekt_etap_wartosc` as w left outer join (
                                                            SELECT 
                    						`idProjectStageValue`,
                    						max(`id`) as max_id
                                                            FROM 
								`projekt_etap_wartosc_plik` 
                                                            WHERE `wsk_u`='0'
                                                            GROUP by `idProjectStageValue`
				) as p ON `w`.`id`=`p`.`idProjectStageValue`
				LEFT outer JOIN `projekt_etap_wartosc_plik`  as pl
				ON pl.`idProjectStageValue`=p.`idProjectStageValue`
				AND p.`max_id`=pl.`id`
                WHERE
                `w`.`idProjectStage`=:id
                AND `w`.`wsk_u`='0'"
                ,$sql);
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
        
        if(array_key_exists('actFile', $value)){
            $this->Log->log(0,"KEY actFile exist => SET WSK_U = 1");
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
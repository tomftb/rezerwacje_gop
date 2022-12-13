<?php

class ManageProjectItems{
    private $Log;
    private $dbLink;
    private $Utilities;
    public function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Utilities=NEW Utilities();
    }
    public function __destruct(){}
    public function setGetWsk($wsk='u',$input=''){
        $input=filter_input(INPUT_GET,$wsk,FILTER_VALIDATE_INT);
       
        if($input===null || $input===false){
            $this->Log->log(0,"[".__METHOD__."] INPUT => `".$wsk."` NOT EXIST, OR WRONG TYPE => SET DEFAULT 0");
            return '0';
        }
        return $input;
    }
    public function unsetBlock($idRecord='0',$table='',$column='',$userId=0){
        $this->Log->log(0,"[".__METHOD__."] UNSET RECORD BLOCK ID => ".$idRecord);
        $this->Log->log(0,"[".__METHOD__."] UNSET TABLE NAME => ".$table);
        $this->Log->log(0,"[".__METHOD__."] UNSET TABLE COLUMN => ".$column);
        $this->Log->log(0,"[".__METHOD__."] USER ID (SESSION) => ".$userId);
        if($idRecord==='0'){
            $this->Log->log(0,"[".__METHOD__."] UNSET BLOCK ID not defined, nothing to do");
            return false;
        }
        /* check */
        $userId=intval($userId,10);
        $wskb=self::getBufferUserId($idRecord,$table,$column);
        $this->Log->logMulti(0,$wskb);
        if(intval($wskb['bu'],10)===$userId){
            /* SET USER ID TO 0 FOR UNSET BLOCKED ROW */
            self::setBlock($idRecord,$table,$column,0);
            
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] blocked by different user ".$wskb['bl']." (".$wskb['bu'].")");
        }
        return $wskb;
    }
    public function getBufferUserId($id=0,$table='',$column=''){
        /*
         * ID
         */
        $this->Log->log(0,"[".__METHOD__."]");
        $wskb=$this->dbLink->squery("select b.`login` as 'bl',`".$column."` as bu FROM `".$table."` as s LEFT JOIN `uzytkownik` as b ON s.`".$column."`=b.`id` WHERE s.`id`=:id",[':id'=>[$id,'INT']]);
        
        if(count($wskb)>0){
            return $wskb[0];  
        }
        return [
            'bl'=>'',
            'bu'=>0
        ];
    }
    public function setBlock($idRecord='0',$table='',$column='',$userId=0){
        /* USERID  = 0 => IT WILL BY NOTIFING AS UNBLOCK */
        $this->Log->log(0,"[".__METHOD__."] SET/UNSET BUFFER USER ID => ".$userId);
        //$this->Log->log(0,$idRecord);
        //$this->Log->log(0,$table);
        //$this->Log->log(0,$column);
        $this->dbLink->setQuery("UPDATE `".$table."` SET `".$column."`=:buffer_user_id WHERE `id`=:id",
                [
                    ':id'=>[$idRecord,'INT'],
                    ':buffer_user_id'=>[intval($userId,10),'INT'],
                ]);
        $this->dbLink->runTransaction();
    }
    public function checkBlock($bufferUserId=0,$bufferLogin='',$loggedUserId=0){
        $this->Log->log(0,"[".__METHOD__."]\r\nBUFFER USER ID => ".$bufferUserId."\r\nLOGGED USER ID =>".$loggedUserId);
        $bufferUserId=intval($bufferUserId,10);
        if($bufferUserId>0 && $bufferUserId!==intval($loggedUserId,10)){
            Throw New Exception("[ERROR] Rekord aktaulnie jest aktualizowany przez - ${bufferLogin}.",0);
        }
        /* $_SESSION['id']*/
    }
    public function getSlo($slo='psDelete'){
        return $this->dbLink->squery("SELECT s.`id` as ID,s.`nazwa` AS Nazwa FROM `slo` s,`app_task` a WHERE s.`id_app_task`=a.`id` AND s.id>0 AND s.wsk_u='0' AND a.`name`=:n ORDER BY s.`id` ASC",[':n'=>[$slo,'STR']]);  
    }
    public function setPostId(){
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->Log->logMulti(0,$_POST);
        $POST = filter_input_array(INPUT_POST);
        $this->Utilities->validateKey($POST,'id',true,1);
        return ($POST);
    }
    public function setReason(&$post){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$post);
        $reason=explode('|',$post['reason']);
        $extra=$post['extra'];
        UNSET($post['extra']);
        if(count($reason)!==2){
            Throw New Exception("[".__METHOD__."] WRONG ARRAY MEMBERS, SHOULD BE 2",1);
        }
        if(0===intval($reason[0],10)){
            return $extra;
        }
        return $reason[1];
    }
}

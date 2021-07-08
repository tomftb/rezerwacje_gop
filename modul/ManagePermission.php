<?php
class ManagePermission
{
    private $inpArray=array();
    private $idPerm=0;
    private $Log;
    private $dbLink;
    function __construct()
    {
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities=NEW Utilities();
    }
    public function uPermUsers()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->Log->logMulti(0,$this->inpArray);
        
        $this->utilities->keyExist($this->inpArray,'ID');
        $this->utilities->isEmptyKeyValue($this->inpArray,'ID',true,1);
        $this->idPerm=$this->inpArray['ID'];
        UNSET($this->inpArray['ID']);
        /* check perrmission exist */
        self::checkPermissionExist();
        /* REMOVE NOT SENDED USERS */
        try{
            $this->dbLink->beginTransaction();
            $this->dbLink->query('SELECT uu.`id_uzytkownik` as `idu` FROM `uzyt_i_upr` uu, `uzytkownik` u WHERE uu.`id_uzytkownik`=u.`id` AND u.`wsk_u`="0" AND `id_uprawnienie`=:i',[':i'=>[$this->idPerm,'INT']]);       
            //$perm=;
            //var_dump($perm);
            array_map(array($this, 'deleteUserFromPerm'),$this->dbLink->sth->fetchAll(PDO::FETCH_ASSOC));
            /* ADD SENDED USERS */
            self::addUserToPerm(); 
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
        }
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');    
    }
    private function deleteUserFromPerm($v)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$v);
        $found=false;
        foreach($this->inpArray as $id => $user)
        {
            if(intval($v['idu'],10) === intval($user,10))
            {
                $this->Log->log(0,"[".__METHOD__."] FOUND USER (".$v['idu']."), UNSET FROM INPUT ARRAY");
                /* UNSET */
                UNSET($this->inpArray[$id]);
                $found=true;
                break;
            }   
        }
        self::delete($found,$v['idu']);
    }
    private function delete($found,$idu){
        if(!$found)
        {
            $this->Log->log(0,"[".__METHOD__."] USER (".$idu.") NOT FOUND IN INPUT ARRAY => DELETE");
            $sql=[
                ':ip'=>[$this->idPerm,'INT'],
                ':iu'=>[$idu,'INT']
            ];
            $this->dbLink->query('DELETE FROM `uzyt_i_upr` WHERE `id_uzytkownik`=:iu AND id_uprawnienie=:ip',$sql);   
        }
    }
    private function addUserToPerm()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        foreach($this->inpArray as $id => $user)
        {
            if(!self::addPerm($id,$user)){
                break;
            }
        }
    }
    private function checkUserExist($idUser=0)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->dbLink->query('SELECT `id`,`wsk_u` FROM `uzytkownik` WHERE `id`=:i',[':i'=>[$idUser,'INT']]);
        $userData=$this->dbLink->sth->fetch(PDO::FETCH_ASSOC);
        if(!is_array($userData)){
            return false;
        }
        $wsku=intval($userData['wsk_u'],10);
        $this->Log->log(0,"INTVAL WSK_U => ".$wsku);
        if($wsku!==0){
            return false;
        }
        return true;
    }
    private function checkPermissionExist()
    {
        $this->Log->log(0,"[".__METHOD__."] ID PERM => ".$this->idPerm);
        if(count($this->dbLink->squery('SELECT `id` FROM `uprawnienia` WHERE `id`=:i',[':i'=>[$this->idPerm,'INT']]))!==1){
            Throw New Exception("PERMISSION (ID:".$this->idPerm.") DATABASE ERROR",1);
        }
    }
    private function addPerm($id,$user)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        if(preg_match('/^user_(\d)+$/i', $id) && (intval($user,10)>0 ) && self::checkUserExist($user))
        {
            $this->Log->log(0,"INSERT => ".$user);
            $sql=[
                ':iu'=>[$user,'INT'],
                ':ip'=>[$this->idPerm,'INT']
            ];
            $this->dbLink->query('INSERT INTO `uzyt_i_upr` (`id_uzytkownik`,`id_uprawnienie`) VALUES (:iu,:ip)',$sql);    
        }
        else
        {
            Throw New Exception("WRONG INPUT KEY (".$id."), OR WRONG ID USER (".$user.") OR USER WITH ID => ".$user." NOT EXIST OR USER IS DELETED",1); 
        } 
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getAllPerm()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $this->responseType='GET';
        $this->Log->log(0,"[".__METHOD__."] filter => ".$f);
        $sql=[':f'=>[$f,'STR']];
        $result=$this->dbLink->squery('SELECT `ID` as \'i\',`SKROT` as \'s\',`NAZWA` as \'n\',`OPIS` as \'o\' FROM `uprawnienia` WHERE ID LIKE (:f) OR NAZWA LIKE (:f) OR SKROT LIKE (:f) OR OPIS LIKE (:f) ORDER BY ID asc'
                ,$sql);
        // $this->dbLink->sth->fetch(PDO::FETCH_ASSOC)
       $this->utilities->jsonResponse(__METHOD__,$result,'showAll','GET');
    }
    public function getUsersWithPerm()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $id=$this->utilities->getNumber(filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT));
        $this->Log->log(0,"[".__METHOD__."] ID => ".$id);
        // ID PERM
        $v['i']=$id;
        // GET USERS WITH PERM
        $v['u']=$this->dbLink->squery('SELECT id, ImieNazwisko FROM `v_upr_i_uzyt_v3` WHERE idUprawnienie=:i',[':i'=>[$id,'INT']]);
        // GET ALL USERS
        $v['a']=$this->dbLink->squery('SELECT ID as "id",CONCAT(Imie," ",Nazwisko) AS "ImieNazwisko" FROM `v_all_user` WHERE wskU=\'0\' ORDER BY ID asc');
        $this->utilities->jsonResponse(__METHOD__, $v,'uPermOff','POST');   
    }
    function __destruct(){}
}
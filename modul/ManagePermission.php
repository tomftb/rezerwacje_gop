<?php
class ManagePermission
{
    private $inpArray=array();
    private $idPerm=0;
    protected $responseType='POST';
    private $Log;
    private $dbLink;
    function __construct()
    {
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities=NEW Utilities();
        $this->response=NEW Response('Permission');
    }
    public function uPermUsers()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->Log->logMulti(0,$this->inpArray);
        if(!array_key_exists('ID', $this->inpArray))
        {
            $this->response->setError(1,'KEY ID NOT FOUND');
        }
        $this->idPerm=$this->inpArray['ID'];
        UNSET($this->inpArray['ID']);
        /* check perrmission exist */
        self::checkPermissionExist();
        /* REMOVE NOT SENDED USERS */
        $perm=$this->query('SELECT uu.`id_uzytkownik` as `idu` FROM `uzyt_i_upr` uu, `uzytkownik` u WHERE uu.`id_uzytkownik`=u.`id` AND u.`wsk_u`=? AND `id_uprawnienie`=?','0,'.$this->idPerm);       
        array_map(array($this, 'deleteUserFromPerm'),$perm);
        /* ADD SENDED USERS */
        self::addUserToPerm(); 
        return($this->response->setResponse(__METHOD__,'','cModal','POST'));     
    }
    private function deleteUserFromPerm($v)
    {
        if($this->response->getError()!=='') { return false;}
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
        if(!$found)
        {
            $this->Log->log(0,"[".__METHOD__."] USER (".$v['idu'].") NOT FOUND IN INPUT ARRAY => DELETE");
            $this->query('DELETE FROM `uzyt_i_upr` WHERE `id_uzytkownik`=? AND id_uprawnienie=?',$v['idu'].",".$this->idPerm);
        }
    }
    private function addUserToPerm()
    {
        if($this->response->getError()!=='') { return false;}
        $this->Log->log(0,"[".__METHOD__."]");
        foreach($this->inpArray as $id => $user)
        {
            if(!self::addUser($id,$user))
            {
                break;
            }
        }
    }
    private function checkUserExist($idUser=0)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $userData=$this->query('SELECT `id`,`wsk_u` FROM `uzytkownik` WHERE `id`=?',$idUser);
        $count=count($userData);
        $this->Log->logMulti(0,$userData);
        $this->Log->log(0,"COUNT => ".$count);
        if($count===0)
        {
            return false;
        }
        $wsku=intval($userData[0]['wsk_u'],10);
        $this->Log->log(0,"INTVAL WSK_U => ".$wsku);
        if($wsku!==0)
        {
            return false;
        }
        return true;
    }
    private function checkPermissionExist()
    {
        $this->Log->log(0,"[".__METHOD__."] ID PERM => ".$this->idPerm);
        $permData=$this->query('SELECT `id` FROM `uprawnienia` WHERE `id`=?',$this->idPerm);
        $count=count($permData);
        $this->Log->log(0,"COUNT => ".$count);
        if($count===0)
        {
            $this->response->setError(1,"PERMISSION (".$this->idPerm."), NOT EXIST");
        }
    }
    private function addUser($id,$user)
    {
        if(preg_match('/^user_(\d)+$/i', $id) && (intval($user,10)>0 ) && self::checkUserExist($user))
        {
            $this->Log->log(0,"INSERT => ".$user);
            $this->query('INSERT INTO `uzyt_i_upr` (`id_uzytkownik`,`id_uprawnienie`) VALUES (?,?)',$user.",".$this->idPerm);    
            return true;
        }
        else
        {
            //$this->Log->log(0,"[".__METHOD__."] WRONG INPUT KEY (".$id."), OR WRONG ID USER (".$user.")");
            $this->response->setError(1,"WRONG INPUT KEY (".$id."), OR WRONG ID USER (".$user.") OR USER WITH ID => ".$user." NOT EXIST OR USER IS DELETED");
            return false;
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
       echo json_encode($this->response->setResponse(__METHOD__,$result,'showAll','GET')); 
    }
    public function getUsersWithPerm()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        if(!$this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->response->setError(1,'');
        }
        else
        {
            // ID PERM
            $v['i']=$this->utilities->getData();
            // GET USERS WITH PERM
            $v['u']=$this->query('SELECT id, ImieNazwisko FROM v_upr_i_uzyt_v3 WHERE idUprawnienie=?',$this->utilities->getData());
            // GET ALL USERS
            $v['a']=$this->query('SELECT ID as "id",CONCAT(Imie," ",Nazwisko) AS "ImieNazwisko" FROM v_all_user WHERE wskU=? ORDER BY ID asc',"0");
        }   
        return($this->response->setResponse(__METHOD__, $v,'uPermOff','POST'));
    }
    function __destruct()
    {}
}
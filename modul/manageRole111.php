<?php
class ManageRole
{
    protected $idRole=0;
    private $inpArray=array();
    protected $filter='';
    protected $taskPerm= ['perm'=>'','type'=>''];
    protected $infoArray=array
            (
                "nazwa"=>array
                (
                    "Podana Nazwa jest za krótka",
                    "Podana Nazwa jest za długa",
                    "Istnieje już rola o podanej nazwie",
                )
            );
    private $Log;
    private $dbLink;
    function __construct()
    {
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities=NEW Utilities();
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getAllRole()
    {
        $f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $this->Log->log(0,"[".__METHOD__."] filter => ".$f);
        echo json_encode($this->response->setResponse(
                __METHOD__,
                $this->dbLink->squery('SELECT `ID` as \'i\',`Nazwa` as \'n\' FROM `v_slo_rola_all` WHERE `WSK_U`=\'0\' AND (`ID` LIKE (:f) OR `Nazwa` LIKE (:f)) ORDER BY ID ASC',[':f'=>[$f,'STR']]),
                '',
                'GET'));
    }
    public function getNewRoleSlo()
    {
        $v['rola']=$this->squery('select * from v_slo_rola');
        $v['perm']=$this->squery('select `ID` as \'i\',`NAZWA` as \'n\' from v_slo_upr');
        $this->utilities->jsonResponse(__METHOD__,$v,'cRole');
    }
    public function rDelete()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->idRole=filter_input(INPUT_POST,'id',FILTER_VALIDATE_INT);
        $this->Log->log(0,'id role => '.$this->idRole);
        if(!$this->idRole)
        {
            $this->response->setError(1,'FIELD ID NOT EXIST IN POST');
        }
        else
        {
            $this->query('UPDATE `slo_rola` SET `WSK_U`=? WHERE `ID`=?','1,'.$this->idRole);
        }
        return ($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    public function cRole()
    {
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->checkKeyExist('nazwa',$this->inpArray,$this->response->error);
        self::checkRoleValueLength();
        self::checkRoleName();
        UNSET($this->inpArray['id']);
        // CHECK AVALIABLE ROLE
        self::addRole();
        // EDIT ROLE PERMISSION
        self::addNewRolePerm($this->queryLastId());  
        return ($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    public function rEdit()
    {
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->checkKeyExist('id',$this->inpArray,$this->response->error);
        $this->utilities->checkKeyExist('nazwa',$this->inpArray,$this->response->error);
        self::checkRoleValueLength();
        self::checkEditedRoleName();
        self::updateRole();
        self::removeRolePerm($this->inpArray['id']);  
        self::addNewRolePerm($this->inpArray['id']);
        
        return ($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    protected function addRole()
    {
        if($this->response->getError()!=='') { return false;}
        $this->query("INSERT INTO `slo_rola` (`NAZWA`,`create_user`,`create_user_full_name`,`create_user_email`,`create_host`) VALUES (?,?,?,?,?)",$this->inpArray['nazwa']. ",".$_SESSION["username"].",".$_SESSION["nazwiskoImie"].",".$_SESSION["mail"].",".$_SERVER['REMOTE_ADDR']);
    }
    private function checkRoleName()
    {
        if($this->response->getError()!=='') { return false;}
        if($this->checkExistInDb('v_slo_rola','NAZWA=?',$this->inpArray['nazwa']))
        {
            $this->response->setError(0, $this->infoArray['nazwa'][2]."<br/>");
        }
    }
    private function checkEditedRoleName()
    {
        if($this->response->getError()!=='') { return false;}
        if($this->checkExistInDb('v_slo_rola','NAZWA=? AND ID!=?',$this->inpArray['nazwa'].','.$this->inpArray['id']))
        {
            $this->response->setError(0, $this->infoArray['nazwa'][2]."<br/>");
        }
    }
    private function updateRole()
    {
        if($this->response->getError()!=='') { return false;}
        $this->query('UPDATE `slo_rola` SET `NAZWA`=? WHERE `ID`=?',$this->inpArray['nazwa'].','.$this->inpArray['id']);
    }
    protected function addNewRolePerm($idRole)
    {
        if($this->response->getError()!=='') {return false;}
        $this->Log->log(0,"[".__METHOD__."] ID ROLE => ".$idRole);
        foreach($this->inpArray as $id => $value)
        {
            $this->insertRolePerm($idRole,$id,$value);
        }
    }
    private function removeRolePerm($idRole)
    {
        /* GET EXIST ROLE PERM */
        /* DELETE NOT SENDED */
        foreach($this->query('SELECT `id_upr` as \'iu\' FROM `upr_i_slo_rola` WHERE `id_rola`=?',$idRole) as $v)
        {
            $this->Log->log(0,"[".__METHOD__."] ID PERM => ".$v['iu']);
            if(!array_key_exists('perm_'.$v['iu'], $this->inpArray ))
            {
                $this->Log->log(0,__METHOD__." REMOVE ROLE (${idRole}) PERM (".$v['iu'].")");
                $this->query('DELETE FROM `upr_i_slo_rola` WHERE `id_rola`=? AND `id_upr`=?',$idRole.",".$v['iu']);  
            }
       }
    }
    private function checkRolePermKey($id,$value)
    {
        if(preg_match('/^perm_(\d)+$/i', $id) && (intval($value,10)===1 ))
        {
            $this->Log->log(0,"[".__METHOD__."] PERM KEY => ".$id." AND VALUE 1");
            return true;
        }
        $this->Log->log(0,"[".__METHOD__."] NO PERM KEY, FOUND => ".$id." OR VALUE NOT 1 => ".$value);
        /* KEY perm_ NOT FOUND */
        /* WRONG VALUE, ACCEPT ONLY 1 */
        return false;
    }
    protected function insertRolePerm($idRole,$idPerm,$value)
    {
        if(!self::checkRolePermKey($idPerm,$value))
        {
            return false;
        }
        $tmp_id=explode('_',$idPerm);   
        $this->Log->log(0,"[".__METHOD__."] ADD ROLE (${idRole}) PERM (".$tmp_id[1].")");
        
        if(!$this->checkExistInDb('upr_i_slo_rola','id_rola=? AND id_upr=?',$idRole.','.$tmp_id[1]))
        {
            // NOT EXIST -> ADD
            $this->Log->log(0,__METHOD__." NOT EXIST => ADD");
            self::checkExistSloPerm($tmp_id[1]);
            if($this->response->getError()!=='') { return false;}
            $this->query('INSERT INTO upr_i_slo_rola (id_rola,id_upr) VALUES (?,?)',$idRole.",".$tmp_id[1]); 
        }
    }

    private function checkExistSloPerm($idPerm)
    {
        if(!$this->checkExistInDb('uprawnienia','`ID`=?',$idPerm))
        {
            $this->response->setError(1,'UPR ('.$idPerm.') NOT EXIST IN DATABASE');
        }
    }
    private function getRole($id)
    {
        if($this->response->getError()!=='') { return false;}
        $roleData=$this->query('SELECT `ID` as \'i\',`Nazwa` as \'n\',`WSK_U` as \'u\',`create_user` as \'cu\',`create_user_email` as\'cue\',`create_date` as \'cd\' FROM `slo_rola` WHERE `ID`=?',$id);
        if(count($roleData)!==1)
        {
            $this->response->setError(1,'THERE EXIST MORE THAN ONE ROLE WITH ID');
            return false;
        }
        if($roleData[0]['u']==='1')
        {
            $this->response->setError(0,'ROLA ZOSTAŁA USUNIĘTA<br/>');
            return false;
        }
        UNSET($roleData[0]['u']);
        return $roleData[0];
    }
    public function getRoleDetails()
    {
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->response->setError(1,$this->utilities->getInfo());
        }
        /* CHECK IS NOT REMOVED */
        $v['role']=self::getRole($this->utilities->getData());
        $v['perm']=self::getRolePerm();
        return($this->response->setResponse(__METHOD__,$v,'sRole','POST',$this->getError()));
    }
    private function getRolePerm()
    {
        if($this->response->getError()!=='') { return false;}
        $slo=$this->squery('SELECT `ID` as \'i\',`NAZWA` as \'n\' FROM `uprawnienia` WHERE ID>0');
        $rolePerm=$this->query('SELECT `id_rola`as \'i\',`id_upr` as \'iu\' FROM `upr_i_slo_rola` WHERE `id_rola`=?',$this->utilities->getData());
        // COMBINE
       return($this->combineSlo($slo,'i',$rolePerm,'iu'));
    }
    protected function combineSlo($slo,$sloKey,$uprRole,$sloUserKey)
    {
        // $sloKey = ID
        // $sloUserKey = idUprawnienie
        foreach($slo as $id => $value)
        {
            foreach($uprRole as $key => $valueEmpl)
            {
                if($value[$sloKey]===$valueEmpl[$sloUserKey])
                {
                    /* SET CHECKED */
                    $this->Log->log(0,__METHOD__." FOUND (".$valueEmpl[$sloUserKey]." ".$value['n'].") SET CHECKED");
                    $slo[$id]['c']=1;
                    unset($uprRole[$key]);
                    break;
                }
            }
        }
        return($slo);
    }
    protected function checkRoleValueLength()
    {
        if($this->response->getError()!=='') {return false;}
        if(strlen($this->inpArray['nazwa'])<3)
        {
            $this->response->setError(0,$this->infoArray['nazwa'][0]."<br/>");

        }
        if(strlen($this->inpArray['nazwa'])>30)
        {
            $this->response->setError(0,$this->infoArray['nazwa'][1]."<br/>");
        }
    }
    public function getRoleUsers()
    {
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->response->setError(1,$this->utilities->getInfo());
            return false;
        }
        $v['role']=self::getRole($this->utilities->getData());
        if($this->response->getError()!=='') { return false; }
        $v['user']=$this->query('SELECT Imie,Nazwisko,Login,Email FROM v_all_user WHERE idRola=? AND wskU=? ORDER BY Nazwisko,Imie,ID ASC ',$this->utilities->getData().',0');
        return($this->response->setResponse(__METHOD__,$v,'rDelete','POST'));
    }
    function __destruct()
    {}
}
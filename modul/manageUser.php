<?php
class manageUser extends initialDb
{
    private $inpArray=array();
    protected $actData=array();
    protected $responseType='POST';
    protected $infoArray=array
            (
                "imie_nazwisko"=>array
                (
                    "Podane Imię, Nazwisko lub Login jest za krótkie",
                    "Podane Imię, Nazwisko lub Login jest za długi",
                    "Istnieje już użytkownik o podanym Imieniu i Nazwisku",
                ),
                "login"=>array
                (
                    "Istnieje już użytkownik o podanym Loginie"
                )
            );
    function __construct(){
        parent::__construct();
        $this->log(0,"[".__METHOD__."]");
        $this->utilities=NEW utilities();
        $this->response=NEW Response('User');
    }
    private function setInpArray(){
        $this->utilities->getPost();
        if($this->utilities->getStatus()===0)
        {
            $this->inpArray=$this->utilities->getData();
        }
        else
        {
            $this->response->setError(1,$this->utilities->getInfo());
        }
    }
    public function cUser()
    {
        $this->log(0,"[".__METHOD__."]");
        self::setInpArray();
        self::checkUserValueLength();
        if($this->checkExistInDb('uzytkownik','login=?',$this->inpArray['Login']))
        {
            $this->response->setError(0,$this->infoArray['login'][0]);
        }
        if($this->checkExistInDb('uzytkownik','imie=? AND nazwisko=?',$this->inpArray['Imie'].','.$this->inpArray['Nazwisko']))
        {
            $this->response->setError(0,$this->infoArray['imie_nazwisko'][2]);
        }
        // CHECK PASSWORD/TYPKONTA INPUT EXIST
        $this->inpArray['Haslo']=$this->utilities->setDafaultValue("haslo",$this->inpArray,'');
        $this->inpArray['TypKonta']=$this->utilities->setDafaultValue("typkonta",$this->inpArray,'a'); // ACTIVE Directory
        $this->addUser();    
        // EDIT USER PERMISSION
        $this->inpArray['ID']=$this->queryLastId();
        self::setPerm(); 
        return($this->response->setResponse(__METHOD__,'','','POST'));
    }
    protected function setActSessionPermRole()
    {
        $this->log(0,"[".__METHOD__."]");
        if($_SESSION['userid']!==$this->inpArray['ID']) { return ''; }
        $idRole=$this->query('SELECT `idRola` FROM `v_all_user` WHERE ID=?',$this->inpArray['ID'])[0];
        $this->logMultidimensional(2,$idRole['IdRola'],__LINE__."::".__METHOD__." idRole");
        // UPDATE CURRENT USER SESSION PERM;
        $permRole=array();
        $idRole=intval($idRole['IdRola'],10);
        if($idRole>0)
        {
            $permRole=$this->query('SELECT `SKROT` FROM `v_upr_i_slo_rola_v2` WHERE `idRola`=?',$idRole);
        }
        $perm=$this->query('SELECT `SKROT` FROM `v_uzyt_i_upr_v2` WHERE `idUzytkownik`=?',$this->inpArray['ID']);
        $_SESSION['perm']=array();
        foreach(array_merge($perm,$permRole) as $v)
        {
            array_push($_SESSION['perm'],$v['SKROT']);
        }
        $this->logMultidimensional(2,$_SESSION['perm'],__LINE__."::".__METHOD__." SESSION['perm']");
    }
    public function eUserOn()
    {
        $this->log(0,"[".__METHOD__."]");
        self::setInpArray();
        self::checkUserValueLength();
        if($this->checkExistInDb('uzytkownik','login=? AND id!=?',$this->inpArray['Login'].','.$this->inpArray['ID']))
        {
            $this->response->setError(0,$this->infoArray['login'][0]);
        }
        if($this->checkExistInDb('uzytkownik','imie=? AND nazwisko=? AND id!=?',$this->inpArray['Imie'].','.$this->inpArray['Nazwisko'].','.$this->inpArray['ID']))
        {
            $this->response->setError(0,$this->infoArray['imie_nazwisko'][2]);
        }
        // CHECK PASSWORD INP EXIST
        $this->inpArray['Haslo']=$this->utilities->setDafaultValue("haslo",$this->inpArray,'');
        $this->inpArray['TypKonta']=$this->utilities->setDafaultValue("typkonta",$this->inpArray,'a'); // ACTIVE Directory
        self::updateUser();
        self::setPerm();
        self::setActSessionPermRole();
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    protected function setUserPerm($permArray,$userId)
    {
        $this->log(0,"[".__METHOD__."]");
        if($this->getError()) { return '';}
        foreach($permArray as $value)
        {
            //echo $value[0].' - '.$value[1];
            if($value[2]>0)
            {
                $this->addUserPerm($userId,$value[0]);
            }
            else
            {
                $this->removeUserPerm($userId,$value[0]);
            }
        }
    }
    public function uPerm()
    {
        $this->log(0,"[".__METHOD__."]");
        self::setInpArray();
        self::setPerm();
        self::setActSessionPermRole();
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    private function getSloPerm()
    {
        $this->log(0,"[".__METHOD__."]");
        $db=array();
        foreach($this->query('SELECT `ID` FROM `v_slo_upr` WHERE `ID`>?',0) as $v)
        {
            array_push($db,$v['ID']);
        }
        $this->logMultidimensional(2,$db,__LINE__."::".__METHOD__." db");
        return ($db);
    }
    protected function checkPermInDb($t1,$t2)
    {
        /*
         * CHECK EXIST IN DB
         * t1 => POST
         * t2 => DATABASE
         */
        $this->log(2,"[".__METHOD__."]");   
        foreach($t1 as $v)
        {
            //$this->logMultidimensional(0,$v,__LINE__."::".__METHOD__." t1");
            $this->log(2,"[".__METHOD__."] ID => ".$v); 
            if(!in_array($v,$t2))
            {  
                $this->response->setError(1,"DICTIONARY ID => ".$v." NOT FOUND IN DB");
                break;
            }         
        }
    }
    private function setPerm()
    {
        if($this->getError()) { return ''; }
        $permDb=self::getSloPerm();
        $permPost=$this->utilities->getArrayKeyValue('ID',$this->utilities->getCbox());
        self::checkPermInDb($permPost,$permDb);
        if($this->getError()) { return ''; }
        foreach($permDb as $v)
        {
            if(in_array($v,$permPost))
            {
                $this->addUserPerm($this->inpArray['ID'],$v);
            }
            else
            {
                $this->removeUserPerm($this->inpArray['ID'],$v);
            }
        } 
    }
    protected function checkExistSloPerm($permTab)
    {
       // CHECK SLO IS AVALIABLE
        foreach($permTab as $value)
        {
            if(!$this->checkExistInDb('v_slo_upr','ID=?',$value[0]))
            { 
                $value[1]=preg_replace('/_/', ' ', $value[1]);
                $this->response->setError(1,"[".$value[1]."] PERMISSION DICTIONARY WAS DELETED");
            }
        }
    }
    protected function checkUserValueLength()
    {
        if(strlen($this->inpArray['Imie'])<3 || strlen($this->inpArray['Nazwisko'])<3 || strlen($this->inpArray['Login'])<3)
        {
            $this->response->setError(0,$this->infoArray['imie_nazwisko'][0]);
        }
        if(strlen($this->inpArray['Imie'])>30 || strlen($this->inpArray['Nazwisko'])>30 || strlen($this->inpArray['Login'])>30)
        {
            $this->response->setError(0,$this->infoArray['imie_nazwisko'][1]);
        }
    }
    protected function addUser()
    {
        if($this->getError()) { return ''; }
        $this->query('INSERT INTO uzytkownik 
            (imie,nazwisko,login,haslo,email,typ,id_rola,mod_dat,mod_user,mod_user_id) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?)'
            ,$this->inpArray['Imie'].",".$this->inpArray['Nazwisko'].",".$this->inpArray['Login'].",".$this->inpArray['Haslo'].",".$this->inpArray['Email'].",".$this->inpArray['TypKonta'].",".$this->inpArray['Rola'].",".$this->cDT.",".$_SESSION["username"].','.$_SESSION["userid"]);
    }
    protected function updateUser()
    {
         if($this->getError()) { return ''; }
        $this->query('UPDATE uzytkownik SET imie=?, nazwisko=?, login=?,email=?,haslo=?,typ=?,id_rola=?, mod_dat=?, mod_user=?,mod_user_id=? WHERE id=?'
            ,$this->inpArray['Imie'].",".$this->inpArray['Nazwisko'].",".$this->inpArray['Login'].",".$this->inpArray['Email'].",".$this->inpArray['Haslo'].",".$this->inpArray['TypKonta'].",".$this->inpArray['Rola'].','.$this->cDT.",".$_SESSION["username"].','.$_SESSION["userid"].','.$this->inpArray['ID']);
    }
    protected function addUserPerm($userId,$value)
    {
         if($this->getError()) { return ''; }
        $this->log(2,"[".__METHOD__."] USER ID => ".$userId.", VALUE => ".$value);
        // CHECK IS EXIST
        if(!$this->checkExistInDb('v_uzyt_i_upr','idUzytkownik=? AND idUprawnienie=?',$userId.','.$value))
        {
            // NOT EXIST -> ADD
            $this->query('INSERT INTO uzyt_i_upr (id_uzytkownik,id_uprawnienie) VALUES (?,?)',$userId.",".$value); 
        }
    }
    protected function removeUserPerm($userId,$value)
    {
        if($this->getError()) { return ''; }
        $this->log(2,"[".__METHOD__."] USER ID => ".$userId.", VALUE => ".$value);
        if($this->checkExistInDb('v_uzyt_i_upr','idUzytkownik=? AND idUprawnienie=?',$userId.','.$value))
        {
            // EXIST -> DELETE
            $this->query('DELETE FROM uzyt_i_upr WHERE id_uzytkownik=? AND id_uprawnienie=?',$userId.",".$value); 
        }   
    }    
    protected function getUserData($id)
    {
        $this->log(0,"[".__METHOD__."]");
        $data=$this->query('SELECT * FROM `uzytkownik` WHERE `id`=?',$id);
        if(count($data)>0)
        {
            return($data[0]);
        }
        else
        {
            $this->response->setError(1,'NO DATA ABOUT PERSON IN DB! ID USER => '.$id);
        }
    }
    # DELETED PROJECT IN DB
    public function dUser()
    {
        $this->log(0,"[".__METHOD__."]");
        self::setInpArray();
        $this->logMultidimensional(0,$this->inpArray,__LINE__."::".__METHOD__." inpArray");
        $this->query('UPDATE `uzytkownik` SET `wsk_u`=? WHERE `id`=?',"1,".$this->inpArray['ID']);
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getUsers()
    {
        $this->log(0,"[".__METHOD__."]");
        $this->responseType='GET';
        if($this->utilities->checkInputGetValInt('wsku')['status']===1)
        {
            $this->response->setError(1,' KEY wsku in $_GET IS EMPTY');
        }
        else
        {
            $this->query('SELECT ID,Imie,Nazwisko,Login,Email,TypKonta,Rola FROM v_all_user WHERE wskU=? ORDER BY id asc',"".$this->utilities->getData().""); 
        }  
        return($this->response->setResponse(__METHOD__,$this->queryReturnValue(),''));
    }
    public function getUsersLike()
    {
        $this->log(0,"[".__METHOD__."]");
        $this->responseType='GET';
        if(!$this->utilities->checkInputGetValInt('wsku')['status']===1)
        {
            $this->response->setError(1,'');
        }
        $w=$this->utilities->getData();
        if($this->utilities->checkKeyExist('filter',$_GET)['status']===1)
        {
            $this->response->setError(1,'');
        }
        if(!$this->getError())
        {
            $f='%'.filter_input(INPUT_GET,'filter').'%';
            $this->logMultidimensional(0,$f,__LINE__."::".__METHOD__." FILTR");
            $this->query('SELECT ID,Imie,Nazwisko,Login,Email,TypKonta,Rola FROM v_all_user WHERE wskU=? AND (ID LIKE (?) OR Imie LIKE (?) OR Nazwisko LIKE (?) OR Login LIKE (?) OR Email LIKE (?) OR TypKonta LIKE (?) OR Rola LIKE (?)) ORDER BY id asc'
                ,"$w,".$f.",".$f.",".$f.",".$f.",".$f.",".$f.",".$f);
        }
        return($this->response->setResponse(__METHOD__,$this->queryReturnValue(),''));   
    }
    public function getUserDel()
    {
        $this->log(0,"[".__METHOD__."]");       
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->response->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else
        {          
            return($this->response->setResponse(__METHOD__,self::getUserData($this->utilities->getData()),'dUser'));
        } 
    }
    # RETURN ALL NOT DELETED DICTIONARY and other FROM DB
    public function getSlo($tableToSelect,$order='ID')
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY '.$order.' ASC ',1);
        $this->actData=$this->queryReturnValue();
    }
    # RETURN ALL EMPLOYEE SPEC DICTIONARY and other FROM DB
    public function getUserPerm()
    {
        $this->log(0,"[".__METHOD__."]");
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->response->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else
        {
            $data[0]=$this->utilities->getData();
            $data[1]=self::getUserPermDB($data[0]);
            return($this->response->setResponse(__METHOD__,$data,'uPermOff','POST'));
        }
    }
    /* getUserPermDB */
    private function sqlGetUserPerm(){ // $idUser
        $this->log(0,"[".__METHOD__."]");
        /* GET DICTIONARY */
        parent::newQuery('SELECT * FROM `v_slo_upr` WHERE `ID`>0 ORDER BY `ID` ASC ');
        $slo=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
        parent::logMulti(2,$slo,__LINE__."::".__METHOD__." slo");
        /* GET USER DICTIONARY */
        parent::newQuery('SELECT * FROM `v_uzyt_i_upr` WHERE `idUzytkownik`='.$this->inpArray['id'].' ORDER BY `idUprawnienie` ASC');
        $userSlo=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
        parent::logMulti(2,$userSlo,__LINE__."::".__METHOD__." userSlo");
        /* COMBINE */
        self::combineSlo($slo,'ID',$userSlo,'idUprawnienie');
        $this->logMultidimensional(2,$this->actData,__LINE__."::".__METHOD__." userSloComb");
    }
    protected function combineSlo($slo,$sloKey,$usrSol,$sloUserKey)
    {
        // $sloKey = ID
        // $sloUserKey = idUprawnienie
        foreach($slo as $id => $value){
            foreach($usrSol as $key => $valueEmpl){
                if($value[$sloKey]===$valueEmpl[$sloUserKey]){
                    $slo[$id]['DEFAULT']='t';
                    unset($usrSol[$key]);
                    break;
                }
            }
        }
        array_push($this->actData,$slo);
    }
    # RETURN CURRENT PROJECT DETAILS
    public function getUserDetails(){
        $this->log(0,"[".__METHOD__."]");
        self::setGetId();
        self::sqlGetUserDetails(); 
        return($this->response->setResponse(__METHOD__,$this->actData,'eUser','POST'));
    }
    private function sqlGetUserDetails(){
        if($this->response->getError()){ return false;}
        try{
            /* GET USER DATA */
            self::sqlGetUserData();
            /* GET USER PERM */
            self::sqlGetUserPerm();
            //GET USER ROLE
            array_push($this->actData,self::getUserRole($this->actData[0]['IdRola']));
            $this->logMultidimensional(2,$this->actData,__LINE__."::".__METHOD__." data");
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }  
    }
    private function sqlGetUserdata(){
        $this->log(0,"[".__METHOD__."]");
        if($this->response->getError()){ return false;}
        $sqlData=array(':id'=>array($this->inpArray['id'],'INT'));
        parent::newQuery("SELECT * FROM `v_all_user` WHERE `id`=:id",$sqlData);
        $this->actData[0]=parent::getSth()->fetch(PDO::FETCH_ASSOC);
    }
    public function getUserRole($idUserRole='')
    {
        $this->log(0,"[".__METHOD__."] ID USER ROLE => ".$idUserRole);
        $userRoleSlo=array();
        // GET ALL ROLE
        $allRole=$this->query('SELECT * FROM v_slo_rola WHERE 1=?',1);  
        if($idUserRole!='')
        {
                // COMBINE USER DICT
                $emptArr=array('ID'=>'0','NAZWA'=>''); 
                $userRole= $this->query('SELECT *,"t" AS "DEFAULT" FROM v_slo_rola WHERE ID=?',$idUserRole); 
                array_push($userRole,$emptArr);
                foreach($allRole as $key => $value)
                {
                    if($value['ID']===$userRole[0]['ID'])
                    {
                        unset($allRole[$key]);
                        break;
                    }
                }
                $userRoleSlo=array_merge($userRole,$allRole);
        }
        else
        {
            $emptArr=array(array('ID'=>'0','NAZWA'=>'','DEFAULT'=>'t'));
            //echo 'NO USER ROLE\n';
            $userRoleSlo=array_merge($emptArr,$allRole);
        }
        //print_r($userRoleSlo);
        return ($userRoleSlo);
    }
    public function getNewUserSlo(){
        $this->log(0,"[".__METHOD__."]");
        // SLO UPR
        $data[0]=$this->query('SELECT * FROM v_slo_upr WHERE 1=? ORDER BY ID ASC ',1);
        // SLO ROLA
        $data[1]=$this->query('SELECT * FROM v_slo_rola WHERE 1=? ORDER BY ID ASC ',1);
        // ADD EMPTY ROLA
        array_push($data[1],array('ID'=>'0','NAZWA'=>'','DEFAULT'=>'t'));
        return($this->response->setResponse(__METHOD__, $data,'cUser'));   
    }
    private function setGetId(){
        if(!$this->utilities->setGetIntKey($this->inpArray['id'],'id')){
             $this->response->setError(1,"[".__METHOD__."] KEY id NOT EXIST OR ID IS NOT INT");
        }
    }
    function __destruct()
    {}
}
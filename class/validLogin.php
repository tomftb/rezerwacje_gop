<?php
class validLogin
{
    private $info="";
    private $getLogout="";
    private $bgColor="";
    private $userName="";
    private $userPassword="";
    private $userData=array();
    private $dbLink;
    private $logLink;
    
    public function __construct(){
        $this->logLink=NEW logToFile();
        $this->userName=filter_input(INPUT_POST,"username");
        $this->userPassword=filter_input(INPUT_POST,"password");
    }
    public function checkLoginData(){
        $this->logLink->log(0,"[".__METHOD__."]");
        if($this->checkGet()){
            return 0;
        }
        else if(isset($_SESSION["perm"]) && in_array('LOG_INTO_APP',$_SESSION['perm'])){
            $this->logLink->log(0,"[".__METHOD__."] SESSION ALREADY INITIALISED");
            return 1;
        }
        else if((trim($this->userName)==='') && (trim($this->userPassword)==='')){
            return 0;
        }
        else{
            $this->dbLink=NEW initialDb();
            if(!self::getUserData()) {return 0;}
            if(!self::checkUserData()) {return 0;}
            if(!self::checkLogin()) {return 0;}
            if(!self::getUserPerm()) { return 0;}
            self::setSessionData();
        }
        return 1;
    }
    private function checkGet(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $this->getLogout = filter_input(INPUT_GET, 'logout');
        if($this->getLogout==='t'){
            $this->info='Wylogowano.';
            $this->bgColor='bg-success';
            if(!session_unset()){
                $this->logLink->log(0,"[".__METHOD__."] session_unset NOT WORK");
                return 0;
            }
            return 1;
        }
        return 0;
    }
    public function getInfoValue(){
        return $this->info;
    }
    public function getBgColorValue(){
        return $this->bgColor;
    }
    private function checkLoginInAD(){
        $this->logLink->log(0,"[".__METHOD__."]");
        /* GET FROM CONST */
        $ldap=new ldapAuth(ldapParm['host'],ldapParm['filter'],ldapParm['tree'],ldapParm['port'],ldapParm['user'],ldapParm['password']); 
        $ldap->loginAd($this->userName,$this->userPassword);
        if(!$ldap->getError()){
            $_SESSION["mail"]=$ldap->getUserAdData('mail',0);
            $_SESSION["nazwiskoImie"]=$ldap->getUserAdData('name',0); 
            return 1;
	}
        self::setError($ldap->getError(),'');
        return 0;
    }
    private function checkLogin(){
        $this->logLink->log(0,"[".__METHOD__."] ACCOUNT TYPE => ".$this->userData['typ']);
        $this->userData['typ']=intval($this->userData['typ'],10);
        /* TO DO => GET AVALIABLE ACCOUNT TYPE */
        /* CHECK ACCOUNT TYPE */
        if($this->userData['typ']===2){
            /* 
             * LOCAL ACCOUNT => CHECK PASSWORD 
             * password_hash("test", PASSWORD_BCRYPT, ["cost" => $cost]);
             */
            //$this->logLink->log(0,"[".__METHOD__."] ".password_hash($this->userPassword, PASSWORD_BCRYPT));
            if (!password_verify($this->userPassword, $this->userData['haslo'])) {
                self::setError('Brak uprawnienia do zalogowania się.',"[".__METHOD__."] Wrong user password => ".$this->userName);
                return 0;
            }
            $_SESSION["mail"]=$this->userData['email'];
            $_SESSION["nazwiskoImie"]=$this->userData['nazwisko'].' '.$this->userData['imie']; 
        }
        else if($this->userData['typ']===1){
            /* AD ACCOUNT => CHECK IN AD */
            if(!self::checkLoginInAD()) {return 0;}
        }
        else{
            /* WRONG ACCOUNT TYPE => SET ERROR */
            self::setError('Brak uprawnienia do zalogowania się.',"[".__METHOD__."] Wrong account type => ".$this->userData['typ']);
            return 0;
        }
        return 1;
    }
    private function setSessionData(){
        $_SESSION["username"]=$this->userName;
        $_SESSION["userid"]=$this->userData['id'];
        $_SESSION["perm"]=$this->userData['perm'];  
        $_SESSION["uid"]= uniqid();
    }
    private function getUserData()
    {
        $this->logLink->log(0,"[".__METHOD__."]");
        $sqlData[':login']=array($this->userName,'STR');
        try{
            $this->dbLink->newQuery("SELECT `id`,`imie`,`nazwisko`,`email`,`wsk_u`,`typ`,`haslo`,`id_rola` FROM `uzytkownik` WHERE `login`=:login",$sqlData);
            $this->userData=$this->dbLink->getSth()->fetch(PDO::FETCH_ASSOC);
            $this->logLink->logMulti(2,$this->userData,__METHOD__);
	}
	catch (PDOException $e){
            self::setError('[ERROR] Wystąpił krytyczny błąd aplikacji! Skontaktuj się z Administratorem!',"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            return 0;
	}
        return 1;
    }
    private function checkUserData(){
        $this->logLink->log(0,"[".__METHOD__."]");
        if(!is_array($this->userData)){
            self::setError('Brak uprawnienia do zalogowania się.','');
            return 0;
        }
        return 1;
    }
    private function getUserPerm(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $this->setActSessionPermRole();
        if(!in_array('LOG_INTO_APP',$this->userData['perm'])){
            self::setError('[LOG_INTO_APP] Brak uprawnienia do zalogowania się','');
            return 0;
        }
        $this->logLink->log(0,"[".__METHOD__."] Uprawnienie `LOG_INTO_APP` istnieje, loguje...");
        return 1;
    }
    protected function setActSessionPermRole(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $sqlData[':id_rola']=array(intval($this->userData['id_rola'],10),'INT');
        $sqlDataPerm[':id']=array(intval($this->userData['id'],10),'INT');
        try{
            /* ROLE PERM */
            $this->dbLink->newQuery("SELECT `SKROT` FROM v_upr_i_slo_rola_v2 WHERE `idRola`=:id_rola",$sqlData);
            $this->userData['rolePerm']=$this->dbLink->getSth()->fetchAll(PDO::FETCH_ASSOC);
            $this->logLink->logMulti(2,$this->userData['rolePerm'],__METHOD__."::ROLE PERM");
            /* USER PERM */
            $this->dbLink->newQuery("SELECT `SKROT` FROM `v_uzyt_i_upr_v2` WHERE `idUzytkownik`=:id",$sqlDataPerm);
            $this->userData['userPerm']=$this->dbLink->getSth()->fetchAll(PDO::FETCH_ASSOC);
            $this->logLink->logMulti(2,$this->userData['userPerm'],__METHOD__."::USER PERM");
            /* COMBINE PERM */
            self::combinePerm();
	}
	catch (PDOException $e){
            self::setError('[ERROR] Wystąpił krytyczny błąd aplikacji! Skontaktuj się z Administratorem!',"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            return 0;
	}
    }
    private function combinePerm(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $this->userData['perm']=array();
        foreach($this->userData['rolePerm'] as $v){
            array_push($this->userData['perm'],$v['SKROT']);
        }
        foreach($this->userData['userPerm'] as $v){
            if(!in_array($v['SKROT'],$this->userData['perm'])){
                array_push($this->userData['perm'],$v['SKROT']);
            }
        }
        $this->logLink->logMulti(2,$this->userData['perm'],__METHOD__."::COMBINE PERM");
    }
    private function setError($userError='',$log=''){
        $this->logLink->log(0,$log);
        $this->info=$userError;
        $this->bgColor='bg-danger';
    }
    public function __destruct() {}
}
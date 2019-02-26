<?php
if(checkFile('function/ldap.php')) include('function/ldap.php');
if(checkFile('.cfg/config.php')) include_once('.cfg/config.php');

class validLogin extends ldapAuth
{
    private $info="";
    private $url="";
    private $getLogout="";
    private $bgColor="";
    private $userName="";
    private $userPassword="";
    private $userData=array();
    private $showLog=0;
    private $dbLink='';
    
    public function __construct()
    {
       //echo "konstruktor run<br/>";
        $this->userName=filter_input(INPUT_POST,"username");
        $this->userPassword=filter_input(INPUT_POST,"password");
        //echo "username - ".$this->userName."<br/>";
    }
    
    public function checkLoginData()
    {
        if($this->showLog>0) { echo "[".__METHOD__."]<br/>"; }
        if($this->checkGet())
        {
            //echo "aa";
            return 0;
        }
        else if(isset($_SESSION["perm"]) && in_array('LOG_INTO_APP',$_SESSION['perm']))
        //else if(isset($_SESSION["permission"]) && $_SESSION["permission"]==='yes')
        {
            //echo "bb";
            return 1;
        }
        else if((trim($this->userName)==='') && (trim($this->userPassword)===''))
        {
            // echo "cc";
            return 0;
        }
        else
        {
            //echo "dd";
            $this->getDbLink();
            if(!$this->checkLoginInValidUsers()) {return 0;}
            if(!$this->getUserPerm($this->userData['id'])) {return 0;}
            if(!$this->checkLoginInAD()) {return 0;}
        }
        return 1;
    }
    private function checkGet()
    {
        if($this->showLog>0) { echo "[".__METHOD__."]<br/>"; }
        $this->getLogout = filter_input(INPUT_GET, 'logout');
        //echo $this->getLogout."<br/>";
        if($this->getLogout==='t')
        {
            // SET PARAMATERS OF VIEW
            $this->info='Wylogowano.';
            $this->bgColor='bg-success';
            // CLEAR SESSION DATA
            $this->clearSessionData();
            return 1;
        }
        return 0;
    }
    public function getInfoValue()
    {
        return $this->info;
    }
    public function getBgColorValue()
    {
        return $this->bgColor;
    }
    private function clearSessionData()
    {
        foreach($_SESSION as $klucz=>$wartosc)
        {
            unset($_SESSION[$klucz]);	
        }; 
    }
    private function checkLoginInAD()
    {
        if($this->showLog>0) { echo "[".__METHOD__."]<br/>"; };
        parent::__construct('geofizyka.geofizyka.pl','(&(sAMAccountName=%u)(objectcategory=person)(objectclass=user))','ou=Geofizyka, dc=geofizyka, dc=pl',389,'ldap@geofizyka.pl','Ld4p321',0);
        
        if($this->loginAd($this->userName,$this->userPassword))
        //if(!$ADcheck->getError())
        {
            $this->setSessionData();
            return 1;
	}
        else
        {
            $this->info=$this->getError();
            $this->bgColor='bg-danger';
        };
        return 0;
    }
    private function setSessionData()
    {
        $_SESSION["username"]=$this->userName;
        $_SESSION["userid"]=$this->userData['id'];
        //$_SESSION["permission"]="yes";
        $_SESSION["perm"]=$this->userData['perm'];
        $_SESSION["mail"]=$this->getUserAdData('mail',0);
        $_SESSION["nazwiskoImie"]=$this->getUserAdData('name',0);
        /*
         * echo "<pre>";
         * print_r($this->userData);
         * print_r($_SESSION);
         * echo "</pre>";
         * die('STOP');
         */
        
    }
    private function checkLoginInValidUsers()
    {
        $this->dbLink->query('SELECT id,imie,nazwisko,login FROM uzytkownik WHERE wsk_u=? AND login=?','0,'.$this->userName);
        $uData=$this->dbLink->queryReturnValue();
        
        if($this->showLog>0) { echo "[".__METHOD__."]<br/>"; }

        if(count($uData)>0)
        {
            $this->userData=$uData[0];
            return 1;
        }
        else
        {
            $this->info='Brak uprawnienia do zalogowania się.';
            $this->bgColor='bg-danger';
        }
        return 0;
    }
    private function getUserPerm($idUser)
    {
        $this->dbLink->query('SELECT SKROT FROM v_uzyt_i_upr_v2 WHERE idUzytkownik=?',$idUser);
        $this->userData['perm']=$this->parsePerm($this->dbLink->queryReturnValue());

        if(!in_array('LOG_INTO_APP',$this->userData['perm']))
        {
            $this->info='[LOG_INTO_APP] Brak uprawnienia do zalogowania się';
            $this->bgColor='bg-danger';
            return (0);
        }
        else
        {
            return (1);
        }
    }
    private function parsePerm($perm)
    {
        $arrToReturn=array();
        foreach($perm as $value)
        {
            array_push($arrToReturn,$value['SKROT']);
        }
        return ($arrToReturn);
    }
    private function getDbLink()
    {
        $this->dbLink=NEW initialDb();
    }
    public function __destruct() {
    
    }
}



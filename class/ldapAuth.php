<?php
class ldapAuth{

	private $ADparm=array('AD_url'=>"",'AD_filter'=>"",'AD_tree'=>"",'AD_port'=>"",'AD_user'=>"",'AD_pass'=>"",'AD_log'=>0);
        private $ADallUserData=array('user'=>"",'filter'=>"");
	private $ADuserData=array();
	private $library=array('ldap','curl');
	private $functionLibrary=array('ldap'=>array('ldap_connect','ldap_bind','ldap_search','ldap_get_entries'),'curl'=>array('curl_init'));
        private $Log;
        
	function __construct($AD_url="",$AD_filter="",$AD_tree="",$AD_port="",$AD_user="",$AD_pass="")
	{
            $this->Log=Logger::init(__METHOD__);
            self::checkInitialParameters(get_defined_vars());
            self::checkLibraryExists($this->library[0]);
            self::checkPort($this->ADparm["AD_url"],$this->ADparm["AD_port"]);		
	}
        private function checkInitialParameters($parm)
        {
            foreach($parm as $k =>$v)
            {
                $this->Log->log(0,"[".__METHOD__."]");
		if(trim($v)!=""){	
                    $this->ADparm[$k]=$v;		
		}
		else{
                    Throw New Exception ("[ERROR][".__METHOD__."] Nie wprowadzono konfiguracji $k => $v ",1);
		}
            }
        }
        private function checkLibraryExists($library)
	{
            $this->Log->log(0,"[".__METHOD__."]");
            if(extension_loaded($library)){	
                $this->Log->log(1,"[".__METHOD__."] Rozszerzenie ".$library." jest uwzględnione w konfiguracji PHP.",1);
		foreach($this->functionLibrary[$library] as $libraryId => $functionName)
		{
                    $this->checkFunctionExists($library,$functionName);
		}		
            }
            else{
                Throw New Exception ("[".mb_strtoupper($library)."] Rozszerzenie ".$library." NIE jest uwzględnione w konfiguracji PHP.",1);
            }
	}
	private function checkFunctionExists($library,$function)
	{
            $this->Log->log(2,"[".__METHOD__."]");
            if (function_exists($function)){
                $this->Log->log(1,"[".__METHOD__."] Funkcja ".$function." istnieje.");
            }
            else {
                Throw New Exception ("[".mb_strtoupper($library)."] Funkcja ".$function." NIE istnieje.",1);
            }
	}
	public function getUserAdData($data1="",$data2=0) // ldpa -> array [][]
	{	
            $this->Log->log(1,"[".__METHOD__."]Przekazane parametry [".$data1."][".$data2."]");	
		if($data1!="" && $data2>=0){	
			if(in_array($data1,$this->ADuserData)){
                            $this->Log->log(1,"[".__METHOD__."][LDAP]".$this->ADuserData[$data1][$data2]);
                            return $this->ADuserData[$data1][$data2];
			}
			else{
                            Throw New Exception ("[".__METHOD__."]","Nie odnaleziono szukanego rekordu.",1);
			}
		}
		else
		{
                    $this->Log->log(1,"[".__METHOD__."][LDAP] Zwracam całość");
                    return $this->ADuserData;
		}
	}
	/*-------------------------------------------------- END getUserAdData ------------------------------------*/
	private function checkPort($host,$port) // check host 
	{
            $this->Log->log(1,"[".__METHOD__."]");
            $errno="";
            $errstr="";
            $timeout=4;
            $connection = @fsockopen($host,$port,$errno,$errstr,$timeout);//
            if (is_resource($connection)){
                $this->Log->log(1,"[".__METHOD__."] connection is_resource. $host:$port ( ".getservbyport($port, 'tcp').") jest otwarty.");     
                fclose($connection);
            }
            else{
                $errno=iconv('cp1250', "UTF-8", $errno);
                $errstr=iconv('cp1250', "UTF-8", $errstr);
                Throw New Exception ("[".__METHOD__."] Client REMOTE ADDR => ".$_SERVER['REMOTE_ADDR'].". Brak odpowiedzi ".$host.":".$port." [".$errno." - ".$errstr."].",1);
            }
	}
	public function loginAd($user="",$password="")
	{
            $this->Log->log(0,"[".__METHOD__."]");
            if(trim($user)!=='' && trim($password)!=="")
            {
            	foreach(get_defined_vars() as $key =>$value)
            	{
                    $this->Log->log(2,"[".__METHOD__."] ${key} - ${value}");
                    $this->ADparm[$key]=$value;
		}
                //self::getAllAdUsers();
                self::connectAD();	
            }
            else{
                Throw New Exception ("[ERROR] Nie wprowadzono danych autoryzacyjnych użytkownika.",0);
            }
	}
	private function connectAD()
	{	
            $this->Log->log(0,"[".__METHOD__."]");

                $ADLDAP_CON = ldap_connect('ldap://'.$this->ADparm['AD_url']);
                ldap_set_option($ADLDAP_CON, LDAP_OPT_PROTOCOL_VERSION, 3);  
                if(@ldap_bind($ADLDAP_CON,$this->ADparm['AD_user'],$this->ADparm['AD_pass'])) //
                {
                    $this->Log->log(1,"[".__METHOD__."] ldap_bind => ok");
                    //$this->logMultidimensional(1,$this->ADparm['user'],__METHOD__." ADParm[user]",0);
                    //$this->logMultidimensional(1,$this->ADparm['user'],__METHOD__." ADParm[filter]",0);
                    $filter = str_replace('%u',$this->ADparm['user'],$this->ADparm['AD_filter']);
                    //$sr=ldap_search($ADLDAP_CON, $this->ADparm['AD_tree'], '(&(sAMAccountName=tborczynski)(objectcategory=person)(objectclass=user))');
                    $sr = @ldap_search($ADLDAP_CON, $this->ADparm['AD_tree'], $filter);
                    if(!$sr){
                        Throw New Exception ("[ERROR][ldap_search] Sprawdz parametr AD_tree i filtr.",1);
                    }
                    $this->logMultidimensional(1,$sr,__METHOD__." sr",0);
                    //$this->logMultidimensional(1,$filter,__METHOD__." filter",0);
                    $result = @ldap_get_entries($ADLDAP_CON, $sr);
                    //var_dump($result);
                    //die();
                    if(!$result){
                        Throw New Exception ("[ERROR][ldap_get_entries] prawdz parametr filtr.",1);
                    }
                    if($result['count'] == 1)
                    {
                        $this->Log->log(1,"[".__METHOD__."] ldap_get_entries == 1");
                        self::ldapUserBind($ADLDAP_CON,$result[0]['dn'],$this->ADparm['password'],$sr);
                    }
                    else{
                        Throw New Exception ("[ERROR] Z danymi autoryzacyjnymi nie jest powiązany żaden użytkownik AD.",0);
                    }				
                    @ldap_unbind($ADLDAP_CON);
                }
                else{
                    Throw New Exception ("[ERROR][ldap_bind] FALSE",1);
                }
            	
            return 0;
	}
        private function ldapUserBind(&$connLink,$user,$pass,$sr='')
        {
            if(@ldap_bind($connLink,$user,$pass))
            {
                $this->ADuserData=ldap_get_attributes($connLink,ldap_first_entry($connLink, $sr));
            }
            else {
                Throw New Exception ("[ERROR][AD] Błędne dane autoryzacyjne.",0);
            }
        }
	function __destruct(){	}
}


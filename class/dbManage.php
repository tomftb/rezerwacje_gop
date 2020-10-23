<?php
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/class/errorConfirm.php");
class dbManage extends errorConfirm
{
    private $dbLink;
    private $Parm=array('host'=>'','database'=>'','port'=>0,'user'=>'','password'=>'','log_lvl'=>0,'pass_cipher'=>'n');
    private $returnValue=array();			
    private $library=array('PDO');
    //private $lastInsertedId=0;
    private $functionLibrary=array('PDO'=>array());	
    private $sqlValueArr=array();
    private $sqlValueArrBind=array();
    public $cDT='';
    public $RA='';
    private $pdoResult;
    function __construct($host="",$database="",$port="",$user="",$password="",$log_lvl=0,$pass_cipher='n')
    {
        parent::__construct();
        $this->log(2,"[".__METHOD__."]");
        $this->cDT=date('Y-m-d H:i:s');
        $this->RA=filter_input(INPUT_SERVER,"REMOTE_ADDR");
	self::setDbParm(get_defined_vars());
	//$this->checkHost($this->Parm['host'],$this->Parm['port']); otwiera polaczenie, ale go nie zamyka !! nie uzywac (testowo ddoana metoda)
	$this->checkLibraryExists($this->library[0],0);
        if(!$this->getError())
        {
            $this->connectDB();
        }
    }
    public function connectDB()
    {
        $this->log(2,"[".__METHOD__."] ");
        self::isPassCipher();
	try
	{
            $this->dbLink = new PDO("mysql:host=".$this->Parm['host'].";dbname=".$this->Parm['database'].";port=".$this->Parm['port'].";encoding=utf8", $this->Parm['user'], $this->Parm['password']);
            $this->dbLink->exec("set names utf8");
            $this->dbLink->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // parametr ,a nastepnie wartosc dla paraemtru // PDO::ERRMODE_EXCEPTION
            $this->dbLink->setAttribute( PDO::ATTR_EMULATE_PREPARES,true); // production set to - false
            $this->dbLink->setAttribute( PDO::ATTR_PERSISTENT, 0); // false
            //$this->dbLink->setAttribute( PDO::ATTR_AUTOCOMMIT,0);
	}
	catch (PDOException $e)
	{
            // pelny blad piszemy samo $e
            $this->setError(0,"[ERROR][".__METHOD__."] Wystąpił błąd bazy danych :</br>".$e->getMessage()."</br>Powiadom administratora Tomasza Borczyńskiego.");
	}			
    }
    private function isPassCipher()
    {
        $this->log(2,"[".__METHOD__."] ");
        /*
         * only base64
         */
        if($this->Parm['pass_cipher']==='y')
        {
            $this->log(2,"[".__METHOD__."] password cipher => decode");
            $this->Parm['password']=base64_decode($this->Parm['password']);
        }
        //$this->log(0,"[".__METHOD__."] ".base64_encode($this->Parm['password']));
    }
    private function setDbParm($parm)
    {
        $this->log(2,"[".__METHOD__."] ");
        foreach($parm as $key =>$value)
	{
            if(trim($value)!="")
            //if($this->clearData($value,0)!="")
            {
                $this->log(2,"[".__METHOD__."] $key => $value");
		$this->Parm[$key]=$value;
            }
            else
            {
		$this->showInfoConnect();
		$this->setError(0,"[ERROR][".__METHOD__."]","Nie wprowadzono konfiguracji - ".$key.".");
            }
	}
    }
    protected function checkUniqueDb($f,$v,$t)
    {
        /*
         * f => field for where condition
         * v => value for where condition
         * t => table
         */
        $this->log(1,"[".__METHOD__."]\nfield=>$f\nvalue=>$v\ntable=>$t");
        if(self::parseFieldValueLength($f,$v,$t)===false)
        {
            return '';
        }
        //if($this->getError()) {return 0;};
        $this->query('SELECT * FROM '.$t.' WHERE '.$f.'=?',$v);
        if(count($this->queryReturnValue())>0)
        {
            $this->setError(0,"[DB ERROR] FIELD VALUE (".$f.") => NOT UNIQUE");
        }
    }
    public function parseFieldValueLength($f,$v,$t)
    {
        $vl=mb_strlen($v);
        $fl=self::getColumnTableLength($f,$t);
        if($vl>$fl)
        {
             $this->setError(0,"[DB ERROR] FIELD VALUE ($f) => $vl is longer that COLUMN DB LENGTH => $fl");	
             return false;
        }
        return true;
    }
    private function getColumnTableLength($c,$t)
    {
        $this->log(1,"[".__METHOD__."]");
        //$select = $this->dbLink->query("select ".$c." from ".$t." where id=1");
        $select = $this->dbLink->query("SHOW FULL COLUMNS from ".$t." WHERE Field='".$c."'");
        $meta= $select->fetchAll(PDO::FETCH_ASSOC);
        //$meta = $select->getColumnMeta(0);
        $this->log(1,"[".__METHOD__."] TYPE => ".$meta[0]['Type'] );
        $this->logMultidimensional(1,$meta,__METHOD__);
        return(self::parseColumnLength($meta[0]['Type']));
    }
    private function parseColumnLength($columnType)
    {
        $columnType=mb_strtolower($columnType);
       
        $l=0;
        switch($columnType)
        {
            case 'text':
                    $l=65535;
                    break;
            case (mb_substr($columnType, 0, 8)==='varchar('):
                    $l=intval(mb_substr($columnType, 8, 2));
                    break;
            case (mb_substr($columnType, 0, 4)==='int('):
                    /*
                     * TO BUILD
                     */
                    //$l=mb_substr($columnType, 4, 6);
                    
            default:
                    /*
                     * DEFAULT AS TEXT
                     */
                    $l=65535;
                break;
        }
        $this->log(1,"[".__METHOD__."] COLUMN MAX LENGTH => ".$l);
        return $l;
    }
    protected function checkExistInDb($tableName,$whereCondition,$valueToCheck)
    {
        $this->log(2,"[".__METHOD__."]]\n table => ".$tableName."\n where => ".$whereCondition."\n value => ".$valueToCheck);  
        if(trim($valueToCheck)!='')
        {
            return(count($this->query('SELECT * FROM '.$tableName.' WHERE '.$whereCondition,$valueToCheck)));
        }
        else
        {
            $this->setError(0,"NO VALUE TO CHECK");
            return(0);
        }
    }
    private function checkLibraryExists($library,$lvl)
    {
        if(extension_loaded($library))
	{
            $this->log(2,"[".__METHOD__."] Biblioteka ".$library." jest uwzględniona w konfiguracji PHP.");
            foreach($this->functionLibrary[$library] as $libraryId => $functionName)
            {
		$this->checkFunctionExists($library,$functionName,$lvl);
            }
	}
	else
	{
            $this->setError(2,"[ERROR][".__METHOD__."][$library] Biblioteka ".$library." nie jest uwzględniona w konfiguracji PHP.");	   
	}
    }
    private function checkFunctionExists($library,$function,$lvl)
    {
	if (function_exists($function))
	{
            $this->log(1,"[".__METHOD__."][".$library."] Funkcja ".$function." jest uwzględniona w konfiguracji PHP.");
	}
	else
	{
            $this->setError(2,"[ERROR][".__METHOD__."][".$library."] Funkcja $function NIE istnieje.");			
	}
    }
    private function checkHost() // check host port=array
    {
	$errno="";
	$errstr="";
	$timeout=4;
	try
	{
        	$connection = @fsockopen($this->Parm['host'],$this->Parm['port'],$errno,$errstr,$timeout);//
		if (is_resource($connection))
		{
                    $this->log(0,"[".__METHOD__."] ".getservbyport($this->Parm['port'], 'tcp')." jest otwarty."); 
                    fclose($connection);
		}
		else
		{
                    //echo mb_detect_encoding($errno, "UTF-8,ISO-8859-1");
                    //$enc=mb_detect_encoding($errstr, "UTF-8,ISO-8859-1");
                    //echo mb_detect_encoding($errstr, "UTF-8,ISO-8859-1,ISO-8859-2");
                    $errstr=iconv('cp1250', "UTF-8", $errstr);
                    $this->setError(0,"[ERROR][".__METHOD__."] Brak odpowiedzi ".$this->Parm['host'].":".$this->Parm['port']." [".$errno." - ".$errstr."].");
		}
	}
        catch (Exception $e)
	{
            echo $this->setError(0,"[ERROR][".__METHOD__."] ".$e->getMessage());
	}
    }
    public function getParm()
    {
	return $this->Parm;
    }
    private function showInfoConnect()
    {
	$tabInfoAction=array(
				" - host"," - name"," - port"," - user"," - password"," * log lvl info (default 0)",' - cipher true/false'
	);
	
        $this->log(0,"[".__METHOD__."] W konstruktorze należy podać :");
	foreach($tabInfoAction as $akcja => $opis)
	{
            $this->log(0,"[".__METHOD__."] $akcja => $opis");
	}
    }
    private function parseQueryResultType($t)
    {
        switch($t)
        {
            default:
            case 'FETCH_ASSOC':
                $this->pdoResult=PDO::FETCH_ASSOC;
                break;
            case 'FETCH_OBJ':
                $this->pdoResult=PDO::FETCH_OBJ;
                break;
        }
    }
    public function query($sqlAction="",$sqlValue="",$pdoResult='FETCH_ASSOC') // $pdoResult=PDO::FETCH_ASSOC
    {				
	$this->log(2,"[".__METHOD__."]");
        $this->log(2,$sqlAction);	
	if(!self::parseQueryAtr(get_defined_vars(),substr_count($sqlAction, '?'))) //$check
	{
            $this->setError(1,"[ERROR][".__METHOD__."] Nie uzupełniono wszystkich wymaganych pól.");	
            return 0;
        }
        self::parseQueryVal($sqlValue);
        self::parseQueryResultType($pdoResult);
	try
	{
            $query = $this->dbLink->prepare($sqlAction);
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            self::bindQuery($query);
            //$this->logMultidimensional(0,$this->sqlValueArr,__METHOD__);
            $finishQuery=$query->execute($this->sqlValueArr);
            $this->dbLink->commit();  //PHP 5 and new
            self::parseQueryAction($query,$sqlAction,$finishQuery);
            $this->clearSqlArray();
            return $this->returnValue;
            //return $finishQuery;
	}
	catch (PDOException $e)
	{
            $this->dbLink->rollback(); 
            $this->setError(1,"[ERROR][".__METHOD__."] Wystąpił błąd zapytania - $sqlAction  :</br>".$e->getMessage()); //
            return false;
	}			
    }
    private function parseQueryAction(&$query,$sql,$finish)
    {
        $action=strtoupper(substr(ltrim($sql),0,6));
        $this->log(2,"[".__METHOD__."] ACTION => ".$action);
        if($action==='SELECT')
        {
            $this->returnValue = $query->fetchAll($this->pdoResult); // $pdoResult
            //print_r($query->fetchAll($pdoResult));
        }
        else
        {
            $this->returnValue=$finish;
        }
    }
    private function parseQueryAtr($atr,$sqlKeyCount)
    {
        $this->log(2,"[".__METHOD__."]");
        $check=true;
        foreach($atr as $key =>$value)
	{
            if(is_array($value))
            {
		$arrayCount=count($value);				
		if($arrayCount===$sqlKeyCount)
		{
                    
		}
		else
		{
                    if($check) {$check=FALSE;}
                    break;
		}
            }
            else
            {
                if($this->clearData($value,0)!="")
                {
                    $this->log(2,"[".__METHOD__."][get_defined_vars] $key => $value");
                }
		/* $check=TRUE; */
		else
		{
                    if($check) {$check=FALSE;}
                    break;
		}
            }				
        }
        return $check;
    }
    private function bindQuery($query)
    {
        /*
         * PDO BIND VALUE START FROM 1
         */
        $this->log(2,"[".__METHOD__."]");
        $pdoType=PDO::PARAM_STR;
        for($i=1;$i<count($this->sqlValueArrBind)+1;$i++)
        {
            $this->log(2,"[for] ".$i." => ".$this->sqlValueArrBind[$i]);
            if(is_numeric($this->sqlValueArrBind[$i]))
            {
                $pdoType=PDO::PARAM_INT; //echo "is numeric $value - ".is_numeric($value)."</br>";
            }
            $query->bindValue($i,"'".$this->sqlValueArrBind[$i]."'",$pdoType);
            $pdoType=PDO::PARAM_STR;
        }
    }
    private function parseQueryVal($sqlValue)
    {
        /*
         * PDO BIND VALUE START FROM 1
         */
        $i=1;
        $this->log(2,"[".__METHOD__."]");
        $tmp=array();
        if(!is_array($sqlValue))
        {
            $tmp=explode(',',$sqlValue);
        }
        else
        {
            $tmp=$sqlValue;
        }
        //$this->logMultidimensional(0,$tmp,__METHOD__);
        foreach($tmp as $id => $val)
        {
            $this->log(2,"[VAL][$i][".$id."] => ".$val);
            self::parseDateValue($val);
            $this->sqlValueArrBind[$i]=$this->clearData($val,0);
            $this->sqlValueArr[$id]=$this->clearData($val,0);
            $i++;
        }
        //$this->logMultidimensional(0,$this->sqlValueArr,__METHOD__."::sqlValueArr");
        //$this->logMultidimensional(0,$this->sqlValueArrBind,__METHOD__."::sqlValueArrBind");
    }
    private function clearSqlArray()
    {
        $this->sqlValueArrBind=array();
        $this->sqlValueArr=array();
    }
    private function parseDateValue(&$v)
    {
        //$this->log(0,"[".__METHOD__."] $v");
        // WARUNEK DLA FUNKCJI NOW() - aktualna data i czas
        if(strpos($v,'NOW()')!==false) 
        {
            $v=str_replace('NOW()',$this->cDT,$v);
        }
    }
    public function queryLastId()
    {
	// default 0
	// dziala jezeli istnieje kolumna ID z auto icrement
	try
	{
            $stmt = $this->dbLink->query("SELECT LAST_INSERT_ID()");
            $lastId = $stmt->fetchColumn();
            return $lastId;
	}
	catch (PDOException $e)
	{
            $this->setError(1,"[ERROR][".__METHOD__."] Wystąpił błąd zapytania :</br>".$e->getMessage()); //
	}
    }
    public function queryReturnValue()
    {
        $this->log(0,"[".__METHOD__."]");
        try
        {
            return $this->returnValue;
        }
        catch (PDOException $e)
        {
            $this->setError(1,"[ERROR][".__METHOD__."] Wystąpił błąd zapytania :</br>".$e->getMessage()); //
        }
    }	
    private function clearData($data,$lvl=1)
    {
        //$this->log(0,"[".__METHOD__."]");
	$data=trim($data);		
	//echo "data |".$data."|<br/>";
	//$data=trim($data); // ltrim
	if($lvl==0 && $data!='')
	{
            $patterns = array('/\#/');
            //$patterns = array('/\//','/\#/'); // nie moze byc backslash '/\*/', -- select * from
            foreach($patterns as $value)
            {
		//echo $value."</br>";
		$data=preg_replace($value, '', $data);
            }
            $data=strip_tags($data);
            $data=htmlspecialchars($data, ENT_QUOTES);
            $this->log(2,"[".__METHOD__."] $data");
	}
	return $data;
    }
    function __destruct()
    {
        $this->log(2,"[".__METHOD__."]");
        $this->dbLink = null;	
    }
}

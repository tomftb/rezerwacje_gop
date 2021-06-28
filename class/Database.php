<?php
/*
	SINGLETON
*/
class Database extends PDO{
    private static $dbLink;
	private $pdoFetchAll=[
			'FETCH_ASSOC'=>PDO::FETCH_ASSOC,
			'FETCH_BOTH '=>PDO::FETCH_BOTH ,
			'FETCH_OBJ'=>PDO::FETCH_OBJ
		];
	private $pdoParam=[
		'BOOL'=>PDO::PARAM_BOOL, 	// Represents a boolean data type.
		'NULL'=>PDO::PARAM_NULL, 	// Represents the SQL NULL data type.
		'INT'=>PDO::PARAM_INT,		// Represents the SQL INTEGER data type.
		'STR'=>PDO::PARAM_STR,		// Represents the SQL CHAR, VARCHAR, or other string data type.
		'STR_NATL'=>PDO::PARAM_STR_NATL, // Flag to denote a string uses the national character set. Available since PHP 7.2.0
		'STR_CHAR'=>PDO::PARAM_STR_CHAR, // Flag to denote a string uses the regular character set. Available since PHP 7.2.0
		'LOB'=>PDO::PARAM_LOB,		// Represents the SQL large object data type.
		'STMT'=>PDO::PARAM_STMT,	// Represents a recordset type. Not currently supported by any drivers.
		'INPUT_OUTPUT'=>PDO::PARAM_INPUT_OUTPUT //  Specifies that the parameter is an INOUT parameter for a stored procedure. You must bitwise-OR this value with an explicit PDO::PARAM_* data type.
	];
    private function __construct($db){
		self::isPassCipher($db['pass'],$db['cipher']);
		parent::__construct("mysql:host=".$db['host'].";dbname=".$db['db'].";port=".$db['port'].";encoding=utf8",$db['user'],$db['pass']);
	}
	protected static function init($dbParm){
		if(!isset(self::$dbLink)){
			/* INITIALISED NEW OBJECT */
			self::$dbLink=new Database($dbParm);
			self::setLoadAtr(); 
			;
		}
		else{
			// ALREADY INITIALISED
		}
		return self::$dbLink;
	}
    private function setLoadAtr(){
		try{
            self::$dbLink->exec("set names utf8");
            self::$dbLink->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // parametr ,a nastepnie wartosc dla paraemtru // PDO::ERRMODE_EXCEPTION
            self::$dbLink->setAttribute( PDO::ATTR_EMULATE_PREPARES,true); // production set to - false
            self::$dbLink->setAttribute( PDO::ATTR_PERSISTENT, 0); // false
            //self::$dbLink->setAttribute( PDO::ATTR_AUTOCOMMIT,0);
		}
		catch (PDOException $e){
            throw New Exception(__METHOD__.$e,1);
		}			
    }
    private function isPassCipher(&$pass,$cipher='n'){
        /*
         * only base64
         */
        if($cipher==='y'){
            $pass=base64_decode($pass);
        }
    }
    public function squery($sth,$param=[],$result='FETCH_ASSOC'){ 
        $task=strtoupper(substr(trim($sth),0,6));
		$result=strtoupper(trim($result));
        try{
            self::$dbLink->sth = self::$dbLink->prepare($sth);
			array_walk($param,array($this,'pdoBindValue')); 
			self::$dbLink->sth->execute();
        }
        catch (PDOException $e){
			throw New Exception(__METHOD__.$e,1);
		}
        return(self::$dbLink->sth->fetchAll(self::parseResultType($result)));  
    }
	private function parseResultType($t){
		if(array_key_exists($t,$this->pdoFetchAll)){
			return $this->pdoFetchAll[$t];
		}
		/* RETURN DEFAULT => empty */
		return $this->pdoFetchAll['FETCH_ASSOC'];	
    }
    public function query($sql,$param=[]){
        self::$dbLink->sth = self::$dbLink->prepare($sql);
		array_walk($param,array($this,'pdoBindValue')); 
        self::$dbLink->sth->execute();
    }
    private function pdoBindValue($param,$key){
        /* 
			EXAMPLE:
			$sqlParm[':id']=['id','INT'];
        */
		if(!array_key_exists($param[1],$this->pdoParam)){
			throw New Exception(__METHOD__."WRONG PDO PARAMETER => ".$param[1],1);
		}
        self::$dbLink->sth->bindValue($key,$param[0],$this->pdoParam[$param[1]]);
    }
    function __destruct(){}
}

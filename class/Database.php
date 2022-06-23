<?php
/*
	SINGLETON
*/
class Database extends PDO{
    private static $dbLink;
    private $queryList=[];
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
		//'STR_NATL'=>PDO::PARAM_STR_NATL, // Flag to denote a string uses the national character set. Available since PHP 7.2.0
		//'STR_CHAR'=>PDO::PARAM_STR_CHAR, // Flag to denote a string uses the regular character set. Available since PHP 7.2.0
		'LOB'=>PDO::PARAM_LOB,		// Represents the SQL large object data type.
		'STMT'=>PDO::PARAM_STMT,	// Represents a recordset type. Not currently supported by any drivers.
		'INPUT_OUTPUT'=>PDO::PARAM_INPUT_OUTPUT //  Specifies that the parameter is an INOUT parameter for a stored procedure. You must bitwise-OR this value with an explicit PDO::PARAM_* data type.
	];
    public function __construct($db){
		self::isPassCipher($db['pass'],$db['cipher']);
		parent::__construct("mysql:host=".$db['host'].";dbname=".$db['db'].";port=".$db['port'].";encoding=utf8",$db['user'],$db['pass']);
    }
    protected static function init($dbParm){
		if(!isset(self::$dbLink)){
			/* INITIALISED NEW OBJECT */
			self::$dbLink=new Database($dbParm);
			self::setLoadAtr(); 
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
    public function squery($sth,$param=[],$result='FETCH_ASSOC',$fetch='fetchAll'){ 
        /*
         * PARAMETER MUST BY INSERTED WITHOUT CHAR => ' " IN STATEMATE TO PROPER BIND VALUE
         */
        self::checkParamIsArray($param);
        try{
            self::$dbLink->sth = self::$dbLink->prepare($sth);
            array_walk($param,array($this,'pdoBindParam')); 
            array_walk($param,array($this,'pdoBindValue')); 
            self::$dbLink->sth->execute();
        }
        catch (PDOException $e){
            throw New Exception(__METHOD__.$e,1);
	}
        return(self::$dbLink->sth->{$fetch}(self::parseResultType(strtoupper(trim($result)))));  
        //return(self::$dbLink->sth->fetchAll(self::parseResultType(strtoupper(trim($result)))));  
    }
    private function parseResultType($t){
		if(array_key_exists($t,$this->pdoFetchAll)){
			return $this->pdoFetchAll[$t];
		}
		/* RETURN DEFAULT => empty */
		return $this->pdoFetchAll['FETCH_ASSOC'];	
    }
    public function query($sql,$param=[]){
        try{
            self::$dbLink->sth = self::$dbLink->prepare($sql);
            self::checkParamIsArray($param);
            array_walk($param,array($this,'pdoBindValue')); 
            self::$dbLink->sth->execute();
        }
        catch (PDOException $e){
            throw New Exception(__METHOD__.$e."\r\n".$sql,1);
	}
    }
    public function query2($sql,$param=[]){
        self::$dbLink->sth = self::$dbLink->prepare($sql);
        self::checkParamIsArray($param);
        array_walk($param,array($this,'pdoBindValue')); 
        self::$dbLink->sth->execute();
    }
    private function pdoBindValue($param,$key){
        /* 
            EXAMPLE:
            $sqlParm[':id']=['id','INT'];
        */
	if(!array_key_exists($param[1],$this->pdoParam)){
            throw New Exception(__METHOD__."WRONG PDO VALUE => ".$param[1],1);
	}
       if(!self::$dbLink->sth->bindValue($key,$param[0],$this->pdoParam[$param[1]])){
             throw New Exception(__METHOD__."WRONG PDO BIND VALUE => ".$param[1],1);
       }
    }
    private function pdoBindParam($param,$key){
        if(!array_key_exists($param[1],$this->pdoParam)){
            throw New Exception(__METHOD__."WRONG PDO PARAMETER => ".$param[1],1);
	}
        if(!self::$dbLink->sth->bindParam($key,$param[0],$this->pdoParam[$param[1]])){
            throw New Exception(__METHOD__."WRONG PDO BIND PDO PARAMETER => ".$param[1],1);
        }
    }
    private function checkParamIsArray($param=[]){
        if(!is_array($param)){
            Throw New Exception('PDO::PARAM IS NOT ARRAY',1);
        }
        foreach($param as $k => $v){
            if(!is_array($v)){
                Throw New Exception('PDO::PARAM::'.$k.' VALUE IS NOT ARRAY',1);
            }
        }
    }
    public function checkMaxValuelength(string $field='',$value='',string $table='')
    {
        $v=mb_strlen($value);
        $f=self::getColumnTableLength($field,$table);
        if($v>$f){
            Throw New Exception('Field '.$field.' value too long. Max '.$f.' you introduced '.$v,0);
        }
    }
    private function getColumnTableLength($c,$t)
    {
        $meta= self::squery("SHOW FULL COLUMNS from ".$t." WHERE Field='".$c."'");
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
        return $l;
    }
    public function setQuery($q='',$p=[]){
        array_push($this->queryList,[$q,$p]);
    }
    public function runQuery(){
        array_map(function($arg){
                        self::query($arg[0],$arg[1]);
        },$this->queryList);
    }
    public function runTransaction(){
        //print_r($this->queryList);
        try{
            self::$dbLink->beginTransaction(); //PHP 5.1 and new
            self::runQuery();
            self::$dbLink->commit();  //PHP 5 and new
        }
        catch (PDOException $e){
            self::$dbLink->rollback(); 
            Throw New Exception("[".__METHOD__."] DATABASE ERROR: ".$e->getMessage(),1);
        }
        finally{
            $this->queryList=[];
        }
    }

    function __destruct(){}
}

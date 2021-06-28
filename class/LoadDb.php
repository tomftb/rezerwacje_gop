<?php
final class LoadDb extends Database{
    private function __construct(){}
	public static function load($database=''){
		$Log=Logger::init(__METHOD__);
		try {
            return parent::init(dbParm);
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x     
			//echo $t;
		//	throw New Exception($t,1);  
			$Log->logMulti(0,"[".__METHOD__."]".$t);
			return null;
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
		//	throw New Exception($e,1);  
			$Log->logMulti(0,"[".__METHOD__."]".$e);
			return null;
        }
		/* TO DO -> BUILD FOR MORE THAN ONE DATABASE */
	}
	function __destruct(){
        $this->log(2,"[".__METHOD__."]");
    }
}
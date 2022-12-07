<?php
/*
 * SINGLETON
 */
final class Logger{
    private static $logLink;
    private static $filename='';
    private static $logName='';
    private static $dir=APP_ROOT."/log";
    
    private function __construct($from){
        self::setLogName();
        self::open(); 
		self::log(0,'Logger construct => '.$from,__METHOD__);
    }
    public static function init($from=''){
		/* CHECK AND INITIALISE Logger (Singleton) CLASS */
		if(!isset(self::$logLink)){
			/* INITIALISED NEW OBJECT */
			self::$logLink=new Logger($from);
		}
		else{
			// ALREADY INITIALISED
			/* self::log(0,'Logger already initialised => init from => '.$from,__METHOD__); */
		}
		return self::$logLink;
	}
    public function log($l=0,$d='',$m=''){
        /*
         * l -> lvl of log
         * d -> data to write
         */
        $type=gettype($d);
        //fwrite(self::$filename, "[".date("Y.m.d H:i:s")."] TYPE ".$type.PHP_EOL);
        if($type==='array' || $type==='object'){
            self::logMultidimensional($l,$d,$m);
        }
        else if(LOG_LVL>=$l){
            fwrite(self::$filename, "[".date("Y.m.d H:i:s")."] ".$d.PHP_EOL);
        }
        else{}
    }
    private function open(){     
		self::$filename = fopen(self::$logName, "a") or die(__METHOD__."Unable to open file!");
    }
    public static function getLogLvl(){
        /* PHP .config CONST */
        return LOG_LVL;
        //return $this->log;
    }
    protected function setLogName(){
		self::setDir();
        self::$logName=self::$dir."/log-".date("Y-m-d").".php";
        //echo $this->logName;
    }
    public function logMulti($l,$data,$m=''){
        self::logMultidimensional($l,$data,$m);
    }
    public function logMultidimensional($l,$data,$m,$nLvl=0){
        /*
         * $l -> level of log
         * $data -> data to write
         * $m -> called method
         * $nLvl -> nesting lvl
         */
        if(is_array($data)){  
            self::log($l, "[${m}][$nLvl][A]");
            $nLvl++;
            self::logMultidimensionaA($l,$data,$m,$nLvl);
        }
        else if(is_object($data)){
            self::log($l, "[${m}][$nLvl][O]");
            $nLvl++;
            self::logMultidimensional($l,get_object_vars($data),$m,$nLvl);
        }
        else if(is_resource($data)){
            self::log($l, "[${m}][$nLvl][R]");
        }
        else{
            self::log($l, "[${m}][${nLvl}][V] ".$data);
        }
    }
    private function logMultidimensionaA($l,$data,$m,$nLvl){
        foreach($data as $k => $v){
            self::log($l, "[${m}][${nLvl}][K] ".$k);
            self::logMultidimensional($l,$v,$m,$nLvl);
        }
    }
	private function setDir(){
		if(!file_exists(self::$dir)){
			if(!is_dir(self::$dir)){
				mkdir(self::$dir);
			}
		}
	}
    private function __clone() { 
		throw new \Exception("Cannot clone a singleton.");
    }
    private function __wakeup(){
        throw new \Exception("Cannot unserialize a singleton.");
    }
    function __destruct(){
		fclose(self::$filename);
    }
}
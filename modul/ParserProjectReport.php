<?php
class ParserProjectReport{
	private static $Link;
    private $Log;
    private function __construct(){
        $this->Log=Logger::init(__METHOD__);
    }
	public static function init(){
		/* CHECK AND INITIALISE Logger (Singleton) CLASS */
		if(!isset(self::$Link)){
			/* INITIALISED NEW OBJECT */
			self::$Link=new ParserProjectReport();
		}
		else{
			// ALREADY INITIALISED
		}
		return self::$Link;
	}
	public function parseKeyValue($k,$v,&$reportData){
        if(preg_match('/^\d*\d+-n$/',$k) || preg_match('/^\d*\d+-t$/',$k)){
            $this->Log->log(2,"FOUND NUMBER / TITLE => ${k} => ${v}");
            $id=explode('-',$k);
            $reportData[$id[0]][$id[1]]=$v;//$id[1]
            return true;
        }
        if(preg_match('/^\d*\d+-\d*\d+-fileposition$/',$k) || preg_match('/^\d*\d+-\d*\d+-value/',$k)){
            $this->Log->log(2,"FOUND FILEPOSITION / VALUE => ${k} => ${v}");
            $id=explode('-',$k);
            $reportData[$id[0]]['d'][$id[1]][$id[2]]=$v;
            return true;
        }
        return false;
    }
	public function checkReportKeys($v){
        $this->Log->log(1,"[".__METHOD__."]");
        if(count($v)!==3){
            $this->Log->logMulti(2,$v,__METHOD__);
            throw New Exception('WRONG INPUT POST (TITLE,NUMBER,DATA)COUNT, WRONG KEYS NAME?',1);
        }
        foreach($v['d'] as $data){
            if(count($data)!==2){
                $this->Log->logMulti(2,$v['d'],__METHOD__);
                throw New Exception('WRONG INPUT FILEPOSITION/VALUE POST COUNT, WRONG KEYS NAME?',1); 
            }
        }
    }
    public function assignFileFromFiles($k,$v,&$reportData){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->log(0,"[".__METHOD__."]KEY => ${k}");
	$this->Log->log(0,"[".__METHOD__."]VALUE:");
        $this->Log->logMulti(0,$v);
	$fileId=explode('-',$k);
	if(preg_match('/^\d*\d+-\d*\d+-fileData/',$k) && isset($reportData[$fileId[0]]['d'][$fileId[1]])){
            $this->Log->log(0,"FOUND FILE AND reportData key Exist => ${k}");   
            //$reportData[$fileId[0]]['d'][$fileId[1]]=$v;
            $reportData[$fileId[0]]['d'][$fileId[1]]['fileName']=$v[0];
            $reportData[$fileId[0]]['d'][$fileId[1]]['fileData']=$v[1];
            $this->Log->logMulti(0,$reportData,'Report Data');
            $this->Log->logMulti(0,$reportData[$fileId[0]]['d'][$fileId[1]],'Report Data FILE');
            return true;
        }
	return false;
    }
	private function __clone() { 
		throw new \Exception("Cannot clone a singleton.");
	}
    private function __wakeup(){
        throw new \Exception("Cannot unserialize a singleton.");
    }

}
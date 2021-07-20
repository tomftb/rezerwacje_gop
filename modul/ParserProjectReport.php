<?php
class ParserProjectReport{
    private static $Link;
    private $Log;
    private $post=[];
    private $files=[];
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
        if(preg_match('/^\d*\d+-\d*\d+-fileposition$/',$k) || preg_match('/^\d*\d+-\d*\d+-value/',$k) || preg_match('/^\d*\d+-\d*\d+-actFileRemove/',$k)|| preg_match('/^\d*\d+-\d*\d+-actFile/',$k)){
            $this->Log->log(0,"FOUND FILEPOSITION / VALUE / ACTUALL FILE => ${k} => ${v}");
            $id=explode('-',$k);
            $reportData[$id[0]]['d'][$id[1]][$id[2]]=$v;
            return true;
        }
        return false;
    }
    public function checkReportKeys($v){
        $this->Log->log(1,"[".__METHOD__."]");
        if(count($v)!==3){
            $this->Log->logMulti(0,$v,__METHOD__);
            throw New Exception('WRONG INPUT POST (TITLE,NUMBER,DATA)COUNT, WRONG KEYS NAME?',1);
        }
        foreach($v['d'] as $data){
            $c=count($data);
            if($c<2 && $c>4){
                $this->Log->logMulti(0,$v['d'],__METHOD__);
                throw New Exception('WRONG INPUT FILEPOSITION/VALUE/ACTUALL-FILE/ACTUALL-REMOVE FILE POST COUNT ('.$c.'), WRONG KEYS NAME?',1); 
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
            $k=substr($k,0,-9);
            $tmpk=explode('-',$k);
            $k=$tmpk[1];
            $reportData[$fileId[0]]['d'][$fileId[1]]['fileId']=$k;
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
    public function parseDocImage($post=[],$files=[]){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $this->post=$post;
        $this->files=$files;
        $this->Log->logMulti(0,$post,'POST');
        $this->Log->logMulti(0,$files,'FILES');
        /* CLEAR ACTUALL POST FILES */
        array_walk($this->files,array('self','checkInsertedFiles')); 
        /* CLEAR POST FILES TO REMOVE */
        array_walk($this->post,['self','unsetPostFilesToRemove']);
        
        $this->Log->logMulti(0,$this->post,'POST 2');
        $this->Log->logMulti(0,$this->files,'FILES 2');
        /* ADD POST FILES TO FILES */
        array_walk($this->post,['self','addPostActFilesToFiles']);
        $this->Log->logMulti(0,$this->files,'FILES 3');
        //array_map(['self','addPostActFilesToFiles'],[$id[0].'-'.$id[1].'-actFile',$id[0].'-'.$id[1].'-actFileRemove']);
        //Throw New Exception (__LINE__.'TEST ERROR',0);
    }
    private function checkInsertedFiles($v,$k){
        $this->Log->log(0,"[".__METHOD__."] KEY => ".$k); 
        $id=explode('-',$k);
        $this->Log->log(0,"[".__METHOD__."] ID => ".$id[0].'-'.$id[1]); 
        $this->Log->logMulti(0,$v,'FILE');
        $this->Log->logMulti(0,$this->post,'POST');
        array_map(['self','unsetPostFiles'],[$id[0].'-'.$id[1].'-actFile',$id[0].'-'.$id[1].'-actFileRemove']);
    }
    private function unsetPostFiles($v){
        $this->Log->log(0,"[".__METHOD__."]KEY ${v} => UNSET");
        /* NO NEED TO CHECK => UNSET CAN REMOVE NOT EXIST KEY */
        UNSET($this->post[$v]);    
    }
    private function unsetPostFilesToRemove($v,$k){
        $this->Log->log(0,"[".__METHOD__."] KEY => ".$k);
        $id=explode('-',$k);
        if(!array_key_exists(2,$id)){
            /* KEY 2 NOT EXIST => EXIST */
            return false;
        }
        if($id[2]==='actFileRemove'){
            $this->Log->log(0,"[".__METHOD__."] KEY ${k} EXIST => UNSET KEY ".$id[0].'-'.$id[1].'-actFile AND '.$k);
            UNSET($this->post[$k]);
            UNSET($this->post[$id[0].'-'.$id[1].'-actFile']);
        }
    }
    private function addPostActFilesToFiles($v,$k){
        $this->Log->log(0,"[".__METHOD__."] KEY => ".$k);
        $id=explode('-',$k);
        if(!array_key_exists(2,$id)){
            /* KEY 2 NOT EXIST => EXIST */
            return false;
        }
        if($id[2]==='actFile'){
            $this->Log->log(0,"[".__METHOD__."] KEY ${k} EXIST => ADD KEY ".$id[0].'-'.$id[1].'-fileData');
            $this->files[$id[0].'-'.$id[1].'-fileData'][0]=APP_ROOT.UPLOAD_PROJECT_REPORT_IMG_DIR.$v;
            $this->files[$id[0].'-'.$id[1].'-fileData'][1]['name']='ActuallFile';
            UNSET($this->post[$k]);
        }
    }
    public function getPost(){
        return $this->post;
    }
    public function getFiles(){
        return $this->files;
    }
}
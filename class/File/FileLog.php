<?php
abstract class FileLog{
    private $logData='';
    private $logDataRN='';
    protected function log($m='',$d=''){
        /*
         * d -> data to write
         * m -> method
         */
        $type=gettype($d);
        //fwrite(self::$filename, "[".date("Y.m.d H:i:s")."] TYPE ".$type.PHP_EOL);
        if($type==='array' || $type==='object'){
            self::logMulti($d);
        }
        else{
            $this->logData.=$this->logDataRN."[".$m."] ".$d;
            $this->logDataRN="\r\n";
        }
    }
    private function logMulti($a,$lvl=0){
        $this->logData.="LVL: ".$lvl." ";
        foreach($a as $k => $v){
            if(is_array($v)){
                $this->logData.="ARRAY\r\n";
                $lvl++;
                self::logMulti($v,$lvl);
            }
            else if(is_object($v)){
                $this->logData.="OBJECT \r\n";
                $lvl++;
                self::logMulti(get_object_vars($v),$lvl);
            }
            else if(is_resource($v)){
                $this->logData.="RESOURCE \r\n";
            }
            else{
                $this->logData.=$this->logDataRN.$k." => ".$v."";
            }  
            $this->logDataRN="\r\n";
        }
    }
    public function getLog(){
        return ($this->logData);
    }
}
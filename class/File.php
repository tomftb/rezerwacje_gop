<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of file
 *
 * @author tborczynski
 */
class File {
    private $newFileName='';
    private $logData='';
    private $logDataRN='';
    private $errDataRN='';
    private $uploadDir='';
    private $acceptedFileExtension=array();
    private $maxFileSize=0;
    private $err='';
    private $files=array();
    private $url='';

    public function __construct(){
        self::log(__METHOD__);
    }
    public function setUrl($url){
        self::log(__METHOD__,$url);
        $this->url=$url;
    }
    public function setMaxFileSize($size){
        self::log(__METHOD__,$size);
        $this->maxFileSize=$size;
    }
    public function setAcceptedFileExtension($ext){
        self::log(__METHOD__);
        self::logMulti($ext);
        $this->acceptedFileExtension=$ext;
    }
    public function setNewFileName($fName){
        self::log(__METHOD__,$fName);
        $this->newFileName=$fName;   
        self::checkFileName();
    }
    public function setRandomFileName($prefix=''){
        self::log(__METHOD__,"prefix: ".$prefix);
        $this->newFileName=uniqid($prefix);
    }
    public function setUploadDir($dir){
        self::log(__METHOD__,'dir: '.$dir);
        $this->uploadDir=$dir;   
        self::checkUploadDir();
    }
    public function getLog(){
        return ($this->logData);
    }
    public function getFileName(){
        self::log(__METHOD__);
        return ($this->fileName);
    }
    public function getUploadFiles(){
        self::log(__METHOD__);
        return ($this->files);
    }
    public function getErr(){
        return ($this->err);
    }
    public function uploadFiles(){
        self::log(__METHOD__);
        if($this->err){ return array();}
        $n=0;
        try {
            self::log(__METHOD__,"FILES:");
            self::logMulti($_FILES);
            self::checkUploadDir();
            foreach($_FILES as $k => $f){
                self::setupFile($_FILES[$k],$k,$n);
                $n++;
            }
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x         
            self::setErr(__METHOD__,$t->getMessage());
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
            self::setErr(__METHOD__,$e->getMessage());
        } 
    }
    private function log($m='',$d=''){
        
        $this->logData.=$this->logDataRN."[".$m."] ".$d;
        $this->logDataRN="\r\n";
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
        }
    }
    private function setErr($m='',$err=''){
        $this->logData.="[".$m."] ".$err;
        $this->err.=$this->errDataRN.$err;
        $this->errDataRN="\r\n";
    }
    private function checkUploadDir(){
        self::log(__METHOD__);
        if($this->uploadDir==='' || !is_dir($this->uploadDir) || !file_exists($this->uploadDir) || !is_writable($this->uploadDir)){
            //self::setErr(__METHOD__,$this->uploadDir.' not a dir OR not exist OR not writable');
            Throw New Exception ("Upload dir:\r\n".$this->uploadDir."Error:\r\nempty OR not a dir OR not exist OR not writable",0);
            //return false;
        }
    }
    private function checkFileName(){
        self::log(__METHOD__);
    }
    private function checkFileSize($tmpFile){
        self::log(__METHOD__);
        if($tmpFile['size']>$this->maxFileSize){
            self::setErr('',$tmpFile['name']." - size limit exceeded");
            return false;
        }
        $this->maxFileSize-=$tmpFile['size'];
    }
    private function checkFileType($tmpFile){
        self::log(__METHOD__);
        if(!in_array($tmpFile['type'],$this->acceptedFileExtension)){
            self::setErr('',$tmpFile['name']." wrong file type → ".$tmpFile['type']);
        }
    }
    private function checkFile($tmpFile){
        
    }
    private function checkFilePresent($tmpFile){
        self::log(__METHOD__);
        if(intval($tmpFile['error'],10)===4){
                self::log('','NO FILE: err lvl => '.$tmpFile['error']);
                return false;
        }
        return true;
    }
    private function setupFile($tmpFile,$k,$n){
        self::log(__METHOD__);
        //if($this->err){ return false;}
        if(!self::checkFilePresent($tmpFile)){
            return false;
        }
        else{
            self::checkFileSize($tmpFile);
            self::checkFileType($tmpFile);
            self::moveFile($tmpFile,$k,$n);
        }   
    }
    private function moveFile($tmpFile,$k,$n){
        self::log(__METHOD__);
        if($this->err){ return false;}
        $ext=explode('.',$tmpFile["name"]);
        $newExt=strtolower(end($ext));
        $fullPath=$this->uploadDir.$this->newFileName.'_'.$n.'.'.$newExt;
        self::log(__METHOD__,"fullPath:\r\n".$fullPath);
        move_uploaded_file($tmpFile["tmp_name"],$fullPath);
        $this->files[$k]=[
                            $this->url.$this->newFileName.'_'.$n.'.'.$newExt,
                            $tmpFile
        ];
    }
    public function __destruct(){
        
    }
}

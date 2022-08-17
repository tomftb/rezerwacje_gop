<?php
/**
 * Description of file
 *
 * @author tborczynski
 */


class File extends FileLog {
    private $fileNamePrefix='';

    private $errDataRN='';
    private $uploadDir='';
    private $acceptedFileExtension=array();
    private $maxFileSize=0;
    private $err='';
    private $files=array();
    private $url='';

    public function __construct(){
        parent::log(__METHOD__);
    }
    public function setUrl($url){
        parent::log(__METHOD__,$url);
        $this->url=$url;
    }
    public function setMaxFileSize($size){
        parent::log(__METHOD__,$size);
        $this->maxFileSize=$size;
    }
    public function setAcceptedFileExtension($ext){
        parent::log(__METHOD__);
        parent::log('',$ext);
        $this->acceptedFileExtension=$ext;
    }
    public function setFileNamePrefix($prefix){
        parent::log(__METHOD__,$prefix);
        $this->fileNamePrefix=$prefix;   
    }
    public function setUploadDir($dir){
        parent::log(__METHOD__,'dir: '.$dir);
        $this->uploadDir=$dir;   
        self::checkUploadDir($dir);
    }
    public function getUploadDir(){
        return $this->uploadDir; 
    }
    public function getFileName(){
        parent::log(__METHOD__);
        return ($this->fileName);
    }
    public function getUploadFiles(){
        parent::log(__METHOD__);
        return ($this->files);
    }
    public function getErr(){
        return ($this->err);
    }
    public function uploadFiles(){
        parent::log(__METHOD__);
        if($this->err){ return array();}
        //$n=0;
        try {
            parent::log(__METHOD__,"FILES:");
            parent::log('',$_FILES);
            self::checkUploadDir($this->uploadDir);
            array_walk($_FILES,['self','setupFile']);
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x         
            self::setErr(__METHOD__,$t->getMessage());
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
            self::setErr(__METHOD__,$e->getMessage());
        } 
    }

    private function setErr($m='',$err=''){
        $this->logData.="[".$m."] ".$err;
        $this->err.=$this->errDataRN.$err;
        $this->errDataRN="\r\n";
    }
    public static function checkUploadDir($uploadDir){
        //parent::log(__METHOD__);
        if($uploadDir==='' || !is_dir($uploadDir) || !file_exists($uploadDir) || !is_writable($uploadDir)){
            //self::setErr(__METHOD__,$this->uploadDir.' not a dir OR not exist OR not writable');
            //Throw New Exception ("Upload dir Exception!",1);
            Throw New Exception ("Upload dir:\r\n".$uploadDir."Error:\r\nempty OR not a dir OR not exist OR not writable",1);
            //return false;
        }
    }
    public static function checkFile($file){
        if($file==='' || !file_exists($file) || !is_readable($file)){
            //self::setErr(__METHOD__,$this->uploadDir.' not a dir OR not exist OR not writable');
            //Throw New Exception ("Upload dir Exception!",1);
            Throw New Exception ("File:\r\n".$file."\r\nError:\r\nempty OR not exsits OR not readable",1);
            //return false;
        }
    }
    public static function checkNewFile($file){
        if($file==='' || file_exists($file)){
            //self::setErr(__METHOD__,$this->uploadDir.' not a dir OR not exist OR not writable');
            //Throw New Exception ("Upload dir Exception!",1);
            Throw New Exception ("File:\r\n".$file."\r\nError:\r\nempty OR exsits",1);
            //return false;
        }
    }
    private function checkFileSize($tmpFile){
        parent::log(__METHOD__);
        if($tmpFile['size']>$this->maxFileSize){
            self::setErr('',$tmpFile['name']." - size limit exceeded");
            return false;
        }
        $this->maxFileSize-=$tmpFile['size'];
    }
    private function checkFileType($tmpFile){
        parent::log(__METHOD__);
        if(!in_array($tmpFile['type'],$this->acceptedFileExtension)){
            self::setErr('',$tmpFile['name']." wrong file type → ".$tmpFile['type']);
        }
    }
    private function checkFilePresent($tmpFile){
        parent::log(__METHOD__);
        if(intval($tmpFile['error'],10)===4){
                parent::log('','NO FILE: err lvl => '.$tmpFile['error']);
                return false;
        }
        return true;
    }
    private function setupFile($tmpFile,$k){
        parent::log(__METHOD__);
        //if($this->err){ return false;}
        if(!self::checkFilePresent($tmpFile)){
            return false;
        }
        else{
            self::checkFileSize($tmpFile);
            self::checkFileType($tmpFile);
            self::moveNewFile($tmpFile,$k);
        }   
    }
    private function moveNewFile($tmpFile,$k){
        parent::log(__METHOD__);
        if($this->err){ return false;}
        $ext=explode('.',$tmpFile["name"]);
        $newExt=strtolower(end($ext));
        $fileName=uniqid($this->fileNamePrefix);
        $fullPath=$this->uploadDir.$fileName.'.'.$newExt;
        parent::log(__METHOD__,"fullPath:\r\n".$fullPath);
        move_uploaded_file($tmpFile["tmp_name"],$fullPath);
        $this->files[$k]=[
                            $this->url.$fileName.'.'.$newExt,//$this->url.$this->newFileName.'_'.$n.'.'.$newExt,
                            $tmpFile
        ];
    }
    public static function moveFile($from,$to,$file){
        self::checkFile($from);
        self::checkUploadDir($to);
        self::checkNewFile($to.$file);
        rename($from, $to.$file);
    }
    public static function deleteFile($file='',$key=0,$dir=''){
        File::checkFile($dir.$file);
        if(!unlink($dir.$file)){
            Throw New Exception ('['.$key.'] Cannot delete file '.$dir.$file,1); 
        }
    }
    public function __destruct(){}
}

<?php
final class showFile {
    private $dir='';
    private $fileName='';
    private $fileExt='';
    private $avaFileExt=[
        'jpeg'=>'image/jpg',
        'bmp'=>'image/bmp',
        'jpg'=>'image/jpg',
        'png'=>'image/png',
        'gif'=>'image/gif'
        ];
    
    //put your code here
    //public function __construct($dir='',$file=''){
    public function __construct(){}
    public function getFile($dir='',$file=''){
        self::setUpDir($dir);
        self::parseFile($file);
        self::setUpHeader();
    }
    private function setUpDir($dir){
        if(trim($dir)===''){
           die('NO DIR INPUT'); 
        }
        $this->dir=$dir;
    }
    private function parseFile($file=''){
        if($file===''){
           die('NO FILE INPUT'); 
        }
        $tmp=explode('.',$file);
        if(count($tmp)<2){
           die('NO FILE EXTENSION'); 
        }
        $this->fileName=$file;
        $this->fileExt=strtolower(end($tmp));
        
        if(!array_key_exists($this->fileExt, $this->avaFileExt)){
            die('WRONG FILE EXTENSION');
        }
    }
    private function setUpHeader(){
        $size = getimagesize("../".$this->dir."/".$this->fileName);
        $fp = fopen("../".$this->dir."/" . $this->fileName, 'rb');
        if ($size and $fp){
            header('Content-Type: '.$this->avaFileExt[$this->fileExt]);
            header('Content-Length: '.filesize("../".$this->dir."/" . $this->fileName));
            fpassthru($fp);
        }
        exit;
    }
}
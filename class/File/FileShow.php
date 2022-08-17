<?php
final class FileShow extends File{
    private static $dir='';
    private static $fileName='';
    private static $fileExt='';
    private static $avaFileExt=[
        'jpeg'=>'image/jpg',
        'bmp'=>'image/bmp',
        'jpg'=>'image/jpg',
        'png'=>'image/png',
        'gif'=>'image/gif'
        ];
    
    //put your code here
    //public function __construct($dir='',$file=''){
    public function __construct(){
        parent::__construct();
    }
    public static function getFile($dir='',$file=''){
        self::setUpDir($dir);
        self::parseFile($file);
        self::setUpHeader();
    }
    private function setUpDir($dir){
        if(trim($dir)===''){
           die('NO DIR INPUT'); 
        }
        File::checkUploadDir($dir);
        self::$dir=$dir;
    }
    private function parseFile($file=''){
        if($file===''){
           die('NO FILE INPUT'); 
        }
        $tmp=explode('.',$file);
        if(count($tmp)<2){
           die('NO FILE EXTENSION'); 
        }
        File::checkFile(self::$dir.$file);
        self::$fileName=$file;
        self::$fileExt=strtolower(end($tmp));
        
        if(!array_key_exists(self::$fileExt, self::$avaFileExt)){
            die('WRONG FILE EXTENSION');
        }
    }
    private function setUpHeader(){
        $size = getimagesize(self::$dir.self::$fileName);
        $fp = fopen(self::$dir. self::$fileName, 'rb');
        if ($size and $fp){
            header('Content-Type: '.self::$avaFileExt[self::$fileExt]);
            header('Content-Length: '.filesize(self::$dir. self::$fileName));
            fpassthru($fp);
        }
        exit;
    }
}
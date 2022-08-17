<?php

final class FileDownload{
    //put your code here
    private static $FileExtensionContentType=[
        'docx'=>'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'pdf'=>'application/pdf',
        'jpg'=>'image/jpeg',
        'jpeg'=>'image/jpeg',
        'bmp'=>'image/bmp',
        'gif'=>'image/gif',
        'png'=>'image/png'
    ];
    private function __construct(){}
    public static function getFile($dir,$file){
        
        self::setUpHeader(self::parseFile($dir,$file));
    }
    private function parseFile($dir='',$file=''){
        if(trim($file)===''){
           die('NO FILE INPUT'); 
        }
        $tmp=explode('.',$file);
        if(count($tmp)<2){
           die('NO FILE EXTENSION'); 
        }
        $ext=strtolower(end($tmp));
        if(!array_key_exists($ext, self::$FileExtensionContentType)){
            die('NOT AVAILABLE FILE EXTENSION'); 
        }
        self::checkFileExist($dir.$file);
        self::checkFileReadable($dir.$file);
        return [$dir,$file,self::$FileExtensionContentType[$ext]];
    }
    private function setUpHeader($file=[]){
        
        if(!$file[1] || !$file[0] || !$file[2]){
            var_dump($file);
            die('WRONG FILE'); 
        }       
        header('Content-Type: '.$file[2]);
        header('Content-Length: '.filesize($file[0].$file[1]));
        header("Content-Disposition:filename=\"".basename($file[1])."\"");

        //header("Content-Disposition:attachment;filename=\"".basename($file[1])."\"");
        readfile($file[0].$file[1]);
        //print file_get_contents($file[0].$file[1]);
         
    }
    private function checkFileExist($file){
        if(!file_exists($file)){
             die('FILE NOT EXIST'); 
        }
    }
    private function checkFileReadable($file){
        if(!is_readable($file)){
             die('FILE NOT READABLE'); 
        }
    }
}

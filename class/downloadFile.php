<?php

final class downloadFile{
    //put your code here
    private static $FileExtensionContentType=[
        'docx'=>['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'pdf'=>['application/pdf'],
        'jpg'=>['image/jpeg'],
        'jpeg'=>['image/jpeg'],
        'bmp'=>['image/bmp'],
        'gif'=>['image/gif'],
        'png'=>['image/png']
    ];
    private function __construct(){}
    public static function getFile($file){
        
        self::setUpHeader(self::parseFile($file));
    }
    private function parseFile($file=''){
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
        self::checkFileExist($file);
        self::checkFileReadable($file);
        return [$file,self::$FileExtensionContentType[$ext]];
    }
    private function setUpHeader($file=[]){
        
        if(!$file[1] || !$file[0]){
            var_dump($file);
            die('WRONG FILE'); 
        }
        header('Content-Type: '.$file[1]);
        header("Content-Disposition:attachment;filename=".$file[0]."");
        readfile($file[0]);
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

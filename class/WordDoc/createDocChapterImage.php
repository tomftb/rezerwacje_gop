<?php
namespace WordDoc;
trait createDocChapterImage {
    private $Log;
    private $imgNumber=0;
    //private $calculate='calculateImages';
    function __construct(){
        $this->Log=Logger::init(__METHOD__);
    }
    function calculateImages($row){
        $this->Log->log(0,"[".__METHOD__."]");
        
        foreach($row->image as $i){
            /* FOUND -> increase ++ and break */
            $this->imgNumber++;
            break;
        }
        $this->Log->log(0,$this->imgNumber);   
    }
    function setDescriptionNumber(&$row,$chapterValue=0){
        $this->Log->log(0,"[".__METHOD__."]");   
        //$this->imgNumber=1;
        $row->paragraph->property->value=preg_replace('/{IMG_DESCR_NUM}/','Ryc. '.strval($chapterValue).'-'.strval($this->imgNumber).'. ',$row->paragraph->property->value);
        self::calculateImages($row);
        //self::{$this->calculate}($row);
    }
    function resetImgNumber(){
        $this->imgNumber=0;
    }
}
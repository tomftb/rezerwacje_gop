<?php

namespace WordDoc;

final class createDocChapter{
    private $Log;
    private $phpWord;
    private $Parent;
    private $section=null;
    private $setChapterSection=['setChapterProperties','noPageBreak','noTabStop','noTabStop'];
    private $chapterName='';
    private $chapterFontName='';
    private $chapterParagraphName='';
    private $textRun=null;
    private $activeList='deactivatedListPosition';//  activatedListPosition
    public function __construct(&$Log,&$phpWord,$Parent){
        $this->Log=$Log;
        $this->Parent=$Parent;
        $this->phpWord=$phpWord;
    }
    public function __destruct(){
        
    }
    public function __call($name='',$arg=array()){
        Throw New \Exception("[".__METHOD__.'] Method '.$name.' not found!',1);
    }
    public function setReportStageChapterList($StageSection){
        $this->Log->log(0,"[".__METHOD__."]");//"[".__NAMESPACE__."]
        self::loopSection($StageSection);
        //self::{$this->setChapterSection[1]}();
    }
    private function setPageBreak(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->section->addPageBreak();
    }
    private function noPageBreak(){
        $this->Log->log(0,"[".__METHOD__."]");
    }
    private function loopSection($StageSection){
        self::loop($StageSection,'loopSubSection');
    }
    private function loopSubSection($s){
        self::loop($s->subsection,'loopRow');
    }
    private function loopRow($u){
        self::loop($u->subsectionrow,'chapter');
    }
    private function loop($data,$run){
        foreach($data as $v){
            self::{$run}($v);
        }
    }
    private function chapter($row){
        $this->Log->log(0,"[".__METHOD__."]");
        self::checkChapterProperty($row);
    }
    private function checkChapterProperty(&$row){
        $this->Log->log(0,"[".__METHOD__."]");
        $setChapter1=function(&$t){
            $this->Log->log(0,"[".__METHOD__."] CHAPTER = 1 => SET CHAPTER PROPERTIES");
            self::{$t->setChapterSection[0]}();
        };
        $setChapter0=function(&$t){
            $this->Log->log(0,"[".__METHOD__."] CHAPTER = 0");
        };
        try{
            if(!property_exists($row->list->property, 'chapter')){  
                return false;
            }
            $row->list->property->chapter=strval($row->list->property->chapter);
            if($row->list->property->chapter!=='1' && $row->list->property->chapter!=='0'){
                throw new \Exception ('Wrong chapter property value -> '.$row->list->property->chapter,1);
            }
            if(!property_exists($row->list->property, 'listLevel')){
                return false;
            }
            $row->list->property->chapterLevel=intval($row->list->property->chapterLevel);
            /* TO DO -> SET LIST LEVE RANGE FROM listLevelMin to listLevelMax */
            if(!in_array($row->list->property->chapterLevel,range(1, intval($row->list->property->chapterLevelMax)))){
                throw new \Exception ('Chapter list level out of range -> '.strval($row->list->property->chapterLevel).' max -> '.strval($row->list->property->chapterLevelMax),1);
            }
            ${'setChapter'.$row->list->property->chapter}($this);
            self::{'setChapterPosition'.$row->paragraph->property->valuenewline.$row->list->property->chapter}($row);
        }
        catch(Exception $e){
            $this->Log->log(0,$e);
        }
    }
    private function setChapterPosition11($row){
        $this->Log->log(0,"[".__METHOD__."] CHAPTER LIST START NEW POSITION:");
        /* ADD TAB STOP TO LAST TEXTRUN, BEFORE BEGIN NEW ONE CHAPTER*/
        self::{$this->setChapterSection[2]}();
        /* SET NEW LIST POSITION */
        $this->Log->log(0,$row->paragraph->property->value);
        $listItemRun = $this->section->addListItemRun($row->list->property->chapterLevel-1,$this->chapterName,$this->chapterParagraphName);
        $listItemRun->addText($row->paragraph->property->value,$this->chapterFontName); 
        $this->textRun = $listItemRun;
        /* SET ACTIVE LIST METHOD TO EXECUTE */
        $this->activeList='activatedListPosition';
        $this->setChapterSection[2]='insertRemaningTabStop';
        $this->setChapterSection[4]='insertRemaningTabStop';
    }
    private function setChapterPosition00($row){
        $this->Log->log(0,"[".__METHOD__."] CHAPTER LIST ADD TO POSITION");
         /* EXECUTE ACTIVE LIST METHOD => activatedListPosition/deactivatedListPosition */
        self::{$this->activeList}($row);
    }
    private function setChapterPosition01($row){
        $this->Log->log(0,"[".__METHOD__."] CHAPTER LIST ADD TO POSITION");
         /* EXECUTE ACTIVE LIST METHOD => activatedListPosition/deactivatedListPosition */
        self::{$this->activeList}($row);
    }
    private function setChapterPosition10($row){
        $this->Log->log(0,"[".__METHOD__."] NO CHAPTER POSITION => DEACTIVATE LIST");
        /* ADD LAST TAB STOP, DEPENDS oF ALREADY TAB STOP ACTION */
        self::{$this->setChapterSection[2]}();
        /* TURN OFF TAB STOP => ALREADY SETUP */
        $this->setChapterSection[2]='noTabStop';
        $this->setChapterSection[4]='noTabStop';
        /* SET ACTIVE LIST METHOD => deactivatedListPosition */
        $this->activeList='deactivatedListPosition';
    }    
    private function activatedListPosition($row){
        $this->Log->log(0,"[".__METHOD__."] ");
        $this->Log->log(0,$row->paragraph->property->value);
        $this->textRun->addText($row->paragraph->property->value,$this->chapterFontName);//,$this->chapterFontName
        $this->setChapterSection[4]='insertRemaningTabStop';
    }
    private function deactivatedListPosition(){
        $this->Log->log(0,"[".__METHOD__."] ");
        
    }
    private function setChapterProperties(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->setChapterSection[0]='chapterPropertiesDefined';
        $this->setChapterSection[1]='setPageBreak';
        $this->chapterName=uniqid('chapterlist_');
        $this->chapterFontName=uniqid('chapterfontstyle_');
        $this->chapterParagraphName=uniqid('chapterparagraph_');
        self::setChapterStyle();
        self::setChapterFontStyle();
        self::setChapterParagraphStyle();
        $this->section = $this->phpWord->addSection(
                    array(
                        'colsNum'   =>  1, //$cols
                        'breakType' => 'continuous', // nextPage, nextColumn, continuous, evenPage, oddPage
                        'colsSpace' => 2880  // 2880/$cols              
                    )
                );
        /* ADD TITLE */
        $this->section->addText("Spis treści", $this->chapterFontName);// TABULACJE => \t
    }
    private function chapterPropertiesDefined(){
        //$this->Log->log(0,"[".__METHOD__."]");
    }
    private function setChapterStyle(){
        //$this->Log->log(0,"[".__METHOD__."]");
        $this->phpWord->addNumberingStyle(
            $this->chapterName,
            array(
                'type'   => 'multilevel',
                'levels' => array(
                    /* 
                     * ('start'=>, 'format'=>, 'text'=>, 'alignment'=>, 'tabPos'=>, 'left'=>, 'hanging'=>, 'font'=>, 'hint'=>) hanging wysuniecie 
                     * hanging in left, left equal left - hanging
                     */
                    array('format' => 'decimal', 'text' => '%1.', 'left' => 360, 'hanging' => 360,'tabPos' => 360),//,'tabPos' => 360
                    array('format' => 'decimal', 'text' => '%1.%2.', 'left' => 1000, 'hanging' => 640,'tabPos' => 1000),//,'tabPos' => 1060
                    array('format' => 'decimal', 'text' => '%1.%2.%3.', 'left' => 1900, 'hanging' => 880,'tabPos' => 1900),//,'tabPos' => 900
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.', 'left' => 3120, 'hanging' => 1220,'tabPos' => 3120),//,'tabPos' => 1000
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.%5.', 'left' => 3620, 'hanging' => 1560,'tabPos' => 3620),//,'tabPos' => 1100
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.%5.%6.', 'left' => 4120, 'hanging' => 1900,'tabPos' => 4120),//,'tabPos' => 1200
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.%5.%6.%7.', 'left' => 4620, 'hanging' => 2240,'tabPos' => 4620),//,'tabPos' => 1300
                ),
            )
        );
    }
    private function setChapterFontStyle(){
        //$this->Log->log(0,"[".__METHOD__."]");
        $this->phpWord->addFontStyle($this->chapterFontName,[
            'name' => 'Arial',
            'size' => \PhpOffice\PhpWord\Shared\Converter::cssToPoint('10pt'),
            'color' => '#000000',//#000000
            //'bgColor' => '#999999',
            'bold' => false,
            'italic'=>false,
            'underline' => '',
            'strikethrough' => false
        ]);
    }
    private function setChapterParagraphStyle(){
        //$this->Log->log(0,"[".__METHOD__."]");
        $tabStop=[
            //new \PhpOffice\PhpWord\Style\Tab('left', 0,'none'),
            new \PhpOffice\PhpWord\Style\Tab('right', 8760,'dot')//15,45 cm
        ];
            
      
        $this->phpWord->addParagraphStyle($this->chapterParagraphName,
                [
                    'tabs'=>$tabStop,
                    'spaceAfter' => 95
                ]);
    }
    public function pageBreak(){
        /* execute or not page break */
        self::{$this->setChapterSection[1]}();
    }
    private function noTabStop(){
        $this->Log->log(0,"[".__METHOD__."]");
    }
    private function insertRemaningTabStop(){
        $this->Log->log(0,"[".__METHOD__."]");
         /* ADD TAB STOP WITH PAGE NUMBER */
        $this->textRun->addText("\t",$this->chapterFontName);//,$this->chapterFontName
    }
    public function lastTabStop(){
        $this->Log->log(0,"[".__METHOD__."]");
        /* LAST TAB STOP */
        self::{$this->setChapterSection[4]}();
    }
}
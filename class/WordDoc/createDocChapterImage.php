<?php
namespace WordDoc;
/*
 * trait can access to method where is used for
 */
trait createDocChapterImage {
    private $imgNumber=0;
    private $descriptionStatus='noDescription'; /* close */
    private $descriptionList=[];
    private $descriptionKey='';
    private $descriptionValue='';
    private $descriptionFontName='';
    private $descriptionParagraphName='';
    private $remainingTabStop='noDescriptionRemainingTabStop';
    private $row;
    private $chapterValue=0;

    function __construct(){
        //$this->Log=Logger::init(__METHOD__);
    }
    function calculateImages(){
        $this->Log->log(0,"[".__METHOD__."]");
        foreach($this->row->image as $i){
            /* FOUND -> increase ++ and break */
            $this->imgNumber++;
            break;
        }
        $this->Log->log(0,$this->imgNumber);   
    }
    function setDescriptionNumber(&$row,$chapterValue=0){
        $this->Log->log(0,"[".__METHOD__."]");   
        $this->descriptionValue=preg_replace('/{IMG_DESCR_NUM}/',"",$row->paragraph->property->value);
        $this->row=$row;
        $this->chapterValue=$chapterValue;
        self::{'setDescription'.$row->paragraph->property->valuenewline.strval(preg_match('/{IMG_DESCR_NUM}/i',$row->paragraph->property->value))}();
        self::{$this->descriptionStatus}();
        self::calculateImages();
    }
    function setDescription11(){
         $this->Log->log(0,"[".__METHOD__."] NEW LINE = 1, IMG_DESCR_NUM = 1");
         $this->descriptionKey='Ryc. '.strval($this->chapterValue).'-'.strval($this->imgNumber).'. ';
         /* ADD TAB STOP TO LAST TEXTRUN, BEFORE BEGIN NEW ONE CHAPTER*/
         $this->row->paragraph->property->value=preg_replace('/{IMG_DESCR_NUM}/',$this->descriptionKey,$this->row->paragraph->property->value);
         $this->descriptionStatus='addDescription';
         /* NEW DESCRIPTION LIST KEY */
         $this->descriptionList[$this->descriptionKey]=[];
         /* SET REMANING TAB STOP */
         $this->remainingTabStop='insertDescriptionRemainingTabStop';
    }
    function setDescription00(){
         $this->Log->log(0,"[".__METHOD__."] NEW LINE = 0, IMG_DESCR_NUM = 0");
    }
    function setDescription10(){
        $this->Log->log(0,"[".__METHOD__."] NEW LINE = 1, IMG_DESCR_NUM = 0");  
        $this->descriptionStatus='noDescription';
    }
    function setDescription01(){
        $this->Log->log(0,"[".__METHOD__."] NEW LINE = 0, IMG_DESCR_NUM = 1");  
        $this->row->paragraph->property->value=preg_replace('/{IMG_DESCR_NUM}/',$this->descriptionKey,$this->row->paragraph->property->value);
    }
    function addDescription(){
        $this->Log->log(0,"[".__METHOD__."] DESCRIPTION key => ".$this->descriptionKey);  
        $this->Log->log(0,"[".__METHOD__."] ".$this->row->paragraph->property->value);  
        /* DYNAMIC CREATE NEW PROEPRTY FOR CREATE IMAGE RESCRIPTION LIST => {IMG_DESCR_LIST} */
        array_push($this->descriptionList[$this->descriptionKey],["VALUE"=>$this->descriptionValue,"STYLE"=>$this->row->paragraph->style]);
    }
    function noDescription(){
        $this->Log->log(0,"[".__METHOD__."] DESCRIPTION key => ".$this->descriptionKey);
        self::{$this->remainingTabStop}();
        $this->remainingTabStop='noDescriptionRemainingTabStop';
    }
    function resetImgNumber(){
        $this->imgNumber=0;
    }
    function createImageDescriptionList(&$WordSection){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->log(0,$this->descriptionList);
        $this->descriptionFontName=uniqid('imagedescriptionfontstyle_');
        $this->descriptionParagraphName=uniqid('imagedescriptionparagraph_');
        //$paragraphStyleName = 'pImageDescriptionStyle';
        //$this->phpWord->addParagraphStyle($paragraphStyleName, ['spacing' => 100]);
        self::setImageDescriptionFontStyle();
        self::setImageDescriptionParagraphStyle();

         /* $WordSection->addText('Spis rycin',
                                    ['bold' => true, 'italic' => false, 'size' => \PhpOffice\PhpWord\Shared\Converter::cssToPoint('14pt'), 'allCaps' => false, 'doubleStrikethrough' => false],
                                    ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT]);
          
          */
         foreach($this->descriptionList as $lp => $value){
             $textrun = $WordSection->addTextRun($this->descriptionParagraphName);
             $textrun->addText($lp,$this->descriptionFontName);
             foreach($value as $item){
                 $textrun->addText($item['VALUE']);
                 //$textrun->addText("\t",$this->chapterFontName);//,$this->chapterFontName
             }
         }
    }
    private function setImageDescriptionFontStyle(){
        //$this->Log->log(0,"[".__METHOD__."]");
        $this->phpWord->addFontStyle($this->descriptionFontName,[
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
    private function setImageDescriptionParagraphStyle(){
        //$this->Log->log(0,"[".__METHOD__."]");
        $tabStop=[
            //new \PhpOffice\PhpWord\Style\Tab('left', 0,'none'),
             
            new \PhpOffice\PhpWord\Style\Tab('right', 8760,'dot')//15,45 cm
        ];
        $this->phpWord->addParagraphStyle($this->descriptionParagraphName,
                [
                    'tabs'=>$tabStop,
                    'spaceAfter' => 0,
                    'spaceBefore' => 0,
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT,
                    'spacing'=>120,
                    'spacingLineRule'=>'auto',
                    'hanging'=>\PhpOffice\PhpWord\Shared\Converter::cmToInch('3'),
                    'indent'=>\PhpOffice\PhpWord\Shared\Converter::cmToInch('3')
                ]);
    }
    private function insertDescriptionRemainingTabStop(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->log(0,$this->descriptionKey);
        $this->Log->log(0,$this->descriptionList);
        array_push($this->descriptionList[$this->descriptionKey],["VALUE"=>"\t","STYLE"=>$this->row->paragraph->style]);
    }
    private function noDescriptionRemainingTabStop(){
        $this->Log->log(0,"[".__METHOD__."]");
    }
}
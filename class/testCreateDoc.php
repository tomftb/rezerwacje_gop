<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of testCreateDoc
 *
 * @author tborczynski
 */
require('convertHtmlToArray.php');

class testCreateDoc {
    private $phpWord;
    private $attribute=array();
    private $word;/* Word 2007 OBJECT */
    private $fontStyle=array();
    private $paragraphStyle=array();
    private $mainSection;
    private $textRun;
    //put your code here
    public function __construct(){
        echo __METHOD__."\r\n";
        
       
        //var_dump($this->phpWord);
    }
    public function __destruct(){
        echo __METHOD__."\r\n";
    }
    private function setUpPhpWord(){
        require_once '../bootstrap.php';
        $settings=new \PhpOffice\PhpWord\Settings();
        $settings::setOutputEscapingEnabled(true);
        $this->phpWord = new \PhpOffice\PhpWord\PhpWord();
        $this->mainSection = $this->phpWord->addSection();
        $this->word = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
    }
    public function createProjectReport($text=''){
        echo __METHOD__."\r\n";
        
        $convert=new convertHtmlToArray();
        $convert->addHtml($text);
        $convert->createHtmlArray();
        if($convert->getError()){
            echo $convert->getError()."\r\n";
            return false;
        }
        
        self::setUpPhpWord();
        $this->textRun = $this->mainSection->addTextRun();
        array_map(array($this, 'writeElementReport'), $convert->getHtmlArray());
        
        $this->word->save("test_". uniqid().".docx");
    }
    private function writeElementReport($element){
        echo __METHOD__."\r\n";
        //print_r($element);
        
        $element['type']==='text' ? self::writeText($element['value']) : self::setTextAttribute($element); 
    }
    private function writeText($text=''){
        echo __METHOD__."\r\n".$text."\r\n";
        //$this->mainSection->addText($text,$this->fontStyle,$this->paragraphStyle);
        $this->textRun->addText($text,$this->fontStyle,$this->paragraphStyle);
    }
    private function setTextAttribute($element=array()){
        /*
         * tag = HTML otag/ctag => otag => open tag, ctag => close tag
         * attrbiute = HTML tag attribute
         */
       
        print_r();
        //self::setUpTag($tag);
        
        //self::setUpAttribute();
    }
    private function setUpTag($tag=''){
        echo __METHOD__."\r\n".$tag."\r\n";
        switch($tag){
            case 'p':
                break;
            case 'span':
                break;
            case 'ul':
                break;
            case 'i':
                break;
            case 'u':
                break;
            case 'b':
                break;
            case 'br':
                break;
            default:
                /* UNAVAILABLE TAG */
                break;
        }
    }
    private function setUpAttribute($attr=array()){
        
    }
}


//$testTekst='<<ul  style=" list-style-type: decimal;"><li>asdasda</li></ul>sdfdsfdsf<p></p>...';
$testTekst='<b>asdasda</b><u>sdfdsfdsf</u>';
$test=NEW testCreateDoc();
$test->createProjectReport($testTekst);
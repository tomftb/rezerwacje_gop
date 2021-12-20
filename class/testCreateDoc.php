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
    private $styleStack=array();
    //put your code here
    /*
     * SET UP FONT DEFAULT VALUES
     * color => #000000 (black)
     * size => 10
     * name => Arial
     */
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
        print_r($this->fontStyle);
        $this->textRun->addText($text,$this->fontStyle,$this->paragraphStyle);
        
    }
    private function setTextAttribute($element=array()){
        /*
         * tag = HTML otag/ctag => otag => open tag, ctag => close tag
         * attrbiute = HTML tag attribute
         */
       
        print_r($element);
        self::setUpTag($element['type'],$element['value'],$element['attribute']);
       
    }
    private function setUpTag($type='',$tag='',$attribute=array()){
        if($type==='otag'){
            self::setUpOpenTag($tag);
            self::setUpAttribute($tag,$attribute);
        }
        else if($type==='ctag'){
            self::setUpCloseTag($tag);
            self::setDownAttribute($tag);
        }
        else if($type==='octag'){
            self::setUpOpenCloseTag($tag);
        }
        else{
            /* UNAVAILABLE TAB*/
        }
    }
    private function setUpOpenTag($tag=''){
        echo __METHOD__."\r\n".$tag."\r\n";
        switch($tag){
            case 'P':
                break;
            case 'SPAN':
                break;
            case 'UL':
                break;
            case 'I':
                $this->fontStyle['italic']=true;
                break;
            case 'U':
                $this->fontStyle['underline']='single';
                break;
            case 'B':
                $this->fontStyle['bold']=true;
                break;
            case 'BR':
                break;
            default:
                /* UNAVAILABLE TAG */
                break;
        }
    }
    private function setUpCloseTag($tag=''){
        echo __METHOD__."\r\n".$tag."\r\n";
        switch($tag){
            case 'P':
                break;
            case 'SPAN':
                break;
            case 'UL':
                break;
            case 'I':
                //UNSET($this->fontStyle['underline']);
                $this->fontStyle['italic']=false;
                break;
            case 'U':
                //$this->fontStyle['underline']='single';
                UNSET($this->fontStyle['underline']);
                break;
            case 'B':
                $this->fontStyle['bold']=false;
                break;
            case 'BR':
                break;
            default:
                /* UNAVAILABLE TAG */
                break;
        }
    }
    private function setUpOpenCloseTag($tag=''){
        echo __METHOD__."\r\n".$tag."\r\n";
    }
    private function setUpAttribute($tag='',$attr=array()){
        echo __METHOD__." => ${tag}\r\n";
        if(count($attr)>0){
            /* CREATE STYLE STACK */
            echo __METHOD__."\r\nCREATE STACK FOR => ".$tag."\r\n";
            array_push($this->styleStack,array('tag'=>$tag,'attr'=>$attr));
            print_r($this->styleStack);
        }
        foreach($attr as $a){
            switch($a['property']){
                case 'FONT-SIZE':
                    $this->fontStyle['size']=$a['value'];
                    break;
                case 'COLOR':
                    $this->fontStyle['color']=$a['value'];
                    break;
                case 'FONT-FAMILY':
                    $this->fontStyle['name']=$a['value'];
                    break;
                case 'FONT-WEIGHT':
                    /* bold / normal */
                    //$this->fontStyle['bold']=true;
                    break;
                case 'BACKGROUND-COLOR':
                    //$this->fontStyle['fgColor']=$a['value'];
                    break; 
                case 'TEXT-ALIGN':
                    //$this->fontStyle['fgColor']=$a['value'];
                    break;
                default:
                    /* UNAVAILABLE TAG */
                    break;
            }
            
        }
    }
    private function setDownAttribute($tag=''){
        echo __METHOD__." => ${tag}\r\n";
        /* LOOP FROM END */
        $key=0;
        $tmpAttr=array();
        $found=false;
        $foundKey=0;
        $tmpStyleStack=array();
        $foundI=0;
        $foundIdKey=0;
        $foundId=false;
        $foundIdNumber=0;
        for($i=count($this->styleStack);$i>0;$i--){
            /* 
             * FIND LAST TAG
             * IF FOUND
             * GET LAST TAG ATTRIBUTE
             * OMMIT WRTIE TO NEW ARRAY
             */
            $key=$i-1;
            echo "[ID:".$i."]\r\n";
            echo "[KEY:".$key."]\r\n";
            echo "[TAG:".$this->styleStack[$key]['tag']."]\r\n";
            /* IF FOUND FIRST occurrence => NO MORE RMEOVE */
            // if($tag===$this->styleStack[$key]['tag']){
            if($tag===$this->styleStack[$key]['tag'] && $found===false){
                
                echo "FOUND TAG\r\n";
                $tmpAttr=$this->styleStack[$key]['attr'];
                $found=true;
                $foundKey=$key;
                //$foundI=$i;
                $foundI=$i;
                continue;
            }
            array_push($tmpStyleStack,$this->styleStack[$key]);
        }
        /* NOT FOUND => RETURN */
        if(!$found){ return false;}
        
        
        echo "[FOUND] KEY:".$foundKey." - TAG:".$tag."\r\n";
        print_r($tmpAttr);
        
        if($foundKey>0){
            /* CHECK KEYS BEFORE */
            echo "[FOUND] KEY GREATER THAN 0 => CHECK KEYS BEFORE\r\n";
            
            for($i=count($this->styleStack)-1;$i>0;$i--){
                $key=$i-1;
                /* 
                 * FIND LAST TAG
                 * IF FOUND
                 * GET LAST TAG ATTRIBUTE
                 * OMMIT WRTIE TO NEW ARRAY
                 */
                //$key=$i-1;
                echo "[ID:".$i."]\r\n";
                echo "[KEY:".$key."]\r\n";
                echo "[TAG:".$this->styleStack[$key]['tag']."]\r\n";
                //print_r($this->styleStack[$key]['attr']);
                /* CHECK ONLY ATTRIBUTE FROM TMP */
                foreach($this->styleStack[$key]['attr'] as $attr){
                    echo $attr['property']." - ".$attr['value']."\r\n";
                    /* LOOP OVER TMP ATTRIBUTE */
                    foreach($tmpAttr as $id => $attr2){
                        if($attr2['property'] === $attr['property']){
                            echo "[ID:$id]TMP ARRAY FOUND BEFORE ATTRIBUTE => ".$attr2['property']."\r\n";
                            $foundId=true;
                            $foundIdNumber=$id;
                            switch($attr['property']){
                                case 'FONT-SIZE':
                                    $this->fontStyle['size']=$attr['value']; /* DEFAULT */
                                    break;
                                case 'FONT-FAMILY':
                                    $this->fontStyle['name']=$attr['value']; /* DEFAULT */
                                    break;
                                case 'COLOR':
                                    $this->fontStyle['color']=$attr['value']; /* DEFAULT */
                                    break;
                                default:
                                    /* UNAVAILABLE STYLE ATTRIBUTE */
                                    break;
                            }
                            break;
                        }
                    }
                    if($foundId){ UNSET($tmpAttr[$foundIdNumber]); };
                }
                /* FOR ALL NOT FOUND => SET DEFAULT */
                self::setDefaultAttribute($tmpAttr);
            }
            //die(__LINE__);
        }
        else{
           //echo "FKEY EQUAL 0\r\n";
            /* IF FIRST ELEMENT => SET DEFAULT FOR ALL ATTRIBUTES */
            self::setDefaultAttribute($tmpAttr);
        }
        /* REWRITE FOR NEW ARRAY WITHOUT FOUND ELEMENT */  
            $this->styleStack=$tmpStyleStack;
            return true; 
    }
    private function setDefaultAttribute($tmpAttr){
        echo __METHOD__."\r\n";
        foreach($tmpAttr as $attr){
                switch($attr['property']){
                    case 'FONT-SIZE':
                        UNSET($this->fontStyle['size']);
                        //$this->fontStyle['size']=10; /* DEFAULT */
                        break;
                    case 'FONT-FAMILY':
                        UNSET($this->fontStyle['name']);
                        //$this->fontStyle['name']='Arial'; /* DEFAULT */
                        break;
                    case 'COLOR':
                        UNSET($this->fontStyle['color']);
                        //$this->fontStyle['color']='#000000'; /* DEFAULT */
                        break;
                    default:
                        /* UNAVAILABLE STYLE ATTRIBUTE */
                        break;
                }
            } 
    }
}


//$testTekst='<<ul  style=" list-style-type: decimal;"><li>asdasda</li></ul>sdfdsfdsf<p></p>...';
$testTekst='<p style="font-size:24;font-family:Lato;"> SIZE 24 <p style="font-size:18">SIZE 18 <p style="font-size:16">SIZE 16 </p><b style="font-size:14;FONT-FAMILY:Tahoma;">BOLD TEXT - asdasda</b><b style="font-size:13;FONT-FAMILY:Tahoma;">BOLD TEXT 2 - asdasda</b><b style="font-size:16;FONT-FAMILY:Tahoma;">BOLD TEXT 3 - asdasda</b><u style="color:#ff0000;"> UNDERLINE TEXT - sdfdsfdsf</u><i>1 italic text 4</i><p> Normal text </p> SIZE 18 </p> SIEZE 24 </p>';
$test=NEW testCreateDoc();
$test->createProjectReport($testTekst);
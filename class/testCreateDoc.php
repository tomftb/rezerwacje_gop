<?php

require('convertHtmlToArray.php');

class testCreateDoc {
    private $phpWord;
    private $attribute=array();
    private $word;/* Word 2007 OBJECT */
	/* ACTUALL FONT STYLE */
    private $ActFontStyle=array();
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
	print_r($convert->getHtmlArray());
	//die(__LINE__."\r\n");
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
        $element['type']==='text' ? self::writeText($element['tag']) : self::checkTag($element['type'],$element['tag'],$element['style']); 
    }
    private function writeText($text=''){
        echo __METHOD__."()\r\n".$text."\r\n";
        //die("DIE:".__LINE__."\r\n");
        //$this->mainSection->addText($text,$this->ActFontStyle,$this->paragraphStyle);
		echo "CURRENT FONT STYLE FOR TEXT:\r\n";
        print_r($this->ActFontStyle);
        $this->textRun->addText($text,$this->ActFontStyle,$this->paragraphStyle);
    }
    private function checkTag($type='',$tag='',$attribute=array()){
         echo __METHOD__."\r\nTYPE => ".$type."\r\nTAG => ".$tag."\r\n";
         /*
         * tag = HTML otag/ctag => otag => open tag, ctag => close tag
         * attrbiute = HTML tag attribute
         */
        if($type==='otag'){
            self::setOpenTag($tag);
            self::setOpenAttribute($tag,$attribute);
        }
        else if($type==='ctag'){
            self::setCloseTag($tag);
            self::setCloseAttribute($tag);
        }
        else if($type==='octag'){
            self::setOpenCloseTag($tag);
        }
        else{
            /* UNAVAILABLE TAB*/
        }
    }
    private function setOpenTag($tag=''){
        echo __METHOD__."\r\n".$tag."\r\n";
        switch($tag){
            case 'P':
                break;
            case 'SPAN':
                break;
            case 'UL':
                break;
            case 'I':
                $this->ActFontStyle['italic']=true;
                break;
            case 'U':
                $this->ActFontStyle['underline']='single';
                break;
            case 'B':
                $this->ActFontStyle['bold']=true;
                break;
            default:
                /* UNAVAILABLE TAG */
                break;
        }
    }
    private function setCloseTag($tag=''){
        echo __METHOD__."\r\n".$tag."\r\n";
        switch($tag){
            case 'P':
				/* ADD BREAK LINE */
				$this->textRun->addTextBreak();
                break;
            case 'SPAN':
                break;
            case 'UL':
                break;
            case 'I':
                //UNSET($this->ActFontStyle['underline']);
                $this->ActFontStyle['italic']=false;
                break;
            case 'U':
                //$this->fontStyle['underline']='single';
                UNSET($this->ActFontStyle['underline']);
                break;
            case 'B':
                $this->ActFontStyle['bold']=false;
                break;
           
            default:
                /* UNAVAILABLE TAG */
                break;
        }
    }
    private function setOpenCloseTag($tag=''){
        echo __METHOD__."\r\n".$tag."\r\n";
        switch($tag){
            case 'BR':
		/* ADD BREAK LINE */
		$this->textRun->addTextBreak();
            break;
            default:
                /* UNAVAILABLE TAG */
                break;
        }
    }
    private function setOpenAttribute($tag='',$attr=array()){
        echo __METHOD__." => ${tag}\r\n";
		/* TAG ADD TO STACK */
        //if(count($attr)===0){ return false; }
        /* ADD TO STYLE STACK */
        echo "ADD TO STACK => ".$tag."\r\n";
        array_push($this->styleStack,array('tag'=>$tag,'attr'=>$attr));
		echo "CURRENT STACK:\r\n";
        print_r($this->styleStack);
		self::updateActFontStyle($attr);	
    }
	private function updateActFontStyle($attr=array()){
		echo __METHOD__."\r\n";
		foreach($attr as $a){
			switch($a['property']){
				case 'FONT-SIZE':
					$this->ActFontStyle['size']=$a['tag'];
					break;
				case 'COLOR':
					$this->ActFontStyle['color']=$a['tag'];
					break;
				case 'FONT-FAMILY':
					$this->ActFontStyle['name']=$a['tag'];
					break;
				case 'FONT-WEIGHT':
					/* bold / normal */
					//$this->ActFontStyle['bold']=true;
					break;
				case 'BACKGROUND-COLOR':
					//$this->ActFontStyle['fgColor']=$a['tag'];
					break; 
				case 'TEXT-ALIGN':
					//$this->ActFontStyle['fgColor']=$a['tag'];
					break;
				default:
					/* UNAVAILABLE TAG */
					break;
			}
        }
	}
    private function setCloseAttribute($tag=''){
        echo __METHOD__." => ${tag}\r\n";
		/* 
		THERE IS TWO OPTIONS:
		- check with last stack element -> if not equal -> thrown ERRO -> MUST BECAUSE FOR EXMAPLE <b><table><tr></td></b> ... IS POSSIBLE!!!
		- check is there exist open tag equal close tak -> if not exists -> thrown error
		*/
		
		self::checkLastStyleStackElement($tag);
		self::updateStyleStack(self::findLastOpenTag($tag));
		/* UPDATE CURRENT FONT STYLE => TAG AND ATTRIBUTE */
		self::updateCurrentFontStyle();
		
		//die(__LINE__);
		return true; 
    }
	private function checkLastStyleStackElement($tag=''){
		echo __METHOD__."\r\n";
		$last='';
		print_r(end($this->styleStack));
		if(count($this->styleStack)===0){
			echo "STACK IS EMPTY - THROWN ERROR\r\n";
			die(__LINE__);
		}
		$last=end($this->styleStack)['tag'];
		if($last!==$tag){
			echo "LAST STACK ELEMENT ".$last." NOT EQUAL CLOSE TAG ".$tag." => THROWN ERROR\r\n";
			die(__LINE__);
		}
		else{
			echo "LAST STACK ELEMENT ".$last." EQUAL CURRENT CLOSE TAG ".$tag."\r\n";
			
			
			return true;
		}
	}
	private function findLastOpenTag($tag=''){
		echo __METHOD__."\r\n";
		$key=0;
		if(count($this->styleStack)===0){
			echo "STACK IS EMPTY - THROWN ERROR\r\n";
			die(__LINE__);
		}
		/* LOOP FROM END */
		for($i=count($this->styleStack);$i>0;$i--){
            /* 
             * FIND LAST TAG
             * IF FOUND
             * GET LAST TAG ATTRIBUTE
             * OMMIT WRTIE TO NEW ARRAY
             */
            $key=$i-1;
            echo "[KEY:".$key."]\r\n";
            echo "[TAG:".$this->styleStack[$key]['tag']."]\r\n";
			echo "[ATTR]\r\n";
			print_r($this->styleStack[$key]['attr']);
			if($this->styleStack[$key]['tag']===$tag){
				echo "FOUND OPEN TAG => RETURN STYLE STACK KEY => ".$key."\r\n";
				return $key;
			}
        }
		return -1;
	}
	private function updateStyleStack($key=-1){
		echo __METHOD__."\r\nKEY TO REMOVE => ".$key."\r\n";
		$tmpStyleStack=array();
		if($key===-1){
			/* KEY NOT FOUND -> THROWN ERROR */
			die(__LINE__);
		}
		foreach($this->styleStack as $k => $v){
			echo "K:".$k."\r\n";
			print_r($v['attr']);
			if($k!==$key){
				array_push($tmpStyleStack,$v);
			}
		}
		//echo "NEW STYLE STACK:\r\n";
		//print_r($tmpStyleStack);
		/* UPDATE CURRENT STYLE STACK */
		$this->styleStack=$tmpStyleStack;
		echo "UPDATED STYLE STACK:\r\n";
		print_r($this->styleStack);
		
		
	}
	private function updateCurrentFontStyle(){
		/* CLEAR */
		$this->ActFontStyle=array();
		//$ActFontStyle=array();
		foreach($this->styleStack as $k => $v){
			echo "K:".$k."\r\n";
			print_r($v['attr']);
			self::setOpenTag($v['tag']);
			self::updateActFontStyle($v['attr']);	
		}
		echo "CURRENT FONT STYLE:\r\n";
		print_r($this->ActFontStyle);
	}
    private function setDefaultAttribute($tmpAttr){
        echo __METHOD__."\r\n";
        foreach($tmpAttr as $attr){
                switch($attr['property']){
                    case 'FONT-SIZE':
                        UNSET($this->ActFontStyle['size']);
                        //$this->fontStyle['size']=10; /* DEFAULT */
                        break;
                    case 'FONT-FAMILY':
                        UNSET($this->ActFontStyle['name']);
                        //$this->fontStyle['name']='Arial'; /* DEFAULT */
                        break;
                    case 'COLOR':
                        UNSET($this->ActFontStyle['color']);
                        //$this->fontStyle['color']='#000000'; /* DEFAULT */
                        break;
                    default:
                        /* UNAVAILABLE STYLE ATTRIBUTE */
                        break;
                }
            } 
    }
}
$testTekst='ALA MA KOTA';
//$testTekst='<p style="font-size:24;font-family:Lato;">P-TEXT<br/></p><img style="margin-left:10px;" src="asdasd.jpg"/>';
//$testTekst='<<ul  style=" list-style-type: decimal;"><li>asdasda</li></ul>sdfdsfdsf<p></p>...';
//$testTekst='<p style="font-size:24;font-family:Lato;"><br/><br/> SIZE 24 <p style="font-size:18">SIZE 18 <p style="font-size:16">SIZE 16 </p><b style="font-size:14;FONT-FAMILY:Tahoma;">BOLD TEXT - asdasda</b><b style="font-size:13;FONT-FAMILY:Tahoma;">BOLD TEXT 2 - asdasda</b><b style="font-size:16;FONT-FAMILY:Tahoma;">BOLD TEXT 3 - asdasda</b><u style="color:#ff0000;"> UNDERLINE TEXT - sdfdsfdsf</u><i>1 italic text 4</i><p> Normal text </p> SIZE 18 </p> SIEZE 24 </p>';
//$testTekst='<p style="font-size:44;font-family:Lato;"> 44 <p style="font-size:24"> 24 <p style="font-size:16"> 16 </p><b style="font-size:14;FONT-FAMILY:Tahoma;"> BOLD 14 </b><b style="font-size:13;FONT-FAMILY:Tahoma;"> BOLD 13 </b><b style="font-size:16;FONT-FAMILY:Tahoma;"> BOLD 16 </b><u style="color:#ff0000;"> UNDERLINE 24</u><i> italic 24 </i><p> P 24 </p> 24 </p> 44 </p>';
/*
$testTekst='<p style="font-size:44;font-family:Lato;"> 44'
				.'<p style="font-size:24"> 24 '
					.'<p style="font-size:16"> 16 </p>'
					.'<u style="color:#ff0000;"> UNDERLINE 24</u>'
					.'<i> italic 24 </i>'
					.'<p> P 24 </p>'
					.'24'
				.'</p>'
				.'44'
			.'</p>';
*/
$test=NEW testCreateDoc();
$test->createProjectReport($testTekst);
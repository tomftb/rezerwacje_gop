<?php


final class convertHtmlToArray{
	private $logData='';
        private $elementStack=array();
        private $html='';
        //private $unavailableTags=['script'];
	
	public function __construct(){}
	public function __destruct(){}
	
	public function addHtml($h=''){
            self::log('',"[".__METHOD__."]");
            $this->html=$h;
            /* clear err/log */
            $this->err='';
            $this->logData='';
            /* clear htmlArrray() */
            $this->htmlArray=[];
            /* clear HTML ARRAY STACk */
            self::clearElementStack();
	}
	public function getHtmlArray(){
            //if($this->err){ return []; }
            self::log("FINALLY TEXT:","[".__METHOD__."]");
            self::logA($this->elementStack,"[".__METHOD__."]");
            return $this->elementStack;
	}
        public function clearElementStack(){
            $this->elementStack=array();
        }
	public function createHtmlArray(){
     
        $part='';
        $openTagChar=false;
        $closeTagChar=false;
        $currentChar='';
        $element='';
        self::log("ORIGINAL TEXT: \n".$this->html,"[".__METHOD__."]");
		//self::clearWhiteCharacters();
		//self::swapHtmlTags();
 		
		for($i=0;$i<mb_strlen($this->html,'UTF-8');$i++){
			$part=mb_substr($this->html,$i,mb_strlen($this->html,'UTF-8')-$i,'UTF-8');
            $currentChar=mb_substr($part,0,1,'UTF-8');
            //self::log("[${tagCount}]PART: ".$part,"[".__METHOD__."]");
            //self::log("[${tagCount}]CHAR: ".$currentChar,"[".__METHOD__."]");
			self::checkOpenChar($currentChar,$openTagChar,$element);
            self::checkCloseChar($currentChar,$closeTagChar);
            self::setupElement($openTagChar,$closeTagChar,$element,$currentChar);   
		}
        /* CHECK IS NOTHING LEFT, IF LEFT ADD AS ELEMENT */
        self::addElementToStack($element);
        /* CHECK FOR PROPER HTML OPEN - CLOSE */
        self::checkOpenCloseTag();    
	}
        private function checkOpenCloseTag(){
            self::log("","[".__METHOD__."]");
            $openStack=array();
            /* CHANGE TO FIX WRoNG NEST ORDER OF HTML TAG, CHANGE PUSH TO OVERWRITE */
            //$closeStack=array();
            $closeStack=array('tag'=>'','order'=>0);
            $copen=0;
            $actTag='';
            $close=array();
            $cClose=0;
            $lOpen=array();
            $lClose=array();
            //self::log("FINALLY ELEMENTS STACK","[".__METHOD__."]");
                //print_r($this->elementStack);
                foreach($this->elementStack as $key => $value){
                    self::log("[".$key."]:\r\nTYPE:".$value['type']."\r\nTAG:".$value['tag'],'');
                    
                    if(array_key_exists('style', $value)){
                        if(count($value['style'])>0){
                            self::log("ATTRIBUTE:",''); 
                            foreach($value['style'] as $atr){
                                //self::log("PROPERTY:".$atr['property'],'');     
                                //self::log("VALUE:".$atr['tag'],'');
                            } 
                        }
                        else{
                            //self::log("NO ATTRIBUTE PROPERTY",''); 
                        }
                    }
                    else{
                        //self::log("NO ATTRIBUTE PROPERTY",''); 
                    }
                    if($value['type']==='otag'){
                        self::log("OPEN TAG:\r\n".$value['tag'],'');
                        array_push($openStack,array('tag'=>$value['tag'],'order'=>$key));
                            //if()
                    }
                    if($value['type']==='ctag'){
                        self::log("FIND CLOSE TAG:\r\n".$value['tag'],'');
                        /* CHANGE TO FIX WRoNG NEST ORDER OF HTML TAG, CHANGE PUSH TO OVERWRITE */
                        //array_push($closeStack,array('tag'=>$value['tag'],'order'=>$key));
                        $closeStack=array('tag'=>$value['tag'],'order'=>$key);
                    }
                    /* CHECK IF THE SAME, IF IS => POP LAST ELEMENT FROM BOTH ARRAY'S */
                    $lOpen=end($openStack);
                    /* CHANGE TO FIX WRoNG NEST ORDER OF HTML TAG, CHANGE PUSH TO OVERWRITE */
                    //$lClose=end($closeStack);
                    self::log("ACT OPEN TAG:\r\n".$lOpen['tag'],'');
                    self::log("ACT CLOSE TAG:\r\n".$closeStack['tag'],'');
                   
                    if($lOpen['tag']===$closeStack['tag']){
                    //if($lOpen['tag']===$lClose['tag']){
                        self::log("ACT TAG ".$lOpen['tag']." EQUAL",'');
                      
                        if($lOpen['order']>$closeStack['order']){
                        //if($lOpen['order']>$lClose['order']){
                            //self::log("WRONG HTML TAG ".$lOpen['tag']." ORDER OPEN ".$lOpen['order']." > CLOSE ".$lClose['order'],'');
                            //self::setError("WRONG HTML TAG ".$lOpen['tag']." ORDER OPEN = ".$lOpen['order']." > CLOSE = ".$lClose['order']);
                            self::log("WRONG HTML TAG ".$lOpen['tag']." ORDER OPEN ".$lOpen['order']." > CLOSE ".$closeStack['order'],'');
                            self::setError("WRONG HTML TAG ".$lOpen['tag']." ORDER OPEN = ".$lOpen['order']." > CLOSE = ".$closeStack['order']);
                            return false;
                        }
                        else{
                            self::log("TAG ".$lOpen['tag']." REMOVE",'');
                             /* REMOVE */
                            array_pop($openStack);
                            /* CHANGE TO FIX WRoNG NEST ORDER OF HTML TAG, CHANGE PUSH TO OVERWRITE */
                            //array_pop($closeStack);
                            /* SET DEFAULT */
                            $closeStack['tag']='';
                            $closeStack['order']=0;
                        }  
                    }
                    if($value['type']==='octag'){
                        self::log("OPEN CLOSE TAG => OMIT:\r\n".$value['tag'],'');
                            //if()
                    }
                }
                
            $cOpen=count($openStack);
            /* CHANGE TO FIX WRoNG NEST ORDER OF HTML TAG, CHANGE PUSH TO OVERWRITE */
            //$cClose=count($closeStack);
            //echo "OPEN STACK\r\n";
            //print_r($openStack);
            //echo "CLOSE STACK\r\n";
            //print_r($closeStack);
           
            //if($cOpen===0 && $closeStack['tag']===''){
            if($cOpen===0 && $cClose===0){
                self::log("NO HTML TAG => EXIT",'');
                return true;
            }
             /* CHANGE TO FIX WRoNG NEST ORDER OF HTML TAG, CHANGE PUSH TO OVERWRITE */
            if($cOpen>0){
            //if($cOpen!==$cClose){  
                self::setError("HTML OPEN TAG STACK  NOT EMPTY! COUNT => ".$cOpen);
                return false;
            }  
            //if($cOpen>0 || $cCpen>0){
              //  self::setError("WRONG TAG ORDER");
               // return false;
            //}
        }
	private function clearWhiteCharacters(){
		/* CLEAR WHITE CHARACTERS FROM HTML TAGS */
		$patterns = [
		'/(\<)\s*(\w+)\s*(\>)/i',
		'/(\<)\s*(\w+)\s*(\/)\s*(\>)/i'
		];
		$replacements =[
			'$1$2$3',
			'$1$2$3$4'
		];
		$this->html=preg_replace($patterns, $replacements, $this->html);
		self::log("CLEAR TEXT: \n".$this->html,"[".__METHOD__."]");
	}
	private function swapHtmlTags(){
		$patterns=[
			"/<\s*\/\s*p\s*>/i",
			"/<\s*\/\s*br\s*>/i",
			"/<\s*br\s*\/\s*>/i",
			"/<\s*p\s*/i"
		];
		$replacements = [
					
					"</span><br/>",
					"<br/>",
					"<br/>",
					"<span "
					];
		$this->html=preg_replace($patterns, $replacements, $this->html);
		self::log("NEW TEXT: \n".$this->html,"[".__METHOD__."]");
	}
        private function checkOpenChar(&$char='',&$openTagChar=false,&$element=''){
            if($char==='<'){
                self::log("FOUND OPEN CHAR <","[".__METHOD__."]");
                $openTagChar=true;
                self::addElementToStack($element);
                
            }
        }
        private function addElementToStack(&$element=''){
            if($element!==''){
                array_push($this->elementStack,array("type"=>'text','tag'=>$element));
                $element='';
            } 
        }
        private function checkCloseChar($char='',&$closeTagChar=false){
            if($char==='>'){
                self::log("FOUND CLOSE CHAR >","[".__METHOD__."]");
                $closeTagChar=true;
            }
        }
        private function setupElement(&$openTagChar=false,&$closeTagChar=false,&$element='',$char=''){            
            if(!$openTagChar && !$closeTagChar){
                /* SETUP VALUE BETWEEN HTML TAG */
                $element.=$char;
            }
            if($openTagChar && !$closeTagChar){
                //self::log('ADD CHAR TO TAG => '.$char,"[".__METHOD__."]");
                $element.=$char;
                return '';
            }
            if($openTagChar && $closeTagChar){
                self::log('END OF TAG '.$char,"[".__METHOD__."]");
                $element.=$char;
                $type='otag';
                $attribute=self::parseTag($element,$type);
                array_push($this->elementStack,array('type'=>$type,'tag'=>$element,'style'=>$attribute));
                self::log("COMPLETE TAG WITH ATTRIBUTE:\r\n".$element,"[".__METHOD__."]");
                $element='';
                $openTagChar=false;
                $closeTagChar=false;
                return '';
            }
            
        }
        private function parseTag(&$element='',&$type){
            self::log('PARSE TAG '.$element,"[".__METHOD__."]");
            $element=mb_strtoupper($element);
            self::log('LENGTH '.mb_strlen($element),"[".__METHOD__."]");
            $attribute='';
            /* REMOVE OPEN AND CLOSE CHAR */
            $element=mb_substr($element,1,mb_strlen($element)-2);
            /* REMOVE LEFT AND RIGHT WHITE SPACE */
            $element=trim($element);
            self::log("CUT AND TRIMMED\r\n".$element,"[".__METHOD__."]");
            
            
            /* CHECK IS CLOSE TAG */
            if(mb_substr($element,0,1)==='/'){
                self::log("FOUND CLOSE TAB, NO ATTRIBUTE PARSE","[".__METHOD__."]");
                $element=mb_substr($element,1);
                $element=trim($element);
                
                //$element="/".self::getTagName($element);
                $element=self::getTagName($element);
                $type='ctag';
                return array();
            }
	
			/* CHECK IS OPEN CLOSE TAG */
			if(mb_substr($element,-1)==='/'){
				self::log("FOUND OPEN CLOSE TAG","[".__METHOD__."]");
				$type='octag';
				$element=mb_substr($element,0,mb_strlen($element)-1);
			}
           
            $element=self::getTagName($element,$attribute);
            return self::getTagAttribute(mb_strtoupper($attribute));
        }
        private function getTagName($element='',&$atr=''){
             self::log("PARSE FOR ATTRIBUTE\r\n".$element,"[".__METHOD__."]");
              /* GET TAG NAME */
            $tagName='';
            $char='';
            for($i=0;mb_strlen($element);$i++){
                $char=mb_substr($element,$i,1);
                self::log("CHAR:".$char,"[".__METHOD__."]");
                if(trim($char)!==''){
                    $tagName.=$char;
                }
                else{
                    self::log("FOUND EMPTY CHAR, LAST I => ".$i,"[".__METHOD__."]");
                    $atr=mb_substr($element,$i);
                    break;
                }
            }
            return $tagName;
        }
        private function getTagAttribute($attribute=''){
            $atrList=array();
            self::log("ATTRIBUTE:\r\n".$attribute,"[".__METHOD__."]");
            if(trim($attribute)===''){
                self::log("NO ATTRIBUTE => RETURN EMPTY ARRAY","[".__METHOD__."]");
                return array();
            }
            /* PARSE FOR STYLE */
            self::getStyle($attribute,$atrList);
            /* TO DO => ANOTHER HTML TAG TO PARSE*/
            return $atrList;
        }
        private function getStyle(&$attribute='',&$list=array()){
            $attribute=trim($attribute);
            /* check length for string style="a:b" */
            /* TRIM */
            $length=mb_strlen($attribute);
            $style=false;
            $equal=false;
            $apostrophe=false;
            $lastapostrophe=false;

            self::log("ATTRIBUTE (STRING LENGTH):\r\n".$length,"[".__METHOD__."]");
            if($attribute==='' || $length<11){
                self::log("ATTRIBUTE IS EMPTY OR LENGTH IS LOWER THAN 11 (style=\"a:b\"):\r\n".$length,"[".__METHOD__."]");
            }
            else{
                /* FIND STYLE */
                self::log("FIND STYLE","[".__METHOD__."]");
                for($i=0;$i<$length;$i++){
                   
                    self::log(mb_substr($attribute,$i,5),"[".__METHOD__."]");
                    if(mb_substr($attribute,$i,5)==='STYLE'){
                        self::log("FOUND STYLE","[".__METHOD__."]");
                        $style=true;
                        /* INCREASE $i + 5*/
                        //$i+=4;
                        $attribute=mb_substr($attribute,5);
                        break;
                    }
                }
                self::log("FIND STYLE ATTRIBUTE\r\n".$attribute,"[".__METHOD__."]");
                if(!$style){
                    return false;
                }
                $equal=self::findFirstNotEmptyChar($attribute,'=');
                $apostrophe=self::findFirstNotEmptyChar($attribute,'"');
                $lastapostrophe=self::checkLastChar($attribute,'"');
                self::log("COMPLETE STYLE ATTRIBUTE\r\n".$attribute,"[".__METHOD__."]");
                self::setUpAttributeList($attribute,$list);
                //echo "[".__METHOD__."]"."\r\n";
                //print_r($list);
                //$char=mb_substr($attribute,$i,1);
            }
        }
        private function findFirstNotEmptyChar(&$attribute='',$char=''){
            $attribute=trim($attribute);
            if(mb_substr($attribute,0,1)!==$char){
                return false;
            }
            $attribute=mb_substr($attribute,1);
            return true;
        }
        private function checkLastChar(&$attribute='',$char=''){
            $attribute=trim($attribute);
            self::log("LAST CHAR => \r\n".mb_substr($attribute,-1),"[".__METHOD__."]");
             
            if(mb_substr($attribute,-1)!==$char){
                return false;
            }
            $attribute=mb_substr($attribute,0,-1);
            //self::log("STYLE ATTRIBUTE WITHOUT LAST CHAR\r\n".$attribute,"[".__METHOD__."]");
            return true;
        }
        private function setUpAttributeList($attribute='',&$list=array()){
            
            $tmp=explode(';',$attribute);
            $tmp_2=array();
            foreach($tmp as $value){
                $tmp_2=explode(':',$value);
                if(count($tmp_2)===2){
                    $tmp_2[0]=trim($tmp_2[0]);
                    $tmp_2[1]=trim($tmp_2[1]);
                    self::log("FOUND COMPLETE STYLE PROPERTY => ADD TO LIST","[".__METHOD__."]");
                    self::log("PROPERTY:\r\n".$tmp_2[0],'');
                    self::log("VALUE:\r\n".$tmp_2[1],'');
                    array_push($list,array('property'=>$tmp_2[0],'tag'=>$tmp_2[1]));
                }
                else
                {
                    /* TO THINK => THROWN ERROR OR LEAVE ? */
                }
            }
        }
	public function getError(){
		if($this->err){
			self::log('ERROR EXIST: '.$this->err,"[".__METHOD__."]");
		}
		else{
			self::log('NO ERROR',"[".__METHOD__."]");
		}
		return $this->err;
	}
	public function getLog(){
            $l=mb_strlen($this->logData,'UTF-8');
            if($l>2){
            	return mb_substr($this->logData,0,$l-1,'UTF-8');
            }
            return $this->logData;
	}
	private function log($d='',$m=''){
            //echo $d."\r\n";
            return $this->logData.=$m.$d."\n";
	}
	private function logA($d='',$m='',$lvl=0){
		if(is_array($d)){
			foreach($d as $v){
				if(is_array($v)){
					self::logA($v,$m,$lvl++);
				}
				else{
					self::log("[${lvl}]".$v,$m);
				}
			}
		}
		else{
			self::log("[${lvl}]".$d,$m);
		}
	}
	private function setError($d='',$m=''){
            self::log($d,$m);
            $this->err.=$d."\n";
	}
}
/* USAGE */
/**/
//$testTekst='11< br / ><p style="font-weight: bold; color:red;font-size:12px">1<strong style="font-weight:bold;color:red;font-size:12px">2</strong>3< b >adam< span   > tomek</span>4<strong>5</strong>6<u>7</u>8</b>9</p>10';
//$testTekst='<<ul  style=" list-style-type: decimal;"><li>asdasda</li></ul>sdfdsfdsf<p></p>...';

//$convert=new convertHtmlToArray();
//$convert->addHtml($testTekst);
//$convert->createHtmlArray();
//echo $convert->getError();
//$convert->getHtmlArray();
//printf("LOG:\n%s",$convert->getLog());
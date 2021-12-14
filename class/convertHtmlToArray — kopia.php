<?php


final class convertHtmlToArray{
	
	private $html='',$htmlArray=[],$openTagStack=[],$closeTagStack=[],$err='';
	private $logData='';
	private $avaliableTags=['p','span','b','i','u','strong','ul','li'];
        private $unavailableTags=['script'];
	
	public function __construct(){}
	public function __destruct(){}
	
	public function addHtml($h=''){
            self::log('',__METHOD__);
            $this->html=$h;
            /* clear err/log */
            $this->err='';
            $this->logData='';
            /* clear htmlArrray() */
            $this->htmlArray=[];
            /* clear open/closetagStack */
            $this->openTagStack=[];
            $this->closeTagStack=[];
	}
	public function getHtmlArray(){
            /* COUNT P */
            self::parseData();
            self::checkTagStack();
            if($this->err){
                return [];
            }
            else{
                self::log("FINALLY TEXT:",__METHOD__);
                self::logA($this->htmlArray,__METHOD__);
                return $this->htmlArray;
            }
	}
	private function parseData(){
     
		$part='';
		$word='';
		$tagCount=0;
		$actTagCount=0;
		$tmpWord='';
		$tmpTagStack=[];
		
		self::log("ORIGINAL TEXT: \n".$this->html,__METHOD__);
		self::clearWhiteCharacters();
		self::swapHtmlTags();
  
		self::log('MB STRING CUT',__METHOD__);
		
		for($i=0;$i<mb_strlen($this->html,'UTF-8');$i++){
			$part=mb_substr($this->html,$i,mb_strlen($this->html,'UTF-8')-$i,'UTF-8');
			$i=$i+self::checkPart($part,$tagCount,$tmpWord);
			if($actTagCount!==$tagCount){
                            if($tmpWord!==''){
				self::log('NEW WORD: '.$tmpWord,__METHOD__);
				array_push($this->htmlArray,[$tmpWord,$tmpTagStack]);
                            }	
                            $actTagCount=$tagCount;
                            $tmpWord='';
			}
			/* ADD TO TMP TAG STACK HTML TAG FOR NEXT WORD */
			$tmpTagStack=$this->openTagStack;
		}
		/* ADD LAST WORD (NO TAG)*/
		if(trim($tmpWord)!==''){
			array_push($this->htmlArray,[$tmpWord,[]]);
		}
	
		//echo "WORDS:\n";
		//print_r($this->htmlArray);
		//echo "WORDS - BR\n";
		self::checkForBreakLines();
		self::checkForStyle();
		self::log("ACTUAL C (TAGS) => ".$tagCount,__METHOD__);       
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
		self::log("CLEAR TEXT: \n".$this->html,__METHOD__);
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
		self::log("NEW TEXT: \n".$this->html,__METHOD__);
	}
	private function checkpart($part,&$c,&$tmpWord){

		$cutLength=0;
		$actTag='';
		self::log("[${c}]CHAR: ".mb_substr($part,0,1,'UTF-8'),__METHOD__);
		foreach($this->avaliableTags as $tag){
			//echo "TAGS => ".$tag."\n";
			$openTagPreg=preg_match('/^<'.$tag.'\s*(\s*style\s*=\s*"\s*((\s*[a-zA-Z]+-[a-zA-Z]+\s*\:\s*[a-zA-Z\d]+\s*\;*\s*)|([a-zA-Z]+\s*\:\s*[a-zA-Z\d]+\s*\;*\s*))+\s*"\s*)?\s*>/i',$part,$matches);
			//$openTagPreg=preg_match('/^<'.$tag.'\s*(style\s*=\s*"\s*"\s*)?\s*>/i',$part,$matches);
			/*
			If matches is provided, then it is filled with the results of search. 
			$matches[0] will contain the text that matched the full pattern, 
			$matches[1] will have the text that matched the first captured parenthesized subpattern, and so on.
			*/
			if($openTagPreg){
				self::log("FOUND OPEN TAG => ".$tag.", SKIP LENGTH OPEN TAG ".$matches[0]." => ".mb_strlen($matches[0]),__METHOD__);
				(count($matches)>1) ? array_push($this->openTagStack,[$tag,$matches[1]]) : array_push($this->openTagStack,[$tag,'']);		
				$c++;
				$cutLength=mb_strlen($matches[0])-1;
			}
			$closeTagPreg=preg_match('/^<\/'.$tag.'>/i',$part,$matches);
			if($closeTagPreg){
				self::log("FOUND CLOSE TAG => ".$tag.", SKIP LENGTH CLOSE TAG ".$matches[0]." => ".mb_strlen($matches[0]),__METHOD__);
				array_push($this->closeTagStack,$tag);
				//break;
				$c++;
				self::checkTagEqual();
				$cutLength=mb_strlen($matches[0])-1;
				$actTag=$tag;
				//return mb_strlen($matches[0])-1;
				//break;
			}
		}
		$tmpTag=$actTag;
		/* FOUND TAG, REMOVE OPEN CHAR < */
		self::log(" FOUND TAG, REMOVE OPEN CHAR => `<`",__METHOD__);
		($cutLength!==0) ? $tmpWord.=mb_substr($part,0,0,'UTF-8') : $tmpWord.=mb_substr($part,0,1,'UTF-8');
	
		return $cutLength;
	}
	private function checkForBreakLines(){
		$tmpWord=[];
		foreach($this->htmlArray as $k => $v){
			$tmpWord=explode('<br/>',$v[0]);
			self::log('WORD: '.$v[0],__METHOD__);
			$this->htmlArray[$k][0]=$tmpWord;
			self::logA($this->htmlArray[$k][0],__METHOD__);
		}
		self::logA($this->htmlArray);
	}
	private function checkForStyle(){
		$tmpCSS=[];
		foreach($this->htmlArray as $k => $v){
			if(count($v[1])>0){
				//printf("HTML TAG EXIST:\n");
				//print_r($v[1]);
				foreach($v[1] as $k1 => $v1){
					self::log('HTML TAG: '.$v1[0],__METHOD__);
					
					if(trim($v1[1])!==''){
						/* remove prefix */
						$v1[1]=mb_substr($v1[1],7,mb_strlen($v1[1]),'UTF-8');
						/* remove sufix */
						$v1[1]=mb_substr($v1[1],0,mb_strlen($v1[1])-1,'UTF-8');
						/* explode via ; */
						$tmpCSS=explode(';',$v1[1]);
						$tmpCSS = array_map(function ($val){ return preg_replace('/\s/','',$val);},$tmpCSS);
						$tmpCSS=array_filter($tmpCSS, function($value) { return !is_null($value) && $value !== ''; });
						
                                                $v1[1]=$tmpCSS;
						self::log('HTML TAG STYLE:',__METHOD__);
						self::logA($v1[1]);
						$this->htmlArray[$k][1][$k1][1]=$v1[1];
					}else{}
				}
			}
		}
		self::log('',__METHOD__);
		self::logA($this->htmlArray);
	}
	public function getTagStack(){
		self::log('',__METHOD__);
		self::logA($this->openTagStack);
		self::logA($this->closeTagStack);
	}

	private function checkTagStack(){
		$lastCloseStack='';
		$cOpen=count($this->openTagStack);
		$cClose=count($this->closeTagStack);
		if($cOpen!==$cClose){
			self::setError("TAG STACK ERROR => ".$cOpen." - ".$cClose);
		}
		else{
			/* CHECK */
			$lastCloseStack=end($this->closeTagStack);
			foreach($this->openTagStack as $key => $open){
				self::log('OPEN TAG =>  '.$open,__METHOD__);
				self::log('LAST CLOSE TAG => '.$lastCloseStack,__METHOD__);
				if($open===end($this->closeTagStack)){
					self::log('TAG EQUAL => REMOVE FROM STACK => '.$open,__METHOD__);
					UNSET($this->openTagStack[$key]);
					array_pop($this->closeTagStack);
				}
				else{
					self::setError("WRONG TAG ORDER => ".$open." - ".$lastCloseStack);
					break;
				}
			}
		}
	}
	private function checkTagEqual(){
		if(empty($this->openTagStack) || empty($this->closeTagStack)){
			return false;
		}
		$endOpen=end($this->openTagStack);
		if($endOpen[0]===$this->closeTagStack[0]){
			self::log('TAG EQUAL => REMOVE FROM STACK => '.$endOpen[0].' '.$endOpen[1],__METHOD__);
			array_pop($this->openTagStack);
			array_pop($this->closeTagStack);
		}
	}
	public function getError(){
		if($this->err){
			self::log('ERROR EXIST: '.$this->err,__METHOD__);
			self::logA($this->openTagStack);
			self::logA($this->closeTagStack);
		}
		else{
			self::log('NO ERROR',__METHOD__);
		};
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
            return $this->logData.="[${m}] ${d}\n";
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
		self::log($d='',$m='');
		$this->err.="${d}\n";
	}
}
/* USAGE */
/**/
//$testTekst='11< br / ><p style="font-weight: bold; color:red;font-size:12px">1<strong style="font-weight:bold;color:red;font-size:12px">2</strong>3< b >adam< span   > tomek</span>4<strong>5</strong>6<u>7</u>8</b>9</p>10';
$testTekst='<ul  style=" list-style-type: decimal;"><li>asdasda</li></ul>';

$convert=new convertHtmlToArray();
$convert->addHtml($testTekst);
$convert->getHtmlArray();
$convert->getError();
printf("LOG:\n%s",$convert->getLog());

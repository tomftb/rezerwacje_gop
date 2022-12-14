<?php
class createDocAbstract {
    protected $Log;
    public function construct__(){
        $this->Log=Logger::init();
    }
    public function __call($name='',$arg=array()){
        $this->Log->log(0,'['.__METHOD__.']');
        $this->Log->log(0,$name);
        $this->Log->log(0,$arg);
    }
    protected function getTwip($size=0,$measurement='cm'){
        $this->Log->log(0,'['.__METHOD__.'] size -> '.$size.' measurement -> '.$measurement);
        /* check - minus size returned value in MS WORD equal value/20 */
        switch($measurement):
            case 'mm':
                $size=$size/10;
            case 'cm':
                return \PhpOffice\PhpWord\Shared\Converter::cmToTwip($size);
            case 'n/a':/* n/a -> set default */
            case 'pkt':/* 1cm ~ 28,34645669291339 pt/pkt */
            case 'pt':
            case 'point':
                return \PhpOffice\PhpWord\Shared\Converter::pointToTwip($size);
            case 'in':
            case 'inch':
                return \PhpOffice\PhpWord\Shared\Converter::inchToTwip($size);
            case 'pc':        
                return \PhpOffice\PhpWord\Shared\Converter::inchToTwip($size/6);
            case 'px':
            case 'pixel':
                    return \PhpOffice\PhpWord\Shared\Converter::inchToTwip($size/96);
            default:
                Throw New Exception('NOT SUPPORTED MEASUREMENT -> '.$measurement,0);  
        endswitch;
    }
    protected function getFormatList($listType=''){
        $available=[
            'bullet'=>['bullet','',''],
            'decimal'=>['decimal','',''],
            'decimal-dot'=>['decimal','','.'],
            'decimal-round-right-bracket'=>['decimal','',')'],
            'decimal-leading-zero'=>['decimal','0',''],
            'upper-alpha'=>['upperLetter','',''],
            'upper-alpha-dot'=>['upperLetter','','.'],
            'upper-alpha-round-right-bracket'=>['upperLetter','',')'],
            'lower-alpha'=>['lowerLetter','',''],
            'lower-alpha-dot'=>['lowerLetter','','.'],
            'lower-alpha-round-right-bracket'=>['lowerLetter','',')'],
            'lower-roman'=>['lowerRoman','',''],
            'lower-roman-dot'=>['lowerRoman','','.'],
            'lower-roman-round-right-bracket'=>['lowerRoman','',')'],
            'upper-roman'=>['upperRoman','',''],
            'upper-roman-dot'=>['upperRoman','','.'],
            'upper-roman-round-right-bracket'=>['upperRoman','',')']
        ];
        if(!array_key_exists($listType,$available)){
            Throw New Exception('NOT SUPPORTED LIST TYPE -> '.$listType,0);
        }
        return $available[$listType];
    }
    /* SWAP WITH PhpWord/Shared/Converted */
    protected function convertToPt($size='0',$measurement='pt'){
        $this->Log->log(0,'['.__METHOD__.'] size -> '.$size.', measurement -> '.$measurement);
        switch($measurement):
            case 'pkt':
                    $size=floatval($size)/28.35;
                    $measurement='cm';
                    break;
                /* EXCEPTION */
            case 'n/a':
                    $measurement='pt';
                    break;
            //default:
                //Throw New Exception('NOT SUPPORTED MEASUREMENT -> '.$measurement,0);
        endswitch;
        return \PhpOffice\PhpWord\Shared\Converter::cssToPoint($size.$measurement);
    }
     
    protected function setFont($rStyle){
        /* TO DO -> CHECK EXISTS */
        /* AVAILABLE
        $textrun->addText('color', array('color' => '996699'));
        $textrun->addText('bold', array('bold' => true));
        $textrun->addText('italic', array('italic' => true));
        $textrun->addText('underline', array('underline' => 'dash'));
        $textrun->addText('strikethrough', array('strikethrough' => true));
        $textrun->addText('doubleStrikethrough', array('doubleStrikethrough' => true));
        $textrun->addText('superScript', array('superScript' => true));
        $textrun->addText('subScript', array('subScript' => true));
        $textrun->addText('smallCaps', array('smallCaps' => true));
        $textrun->addText('allCaps', array('allCaps' => true));
        $textrun->addText('fgColor', array('fgColor' => 'yellow'));
        $textrun->addText('scale', array('scale' => 200));
        $textrun->addText('spacing', array('spacing' => 120));
        $textrun->addText('kerning', array('kerning' => 10));
        */
        $this->Log->log(0,"[".__METHOD__."] Style:");
        //$this->Log->log(0,$rStyle);
        return [
            'name' => $rStyle->fontFamily,
            'size' => self::convertToPt($rStyle->fontSize,$rStyle->fontSizeMeasurement),
            'color' => $rStyle->color,
            'bgColor' => $rStyle->backgroundColor,
            'bold' => self::setTextStyle($rStyle->fontWeight),
            'italic'=>self::setTextStyle($rStyle->fontStyle),
            'underline' => self::setTextUnderline($rStyle->underline),
            'strikethrough' => self::setTextStyle($rStyle->{'line-through'}),
                //works -> height ? 'position'=>1000,
                // works 'hidden'=>true
        ];
    }
    protected function setAlign($style){
        //$this->Log->log(0,"[".__METHOD__."] Style:");
        //$this->Log->log(0,$style);
        //'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER);
        //$this->phpWord->addFontStyle('r2Style', array('bold'=>false, 'italic'=>false, 'size'=>12));
        //$this->phpWord->addParagraphStyle('p2Style', array('align'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter'=>100));
        //$ParagraphStyle['alignment']=\PhpOffice\PhpWord\SimpleType\Jc::LEFT;
        //$this->mainSection->addText("Na zlecenie:",$FontStyle,$ParagraphStyle);
         /* TO DO -> CHECK EXISTS */
        $available=[
                'CENTER'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                'LEFT'=>\PhpOffice\PhpWord\SimpleType\Jc::LEFT,
                'RIGHT'=>\PhpOffice\PhpWord\SimpleType\Jc::RIGHT,
                'JUSTIFY'=>\PhpOffice\PhpWord\SimpleType\Jc::BOTH
        ];
        //textAlign
        if(!property_exists($style,'textAlign')){
            return $available['LEFT'];
        }
        if(!array_key_exists($style->textAlign,$available)){
            $this->Log->log(0,'['.__METHOD__.'] WRONG TEXT ALIGN -> '.$style->textAlign);
            return $available['LEFT'];
            //Throw New Exception('WRONG TEXT ALIGN -> '.$style->textAlign,0);
        }
        return $available[$style->textAlign];
    }
    protected function setParagraphProperties($r){
        /* GET TWIP */
        $spacingLineValue=self::setSpacingLineValue($r->paragraph->style);
        /* FIX FOR n/a */
        self::setSpacingLineValueMeasurement($r->paragraph->style,$spacingLineValue);
        /* SET TO POINT */
        $setSpacingLineRule=self::setSpacingLineRule($r->paragraph->style,$spacingLineValue);
        return [
            'tabs'=>self::setTabStop($r->paragraph->tabstop),
            'alignment'=>self::setAlign($r->paragraph->style),
            'spaceBefore'=>self::setParagraphSpace($r->paragraph->style,'marginTop'), /* IN TWIP : 1 pkt  - 20 twip ex. 240 TWIP = 12 pkt */
            'spaceAfter'=>self::setParagraphSpace($r->paragraph->style,'marginBottom'), /* IN TWIP 1 - 20 */
            /* INTERLINIA */
            'spacing'=>$spacingLineValue,
            'spacingLineRule'=>$setSpacingLineRule
        ]; 
    }
    private function setParagraphSpace($style,$key='marginTop'){
        $this->Log->log(0,'['.__METHOD__.']');
        //$this->Log->log(0,$style);
        //$this->Log->log(0,$key);
        $size=0;
       // $measurement='';
        if(property_exists($style, $key)){
            $size=$style->{$key};
            
            //return round(intval($style->{$key},10)*20,0);
        }
        else{
            $this->Log->log(0,'['.__METHOD__.'] Property '.$key.' not exists in style -> return default 160 twip');
            return 160;
        }
        if(property_exists($style, $key."Measurement")){
            $this->Log->log(0,'['.__METHOD__.'] Property '.$key.'Measurement exists ('.$style->{$key.'Measurement'}.') in style -> calculate');
            /* calculate measurement */
            //$measurement=$key."Measurement";
            $size=self::getTwip(floatval($style->{$key}),$style->{$key.'Measurement'});
            //$size=self::getTwip($style->{$key},$style->{$key.'Measurement'});
            //return round(intval($style->{$key},10)*20,0);
        }
        else{
            $this->Log->log(0,'['.__METHOD__.'] Property '.$key.'Measurement no exists style -> no calculate');
        }
        $this->Log->log(0,'['.__METHOD__.'] Size -> '.$size);
        return $size;
        
        /* 
         * default 160 twip = 8 pkt
         * default 20 twip = 1 pkt
         */
        //$this->Log->log(0,'['.__METHOD__.'] Property '.$key.' not exists in style -> return default 160 twip');
       
    }
    private function setSpacingLineRule($style,&$spacingLineValue=1){
        /* atLeast, exact, auto */
        $this->Log->log(0,'['.__METHOD__.']');
        //$this->Log->log(0,$style);
        $lineSpacing='auto';
        if(!property_exists($style,'lineSpacing')){
            $this->Log->log(0,'Property lineSpacing not exists, set default => auto');
            return $lineSpacing;
        }
        switch($style->{'lineSpacing'}){                 
                case 'exactly':
                    $lineSpacing='exact';
                    break;
                case 'atLeast':
                    $lineSpacing='atLeast';
                    break;
                case 'single':/* LEAVE PhpWord default 240 TWIP */
                    $spacingLineValue=0;
                    break;
                case 'double':/* LEAVE PhpWord default 240 TWIP + 240 TWIP*/
                    $spacingLineValue=240;
                    break;
                case 'oneAndHalf':
                    $spacingLineValue=120;
                    break;
                case 'auto':
                     $this->Log->log(0,'auto');
                    /* TO POINT AND MULTIPLY MS WORD MEASUREMENT 0.0834 */
                default:
                    $this->Log->log(0,'default');
                    /* 
                     * FIX for additional PhpWord 240 TWIP
                     * vendor/phpword/src/PhpWord/Writer/Word2007/Style/Spacing.php => write();
                     */
                    $spacingLineValue-=240;
                    break;
            }
        $this->Log->log(0,'lineSpacing `'.$style->{'lineSpacing'}."`\rreturn type => ".$lineSpacing."\rreturn value => ".$spacingLineValue);   
        return $lineSpacing;
    }
    private function setSpacingLineValue($style){
        $this->Log->log(0,'['.__METHOD__.']');
        /* 200 - 10 pkt */
        $size='0';
        $measurement='pkt';
        if(property_exists($style,'lineSpacingValue')){
            $size=$style->lineSpacingValue;
        }
         if(property_exists($style,'lineSpacingMeasurement')){
            $measurement=$style->lineSpacingMeasurement;
        }
        return self::getTwip($size,$measurement);  
    }
    private function setSpacingLineValueMeasurement($style,&$spacingLineValue=1){
        $this->Log->log(0,'['.__METHOD__.']');
            switch($style->{'lineSpacingMeasurement'}){  
                case 'n/a':
                    $this->Log->log(0,'n/a');
                    $spacingLineValue*=12;
                    break;
                default: /* nothing to do */
                    break;
            }
    }
    private function setTextStyle($style='1'){
        if($style==='1'){
            return true;
        }
        else{
            return false;
        }
    }
    private function setTextUnderline($style='1'){
        /* TO DO => Underline, single, dash, dotted, etc. */
        if($style==='1'){
            return 'single';
        }
        else{
            return '';
        }
    }
    protected function setTabStop($rTabStop){
        /*  AVAILABLE in CLASS:
            - none,dot,hyphen,underscore,heavy,middleDot
            UNAVAILABLE in MS Word Office:
            - heavy
            - middleDot
        */
        $tabStop=[];
        foreach($rTabStop as $v){
            array_push($tabStop,new \PhpOffice\PhpWord\Style\Tab($v->alignment, self::getTwip(floatval($v->position),$v->measurement),self::getLeadingSign($v->leadingSign)));
        }
        return $tabStop;
    }
    private function getLeadingSign($sign='none'){
        $available=[
            'none'=>'none',
            'underline'=>'underscore',
            'dash'=>'hyphen',
            'dot'=>'dot'
        ];
        if(!array_key_exists($sign,$available)){
            //$this->Log->log(0,'['.__METHOD__.'] Property '.$key.' not exists in style -> return default 160 twip');
            $this->Log->log(0,'['.__METHOD__.'] NOT SUPPORTED SIGN -> '.$sign." return default - none");
            return $available['none'];
            //Throw New Exception('NOT SUPPORTED SIGN -> '.$sign,0);
        }
        return $available[$sign];
    }
    protected function firstCheckImage($Image){
        $this->Log->log(2,"[".__METHOD__."]");
        if(!is_object($Image)){
            throw new Exception('Variable `Image` is not a object!',1);
        }
        if(!property_exists($Image,'data')){
            throw new Exception('Variable `Image` doesn\'t have `data` property!',1);
        }
        if(!property_exists($Image->data,'tmp')){
            throw new Exception('Variable `Image` `data` property doesn\'t have `tmp` property!',1);
        }
        $tmp=['d','n','y'];
        $type=gettype($Image->data->tmp);
        if($type!=='string'){
            throw new Exception('Variable `Image` `data` `tmp` property not a string - `'.$type.'`!',1);
        }
        if(!in_array($Image->data->tmp,$tmp)){
             throw new Exception('Variable `Image` `data` property doesn\'t have proper value - `'.$Image->data->tmp.'`!',1);
        }
    }
    protected function secondCheckImage($Image){
        $this->Log->log(2,"[".__METHOD__."]");
        $this->Log->log(2,$Image);
        //$this->Log->log(2,$Image->style);
        //$this->Log->log(0,gettype($Image->style->width));
        /* ONLY CHECK MAIN PROPERTY */ 
        self::checkPropertyStyle($Image);
        self::checkPropertyProperty($Image);
    }
    private function checkPropertyStyle($Image){
        $style=['width','height'];
        if(!property_exists($Image,'style')){
            throw new Exception('Variable `Image` doesn\'t have `style` property!',1);
        }
        foreach($style as $value){
             self::checkProperty($Image->style,'Image style',$value,'string');
        }
    }
    private function checkPropertyProperty($Image){
        $property=['uri','name'];
        if(!property_exists($Image,'property')){
            throw new Exception('Variable `Image` doesn\'t have `style` property!',1);
        }
        foreach($property as $value){
             self::checkProperty($Image->property,'Image property',$value,'string');
        }
    }
    private function checkProperty($Object,$ObjectName='',$property='',$type=''){
        if(!property_exists($Object,$property)){
            throw new Exception($ObjectName.' doesn\'t have `'.$property.'` property!',1);
        }
        $t=gettype($Object->{$property});
        if($t!==$type){
            throw new Exception($ObjectName.' property `'.$property.'` != `'.$type.'`!',1);
        }
    }
    protected function setUpMaxFontSize(&$allRow){
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->Log->log(0,$allRow);
        /* 
            TO DO
            CAN BE CHANGET TO ANOTHER NAME WITH MORE FUNCTIONS    
        */
        $tmp= new stdClass();
        $i=-1;
        foreach($allRow as $prop => $v){
            if($v->paragraph->property->valuenewline==='1'){
                $i++;
                $mfs=self::getMax(0,$v->paragraph->style);
                $tmp->{$i}=new stdClass();
                $tmp->{$i}->{'key'}=array($prop);
                $tmp->{$i}->{'maxFontSize'}=$mfs;
                continue;
            }
            
            array_push($tmp->{$i}->key,$prop);
            $tmp->{$i}->maxFontSize=self::getMax($tmp->{$i}->maxFontSize,$allRow->{$prop}->paragraph->style);
        }
        /* SET TMP MAX SIZE */
        foreach($allRow as $prop => &$v){
            foreach($tmp as $tv){
                if(in_array($prop,$tv->key)){
                    //$v->paragraph->{'tmp'}=new stdClass();
                    $v->paragraph->{'tmp'} = new stdClass();
                    $v->paragraph->{'tmp'}->{'maxFontSize'}=$tv->maxFontSize;
                }
            }
        }  
    }
    private function getMax($actMax,$rowParagraphStyle){
        $fs=self::convertToPt($rowParagraphStyle->fontSize,$rowParagraphStyle->fontSizeMeasurement);
        if($fs>$actMax){
            /* RETURN NEW MAX */
            return $fs;
        }
        return $actMax;
    }
}


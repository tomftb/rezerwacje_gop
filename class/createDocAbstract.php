<?php
class createDocAbstract {
    protected $Log;
    public function construct__(){
        $this->Log=Logger::init();
    }
    protected function getTwip($size=0,$measurement='cm'){
        /* check - minus size */
        switch($measurement):
            case 'mm':
                $size=$size/10;
            case 'cm':
                return \PhpOffice\PhpWord\Shared\Converter::cmToTwip($size);
            case 'point':
                return \PhpOffice\PhpWord\Shared\Converter::pointToTwip($size);
            case 'inch':
                return \PhpOffice\PhpWord\Shared\Converter::inchToTwip($size);
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
    protected function convertToPt($size=0,$measurement='pt'){
        switch($measurement):
            case 'px':
                return $size*0.75;
            case 'pt':
                return $size;
            default:
                Throw New Exception('NOT SUPPORTED MEASUREMENT -> '.$measurement,0);
        endswitch;
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
        return [
            'name' => $rStyle->fontFamily,
            'size' => self::convertToPt($rStyle->fontSize,$rStyle->fontSizeMeasurement),
            'color' => $rStyle->color,
            'bgColor' => $rStyle->backgroundColor,
            'bold' => self::setTextStyle($rStyle->fontWeight),
            'italic'=>self::setTextStyle($rStyle->fontStyle),
            'underline' => self::setTextStyle($rStyle->underline),
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
        return [
            'tabs'=>self::setTabStop($r->paragraph->tabstop),
            'alignment'=>self::setAlign($r->paragraph->style),
            'spaceBefore'=>self::setParagraphSpace($r->paragraph->style,'marginTop'), /* IN TWIP : 1 pkt  - 20 twip ex. 240 TWIP = 12 pkt */
            'spaceAfter'=>self::setParagraphSpace($r->paragraph->style,'marginBottom'), /* IN TWIP 1 - 20 */
            /* INTERLINIA */
            'spacing'=>'100',
            'spacingLineRule'=>'auto'/* atLeast, exact, auto */
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
            switch($style->{$key.'Measurement'}){
                default:
                    // default if not found
                case 'pkt':
                    /* multiply - pkt */
                    $size=round(floatval($style->{$key})*20,2);
                    break;
                case 'cm':
                    $size=round(floatval($style->{$key})*28.35*20,2);
                    break;
                case 'mm':
                    $size=round(floatval($style->{$key})*2.85*20,2);
                    break;
                case 'pt':
                    //$size=round(floatval($style->{$key})*2.85*20,2);
                    $size=round(floatval($style->{$key})*0.75000000001875*20,2);
                    break;
                case 'px':
                    /* 1 px = 0,7500937499990312 pkt */
                    //$size=round(floatval($style->{$key})*2.85*20,2);
                    $size=round(floatval($style->{$key})*0.7500937499990312*20,2);
                    break;
            }
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
    private function setTextStyle($style='1'){
        if($style==='1'){
            return true;
        }
        else{
            return false;
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
            array_push($tabStop,new \PhpOffice\PhpWord\Style\Tab($v->alignment, self::getTwip($v->position,$v->measurement),self::getLeadingSign($v->leadingSign)));
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
}


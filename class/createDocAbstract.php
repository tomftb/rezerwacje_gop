<?php
class createDocAbstract {
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
            'bullet'=>['bullet',''],
            'decimal'=>['decimal',''],
            'decimal-dot'=>['decimal','.'],
            'decimal-round-right-bracket'=>['decimal',')'],
            'upper-alpha'=>['upperLetter',''],
            'upper-alpha-dot'=>['upperLetter','.'],
            'upper-alpha-round-right-bracket'=>['upperLetter',')'],
            'lower-alpha'=>['lowerLetter',''],
            'lower-alpha-dot'=>['lowerLetter','.'],
            'lower-alpha-round-right-bracket'=>['lowerLetter',')'],
            'lower-roman'=>['lowerRoman',''],
            'lower-roman-dot'=>['lowerRoman','.'],
            'lower-roman-round-right-bracket'=>['lowerRoman',')'],
            'upper-roman'=>['upperRoman',''],
            'upper-roman-dot'=>['upperRoman','.'],
            'upper-roman-round-right-bracket'=>['upperRoman',')']
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
            'strikethrough' => self::setTextStyle($rStyle->{'line-through'})
        ];
    }
    protected function setAlign($align='LEFT'){
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
        if(!array_key_exists($align,$available)){
            Throw New Exception('WRONG TEXT ALIGN -> '.$align,0);
        }
        return ['alignment'=>$available[$align]];
    }
    protected function setListAlign($align='LEFT'){
        return self::setAlign($align)['alignment'];
    }
    private function setTextStyle($style='1'){
        if($style==='1'){
            return true;
        }
        else{
            return false;
        }
    }
    
}

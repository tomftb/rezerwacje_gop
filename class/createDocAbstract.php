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
    protected function setFont($r){
        /* TO DO -> CHECK EXISTS */
        return [
            'name' => $r->paragraph->style->fontFamily,
            'size' => self::convertToPt($r->paragraph->style->fontSize,$r->paragraph->style->fontSizeMeasurement),
            'color' => $r->paragraph->style->color,
            'bgColor' => $r->paragraph->style->backgroundColor,
            'bold' => self::setTextStyle($r->paragraph->style->fontWeight),
            'italic'=>self::setTextStyle($r->paragraph->style->fontStyle),
            'underline' => self::setTextStyle($r->paragraph->style->underline),
            'strikethrough' => self::setTextStyle($r->paragraph->style->{'line-through'})
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

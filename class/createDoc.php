<?php
class createDoc {
    private $phpWorld;
    private $fileName='default.docx';
    private $projectData=array();
    private $mainSection;
    private $files=[];
    private $Log;
    /*
    private $css=[
        'name'=>'Arial',// Arial
        'size'=>'10',//10
        'color'=>'#000000',//#000000
        'bold'=>false,
        'italic'=>false
    ];
     *
     */
    private $FontStyle=[];
    private $ParagraphStyle=[];
    const docDir='DOC/';
    
    function __construct($projectDetails,$files,$fileName,$ext=''){
        $this->Log=Logger::init();
        $this->Log->log(0,"[".__METHOD__."] FILENAME => ".$fileName);
        $this->Log->log(0,"[".__METHOD__."] EXTENSION => ".$ext);
        $this->projectData=$projectDetails;
        $this->fileName=$fileName."_".uniqid().$ext;
        $this->files=$files;
        require_once DR.'/bootstrap.php';
        // Creating the new document...
        $settings=new \PhpOffice\PhpWord\Settings();
        $settings::setOutputEscapingEnabled(true);
        $this->phpWord = new \PhpOffice\PhpWord\PhpWord();
    }
    public function createProjectStageReport(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->mainSection = $this->phpWord->addSection();
        empty($this->projectData) ? parent::setError(0,"NO STAGE DATA SELECTED") :  self::setUpData(); 
       
        //parent::setError(0,__LINE__.'TEST STOP');
        if(parent::getError()){
            /* ERROR EXIST, NO SAVE FILE */
            return false;
        }
        else{
            $this->Log->log(0,"[".__METHOD__.'] LOAD => \PhpOffice\PhpWord\IOFactory::createWriter()');
            $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
            /* check is file exist */
            $this->Log->log(0,"[".__METHOD__.'] SAVE FILE => '.DR."/".self::docDir.$this->fileName);
            //$objWriter->setOutputEscapingEnabled(true);
            $objWriter->save(DR."/".self::docDir.$this->fileName);
        }
    }
    public function createProjectReport(){
        $this->Log->log(0,"[".__METHOD__."]");
        
         try {
           /* Note: any element you append to a document must reside inside of a Section. */

        // Adding an empty Section to the document...
        $this->Log->log(0,"[".__METHOD__."] BEFORE SECTION");
        $section = $this->phpWord->addSection();
        $this->Log->log(0,"[".__METHOD__."] SECTION");
        $text = "some text";
        $this->phpWord->addFontStyle('r2Style', array('bold'=>false, 'italic'=>false, 'size'=>12));
        $this->phpWord->addParagraphStyle('p2Style', array('align'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter'=>100));
        $section->addText($text, 'r2Style', 'p2Style');
        $this->Log->log(0,"[".__METHOD__."] AFTER addText");
        // Adding Text element to the Section having font styled by default...
        $section->addText( 'Do Realizacji: '.$this->projectData['rodzaj_umowy'],array('size'=>22,'color' => 'FF8080'));
        $section->addText( 'Numer: '.$this->projectData['rodzaj_umowy']);
        $section->addText( 'Do kierowania grupą (Lider) powołuje : '.$this->projectData['nadzor']);
        $section->addText( 'Temat: '.$this->projectData['rodzaj_umowy']);
        $section->addText( 'Typ: '.$this->projectData['typ_umowy']);
        $section->addText( 'System: '.$this->projectData['system']);
         $this->Log->log(0,"[".__METHOD__."] AFTER multiply addText");
        /*
    * Note: it's possible to customize font style of the Text element you add in three ways:
    * - inline;
    * - using named font style (new font style object will be implicitly created);
    * - using explicitly created font style object.
    */
    // New portrait section - NEW BLANK PAGE
    //$section = $this->phpWord->addSection();
         $this->Log->log(0,"[".__METHOD__."] BEFORE NEXT SECTION");
    $section = $this->phpWord->addSection();
     $this->Log->log(0,"[".__METHOD__."] AFTER NEXT SECTION");
    // TITLE
    $section->addTitle('Welcome to Project', 1);
   // Adding Text element with font customized inline...
   $section->addText(
       'Do Realizacji: '.$this->projectData['rodzaj_umowy'],
       array('name' => 'Tahoma', 'size' => 10)
   );

   // Adding Text element with font customized using named font style...
   $fontStyleName = 'oneUserDefinedStyle';
   $this->phpWord->addFontStyle(
       $fontStyleName,
       array('name' => 'Tahoma', 'size' => 10, 'color' => '1B2232', 'bold' => true)
   );
   $section->addText(
       'Do Realizacji: '.$this->projectData['rodzaj_umowy'],
       $fontStyleName
   );

   // Adding Text element with font customized using explicitly created font style object...
   $fontStyle = new \PhpOffice\PhpWord\Style\Font();
   $fontStyle->setBold(true);
   $fontStyle->setName('Tahoma');
   $fontStyle->setSize(13);
   $myTextElement = $section->addText('Do Realizacji: '.$this->projectData['rodzaj_umowy']);
   $myTextElement->setFontStyle($fontStyle);
   // Image
    $this->Log->log(0,"[".__METHOD__."] BEFORE ADD IMAGE");
    $section->addImage(DR.'/upload/609a22bf9f7c0_0.jpeg', array('width'=>800, 'height'=>533));
     $this->Log->log(0,"[".__METHOD__."] AFTER ADD IMAGE");
    /* --- */
    
    // Inline font style
$fontStyle_array['name'] = 'Times New Roman';
$fontStyle_array['size'] = 20;

$textrun = $section->addTextRun();
$textrun->addText('I am inline styled ', $fontStyle_array);
$textrun->addText('with ');
$textrun->addText('color', array('color' => '996699'));
$textrun->addText(', ');
$textrun->addText('bold', array('bold' => true));
$textrun->addText(', ');
$textrun->addText('italic', array('italic' => true));
$textrun->addText(', ');
$textrun->addText('underline', array('underline' => 'dash'));
$textrun->addText(', ');
$textrun->addText('strikethrough', array('strikethrough' => true));
$textrun->addText(', ');
$textrun->addText('doubleStrikethrough', array('doubleStrikethrough' => true));
$textrun->addText(', ');
$textrun->addText('superScript', array('superScript' => true));
$textrun->addText(', ');
$textrun->addText('subScript', array('subScript' => true));
$textrun->addText(', ');
$textrun->addText('smallCaps', array('smallCaps' => true));
$textrun->addText(', ');
$textrun->addText('allCaps', array('allCaps' => true));
$textrun->addText(', ');
$textrun->addText('fgColor', array('fgColor' => 'yellow'));
$textrun->addText(', ');
$textrun->addText('scale', array('scale' => 200));
$textrun->addText(', ');
$textrun->addText('spacing', array('spacing' => 120));
$textrun->addText(', ');
$textrun->addText('kerning', array('kerning' => 10));
$textrun->addText('. ');
    
    /* --- */
    
$filler_text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
        . 'Nulla fermentum, tortor id adipiscing adipiscing, tortor turpis commodo. '
        . 'Donec vulputate iaculis metus, vel luctus dolor hendrerit ac. '
        . 'Suspendisse congue congue leo sed pellentesque.';

// Normal
$section = $this->phpWord->addSection();
$section->addText("Normal paragraph. {$filler_text}");

// Two columns
$section = $this->phpWord->addSection(
    array(
        'colsNum'   => 2,
        'colsSpace' => 1440,
        'breakType' => 'continuous',
    )
);
$section->addText("Two columns, one inch (1440 twips) spacing. {$filler_text}");

// Normal
$section = $this->phpWord->addSection(array('breakType' => 'continuous'));
$section->addText("Normal paragraph again. {$filler_text}");

// Three columns
$section = $this->phpWord->addSection(
    array(
        'colsNum'   => 3,
        'colsSpace' => 720,
        'breakType' => 'continuous',
    )
);
$section->addText("Three columns, half inch (720 twips) spacing. {$filler_text}");

// Normal
$section = $this->phpWord->addSection(array('breakType' => 'continuous'));
$section->addText("Normal paragraph again. {$filler_text}");

/* --- */

/* -- TABLE -- */
 $this->Log->log(0,"[".__METHOD__."] BEFORE table");
$section = $this->phpWord->addSection();
$header = array('size' => 16, 'bold' => true);

// 1. Basic table

$rows = 10;
$cols = 5;
$section->addText('Basic table', $header);

$table = $section->addTable();
for ($r = 1; $r <= $rows; $r++) {
    $table->addRow();
    for ($c = 1; $c <= $cols; $c++) {
        $table->addCell(1750)->addText("Row {$r}, Cell {$c}");
    }
}
// 2. Advanced table
 $this->Log->log(0,"[".__METHOD__."] BEFORE Advanced table");
$section = $this->phpWord->addSection();
$section->addTextBreak(1);
$section->addText('Fancy table', $header);

$fancyTableStyleName = 'Fancy Table';
$fancyTableStyle = array('borderSize' => 6, 'borderColor' => '006699', 'cellMargin' => 80, 'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::CENTER, 'cellSpacing' => 50);
$fancyTableFirstRowStyle = array('borderBottomSize' => 18, 'borderBottomColor' => '0000FF', 'bgColor' => '66BBFF');
$fancyTableCellStyle = array('valign' => 'center');
$fancyTableCellBtlrStyle = array('valign' => 'center', 'textDirection' => \PhpOffice\PhpWord\Style\Cell::TEXT_DIR_BTLR);
$fancyTableFontStyle = array('bold' => true);
$this->phpWord->addTableStyle($fancyTableStyleName, $fancyTableStyle, $fancyTableFirstRowStyle);
$table2 = $section->addTable($fancyTableStyleName);
$table2->addRow(900);
$table2->addCell(2000, $fancyTableCellStyle)->addText('Row 1', $fancyTableFontStyle);
$table2->addCell(2000, $fancyTableCellStyle)->addText('Row 2', $fancyTableFontStyle);
$table2->addCell(2000, $fancyTableCellStyle)->addText('Row 3', $fancyTableFontStyle);
$table2->addCell(2000, $fancyTableCellStyle)->addText('Row 4', $fancyTableFontStyle);
$table2->addCell(500, $fancyTableCellBtlrStyle)->addText('Row 5', $fancyTableFontStyle);
for ($i = 1; $i <= 8; $i++) {
    $table2->addRow();
    $table2->addCell(2000)->addText("Cell {$i}");
    $table2->addCell(2000)->addText("Cell {$i}");
    $table2->addCell(2000)->addText("Cell {$i}");
    $table2->addCell(2000)->addText("Cell {$i}");
    $text = (0 == $i % 2) ? 'X' : '';
    $table2->addCell(500)->addText($text);
}
/*
 *  3. colspan (gridSpan) and rowspan (vMerge)
 *  ---------------------
 *  |     |   B    |    |
 *  |  A  |--------|  E |
 *  |     | C |  D |    |
 *  ---------------------
 */

$section->addPageBreak();
$section->addText('Table with colspan and rowspan', $header);

$fancyTableStyle = array('borderSize' => 6, 'borderColor' => '999999');
$cellRowSpan = array('vMerge' => 'restart', 'valign' => 'center', 'bgColor' => 'FFFF00');
$cellRowContinue = array('vMerge' => 'continue');
$cellColSpan = array('gridSpan' => 2, 'valign' => 'center');
$cellHCentered = array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER);
$cellVCentered = array('valign' => 'center');

$spanTableStyleName = 'Colspan Rowspan';
$this->phpWord->addTableStyle($spanTableStyleName, $fancyTableStyle);
$table = $section->addTable($spanTableStyleName);

$table->addRow();

$cell1 = $table->addCell(2000, $cellRowSpan);
$textrun1 = $cell1->addTextRun($cellHCentered);
$textrun1->addText('A');
$textrun1->addFootnote()->addText('Row span');

$cell2 = $table->addCell(4000, $cellColSpan);
$textrun2 = $cell2->addTextRun($cellHCentered);
$textrun2->addText('B');
$textrun2->addFootnote()->addText('Column span');

$table->addCell(2000, $cellRowSpan)->addText('E', null, $cellHCentered);

$table->addRow();
$table->addCell(null, $cellRowContinue);
$table->addCell(2000, $cellVCentered)->addText('C', null, $cellHCentered);
$table->addCell(2000, $cellVCentered)->addText('D', null, $cellHCentered);
$table->addCell(null, $cellRowContinue);
/*
 *  4. colspan (gridSpan) and rowspan (vMerge)
 *  ---------------------
 *  |     |   B    |  1 |
 *  |  A  |        |----|
 *  |     |        |  2 |
 *  |     |---|----|----|
 *  |     | C |  D |  3 |
 *  ---------------------
 * @see https://github.com/PHPOffice/PHPWord/issues/806
 */

$section->addPageBreak();
$section->addText('Table with colspan and rowspan', $header);

$styleTable = array('borderSize' => 6, 'borderColor' => '999999');
$this->phpWord->addTableStyle('Colspan Rowspan', $styleTable);
$table = $section->addTable('Colspan Rowspan');

$row = $table->addRow();
$row->addCell(1000, array('vMerge' => 'restart'))->addText('A');
$row->addCell(1000, array('gridSpan' => 2, 'vMerge' => 'restart'))->addText('B');
$row->addCell(1000)->addText('1');

$row = $table->addRow();
$row->addCell(1000, array('vMerge' => 'continue'));
$row->addCell(1000, array('vMerge' => 'continue', 'gridSpan' => 2));
$row->addCell(1000)->addText('2');

$row = $table->addRow();
$row->addCell(1000, array('vMerge' => 'continue'));
$row->addCell(1000)->addText('C');
$row->addCell(1000)->addText('D');
$row->addCell(1000)->addText('3');



    /* -- END TABLE -- */
    // Saving the document as OOXML file...
    $this->Log->log(0,"[".__METHOD__."] BEFORE createWriter");
    $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
    $this->Log->log(0,"[".__METHOD__."] BEFORE SAVE FILE");
    $objWriter->save(DR."/".self::docDir.$this->fileName);
   // Saving the document as ODF file...
    //$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'ODText');
    //$objWriter->save('helloWorld.odt');

    // Saving the document as HTML file...
    //$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'HTML');
    //$objWriter->save('helloWorld.html');
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x         
            $this->response->setError(1,'PHP7 Caught exception: '.$t->getMessage()." in ".$t->getFile());
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
            $this->response->setError(1,'PHP5 Caught exception: '.$e->getMessage()." in ".$e->getFile());
        }
        finally{
            
        }
        
        
     $this->Log->log(0,"[".__METHOD__."] END");
    }
    private function setUpData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $convert=new convertHtmlToArray();     
        
        foreach($this->projectData as $k => $v){
            /* EXPLDOE -> p */
            //$this->Log->log(0,"KEY => ".$k);
            if(preg_match("/^\d\d*-t$/",$k)){
                $this->Log->log(0,"FOUND TITLE ".$k);
                self::writeData($convert,$v,$k);   
            }
            if(preg_match("/^\d\d*-\d\d*-value$/",$k)){
                $this->Log->log(0,"FOUND TEXTAREA ".$k);
                self::writeData($convert,$v,$k);   
            }
        }
        //parent::setError(1,'test error');
    }
    private function writeData($convert,$v,$id){
        $this->Log->log(0,"[".__METHOD__."]");
        $convert->addHtml($v);
        $data=$convert->getHtmlArray();
        //$this->Log->log(0,$convert->getLog());
        if($convert->getError()){
            parent::setError(0,$convert->getError());
        }
        else{
            foreach($data as $k => $v){
                /* KEY v[0] VALUE ARRAY */
                /* KEY v[1] STYLE */
                self::writeDataToFile($v[0],$v[1],$id);
                //parent::logMwriteTekstulti(0, $v);       
            }
        }
    }

        
    private function writeDataToFile($v,$tag,$id){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->FontStyle=[];
        $this->ParagraphStyle=[];
        //$css=array('name' => 'Tahoma', 'size' => 10, 'color' => '#ff0000', 'bold' => true,'italic'=>true,'underline' => 'single');
        self::setUpTag($tag);
        //array_map(array($this, 'setUpTag'), $tag);
        $this->Log->log(0,"FONT STYLE:");
        $this->Log->logMulti(0,$this->FontStyle);
        /* PARSE FILE */
        $filePostion='bottom';
        $file='';
        if(preg_match('/value$/',$id)){
            $this->Log->log(0,"FOUND VALUE");
            /* GET ID */
            $tmpId=mb_substr($id,0,-5);
            $this->Log->log(0,"VALUE ID => ".$tmpId);
            /* SET FILE POSITION */
            self::setFilePosition($tmpId,$filePostion);
            /* SET FILE */
            self::setFile($tmpId,$filePostion,$file);
        }
        self::addTextFile($v,$filePostion,$file);   
    }
    private function setFilePosition($id,&$filePostion){
        if(array_key_exists($id."fileposition", $this->projectData)){
            $filePostion=$this->projectData[$id."fileposition"];
            UNSET($this->projectData[$id."fileposition"]);
        }
        else{
            $this->Log->log(0,"NO FILE POSITION => STAY DEFAULT ");
        }
        $this->Log->log(0,"FILE POSITION => ".$filePostion);
    }
    private function setFile($id,&$filePostion,&$file){
        if(array_key_exists($id."fileData", $this->files)){
            $this->Log->log(0,"FOUND FILE => ".$this->files[$id."fileData"]);
            $file=$this->files[$id."fileData"];
            UNSET($this->files[$id."fileData"]);
        }
        else{
            /* SETUP DEFAULT TEXT POSITION */
            $filePostion='bottom';
        }
    }
    private function addTextFile($tekstArray,$filePosition,$file){
        $this->Log->log(0,"[".__METHOD__."] FILE POSITION => ".$filePosition);
        $this->mainSection = $this->phpWord->addSection(array('breakType' => 'continuous'));
        //$this->mainSection->addTextBreak();
        /* NO FILE */
        if($file===''){
            array_map(array($this, 'writeTekst'), $tekstArray);
            return '';
        }
        $imageProperties=getimagesize($file);
        $this->Log->logMulti(0,$imageProperties);
        switch($filePosition):
            default:
            case 'bottom':    
                /* ADD TEXT */
                array_map(array($this, 'writeTekst'), $tekstArray);
                /* ADD FILE - IMAGE */
                $this->mainSection->addImage($file, array('width'=>$imageProperties[0], 'height'=>$imageProperties[1],'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER));
                break;
            case 'top':
                /* ADD FILE */
                 $this->mainSection->addImage($file, array('width'=>$imageProperties[0], 'height'=>$imageProperties[1],'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER));
                /* ADD TEXT */
                array_map(array($this, 'writeTekst'), $tekstArray);
                break;
            case 'left':
                self::setMultiColumnSection();
                $this->mainSection->addImage($file, array('width'=>$imageProperties[0], 'height'=>$imageProperties[1],'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER));
                array_map(array($this, 'writeTekst'), $tekstArray);
                self::setMultiColumnSection();
                break;
            case 'right':
                self::setMultiColumnSection();
                array_map(array($this, 'writeTekst'), $tekstArray);
                //$this->mainSection->addText($tekstArray[0],$this->FontStyle,$this->ParagraphStyle);    
                //$this->mainSection->addText($tekstArray[0],$this->FontStyle,$this->ParagraphStyle);  
                
                $this->mainSection->addImage($file, array('width'=>$imageProperties[0], 'height'=>$imageProperties[1],'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER));
                self::setMultiColumnSection();
                break;
        endswitch;
    }
    private function writeTekst($tekst){
         $this->mainSection->addText($tekst,$this->FontStyle,$this->ParagraphStyle);//array('underline' => 'single') //$fontStyleName          
    }
    private function setMultiColumnSection($colNum=2,$colSpace=10,$breakType='continuous'){
        $this->mainSection = $this->phpWord->addSection(array(
                                                                'colsNum'   => $colNum,
                                                                'colsSpace' => $colSpace,
                                                                'breakType' => $breakType
                                                            ));
    }
    private function setUpTag($t){
        $this->Log->log(0,"[".__METHOD__."]");      
        /* PARSE STYLE FROM THE END LAST STYLE MOST IMPORTANT */
        for($i=count($t);$i>0;$i--){
            $this->Log->logMulti(0,$t[$i-1]);      
            /* PARSE CSS STYLE */
            self::parseStyle($t[$i-1][1]);
            /* PARSE HTML TAG */
            self::parseTag($t[$i-1][0]);
        }        
    }
    private function parseStyle($style){
        $this->Log->log(0,"[".__METHOD__."]");
        if(!is_array($style)){
            $this->Log->log(0,"[".__METHOD__."] KEY STYLE IS NOT AN ARRAY => OMIT");
            return false;
        }
        $avaStyle=['font-size'=>'size','color'=>'color','font-family'=>'name','font-weight'=>'bold','background-color'=>'fgColor','text-align'=>'align'];
        //$this->Log->logMulti(0,$style);
        foreach($style as $s){
            $val=explode(':',$s); 
            self::checkStyleProperty($avaStyle,$val);        
        /* text-decoration => underline, font-weight => normal, bold */
        }
    }
    private function checkStyleProperty($avaStyle,&$val){
        if(count($val)!=2){
            parent::setError(0,'WRONG STYLE '.$val[0].' PARAMETER COUNT');
            return false;
        }
        $val[0]=mb_strtolower(trim($val[0]));
        $val[1]=mb_strtolower(trim($val[1]));
        if(!array_key_exists($val[0], $avaStyle)){
            parent::setError(0,'WRONG STYLE '.$val[0].' STYLE UNAVALIABLE');
            //$this->Log->log(0,"[".__METHOD__."] UNAVALIABLE STYLE => ".$val[0]);   
            return false;     
        }
        if(!array_key_exists($avaStyle[$val[0]], $this->FontStyle)){
            self::parseSizeType($avaStyle[$val[0]],$val[1]);
            self::parseFontWeight($avaStyle[$val[0]],$val[1]);
             /* SETUP TEXT ALIGN */
            $this->FontStyle[$avaStyle[$val[0]]]=$val[1];
            self::parseTextAlign($avaStyle[$val[0]],$val[1]);
        }
    }
    private function parseTag($tag){
        $this->Log->log(0,"[".__METHOD__."]");
        $avaTag=['b'=>['bold',true],'u'=>['underline','single'],'i'=>['italic',true],'span'=>''];
        $tag=mb_strtolower($tag);
        if(!array_key_exists($tag, $avaTag)){
            parent::setError(0,'TAG '.$tag.' UNAVALIABLE');
            //$this->Log->log(0,"[".__METHOD__."] UNAVALIABLE STYLE => ".$val[0]);   
            return false;     
        }
        /* SPAN EXCEPTION */
        if($tag==='span'){
            $this->Log->log(0,"[".__METHOD__."] SPAN => SKIP");
            return true;
        }
        /* setup correct value */
        $tagValue=$avaTag[$tag][1];
        /* change tag name */
        $tag=$avaTag[$tag][0];
        
        if(!array_key_exists($tag, $this->FontStyle)){
            $this->FontStyle[$tag]=$tagValue;
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] STYLE ALREADY SETUP => ".$tag);   
        }
    }
    private function parseSizeType($style,&$size){
        /* parse size value type */
        /* NOT THE SAME TYPE OF VAR */
        if($style=='size' && (mb_substr($size,-2,null)=='px')){
            /* FOUND SIZE WITH PX */
            $this->Log->log(0,"[".__METHOD__."] FOUND px");
            $size=mb_substr($size,0,mb_strlen($size)-2);
        }
        else if($style=='size' && (mb_substr($size,-3,null)=='ppt')){
            /* FOUND SIZE WITH PX */
            $this->Log->log(0,"[".__METHOD__."] FOUND ppt");
            $size=mb_substr($size,0,mb_strlen($size)-3);
        }
        else{
            /* NO SIZE TYPE */
        }
    }
    private function parseFontWeight($style,&$weight){
        /* parse size value type */
        /* NOT THE SAME TYPE OF VAR */
        if($style=='bold' && $weight=='bold'){ 
            $weight=true;
            /* FOUND SIZE WITH PX */
            $this->Log->log(0,"[".__METHOD__."] FOUND BOLD");
           
        }
        else if ($style=='bold' && $weight!='bold'){
            /* SETUP BOLD = FALSE */
            $this->Log->log(0,"[".__METHOD__."] FOUND NOT BOLD");
            $weight=false;
        }
        else{
            /* NO FONT-WEIGHT */
            //$weight=false;
        }
    }
    private function parseTextAlign($style,$align){
        $this->Log->log(0,"[".__METHOD__."] STYLE => ".$style.", ALIGN => ".$align);
        if($style!=='align'){ return false; }
        $cssAlign=[
                'center'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                'left'=>\PhpOffice\PhpWord\SimpleType\Jc::LEFT,
                'right'=>\PhpOffice\PhpWord\SimpleType\Jc::RIGHT];
        if(!array_key_exists($align,$cssAlign)){
            parent::setError(0,'WRONG STYLE ALIGN ATTRIBUTE => '.$align);
        }
        else{
            $this->ParagraphStyle['align']=$cssAlign[$align];       
            UNSET($this->FontStyle['align']);
        }
    }
    public function getDocName(){
        return $this->fileName;
    }
    function _desctruct(){
        $this->Log->log(0,"[".__METHOD__."]");
    }
}

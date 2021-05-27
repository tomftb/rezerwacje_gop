<?php
class createDoc extends errorConfirm {
    private $phpWorld;
    private $fileName='default.docx';
    private $projectData=array();
    private $mainSection;
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
    private $css=[];
    const docDir='DOC/';
    
    function __construct($projectDetails,$files,$fileName,$ext=''){
        parent::__construct();
        parent::log(0,$fileName);
        parent::log(0,$ext);
        //parent::logMulti(0, $projectDetails);
        //parent::logMulti(0, $files);
        $this->projectData=$projectDetails;
        $this->fileName=$fileName."_".uniqid().$ext;
        require_once 'bootstrap.php';
        // Creating the new document...
        $this->phpWord = new \PhpOffice\PhpWord\PhpWord();
        //parent::setError(1,'test error');
    }
    public function createProjectStageReport(){
        parent::log(0,"[".__METHOD__."]");
        $this->mainSection = $this->phpWord->addSection();
        self::setUpData(); 
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
        /* check is file exist */
        $objWriter->save($this->DR."/".self::docDir.$this->fileName);
    }
    public function createProjectReport(){
        /* Note: any element you append to a document must reside inside of a Section. */

    // Adding an empty Section to the document...
    $section = $this->phpWord->addSection();
    
    $text = "some text";
    $this->phpWord->addFontStyle('r2Style', array('bold'=>false, 'italic'=>false, 'size'=>12));
    $this->phpWord->addParagraphStyle('p2Style', array('align'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter'=>100));
    $section->addText($text, 'r2Style', 'p2Style');
    
    // Adding Text element to the Section having font styled by default...
    $section->addText( 'Do Realizacji: '.$this->projectData['rodzaj_umowy'],array('size'=>22,'color' => 'FF8080'));
    $section->addText( 'Numer: '.$this->projectData['rodzaj_umowy']);
    $section->addText( 'Do kierowania grupą (Lider) powołuje : '.$this->projectData['nadzor']);
    $section->addText( 'Temat: '.$this->projectData['rodzaj_umowy']);
    $section->addText( 'Typ: '.$this->projectData['typ_umowy']);
    $section->addText( 'System: '.$this->projectData['system']);
        /*
    * Note: it's possible to customize font style of the Text element you add in three ways:
    * - inline;
    * - using named font style (new font style object will be implicitly created);
    * - using explicitly created font style object.
    */
    // New portrait section - NEW BLANK PAGE
    //$section = $this->phpWord->addSection();
    $section = $this->phpWord->addSection();
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
    $section->addImage($this->DR.'/upload/609a22bf9f7c0_0.jpeg', array('width'=>800, 'height'=>533));
    
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
    $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
    $objWriter->save($this->DR."/".self::docDir.$this->fileName);
   // Saving the document as ODF file...
    //$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'ODText');
    //$objWriter->save('helloWorld.odt');

    // Saving the document as HTML file...
    //$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'HTML');
    //$objWriter->save('helloWorld.html');
    }
    private function setUpData(){
        parent::log(0,"[".__METHOD__."]");
        $convert=new convertHtmlToArray();     
        
        foreach($this->projectData as $k => $v){
            /* EXPLDOE -> p */
            //parent::log(0,"KEY => ".$k);
            if(preg_match("/^\d\d*-t$/",$k)){
                parent::log(0,"FOUND TITLE ".$k);
                self::writeData($convert,$v);   
            }
            if(preg_match("/^\d\d*-\d\d*-value$/",$k)){
                parent::log(0,"FOUND TEXTAREA ".$k);
                self::writeData($convert,$v);   
            }
        }
        //parent::setError(1,'test error');
    }
    private function writeData($convert,$v){
        parent::log(0,"[".__METHOD__."]");
        $convert->addHtml($v);
        $data=$convert->getHtmlArray();
        //parent::log(0,$convert->getLog());
        if($convert->getError()){
            parent::setError(0,$convert->getError());
        }
        else{
            foreach($data as $k => $v){
                /* KEY v[0] VALUE */
                /* KEY v[1] STYLE */
                self::writeTekst($v[0],$v[1]);
                //parent::logMulti(0, $v);       
            }
        }
    }

        
    private function writeTekst($v,$tag){
        parent::log(0,"[".__METHOD__."]");
        $this->css=[];
        //$css=array('name' => 'Tahoma', 'size' => 10, 'color' => '#ff0000', 'bold' => true,'italic'=>true,'underline' => 'single');
        self::setUpTag($tag);
        //array_map(array($this, 'setUpTag'), $tag);
        parent::log(0,"CSS:");
        parent::logMulti(0,$this->css);
        foreach($v as $k => $tekst){
            parent::log(0,$tekst);  
            $this->mainSection->addText($tekst,$this->css);//array('underline' => 'single') //$fontStyleName
        }
    }
    private function setUpTag($t){
        parent::log(0,"[".__METHOD__."]");      
        /* PARSE STYLE FROM THE END LAST STYLE MOST IMPORTANT */
        for($i=count($t);$i>0;$i--){
            parent::logMulti(0,$t[$i-1]);      
            self::parseStyle($t[$i-1][1]);
            self::parseTag($t[$i-1][0]);
        }        
    }
    private function parseStyle($style){
        parent::log(0,"[".__METHOD__."]");
        if(!is_array($style)){
            parent::log(0,"[".__METHOD__."] KEY STYLE IS NOT AN ARRAY => OMIT");
            return false;
        }
        $avaStyle=['font-size'=>'size','color'=>'color','font-family'=>'name','font-weight'=>'bold','background-color'=>'fgColor'];
        //parent::logMulti(0,$style);
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
        if(!array_key_exists($val[0], $avaStyle)){
            parent::setError(0,'WRONG STYLE '.$val[0].' STYLE UNAVALIABLE');
            //parent::log(0,"[".__METHOD__."] UNAVALIABLE STYLE => ".$val[0]);   
            return false;     
        }
        if(!array_key_exists($avaStyle[$val[0]], $this->css)){
            self::parseSizeType($avaStyle[$val[0]],$val[1]);
            self::parseFontWeight($avaStyle[$val[0]],$val[1]);
            $this->css[$avaStyle[$val[0]]]=$val[1];
        }
    }
    private function parseTag($tag){
        parent::log(0,"[".__METHOD__."]");
        $avaTag=['b'=>['bold',true],'u'=>['underline','single'],'i'=>['italic',true],'span'=>''];
        $tag=mb_strtolower($tag);
        if(!array_key_exists($tag, $avaTag)){
            parent::setError(0,'TAG '.$tag.' UNAVALIABLE');
            //parent::log(0,"[".__METHOD__."] UNAVALIABLE STYLE => ".$val[0]);   
            return false;     
        }
        /* SPAN EXCEPTION */
        if($tag==='span'){
            parent::log(0,"[".__METHOD__."] SPAN => SKIP");
            return true;
        }
        /* setup correct value */
        $tagValue=$avaTag[$tag][1];
        /* change tag name */
        $tag=$avaTag[$tag][0];
        
        if(!array_key_exists($tag, $this->css)){
            
            //self::parseFontWeight($avaTag[$tag],$tag);
            $this->css[$tag]=$tagValue;
        }
        else{
            parent::log(0,"[".__METHOD__."] STYLE ALREADY SETUP => ".$tag);   
        }
    }
    private function parseSizeType($style,&$size){
        /* parse size value type */
        /* NOT THE SAME TYPE OF VAR */
        if($style=='size' && (mb_substr($size,-2,null)=='px')){
            /* FOUND SIZE WITH PX */
            parent::log(0,"[".__METHOD__."] FOUND px");
            $size=mb_substr($size,0,mb_strlen($size)-2);
        }
        else if($style=='size' && (mb_substr($size,-3,null)=='ppt')){
            /* FOUND SIZE WITH PX */
            parent::log(0,"[".__METHOD__."] FOUND ppt");
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
            parent::log(0,"[".__METHOD__."] FOUND BOLD");
           
        }
        else if ($style=='bold' && $weight!='bold'){
            /* SETUP BOLD = FALSE */
            parent::log(0,"[".__METHOD__."] FOUND NOT BOLD");
            $weight=false;
        }
        else{
            /* NO FONT-WEIGHT */
            //$weight=false;
        }
        
    }
    public function getDocName(){
        return self::docDir.$this->fileName;
    }
    function _desctruct(){
        //$this->log(0,"[".__METHOD__."]");
    }
}

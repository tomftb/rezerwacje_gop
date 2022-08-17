<?php
class createDoc extends createDocAbstract {
    private $phpWorld;
    private $fileName='default.docx';
    private $projectData=array();
    private $mainSection;
    private $files=[];
    private $Log;
    private $ActFontStyle=array();
    private $paragraphStyle=array();
    private $styleStack=array();
    private $textRun;
    /*
     * VARIABLE DETERMINATES ADD NEW SECTION FOR EACH ELEMENT LINK TITIE, TEXTAREA...
     * false - the same section
     * true - new section
     */
    private $newSection=true;
    /*
     * VARAIBLE DETERMINATES NEW PAGE
     */
    private $newPage=false;
    private $FontStyle=[];
    private $ParagraphStyle=[];
    private $docDir='';
    
    function __construct($projectDetails,$files,$fileName,$ext='',$dir=''){
        $this->Log=Logger::init();
        $this->Log->log(0,"[".__METHOD__."] FILENAME => ".$fileName);
        $this->Log->log(0,"[".__METHOD__."] EXTENSION => ".$ext);
        /*
         * SETUP DOCUMENT DATA
         */
        $this->projectData=$projectDetails;
        $this->fileName=uniqid($fileName."_").$ext;
        $this->files=$files;
        $this->docDir=$dir;
        /*
         *  Creating the new document...
         */
        require_once APP_ROOT.'/bootstrap.php';
        $settings=new \PhpOffice\PhpWord\Settings();
        $settings::setOutputEscapingEnabled(true);
        $this->phpWord = new \PhpOffice\PhpWord\PhpWord();
        /*
         * IMPORTANT
         * NO PAGE BACKGROUND COLOR
         */
        //print_r($this->phpWord);
        self::setDocInfo();
    }
    private function setDocInfo(){
        $properties = $this->phpWord ->getDocInfo();
        $properties->setCreator('Tomasz 1111111');
        //echo 'asdasdas';
        //$this->phpWord->getDocumentProperties();
        
            //$properties = $phpWord->getDocInfo();
            
            $properties->setCompany('Geofizyka Toruń S.A.');
            $properties->setTitle('Testowy Etap projektu');
            $properties->setDescription('TEST OPIS');
            $properties->setCategory('TEST KATEGORIA');
            $properties->setLastModifiedBy('OSTATNIA MODYFIKACJA przez tborcyznski');
            $properties->setCreated(mktime(0, 0, 0, 3, 12, 2022));
            $properties->setModified(mktime(0, 0, 0, 3, 14, 2022));
            $properties->setSubject('TEMAT DOKUMENTU');
            $properties->setKeywords('SŁOWA KLUCZOWE');
          
    }
    private function throwError($d='',$l=0){
        Throw New Exception ($d,$l);
    }
    public function createProjectStageReport(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->mainSection = $this->phpWord->addSection();
        /*
         * RUN CREATE DOCUMENT
         */
        empty($this->projectData) ? self::throwError("NO STAGE DATA SELECTED",0) :  self::setUpData(); 
        /*
         * CREATE DOC WRITER
         */
        $this->Log->log(0,"[".__METHOD__.'] LOAD => \PhpOffice\PhpWord\IOFactory::createWriter()');
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
        /* check is file exist */
        $this->Log->log(0,"[".__METHOD__."] SAVE FILE => ".$this->docDir.$this->fileName);
        //$objWriter->setOutputEscapingEnabled(true);
        $objWriter->save($this->docDir.$this->fileName);
    }
    public function genReportStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        //print_r($this->projectData);
        /* MOVE data->valuenewline to property */
        self::setReportStagePage();
        self::setReportStageSection();
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
        $objWriter->save($this->docDir.$this->fileName);
    }
    private function setReportStagePage(){
        /* TO DO */
        
        //print_r($this->projectData->style);
        //print_r($this->projectData->property);
        unset($this->projectData->style);
        unset($this->projectData->property);
    }
    private function setReportStageSection(){
        //print_r($this->projectData->section);
        
        $firstRow=true;
        $firstSection=true;
        $breakType='continuous';
        $run=null;
        $actListName=uniqid('list_');
        $actTabStopName=uniqid('tabstop_');
        foreach($this->projectData->section as $s){
            /*
             * (twips )Twip to miara typograficzna, zdefiniowana jako 1⁄20 punktu typograficznego. Jeden twip ma 1⁄1440 cala lub 17,64 μm
             */
            //print_r($this->projectData->section);
            
            /* CHECK FOR NEW PAGE */
            
            if($s->property->valuenewline==='y' && $firstSection===false){
                //$section->addPageBreak();
                $breakType='newPage';
            }
            
            $section = self::setSectionColumn($s->subsection,$breakType);
            //var_dump($section);
            //print_r($section);
            /* COLUMNS */
            foreach($s->subsection as $u){
                //$section->addText("Regularność pomiarów danych sejsmicznychWedług podziału administracyjnego Polski projektowane zdjęcie sejsmiczne dla tematu: „Prace sejsmiczne 3D Wielkie Oczy” znajduje się w południowo-wschodniej Polsce, w obrębie województwa podkarpackiego, w powiecie jarosławskim, lubaczowskim i przemyskim (tylko punkty odbioru).Obszar badań zlokalizowany jest w obrębie koncesji poszukiwawczych: Lubaczów – Zapałów 21/97/p i Przeworsk – Jarosław - Stubno 24/99/p.Obszar projektowanego zdjęcia sejsmicznego Wielkie Oczy 3D położony jest we wschodniej części zapadliska przedkarpackiego. Głównymi elementami jego budowy geologicznej są utwory miocenu autochtonicznego i mezopaleozoiczne podłoże zbudowane z  utworów prekambru, kambru, ordowiku, syluru, jury i kredy.Otrzymaną regularność pomiarów zaprezentowano na mapach rozmieszczenia punktów wzbudzania i odbioru (Ryc. 3 1Ryc. 3 1), jak również na mapach krotności profilowania (ilości tras sejsmicznych w binach WPG) (Ryc. 3 2Ryc. 3 2), oraz mapach ");
                //$section->addText("1");
                /* TO DO */
                //print_r($u->style);
                //print_r($u->property);
                //print_r($u->subsectionrow);
                
               
                foreach($u->subsectionrow as $r){
                    //print_r($r);
                    //print_r($r->paragraph->property->paragraph);
                    if($firstRow){
                        //$this->phpWord->addFontStyle('r2Style', array('bold'=>false, 'italic'=>false, 'size'=>12));
                        //$this->phpWord->addParagraphStyle('p2Style', array('align'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter'=>100));
                        //$textrun = $section->addTextRun(array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER));
                        //$textrun->addText($r->paragraph->property->value, 'r2Style', 'p2Style');
                        //array('align'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter'=>100)
                        
                        /*
                         * CHECK TYPE
                         */
                        self::checkType($r,$section,$run,$actListName,$actTabStopName);
                        $firstRow=false;
                        continue;
                    }
                    //$textrun = self::checkNewLine($section,$textrun,$r->paragraph->property->valuenewline,$r);
                    self::checkNewLine($r,$section,$run,$actListName,$actTabStopName);
                    
                    
                    //print_r($r->paragraph->style);
                    
                    
                    //self::setText($textrun,$r);
                    //print_r($r->paragraph->style);
                    //print_r($r->paragraph->property);
                    //print_r($r->paragraph->tabstop);
                    //print_r($r->list->style);
                    //print_r($r->list->property);
                    //print_r($r->image->style);
                    //print_r($r->image->property);
                    //print_r($r->table->style);
                    //print_r($r->table->property);
                    
                }
                $firstRow=true;
            }
            //if($s->property->valuenewline==='y' && $firstSection===false){
                //$section->addPageBreak();
               // $section = self::setSectionColumn($s->subsection,'newPage');
           // }
            /* AT THE END ADD FAKE section if no more left */
            
            //break;
            //$section = $this->phpWord->addSection();
            //$section->getStyle()->setBreakType('continuous');
            //$section->addText(" 1 subsection");
            //self::setSectionColumn
            //print_r($s->property);
            //print_r($s->style);
            //print_r($s->subsection);
             $firstSection=false;
        }
    }
    private function checkType($r,&$section,&$run,&$actListName='',&$actTabStopName=''){
        //echo __METHOD__." - ";
        //echo $r->paragraph->property->paragraph." .";
        switch($r->paragraph->property->paragraph):
            default:
            case 'p':
                /* TO SET THE sAME TAB STOP - USE FRONT END TO ADD TAB STOP FOR NEW PARAGRAPH */
                $textrun = $section->addTextRun(parent::setParagraphProperties($r)); 
                //var_dump($this->phpWord);
                //$rightTabStyleName = 'rightTab';
                //$this->phpWord->addParagraphStyle($rightTabStyleName, array('tabs' => array(new \PhpOffice\PhpWord\Style\Tab('right', 1440,'dot'))));
                $textrun->addText($r->paragraph->property->value,parent::setFont($r->paragraph->style));
                array_walk($r->image,['self','setRunImage'],$textrun);
                //$section->addText($r->paragraph->property->value,parent::setFont($r->paragraph->style),$rightTabStyleName);
                $run = $textrun;
                break;
            case 'l':
                self::setListItem($r,$section,$run,$actListName,$actTabStopName);                
                break;
        endswitch;
    }
    private function checkTypeInLine($r,&$run){
        //echo __METHOD__." - ";
        //echo $r->paragraph->property->paragraph." .";
        switch($r->paragraph->property->paragraph):
            default:
            case 'p':
                //self::setText($run,$r);
                $run->addText($r->paragraph->property->value,parent::setFont($r->paragraph->style));
            case 'l':
                //self::setText($run,$r);
                $run->addText($r->paragraph->property->value,parent::setFont($r->paragraph->style));
        endswitch;
    }
    private function setListItem($r,&$section,&$run,&$actListName='',&$actTabStopName=''){
        //$this->phpWord->addSection();
        //echo "Act list name - ".$actListName.', nowa lista - ';
        //print_r($r->list->property->newList);
        //echo '.';
        if($r->list->property->newList==='y'){
            /* SET NEW LIST NAME */
            $actListName=uniqid('list_');
            $actTabStopName=uniqid('tabstop_');
            /* RESET TAB STOP */
        }
        //echo 'act list name - '.$actListName.' ';
        //echo 'act tab stop name - '.$actTabStopName.' ';
        $listItemRun = $section->addListItemRun($r->list->property->listLevel-1, self::setListStyle($r,$actListName), self::setListParagraph($r,$actTabStopName));
        //self::setText($listItemRun,$r);
        $listItemRun->addText($r->paragraph->property->value,parent::setFont($r->paragraph->style));
        array_walk($r->image,['self','setRunImage'],$listItemRun);
        
        $run = $listItemRun;
    }
    private function setRunImage($image,$key=0,&$item){
        $imageDir = ($image->data->tmp==='n') ? UPLOAD_DIR : TMP_UPLOAD_DIR;
        $item->addImage($imageDir.$image->property->uri, array('width' => $image->style->width, 'height' => $image->style->height));//, 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER
        
    }
    private function setListStyle($r,$listName=''){
      
        $hanging = parent::getTwip($r->paragraph->style->indentation,$r->paragraph->style->indentationMeasurement);
        $left = $hanging+parent::getTwip($r->paragraph->style->leftEjection,$r->paragraph->style->leftEjectionMeasurement);       
        /* Format List Array */
        $formatList=parent::getFormatList($r->list->style->listType);
        $this->phpWord->addNumberingStyle(
            $listName,
            array(
                'type'   => 'multilevel',
                'levels' => array(
                    /* ('start'=>, 'format'=>, 'text'=>, 'alignment'=>, 'tabPos'=>, 'left'=>, 'hanging'=>, 'font'=>, 'hint'=>) */
                    array('format' => $formatList[0], 'text' => $formatList[1].'%1'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 360
                    array('format' => $formatList[0], 'text' => $formatList[1].'%2'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 720
                    array('format' => $formatList[0], 'text' => $formatList[1].'%3'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 360
                    array('format' => $formatList[0], 'text' => $formatList[1].'%4'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 720
                    array('format' => $formatList[0], 'text' => $formatList[1].'%5'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 360
                    array('format' => $formatList[0], 'text' => $formatList[1].'%6'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 720
                    array('format' => $formatList[0], 'text' => $formatList[1].'%7'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily)//, 'tabPos' => 360
                ),
            )
        );
        //return array('listType' => \PhpOffice\PhpWord\Style\ListItem::TYPE_NUMBER_NESTED);
        return $listName;
    }
    private function setListParagraph($r,$actTabStopName='P-Style'){
        //$name = 'P-Style';
        //var_dump($this->phpWord);
            /*
            'styleName'           => array(self::READ_VALUE, array('w:pStyle', 'w:name')),
            'alignment'           => array(self::READ_VALUE, 'w:jc'),
            'basedOn'             => array(self::READ_VALUE, 'w:basedOn'),
            'next'                => array(self::READ_VALUE, 'w:next'),
            'indent'              => array(self::READ_VALUE, 'w:ind', 'w:left'),
            'hanging'             => array(self::READ_VALUE, 'w:ind', 'w:hanging'),
            'spaceAfter'          => array(self::READ_VALUE, 'w:spacing', 'w:after'),
            'spaceBefore'         => array(self::READ_VALUE, 'w:spacing', 'w:before'),
            'widowControl'        => array(self::READ_FALSE, 'w:widowControl'),
            'keepNext'            => array(self::READ_TRUE,  'w:keepNext'),
            'keepLines'           => array(self::READ_TRUE,  'w:keepLines'),
            'pageBreakBefore'     => array(self::READ_TRUE,  'w:pageBreakBefore'),
            'contextualSpacing'   => array(self::READ_TRUE,  'w:contextualSpacing'),
            'bidi'                => array(self::READ_TRUE,  'w:bidi'),
            'suppressAutoHyphens' => array(self::READ_TRUE,  'w:suppressAutoHyphens'),
                    */
        $this->phpWord->addParagraphStyle($actTabStopName, array('align'=>parent::setAlign($r->paragraph->style->textAlign),'tabs'=>parent::setTabStop($r->paragraph->tabstop) ,'spaceAfter' => 95));
        return $actTabStopName;
    }
    private function setSectionColumn($subsection,$breakType='continuous'){
        /* EXAMPLE:
            * Normal
                $section = $this->phpWord->addSection(array('breakType' => 'continuous'));
                $section->addText("Normal paragraph again. {$filler_text}");
            * Two columns
                $section = $this->phpWord->addSection(
                    array(
                        'colsNum'   => 2,
                        'colsSpace' => 1440,
                        'breakType' => 'continuous',
                        )
                );
                $section->addText("Two columns, one inch (1440 twips) spacing. {$filler_text}");
            * Three columns
                $section = $this->phpWord->addSection(
                    array(
                        'colsNum'   => 3,
                        'colsSpace' => 720,
                        'breakType' => 'continuous',
                    )
                );
                $section->addText("Three columns, half inch (720 twips) spacing. {$filler_text}");
         */
        //echo 'COUNT'.count(get_object_vars($subsection));
        //print_r(get_object_vars($subsection));
        //$this->Log->log(0,"[".__METHOD__."] SECTIONS -> ".count(get_object_vars($subsection))); 
        $cols = count(get_object_vars($subsection));
        //print_r($subsection);
        return $this->phpWord->addSection(
                    array(
                        'colsNum'   => $cols , //$cols
                        'breakType' => $breakType, // new word page
                        'colsSpace' => 2880/$cols  // 2880/$cols              
                    )
                );
    }    
    private function checkNewLine($r,&$section,&$run,&$actListName='',&$actTabStopName=''){
        //echo __METHOD__." - ";
        //echo $r->paragraph->property->valuenewline."\r\n";
        if($r->paragraph->property->valuenewline==='y'){
            self::checkType($r,$section,$run,$actListName,$actTabStopName);
        }
        else{
            self::checkTypeInLine($r,$run);
        }
    }
    public function createProjectReport(){
        $this->Log->log(0,"[".__METHOD__."]"); 
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
    $objWriter->save($this->docDir.$this->fileName);
   // Saving the document as ODF file...
    //$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'ODText');
    //$objWriter->save('helloWorld.odt');

    // Saving the document as HTML file...
    //$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'HTML');
    //$objWriter->save('helloWorld.html');
        
        
        
     $this->Log->log(0,"[".__METHOD__."] END");
    }
    private function setUpData(){
        $this->Log->log(0,"[".__METHOD__."]");
        /*
         * CREATE CONVERTER OBJECT
         */
        $convert=new convertHtmlToArray(); 
        $this->textRun = $this->mainSection->addTextRun();
        //self::addTitlePage();
        self::addPageHeader();
        self::addPageFooter();
        foreach($this->projectData as $k => $v){
            /* EXPLDOE -> p */
            $this->Log->log(0,"KEY => ".$k);
            $this->Log->log(0,"VALUE:\r\n".$v);
            /**/
            if(preg_match("/^\d\d*-t$/",$k)){
                $this->Log->log(0,"FOUND TITLE FIELD:\r\nKEY => ".$k."\r\nVALUE:\r\n".$v);
                self::writeData($convert,$v,$k);   
            }
            if(preg_match("/^\d\d*-\d\d*-value$/",$k)){
                $this->Log->log(0,"FOUND TEXTAREA FIELD:\r\nKEY => $k\r\nVALUE:\r\n$v");
                self::writeData($convert,$v,$k);   
            }
            
            /* CLEAR TEXT RUN */
            //$this->textRun=false;
            //$this->mainSection = $this->phpWord->addSection(array('breakType' => 'continuous'));
        }
        //die( $this->Log->log(0,"DIE at ".__LINE__));
    }
    private function writeData($convert,$v,$id){
        $this->Log->log(0,"[".__METHOD__."][".$id."]VALUE:\r\n".$v);
        $convert->addHtml($v);
        /*
         * GET DATA FROM CONVERTER
         */
        $convert->createHtmlArray();
        //$data=$convert->getHtmlArray();
        //$this->Log->log(0,"HTML ARRAY:");
        //$this->Log->logMulti(0,$data);
        //$this->Log->log(0,$convert->getLog());
        //$this->Log->log(0,"DIE:".__LINE__);
       
        if($convert->getError()){
            Throw New Exception("CONVERT ERROR: ".$convert->getError(),0);
        }
        else{
            
           
            $this->Log->logMulti(0,$convert->getHtmlArray());
            
            //self::writeElementReport($convert->getHtmlArray());
            //die(__METHOD__.__LINE__); 
            array_map(array($this, 'writeElementReport'), $convert->getHtmlArray());
            /* 
             * WILL GIVE US BREAK LINE
             * IF method run in this position
             * 
             *  $this->textRun = $this->mainSection->addTextRun();
             * 
             */
            self::setUpNewSection();
            /*
             * TURN OF
               foreach($data as $k => $v){
                 KEY v[0] VALUE ARRAY
                 KEY v[1] STYLE
                self::writeDataToFile($v[0],$v[1],$id);
                parent::logMwriteTekstulti(0, $v);       
                }
             */
           
        }
        //die(__METHOD__.__LINE__);
    }
    private function setUpNewSection(){
        if($this->newSection){
            $this->textRun = $this->mainSection->addTextRun();
        }
    }
    private function writeElementReport($element=array()){
        $this->Log->log(0,__METHOD__);
        //if(!is_array($element)){
        //    self::throwError(__METHOD__.'WRONG ELEMENT => NOT ARRAY',0);
        //}
        $element['type']==='text' ? self::writeText($element['tag']) : self::checkTag($element); 
    }
    private function writeText($text=''){
        $this->Log->log(0,__METHOD__."\r\n ".$text."\r\nCURRENT STYLE:");
        $this->Log->logMulti(2,$this->ActFontStyle);
        $this->textRun->addText($text,$this->ActFontStyle,$this->paragraphStyle);
    }
    private function checkTag($element=array()){
        $this->Log->log(0,__METHOD__."\r\nTYPE => ".$element['type']."\r\nTAG => ".$element['tag']);
         /*
         * tag = HTML otag/ctag => otag => open tag, ctag => close tag
         * attrbiute = HTML tag attribute
         */
        if($element['type']==='otag'){
            self::setOpenTag($element['tag']);
            self::setOpenAttribute($element['tag'],$element['style']);
        }
        else if($element['type']==='ctag'){
            self::setCloseTag($element['tag']);
            self::setCloseAttribute($element['tag']);
        }
        else if($element['type']==='octag'){
            self::setOpenCloseTag($element['tag']);
        }
        else{
            self::throwError("UNAVAILABLE TAG TYPE!",0);	
        }
    }
      private function setOpenTag($tag=''){
        $this->Log->log(0,__METHOD__." ".$tag);
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
            default:/* UNAVAILABLE TAG */
                //self::throwError("UNAVAILABLE TAG!",0);	
                break;
        }
    }
    private function setCloseTag($tag=''){
        $this->Log->log(0,__METHOD__." ".$tag);
        switch($tag){
            case 'P':
		/* ADD BREAK LINE */
                $this->Log->log(0,"ADD TEXT BREAK");
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
            default: /* UNAVAILABLE TAG */
                //self::throwError("UNAVAILABLE TAG!",0);	
                self::throwError("UNAVAILABLE TAG - <b>".$tag."</b>",0);
                break;
        }
    }
    private function setOpenCloseTag($tag=''){
        $this->Log->log(0,__METHOD__." ".$tag);
        switch($tag){
            case 'BR':
                $this->Log->log(0,"ADD TEXT BREAK");
                $this->textRun->addTextBreak();
                break;
            default:/* UNAVAILABLE TAG */
                //self::throwError("UNAVAILABLE TAG!",0);	
                self::throwError("UNAVAILABLE TAG - <b>".$tag."</b>",0);
                break;
        }
    }
    private function setOpenAttribute($tag='',$attr=array()){
        $this->Log->log(0,__METHOD__." ADD TO STACK => ".$tag);
        array_push($this->styleStack,array('tag'=>$tag,'attr'=>$attr));
	//echo "CURRENT STACK:\r\n";
        //print_r($this->styleStack);
	self::updateActFontStyle($attr);	
    }
    private function updateActFontStyle($attr=array()){
        $this->Log->log(0,__METHOD__);
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
                                    self::throwError("UNAVAILABLE STYLE - <b>".$a['property']."</b>",0);
                                    break;
			}
        }
	}
    private function setCloseAttribute($tag=''){
        $this->Log->log(0,__METHOD__." ".$tag);
	self::checkLastStyleStackElement($tag);
	self::updateStyleStack(self::findLastOpenTag($tag));
	/* UPDATE CURRENT FONT STYLE => TAG AND ATTRIBUTE */
	self::updateCurrentFontStyle();	
    }
    private function checkLastStyleStackElement($tag=''){
		$this->Log->log(0,__METHOD__);
		//$last='';
		//print_r(end($this->styleStack));
		if(count($this->styleStack)===0){
                    self::throwError("STACK IS EMPTY!",0);	
		}
		$last=end($this->styleStack)['tag'];
		if($last!==$tag){
                    self::throwError("LAST STACK ELEMENT ".$last." NOT EQUAL CLOSE TAG ".$tag,0);
		}
		else{
                    $this->Log->log(0,"LAST STACK ELEMENT ".$last." EQUAL CURRENT CLOSE TAG ".$tag);
		}
	}
        private function findLastOpenTag($tag=''){
            $this->Log->log(0,__METHOD__);
            $key=0;
            if(count($this->styleStack)===0){
                self::throwError(__METHOD__." STACK IS EMPTY",0);
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
                //echo "[KEY:".$key."]\r\n";
                //echo "[TAG:".$this->styleStack[$key]['tag']."]\r\n";
                //echo "[ATTR]\r\n";
		//print_r($this->styleStack[$key]['attr']);
		if($this->styleStack[$key]['tag']===$tag){
                    //echo "FOUND OPEN TAG => RETURN STYLE STACK KEY => ".$key."\r\n";
                    return $key;
		}
            }
            return -1;
	}
        private function updateStyleStack($key=-1){
		//echo __METHOD__."\r\nKEY TO REMOVE => ".$key."\r\n";
		$tmpStyleStack=array();
		if($key===-1){
			/* KEY NOT FOUND -> THROWN ERROR */
                        self::throwError(__METHOD__." KEY NOT FOUND",0);
			
		}
		foreach($this->styleStack as $k => $v){
			//echo "K:".$k."\r\n";
			//print_r($v['attr']);
			if($k!==$key){
				array_push($tmpStyleStack,$v);
			}
		}
		//echo "NEW STYLE STACK:\r\n";
		//print_r($tmpStyleStack);
		/* UPDATE CURRENT STYLE STACK */
		$this->styleStack=$tmpStyleStack;
		//echo "UPDATED STYLE STACK:\r\n";
		//print_r($this->styleStack);
	}
        private function updateCurrentFontStyle(){
            $this->Log->log(0,__METHOD__);
            /* CLEAR */
            $this->ActFontStyle=array();
            //$ActFontStyle=array();
            foreach($this->styleStack as $k => $v){
		//echo "K:".$k."\r\n";
		//print_r($v['attr']);
		self::setOpenTag($v['tag']);
		self::updateActFontStyle($v['attr']);	
            }
            $this->Log->log(0,"CURRENT FONT STYLE:");
            $this->Log->logMulti(0,$this->ActFontStyle);
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
        $file=[
            'position'=>'bottom',
            'name'=>'',
            'url'=>''
        ];
        
        if(preg_match('/value$/',$id)){
            $this->Log->log(0,"FOUND VALUE");
            /* GET ID */
            $tmpId=mb_substr($id,0,-5);
            $this->Log->log(0,"VALUE ID => ".$tmpId);
            /* SET FILE POSITION */
            self::setImagePosition($tmpId,$file['position']);
            /* SET FILE */
            self::setImage($tmpId,$file);
        }
        self::addTextImage($v,$file);   
    }
    private function addTitlePage(){
        $this->mainSection = $this->phpWord->addSection(array('breakType' => 'continuous'));
        $FontStyle= array(
            'name' => 'Lato Light',
            'size' => 18,
            'color' => '#595959',
            'bold' => false,
            'italic'=>false,
            'underline' => false
        );// underline -> single
        $ParagraphStyle=array(
            'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER,
            'spaceAfter'=>300,
            'spaceBefore'=>2500
        );
        $this->mainSection->addText('OPRACOWANIE BADAŃ SEJSMICZNYCH',$FontStyle,$ParagraphStyle);
        $FontStyle['name']='Lato Black';
        $ParagraphStyle['spaceAfter']=0;
        $ParagraphStyle['spaceBefore']=0;
        //$FontStyle= array('name' => , 'size' => 7, 'color' => '#000000', 'bold' => true,'italic'=>false,'underline' => false);// underline -> single
       
        $this->mainSection->addText('PRZETWARZANIE DANYCH SEJSMICZNYCH 3D WIELKIE OCZY',$FontStyle,$ParagraphStyle);
        // Three columns
        $this->mainSection = $this->phpWord->addSection(
            array(
                'colsNum'   => 3,
                'colsSpace' => 720,
                'breakType' => 'continuous',
            )
        );
        $FontStyle['name']='Lato Light';
        $FontStyle['size']=12;
        $ParagraphStyle['spaceBefore']=8430;
        $ParagraphStyle['alignment']=\PhpOffice\PhpWord\SimpleType\Jc::LEFT;
        $this->mainSection->addText("Na zlecenie:",$FontStyle,$ParagraphStyle);
        $this->mainSection = $this->phpWord->addSection(
            array(
                'colsNum'   => 3,
                'colsSpace' => 720,
                'breakType' => 'continuous',
            )
        );
        $FontStyle['name']='Lato';
        $FontStyle['bold']=true;
         $ParagraphStyle['spaceBefore']=0;
        $this->mainSection->addText("PGNiG SA",$FontStyle,$ParagraphStyle);
        $this->mainSection = $this->phpWord->addSection(
            array(
                'colsNum'   => 3,
                'colsSpace' => 720,
                'breakType' => 'continuous',
            )
        );
        $FontStyle['name']='Lato Light';
        $FontStyle['bold']=false;
        $this->mainSection->addText("Data: październik 2021",$FontStyle,$ParagraphStyle);
        $this->mainSection = $this->phpWord->addSection(
            array(
                'colsNum'   => 3,
                'colsSpace' => 720,
                'breakType' => 'continuous',
            )
        );
        $this->mainSection->addText("Egz. nr  1/2",$FontStyle,$ParagraphStyle);
        $this->mainSection->addImage(
            'D:\WWW\rezerwacja-gop.geofizyka.pl\WWW\upload\main_tlo.jpg',
            array(
                'width'            => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(20.98),
                'height'           => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(29.76),
                //'width' => 77, 
                //'height' => 49,
                'unit'=>'px',
                'wrappingStyle' => 'behind',
                'positioning'=>'relative',
                //'posVertical'      => \PhpOffice\PhpWord\Style\Image::POSITION_VERTICAL_CENTER,
                //'positioning'      => \PhpOffice\PhpWord\Style\Image::POSITION_ABSOLUTE,
                //'posHorizontal'    => \PhpOffice\PhpWord\Style\Image::POSITION_HORIZONTAL_LEFT,//POSITION_HORIZONTAL_RIGHT
                'posHorizontalRel' => \PhpOffice\PhpWord\Style\Image::POSITION_RELATIVE_TO_PAGE,
                'posVerticalRel'   => \PhpOffice\PhpWord\Style\Image::POSITION_RELATIVE_TO_PAGE, // POSITION_RELATIVE_TO_PAGE
                //'marginright'       => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(15.5),
                //'marginTop'        => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(1.5),
                //'marginLeft'       => 200,
                //'marginTop'        => 30,
                //'marginBottom'=>1000
            )
);
        //$ParagraphStyle['pageBreakBefore']='true';
        //$this->mainSection->addText("Egz. nr  1/2",$FontStyle,$ParagraphStyle);
        $this->mainSection->addPageBreak();
        $this->mainSection = $this->phpWord->addSection(array('breakType' => 'continuous'));
        $FontStyle['name']='Lato Light';
        $FontStyle['size']=18;
        $ParagraphStyle['spaceBefore']=1000;
        $ParagraphStyle['spaceAfter']=500;
        $ParagraphStyle['alignment']=\PhpOffice\PhpWord\SimpleType\Jc::CENTER;
        $this->mainSection->addText('OPRACOWANIE BADAŃ SEJSMICZNYCH',$FontStyle,$ParagraphStyle);
        $FontStyle['name']='Lato Black';
        $ParagraphStyle['spaceAfter']=1000;
        $ParagraphStyle['spaceBefore']=0;
        $this->mainSection->addText('PRZETWARZANIE DANYCH SEJSMICZNYCH 3D WIELKIE OCZY',$FontStyle,$ParagraphStyle);
        $ParagraphStyle['spaceAfter']=0;
        $ParagraphStyle['spaceBefore']=0;
        $ParagraphStyle['alignment']=\PhpOffice\PhpWord\SimpleType\Jc::LEFT;
        $this->mainSection = $this->phpWord->addSection(
            array(
                'colsNum'   => 2,
                'colsSpace' => 0,
                'breakType' => 'continuous',
            )
        );
        $FontStyle['name']='Lato';
        $FontStyle['size']=11;
        $this->mainSection->addText("Opracowanie:",$FontStyle,$ParagraphStyle);
        $this->mainSection->addTextBreak();
        $this->mainSection->addTextBreak();
        $this->mainSection->addTextBreak();
         $FontStyle['bold']=true;
        $this->mainSection->addText("mgr Anna Zduniak",$FontStyle,$ParagraphStyle);
        $this->mainSection->addText("mgr Jacek Biesaga",$FontStyle,$ParagraphStyle);
         $FontStyle['bold']=false;
        $this->mainSection->addTextBreak();
        $this->mainSection->addText("Nadzór technologiczny:",$FontStyle,$ParagraphStyle);
        $this->mainSection->addText("GŁÓWNY TECHNOLOG",$FontStyle,$ParagraphStyle);
        $this->mainSection->addTextBreak();
         $FontStyle['bold']=true;
        $this->mainSection->addText("mgr Serweryn Tlałka",$FontStyle,$ParagraphStyle);
         $FontStyle['bold']=false;
        $this->mainSection->addTextBreak();
        $this->mainSection->addTextBreak();
        $this->mainSection->addText("Weryfikował:",$FontStyle,$ParagraphStyle);
        $this->mainSection->addText("KIEROWNIK OŚRODKA",$FontStyle,$ParagraphStyle);
        $this->mainSection->addText("PRZETWARZANIA DANYCH",$FontStyle,$ParagraphStyle);
        $this->mainSection->addText("SEJSMICZNYCH",$FontStyle,$ParagraphStyle);
        $this->mainSection->addTextBreak();
         $FontStyle['bold']=true;
        $this->mainSection->addText("mgr Krzysztof Kolasiński",$FontStyle,$ParagraphStyle);
         $FontStyle['bold']=false;
        $this->mainSection->addText("(nr upr. IX-0511)",$FontStyle,$ParagraphStyle);
        $this->mainSection->addTextBreak();
        $this->mainSection->addText("Zatwierdził:",$FontStyle,$ParagraphStyle);
        $this->mainSection->addText("I WICEPREZES ZARZĄDU ds.",$FontStyle,$ParagraphStyle);
        $this->mainSection->addText("GEOFIZYKI",$FontStyle,$ParagraphStyle);
         $this->mainSection->addTextBreak();
          $FontStyle['bold']=true;
        $this->mainSection->addText("mgr inż. Jerzy Trela",$FontStyle,$ParagraphStyle);
         $FontStyle['bold']=false;
        $this->mainSection->addText("(nr upr. IX-0374)",$FontStyle,$ParagraphStyle);
        /* */
        $this->mainSection = $this->phpWord->addSection(array('breakType' => 'continuous'));
        $this->mainSection->addText("Na zlecenie:",$FontStyle,$ParagraphStyle);
        $this->mainSection->addTextBreak();
        $this->mainSection->addTextBreak();
        $this->mainSection->addImage(
            'D:\WWW\rezerwacja-gop.geofizyka.pl\WWW\upload\pgnig_small_logo.png',
            array(
                'width'            => 130,
                'height'           => 50,
                'unit'=>'px',
                'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::LEFT
            ),
            null,
            "PGING_small_logo"    
        );
        $FontStyle['bold']=true;
        /* pt. */
        $ParagraphStyle['spaceAfter']=0;
        $ParagraphStyle['spaceBefore']=0;
        /* 180 => 18 pt. */
        $ParagraphStyle['space']=array('line' => 180, 'rule' => 'auto');
        //$ParagraphStyle['spacing']=15;
        $this->mainSection->addText("Polskie Górnictwo Naftowe i Gazownictwo SA",$FontStyle,$ParagraphStyle);
        $this->mainSection->addText("Oddział Geologii i Eksploatacji",$FontStyle,$ParagraphStyle);
        $FontStyle['bold']=false;
        $this->mainSection->addText("ul. Kasprzaka 25, 01-224 Warszawa",$FontStyle,$ParagraphStyle);
        unset($ParagraphStyle['space']);
        self::testList();
        self::testTabulation();
        self::testListTabulation();
        $this->mainSection->addPageBreak();
    }
    private function testList(){
        $this->mainSection->addPageBreak();
        /* CREATE LIST */
        
        $fontStyleName = 'myOwnStyle';
        $this->phpWord->addFontStyle($fontStyleName, array('color' => 'FF0000'));
        $paragraphStyleName = 'P-Style';
        $this->phpWord->addParagraphStyle($paragraphStyleName, array('spaceAfter' => 95));
        
        $multilevelNumberingStyleName = 'multilevel';
        $this->phpWord->addNumberingStyle(
            $multilevelNumberingStyleName,
            array(
                'type'   => 'multilevel',
                'levels' => array(
                    array('format' => 'decimal', 'text' => '%1.', 'left' => 360, 'hanging' => 360, 'tabPos' => 360),
                    array('format' => 'upperLetter', 'text' => '%2.', 'left' => 720, 'hanging' => 360, 'tabPos' => 720),
                ),
            )
        );
        $predefinedMultilevelStyle = array('listType' => \PhpOffice\PhpWord\Style\ListItem::TYPE_NUMBER_NESTED);
        // New section
        $this->mainSection->addSection();
       
        // Lists
        $this->mainSection->addText('Multilevel list.');
        $this->mainSection->addListItem('List Item I', 0, null, $multilevelNumberingStyleName);
        $this->mainSection->addListItem('List Item I.a', 1, null, $multilevelNumberingStyleName);
        $this->mainSection->addListItem('List Item I.b', 1, null, $multilevelNumberingStyleName);
        $this->mainSection->addListItem('List Item II', 0, null, $multilevelNumberingStyleName);
        $this->mainSection->addListItem('List Item II.a', 1, null, $multilevelNumberingStyleName);
        $this->mainSection->addListItem('List Item III', 0, null, $multilevelNumberingStyleName);
        $this->mainSection->addTextBreak(2);
        $this->mainSection->addText('Basic simple bulleted list.');
        $this->mainSection->addListItem('List Item 1');
        $this->mainSection->addListItem('List Item 2');
        $this->mainSection->addListItem('List Item 3');
        $this->mainSection->addText('Continue from multilevel list above.');
        $this->mainSection->addListItem('List Item IV', 0, null, $multilevelNumberingStyleName);
        $this->mainSection->addListItem('List Item IV.a', 1, null, $multilevelNumberingStyleName);
        $this->mainSection->addTextBreak(2);
        $this->mainSection->addText('Multilevel predefined list.');
        $this->mainSection->addListItem('List Item 1', 0, $fontStyleName, $multilevelNumberingStyleName, $paragraphStyleName);
        $this->mainSection->addListItem('List Item 2', 0, $fontStyleName, $multilevelNumberingStyleName, $paragraphStyleName);
        $this->mainSection->addListItem('List Item 3', 1, $fontStyleName, $multilevelNumberingStyleName, $paragraphStyleName);
        $this->mainSection->addListItem('List Item 4', 1, $fontStyleName, $multilevelNumberingStyleName, $paragraphStyleName);
        $this->mainSection->addListItem('List Item 5', 2, $fontStyleName, $multilevelNumberingStyleName, $paragraphStyleName);
        $this->mainSection->addListItem('List Item 6', 1, $fontStyleName, $multilevelNumberingStyleName, $paragraphStyleName);
        $this->mainSection->addListItem('List Item 7', 0, $fontStyleName, $multilevelNumberingStyleName, $paragraphStyleName);
        $this->mainSection->addTextBreak(2);
        $this->mainSection->addText('List with inline formatting.');
        $listItemRun = $this->mainSection->addListItemRun();
        $listItemRun->addText('List item 1');
        $listItemRun->addText(' in bold', array('bold' => true));
        $listItemRun = $this->mainSection->addListItemRun(1, $predefinedMultilevelStyle, $paragraphStyleName);
        $listItemRun->addText('List item 2');
        $listItemRun->addText(' in italic', array('italic' => true));
        $footnote = $this->mainSection->addFootnote();
        $footnote->addText('this is a footnote on a list item');
        $listItemRun = $this->mainSection->addListItemRun();
        $listItemRun->addText('List item 3');
        $listItemRun->addText(' underlined', array('underline' => 'dash'));
        $this->mainSection->addTextBreak(2);

        // Numbered heading
        $headingNumberingStyleName = 'headingNumbering';
        $this->phpWord->addNumberingStyle(
            $headingNumberingStyleName,
            array('type'   => 'multilevel',
                  'levels' => array(
                      array('pStyle' => 'Heading1', 'format' => 'decimal', 'text' => '%1'),
                      array('pStyle' => 'Heading2', 'format' => 'decimal', 'text' => '%1.%2'),
                      array('pStyle' => 'Heading3', 'format' => 'decimal', 'text' => '%1.%2.%3'),
                  ),
            )
        );
        $this->phpWord->addTitleStyle(1, array('size' => 16), array('numStyle' => $headingNumberingStyleName, 'numLevel' => 0));
        $this->phpWord->addTitleStyle(2, array('size' => 14), array('numStyle' => $headingNumberingStyleName, 'numLevel' => 1));
        $this->phpWord->addTitleStyle(3, array('size' => 12), array('numStyle' => $headingNumberingStyleName, 'numLevel' => 2));

        $this->mainSection->addTitle('Heading 1', 1);
        $this->mainSection->addTitle('Heading 2', 2);
        $this->mainSection->addTitle('Heading 3', 3);
    }
    private function testList22(&$section){
        $section->addPageBreak();
        /* CREATE LIST */
        
        $fontStyleName = 'myOwnStyle';
        $this->phpWord->addFontStyle($fontStyleName, array('color' => 'FF0000'));
        $paragraphStyleName = 'P-Style';
        $this->phpWord->addParagraphStyle($paragraphStyleName, array('spaceAfter' => 95));
        
        $multilevelNumberingStyleName = 'multilevel';
        $this->phpWord->addNumberingStyle(
            $multilevelNumberingStyleName,
            array(
                'type'   => 'multilevel',
                'levels' => array(
                    array('format' => 'decimal', 'text' => '%1.', 'left' => 360, 'hanging' => 360, 'tabPos' => 360),
                    array('format' => 'upperLetter', 'text' => '%2.', 'left' => 720, 'hanging' => 360, 'tabPos' => 720),
                ),
            )
        );
        $predefinedMultilevelStyle = array('listType' => \PhpOffice\PhpWord\Style\ListItem::TYPE_NUMBER_NESTED);


       
        // Lists
        $section->addText('Multilevel list.');
        $section->addListItem('List Item I', 0, null, $multilevelNumberingStyleName);
        $section->addListItem('List Item I.a', 1, null, $multilevelNumberingStyleName);
        $section->addListItem('List Item I.b', 1, null, $multilevelNumberingStyleName);
        $section->addListItem('List Item II', 0, null, $multilevelNumberingStyleName);
        $section->addListItem('List Item II.a', 1, null, $multilevelNumberingStyleName);
        $section->addListItem('List Item III', 0, null, $multilevelNumberingStyleName);
        $section->addTextBreak(2);
        $section->addText('Basic simple bulleted list.');
        $section->addListItem('List Item 1');
        $section->addListItem('List Item 2');
        $section->addListItem('List Item 3');
        $section->addText('Continue from multilevel list above.');
        $section->addListItem('List Item IV', 0, null, $multilevelNumberingStyleName);
        $section->addListItem('List Item IV.a', 1, null, $multilevelNumberingStyleName);
        $section->addTextBreak(2);
        $section->addText('Multilevel predefined list.');
        $section->addListItem('List Item 1', 0, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        $section->addListItem('List Item 2', 0, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        $section->addListItem('List Item 3', 1, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        $section->addListItem('List Item 4', 1, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        $section->addListItem('List Item 5', 2, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        $section->addListItem('List Item 6', 1, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        $section->addListItem('List Item 7', 0, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        $section->addTextBreak(2);
        $section->addText('List with inline formatting.');
        $listItemRun = $section->addListItemRun();
        $listItemRun->addText('List item 1');
        $listItemRun->addText(' in bold', array('bold' => true));
        $listItemRun = $section->addListItemRun(1, $predefinedMultilevelStyle, $paragraphStyleName);
        $listItemRun->addText('List item 2');
        $listItemRun->addText(' in italic', array('italic' => true));
        $footnote = $section->addFootnote();
        $footnote->addText('this is a footnote on a list item');
        $listItemRun = $section->addListItemRun();
        $listItemRun->addText('List item 3');
        $listItemRun->addText(' underlined', array('underline' => 'dash'));
        $section->addTextBreak(2);

        // Numbered heading
        $headingNumberingStyleName = 'headingNumbering';
        $this->phpWord->addNumberingStyle(
            $headingNumberingStyleName,
            array('type'   => 'multilevel',
                  'levels' => array(
                      array('pStyle' => 'Heading1', 'format' => 'decimal', 'text' => '%1'),
                      array('pStyle' => 'Heading2', 'format' => 'decimal', 'text' => '%1.%2'),
                      array('pStyle' => 'Heading3', 'format' => 'decimal', 'text' => '%1.%2.%3'),
                  ),
            )
        );
        $this->phpWord->addTitleStyle(1, array('size' => 16), array('numStyle' => $headingNumberingStyleName, 'numLevel' => 0));
        $this->phpWord->addTitleStyle(2, array('size' => 14), array('numStyle' => $headingNumberingStyleName, 'numLevel' => 1));
        $this->phpWord->addTitleStyle(3, array('size' => 12), array('numStyle' => $headingNumberingStyleName, 'numLevel' => 2));

        $section->addTitle('Heading 1', 1);
        $section->addTitle('Heading 2', 2);
        $section->addTitle('Heading 3', 3);
    }
    private function testTabulation(){
        $this->mainSection->addPageBreak();
        // Define styles
        $multipleTabsStyleName = 'multipleTab';
        $this->phpWord->addParagraphStyle(
            $multipleTabsStyleName,
            array(
                'tabs' => array(
                    new \PhpOffice\PhpWord\Style\Tab('left', 1550),
                    new \PhpOffice\PhpWord\Style\Tab('center', 3200),
                    new \PhpOffice\PhpWord\Style\Tab('right', 5300),
                ),
            )
        );

        $rightTabStyleName = 'rightTab';
        $this->phpWord->addParagraphStyle($rightTabStyleName, array('tabs' => array(new \PhpOffice\PhpWord\Style\Tab('right', 9090,'dot'))));

        $leftTabStyleName = 'centerTab';
        $this->phpWord->addParagraphStyle($leftTabStyleName, array('tabs' => array(new \PhpOffice\PhpWord\Style\Tab('center', 4680))));

        // New portrait section
        $this->mainSection->addSection();

        // Add listitem elements
        $this->mainSection->addText("Multiple Tabs:\tOne\tTwo\tThree", null, $multipleTabsStyleName);
        $this->mainSection->addText("Left Aligned\tRight Aligned", null, $rightTabStyleName);
        $this->mainSection->addText("\tCenter Aligned", null, $leftTabStyleName);
    }
    private function testListTabulation(){
        
        $this->mainSection->addPageBreak();
        $fontStyleName = 'myOwnStyle2';
        $this->phpWord->addFontStyle($fontStyleName, array('color' => 'FF0000'));
        $paragraphStyleName = 'P-Style2';
        $this->phpWord->addParagraphStyle($paragraphStyleName, array('spaceAfter' => 95,'tabs' => array(new \PhpOffice\PhpWord\Style\Tab('right', 9090,'dot'))));
        
        $predefinedMultilevelStyle = array(
            'listType' => \PhpOffice\PhpWord\Style\ListItem::TYPE_NUMBER_NESTED,
                'start'=>20
                );
        /*
         * left - wcięcie pierwszego wiersza (od lewej strony)
         * hanging - odstęp od wcięcia, przeznaczony na numerację
         * tabPos - tabulacja
         * hanging - create function to dynamic calculate. function should check font size and count elements of list - only for numeric etc.
         */
        $multilevelNumberingStyleName = 'multilevel2';
        $this->phpWord->addNumberingStyle(
            $multilevelNumberingStyleName,
            array(
                'type'   => 'multilevel',
                'levels' => array(
                    array('format' => 'decimal', 'text' => '%1.', 'left' => 360, 'hanging' => 390, 'tabPos' => 360),
                    array('format' => 'decimal', 'text' => '%1.%2.', 'left' => 792, 'hanging' => 482, 'tabPos' => 792), // ... - 432 - ...
                    array('format' => 'decimal', 'text' => '%1.%2.%3.', 'left' => 1224, 'hanging' => 624, 'tabPos' => 1224),//1224 - 504 1224
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.', 'left' => 1728, 'hanging' => 648, 'tabPos' => 1800),
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.%5.', 'left' => 2232, 'hanging' => 792, 'tabPos' => 2520),
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.%5.%6.', 'left' => 2736 , 'hanging' => 936, 'tabPos' => 2880),
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.%5.%6.%7.', 'left' => 3240, 'hanging' => 1080, 'tabPos' => 3600),
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.%5.%6.%7.%8.', 'left' => 3744, 'hanging' => 1224, 'tabPos' => 3960),
                    array('format' => 'decimal', 'text' => '%1.%2.%3.%4.%5.%6.%7.%8.%9.', 'left' => 4320, 'hanging' => 1440, 'tabPos' => 4680)
                ),
            )
        );
        $this->mainSection->addText('Spis treści');
        $rightTabStyleName = 'rightTab2';
        $this->phpWord->addParagraphStyle($rightTabStyleName, array('tabs' => array(new \PhpOffice\PhpWord\Style\Tab('right', 9090,'dot'))));
        $this->mainSection->addText("Wstęp\t7", null, $rightTabStyleName);
        //$this->mainSection->addText('Wstęp');
        $listItemRun =$this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Cel prac oraz podstawowe zadania\t9");
        //$listItemRun->addText("\t1", null, $rightTabStyleName);
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Zakres prac i terminy realizacji\t11");
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Ocena danych wejściowych\t15");
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Sekwencja przetwarzania danych sejsmicznych\t27");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Sekwencja przetwarzania podstawowego z migracją czasową po składaniu (PoSTM))\t27");
        
        
        
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Sekwencja przetwarzania z migracją czasową przed składaniem (PreSTM))\t29");
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Procedury i parametry przetwarzania\t31");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Omówienie procedur sekwencji przetwarzania podstawowego\t 31");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Redakcja rekordów i tras sejsmicznych\t31");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Obliczanie bazowych poprawek statystycznych\t31");
        
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Tłumienie zakłóceń\t43");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Kompensacja zaniku amplitud tras sejsmicznych z czasem\t48");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Skalowanie amplitud tras sejsmicznych\t49");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Formowanie elementarnego sygnału sejsmicznego - etap 1 - standaryzacja sygnału\t52");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Formowanie elementarnego sygnału sejsmicznego - etap 2 - dekonwolucja\t54");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Analiza prędkości\t55");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Autmatyczna korekta poprawek statystycznych\t58");
        
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Interpolacja i regularyzacja zapisu sejsmicznego w binach offsetowych przed migracją czasową przed składaniem\t65");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Składanie tras wg WPG\t65");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Migracja czasowa po składaniu\t65");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Omówienie procedur sekwencji przetwarzania z migracją czasową przed skladaniem\t67");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Migracja czasowa przed składaniem oraz analizy prędkości\t67");
        
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Tłumienie odbić wielokrotnych\t67");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Składanie tras dla wersji z migracją czasową przed składaniem\t68");
        $listItemRun = $this->mainSection->addListItemRun(2, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Konwersja zero-fazowa sygnału, resztkowa rotacja fazy\t69");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Kontrola jakości procesów przetwarzania\t70");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Porównanie końcowych wyników migracji czasowej po składaniu z danymi archiwalnymi\t75");
        
        /* TESTOWE ROW */
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Porównanie końcowych wyników migracji czasowej po składaniu z danymi archiwalnymi\t75");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Porównanie końcowych wyników migracji czasowej po składaniu z danymi archiwalnymi\t75");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Porównanie końcowych wyników migracji czasowej po składaniu z danymi archiwalnymi\t75");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Porównanie końcowych wyników migracji czasowej po składaniu z danymi archiwalnymi\t75");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Porównanie końcowych wyników migracji czasowej po składaniu z danymi archiwalnymi\t75");
        $listItemRun = $this->mainSection->addListItemRun(1, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Porównanie końcowych wyników migracji czasowej po składaniu z danymi archiwalnymi\t75");
        
        
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Ilustracja produktów przetwarzania\t83");
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Wnioski i ocena rezultatów przetwarzania\t93");
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Wykaz danych przekazanych Zleceniodawcy\t95");
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Spis rycin\t98");
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Notatki ze spotkania\t103");
        /* TESTOWE ROW */
        for ($i=0; $i<200; $i++){
            $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
            $listItemRun->addText($i."Sekwencja przetwarzania podstawowego z migracją czasową po składaniu (PoSTM))\t27");
        }
        $listItemRun = $this->mainSection->addListItemRun(0, $multilevelNumberingStyleName, $paragraphStyleName);
        $listItemRun->addText("Sekwencja przetwarzania podstawowego z migracją czasową po składaniu (PoSTM))\t27");
        //$this->mainSection->addListItem('Cel prac oraz podstawowe zadania\t1', 0, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        //$this->mainSection->addListItem('Zakres prac i terminy realizacji\t2', 0, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        //$this->mainSection->addListItem('List Item 3', 1, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        //$this->mainSection->addListItem('List Item 4', 1, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        //$this->mainSection->addListItem('List Item 5', 2, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        //$this->mainSection->addListItem('List Item 6', 1, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
        //$this->mainSection->addListItem('List Item 7', 0, $fontStyleName, $predefinedMultilevelStyle, $paragraphStyleName);
    }
    private function setImagePosition($id,&$filePostion){
        if(array_key_exists($id."fileposition", $this->projectData)){
            $filePostion=$this->projectData[$id."fileposition"];
            UNSET($this->projectData[$id."fileposition"]);
        }
        else{
            $this->Log->log(0,"NO FILE-IMAGE POSITION => STAY DEFAULT ");
        }
        $this->Log->log(0,"FILE-IMAGE POSITION => ".$filePostion);
    }
    private function setImage($id,&$image){
        if(array_key_exists($id."fileData", $this->files)){
            $this->Log->log(0,"[".__METHOD__."]\r\nFOUND IMAGE\r\nNAME: ".$this->files[$id."fileData"][1]['name']."\r\nLOCATION: ".$this->files[$id."fileData"][0]);
            //$file=$this->files[$id."fileData"];
            $image['url']=$this->files[$id."fileData"][0];
            $image['name']=$this->files[$id."fileData"][1]['name'];
            UNSET($this->files[$id."fileData"]);
        }
        else{
            /* SETUP DEFAULT TEXT POSITION */
            $image['position']='bottom';
        }
    }
    private function addTextImage($tekstArray,$image){
        
         /* ADD PAGE HEAD */
        
        $this->Log->log(0,"[".__METHOD__."]\r\nIMAGE NAME: ".$image['name']."\r\nIMAGE POSITION: ".$image['position']."\r\nIMAGE URL: ".$image['url']);
        $this->mainSection = $this->phpWord->addSection(array('breakType' => 'continuous'));
        self::addPageHeader();
        //$this->mainSection->addTextBreak();
        /* NO FILE */
        if($image['url']===''){
            array_map(array($this, 'addText'), $tekstArray);
            return '';
        }
        /* DEFAULT UNIT PT */
        $imageProperties=self::setWordImageSize(getimagesize($image['url']));
        
        switch($image['position']):
            default:
            case 'bottom':    
                /* ADD TEXT */
                array_map(array($this, 'addText'), $tekstArray);
                /* 
                 * ADD FILE - IMAGE
                 * FILE
                 * STYLE
                 * WATERMARK
                 * NAME
                 */
                $this->mainSection->addImage($image['url'], array('width'=>$imageProperties[0], 'height'=>$imageProperties[1],'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER),null,$image['name']);
                break;
            case 'top':
                /* ADD FILE */
                 $this->mainSection->addImage($image['url'], array('width'=>$imageProperties[0], 'height'=>$imageProperties[1],'unit'=>'px','alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER),null,$image['name']);
                /* ADD TEXT */
                array_map(array($this, 'addText'), $tekstArray);
                break;
            case 'left':
                self::setMultiColumnSection();
                $this->mainSection->addImage($image['url'], array('width'=>$imageProperties[0], 'height'=>$imageProperties[1],'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER),null,$image['name']);
                array_map(array($this, 'addText'), $tekstArray);
                self::setMultiColumnSection();
                break;
            case 'right':
                self::setMultiColumnSection();
                array_map(array($this, 'addText'), $tekstArray);
                //$this->mainSection->addText($tekstArray[0],$this->FontStyle,$this->ParagraphStyle);    
                //$this->mainSection->addText($tekstArray[0],$this->FontStyle,$this->ParagraphStyle);  
                $this->mainSection->addImage($image['url'], array('width'=>$imageProperties[0], 'height'=>$imageProperties[1],'alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER),null,$image['name']);
                self::setMultiColumnSection();
                break;
        endswitch;
        /* ADD PAGE FOOTER (STOPKA) */
        self::addPageFooter();
    }
    private function addPageFooter(){
        $this->Log->log(0,"[".__METHOD__."]");
        $footer = $this->mainSection->addFooter();
        //var_dump($footer);
        //die(__LINE__);
        /*
        $footer->addImage(
                'D:\WWW\rezerwacja-gop.geofizyka.pl\WWW\upload\gt_line.png',
                array(
                    'width' => 602,
                    'height' => 1,
                    'unit'=>'px',
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                    'positioning'=> 'absolute',
                    'marginTop' => 0,
                    'marginBottom' => 0
                ));*/
         $footer->addImage('D:\WWW\rezerwacja-gop.geofizyka.pl\WWW\upload\gt_line.png', array('width' => 602, 'height' => 1,'unit'=>'px','alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER));
   

        

        $footer->addPreserveText('STRONA {PAGE} z {NUMPAGES}', array('name' => 'Lato','bold'=>true, 'size'=>7), array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER));
       
        //$footer->addLink('https://github.com/PHPOffice/PHPWord', 'PHPWord on GitHub');
    }
    private function addPageHeader(){
        $this->Log->log(0,"[".__METHOD__."]");
        $FontStyle= array('name' => 'Lato', 'size' => 7, 'color' => '#595959', 'bold' => true,'italic'=>false,'underline' => false);// underline -> single
        $ParagraphStyle=array('alignment'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER,'spaceAfter'=>0);
        $this->Log->logMulti(0,$this->ParagraphStyle);
        $this->Log->log(0,"[".__METHOD__."]");
        $subsequent = $this->mainSection->addHeader();
       
        //$subsequent->addText('Subsequent pages in Section 1 will Have this!');
        
        
        /*
        $subsequent->addImage(
            'D:\WWW\rezerwacja-gop.geofizyka.pl\WWW\upload\small_header_gt_logo.jpg',
            array(
                //'width'            => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(3),
                //'height'           => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(3),
                'width' => 77, 
                'height' => 49,
                'unit'=>'px',
                'positioning'      => \PhpOffice\PhpWord\Style\Image::POSITION_ABSOLUTE,
                'posHorizontal'    => \PhpOffice\PhpWord\Style\Image::POSITION_HORIZONTAL_LEFT, // POSITION_HORIZONTAL_CENTER
                //'posHorizontalRel' => \PhpOffice\PhpWord\Style\Image::POSITION_RELATIVE_TO_COLUMN,
                'posVertical'      => \PhpOffice\PhpWord\Style\Image::POSITION_VERTICAL_TOP,
                'posVerticalRel'   => \PhpOffice\PhpWord\Style\Image::POSITION_RELATIVE_TO_LINE ,//POSITION_RELATIVE_TO_LINE
            )
        );
         * 
        */
        
        $subsequent->addText("OPRACOWANIE BADAŃ SEJSMICZNYCH",$FontStyle,$ParagraphStyle);   
        $subsequent->addText("PRZETWARZANIE DANYCH SEJSMICZNYCH 3D WIELKIE OCZY",$FontStyle,$ParagraphStyle); 
        $subsequent->addImage(
            'D:\WWW\rezerwacja-gop.geofizyka.pl\WWW\upload\small_header_gt_logo.jpg',
            array(
                //'width'            => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(3),
                //'height'           => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(3),
                'width' => 77, 
                'height' => 49,
                'unit'=>'px',
                'wrappingStyle' => 'behind',
                'positioning'=>'relative',
                'posVertical'      => \PhpOffice\PhpWord\Style\Image::POSITION_VERTICAL_CENTER,
                //'positioning'      => \PhpOffice\PhpWord\Style\Image::POSITION_ABSOLUTE,
                'posHorizontal'    => \PhpOffice\PhpWord\Style\Image::POSITION_HORIZONTAL_LEFT,//POSITION_HORIZONTAL_RIGHT
                //'posHorizontalRel' => \PhpOffice\PhpWord\Style\Image::POSITION_RELATIVE_TO_PAGE,
                'posVerticalRel'   => \PhpOffice\PhpWord\Style\Image::POSITION_RELATIVE_TO_TMARGIN, // POSITION_RELATIVE_TO_PAGE
                //'marginright'       => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(15.5),
                //'marginTop'        => \PhpOffice\PhpWord\Shared\Converter::cmToPixel(1.5),
                //'marginLeft'       => 200,
                //'marginTop'        => 30,
                //'marginBottom'=>1000
            )
);
          
          
         
       // $subsequent->addImage('D:\WWW\rezerwacja-gop.geofizyka.pl\WWW\upload\small_header_gt_logo.jpg', array('width' => 77, 'height' => 49,'unit'=>'px'));
        $subsequent->addImage(
                'D:\WWW\rezerwacja-gop.geofizyka.pl\WWW\upload\gt_line.png',
                array(
                    'width' => 602,
                    'height' => 1,
                    'unit'=>'px',
                    'positioning'      => \PhpOffice\PhpWord\Style\Image::POSITION_ABSOLUTE,
                    'posVertical'      => \PhpOffice\PhpWord\Style\Image::POSITION_VERTICAL_CENTER
                )
        );
    }
    private function setWordImageSize($img){
        $maxWidth=602;
        $this->Log->log(0,"[".__METHOD__."] MAX WIDTH => $maxWidth");
        /* MAX WIDTH FOR WORD 450 px */
        $this->Log->logMulti(2,$img);
        /*
         * [0] => WITDH
         * [1] => HEIGHT
         * [2] => image constant type
         * [3] => width="xxx" height="yyy"
         * [bits] => example -> 8 
         * [mime] => example -> image/png
         */
        $orgWidth=$img[0];
        $orgHeight=$img[1];
        
        /* 450 PT, 602 PX */
        if(intval($orgWidth)>$maxWidth){
            $img[0]=$maxWidth;
            //$img[1]=602;
            /* 
             * RESIZE PERCENT 
             * (100-(($maxWidth*100)/$orgWidth))/100)
             */
            $img[1]=round($orgHeight-($orgHeight*((100-(($maxWidth*100)/$orgWidth))/100)),2);
            
            $this->Log->log(0,"[".__METHOD__."] NEW WIDTH => ".$img[0]." NEW HEIGHT => ".$img[1]);
        }
        
        return $img;
    }
    private function addText($tekst){
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
            Throw New Exception('WRONG STYLE '.$val[0].' PARAMETER COUNT',0);
        }
        $val[0]=mb_strtolower(trim($val[0]));
        $val[1]=mb_strtolower(trim($val[1]));
        if(!array_key_exists($val[0], $avaStyle)){
            Throw New Exception('WRONG STYLE '.$val[0].' STYLE UNAVALIABLE',0);    
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
        $avaTag=['b'=>['bold',true],'u'=>['underline','single'],'i'=>['italic',true],'span'=>'','li'=>'','ul'=>''];
        $tag=mb_strtolower($tag);
        if(!array_key_exists($tag, $avaTag)){
           Throw New Exception('TAG '.$tag.' UNAVALIABLE',0);    
        }
        /* SPAN UL LI EXCEPTION */
        if($tag==='span' || $tag==='ul' || $tag==='li'){
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
                'right'=>\PhpOffice\PhpWord\SimpleType\Jc::RIGHT
                //,'justify'=>\PhpOffice\PhpWord\SimpleType\Jc::JUSTIFY
        ];
        if(!array_key_exists($align,$cssAlign)){
            Throw New Exception('WRONG STYLE ALIGN ATTRIBUTE => '.$align,0);
        }
        $this->ParagraphStyle['align']=$cssAlign[$align];       
        UNSET($this->FontStyle['align']);
    }
    public function getDocName(){
        return $this->fileName;
    }
    function _desctruct(){
        $this->Log->log(0,"[".__METHOD__."]");
    }
}

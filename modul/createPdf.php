<?php
//session_start();
//require('..\\lib\\fpdf181\\tfpdf.php');
#require('lib\\fpdf181\\\\makefont\\makefont.php');
$DOC_ROOT=(filter_input(INPUT_SERVER,"DOCUMENT_ROOT"));
// H:/WWW/rezerwacja-gop.geofizyka.pl/WWW
require($DOC_ROOT.'/lib/fpdf181/tfpdf.php');
//require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

define("_SYSTEM_TTFONTS", $DOC_ROOT.'/lib/fpdf181/font/unifont/lato/');
define("FPDF_FONTPATH",$DOC_ROOT.'/lib/fpdf181/font/');

class PDF extends tFPDF
{
    // Page header
    function Header()
    {     
        $this->AddFont('Lato','','Lato-Regular.ttf',true);
        //$this->AddFont('DejaVu','','DejaVuSans.ttf',true);
        $this->SetFont('Lato','',6);
        //$this->SetFont('DejaVu','',6);
        $this->SetLeftMargin(20);
        $this->SetRightMargin(20);
        $this->SetTopMargin(20);
        $this->Cell(0,0,'PROCEDURA P-8.5/SP',0,0,'L');
        $this->Cell(0,0,'F.P-8.5',0,0,'R');
        $this->Cell(0,6,'',0,1,'C');
        $this->Cell(0,0,'POWOŁANIE GRUPY REALIZUJĄCEJ',0,0,'L');
        $this->Cell(0,0,'DATA: 31.10.2017',0,0,'R');
        $this->Cell(0,3,'',0,1,'C');
        $this->Cell(0,0,'WYDANIE: 6',0,0,'R');
        $this->Cell(0,3,'',0,1,'C');
         
        $this->Image('..\\lib\\fpdf181\\gt_line_header.png',20,22,0);
        // Line break
        $this->Ln(5);
        
    }

    // Page footer
    function Footer()
    {
        // Position at 1.5 cm from bottom
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Lato','',6);
        //$this->SetFont('DejaVu','',6);
        // Page number
        #$this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
        $this->SetTextColor(80,80,80);
        $this->Cell(0,6,'Dokument jest własnością Geofizyki Toruń S.A.',0,0,'C');
        $this->Cell(0,6,'',0,1,'C');
        $this->Cell(0,0,'Zabrania się samowolnego dokonywania zmian, kopiowania i rozpowszechniania tego dokumentu',0,0,'C');   
    }
}
   // Instanciation of inherited class
$pdf = new PDF();

#MakeFont('C:\\Windows\\Fonts\\comic.ttf','cp1252');
$pdf->SetTitle("Powołanie grupy realizującej",true);
$pdf->SetAuthor("Tomasz Borczyński" ,true);
$pdf->SetSubject("Powołanie grupy sejsmicznej" ,true);
$pdf->AliasNbPages();
$pdf->AddPage();
#$pdf->SetFont('Arial', 'B', 12);
// Add a Unicode font (uses UTF-8)
$pdf->AddFont('Lato','','Lato-Regular.ttf',true);
$pdf->AddFont('LatoB','','Lato-Bold.ttf',true);
//$pdf->AddFont('DejaVu','','DejaVuSans.ttf',true);
$pdf->SetFont('LatoB','',14);
//$pdf->SetFont('DejaVu','',14);
$pdf->Cell(0,6,'POWOŁANIE GRUPY REALIZUJĄCEJ',0,1,'C');
/* TEST DATA CONTENT
foreach($projectDetails as $keyFiled => $valueToAdd)
{
    $pdf->Cell(0,10,$keyFiled." - ".$valueToAdd,0,1,'C');  
}
 */
$pdf->SetFont('Lato', '', 11);   
//$pdf->SetFont('DejaVu', '', 11);
$pdf->Cell(0,3,'',0,1,'C');
$pdf->Cell(0,6,'do realizacji '.$projectDetails['typ_umowy'].' nr '.$projectDetails['numer_umowy'],0,1,'C');
$pdf->Cell(0,6,'temat : '.$projectDetails['temat_umowy'],0,1,'C');
$pdf->Cell(0,10,'',0,1,'C');
$pdfBodyPartList=array(
    array('n','Do kierowania Grupą powołuję - '.$projectDetails['kier_grupy']),
    array('n','W skład Grupy włączam pracowników wyszczególnionych w F.PJ-4.9/GOP/002'),
    array('n','Termin  realizacji '.$projectDetails['typ_umowy'].' '.$projectDetails['term_realizacji']),
    array('n','Kierującego Grupą (Lidera) zobowiązuję do przedstawienia harmonogramu prac'),
    array('','do dnia '.$projectDetails['harm_data']),
    array('n','Zobowiązuję do prowadzenia dokumentacji i zapisów zgodnie z procedurami ISO'),
    array('n','Kierującego Grupą (Lidera) zobowiązuję do zakończenia prac i napisania raportu'),
    array('','z realizacji zadania do dnia '.$projectDetails['term_realizacji']),
    array('n','Nadzór nad realizacją  powierzam - '.$projectDetails['nadzor']),
    array('n','Wykaz powiązanych dokumentów:')

);
// PROJECT DOCUMENTS DOCUMENT
foreach($projectDoc as $keyFiled => $valueToAdd)
{
    //print_r($valueToAdd);
    array_push($pdfBodyPartList,array('l',''.$valueToAdd['NAZWA']));
};
//print_r($pdfBodyPartList);
$pdf->SetFont('Lato','',11);
//$pdf->SetFont('DejaVu','',11);
$counter=1;
$counterLetter=0;
$letterBig=array("a","b","c","d","e","f","g","h","i","j","k","l","m");
$createDate=explode(' ',$projectDetails['create_date']);
$i=0;
foreach($pdfBodyPartList as $key =>$value)
{
    if($value[0]==='n')
    {
        $pdf->Cell(0,10,$counter.". ".$value[1],0,1);
        $counter++;
    }
    else if($value[0]==='l')
    {
        // ADD MARGIN LEFT
        $pdf->Cell(10);
        $pdf->Cell(0,10,$letterBig[$counterLetter].". ".$value[1],0,1);
        $counterLetter++;
    }
    else
    {
        $pdf->Cell(10);
        $pdf->Cell(0,10,$value[1],0,1);
    }
    
};
$pdf->SetFont('Lato','',9);
//$pdf->SetFont('DejaVu','',9);
$pdf->Cell(10);

$pdf->Cell(0,10,'',0,0,'L');
$pdf->Cell(0,10,'',0,0,'R');
$pdf->Cell(0,1,'',0,1,'C');
$pdf->Cell(15);
$pdf->Cell(0,10,' '.$projectDetails['nadzor'].' ',0,0,'L');
$pdf->SetRightMargin(35);
$pdf->Cell(0,10,' '.$projectMainTech['ImieNazwisko'].' ',0,0,'R');
$pdf->Cell(0,2,'',0,1,'C');
$pdf->Cell(0,10,'..........................................................',0,0,'L');
$pdf->SetRightMargin(20);
$pdf->Cell(0,10,'..........................................................',0,0,'R');
$pdf->Cell(0,10,'',0,1,'C');
$pdf->Cell(10);
$pdf->Cell(0,0,'/ KIEROWNIK ZESPOŁU /',0,0,'L');
$pdf->Cell(0);
$pdf->SetRightMargin(30);
$pdf->Cell(0,0,'/ GŁÓWNY TECHNOLOG /',0,0,'R');
$pdf->Cell(0,6,'',0,1,'C');
$pdf->Cell(0,10,'',0,0,'R');
$pdf->Cell(0,1,'',0,1,'C');

$pdf->Cell(0,10,'Zatwierdzam : '.$projectMainManager['ImieNazwisko'].' ',0,0,'R');
$pdf->Cell(0,2,'',0,1,'C');
$pdf->SetRightMargin(20);
$pdf->Cell(0,10,'..........................................................',0,0,'R');
$pdf->Cell(0,10,'',0,1,'C');
$pdf->SetRightMargin(30);
$pdf->Cell(0,0,'/ KIEROWNIK OŚRODKA /',0,0,'R');
$pdf->Cell(0,6,'',0,1,'C');
$pdf->SetRightMargin(45);
$pdf->Cell(0,6,'Data : '.$createDate[0].' ',0,0,'R');
$pdf->Cell(0,2,'',0,1,'C');
$pdf->SetRightMargin(20);
$pdf->Cell(0,5,'..........................................................',0,0,'R');
// TEAM
$pdf->AddPage();
$pdf->SetFont('Lato','',14);
//$pdf->SetFont('DejaVu','',14);
$pdf->Cell(0,8,'IMIENNY WYKAZ PRACOWNIKÓW',0,1,'L');
$pdf->SetFont('Lato','',11);
//$pdf->SetFont('DejaVu','',11);

$pdf->Cell(0,10,'realizujących '.$projectDetails['typ_umowy'].' nr '.$projectDetails['numer_umowy'],0,0,'L');
$pdf->Cell(0,6,'',0,1,'C');
$pdf->Cell(0,1,'..................................................................................................',0,1,'R');

$pdf->Cell(0,10,'temat '.$projectDetails['temat_umowy'],0,0,'L');
//Cell(width,height,text,border,ln,align,fill,llink)
$pdf->Cell(0,6,'',0,1,'C');
$pdf->Cell(0,1,'..............................................................................................................................',0,1,'R');
$pdf->Cell(0,6,'',0,1,'C');
// Header
$header = array('L.P.', 'NAZWISKO I IMIĘ', 'DATA OD','DATA DO', 'PODPIS I DATA');
  $width=34;  
foreach($header as $id=>$col)
{
        if($id===0)
        {
            $width=10;
        }
        else if($id===1)
        {
            $width=74; 
        }
        else if($id===2 || $id===3)
        {
            $width=25; 
        }
        else
        {
            $width=35.5;
        }
        $pdf->Cell($width,10,$col,1,0,'C');
      
}
    $pdf->Ln();      
    // Data
    $lp=1;
    foreach($projectTeam as $row)
    {
        $pdf->Cell(10,7,$lp,1,0,'C');
        foreach($row as $id =>$col)
        {
                if($id==='NazwiskoImie')
                {
                    $width=74; 
                    $value=$col;
                }
                else if($id==='DataOd' || $id==='DataDo')
                {
                    $width=25; 
                    $value=$col;
                }
                else
                {
                    $width=35.5;
                    $value=$col;
                } 
                $pdf->Cell($width,7,$value,1,0,'C');
    
        }
        // EMPTY CELL FOR PODPIS I DATA
        $pdf->Cell(35.5,7,'',1,0,'C');
        $lp++;       
        $pdf->Ln();
    }
// OPEN
$pdf->Output('project.pdf','I');
// DOWNLOAD
$pdf->Output('project.pdf','I');
?>
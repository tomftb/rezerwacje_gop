<?php
session_start();
//require('..\\lib\\fpdf181\\tfpdf.php');
#require('lib\\fpdf181\\\\makefont\\makefont.php');
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/lib/fpdf181/tfpdf.php');
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');


 #$field0=filter_input(INPUT_POST,fieldPdf0);
 
/*
        class PDF extends tFPDF
{
    // Page header
    function Header()
    {        
        $this->AddFont('DejaVu','','DejaVuSans.ttf',true);
        $this->SetFont('DejaVu','',6);
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
        $this->SetFont('DejaVu','',6);
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
$pdf->SetTitle("ąśćżźćżźłóąś",true);
$pdf->SetAuthor("Tomasz Borczyński" ,true);
$pdf->SetSubject("Powołanie grupy sejsmicznej" ,true);
$pdf->AliasNbPages();
$pdf->AddPage();
#$pdf->SetFont('Arial', 'B', 12);
// Add a Unicode font (uses UTF-8)
$pdf->AddFont('DejaVu','','DejaVuSans.ttf',true);
$pdf->SetFont('DejaVu','',14);
$pdf->Cell(0,6,'POWOŁANIE GRUPY REALIZUJĄCEJ',0,1,'C');
/*
foreach($inputArray as $keyFiled => $valueToAdd)
{
    $pdf->Cell(0,10,$keyFiled." - ".$valueToAdd,0,1,'C');  
}
 */
        /*
$pdf->SetFont('DejaVu', '', 11);
$pdf->Cell(0,6,'do realizacji '.$inputArray[0].' nr '.$inputArray[1],0,1,'C');
$pdf->Cell(0,6,'temat : '.$inputArray[2],0,1,'C');
$pdfBodyPartList=array(
    array('n','Do kierowania Grupą powołuję - '.$inputArray[3]),
    array('n','W skład Grupy włączam pracowników wyszczególnionych w F.PJ-4.9/GOP/002'),
    array('n','Termin  realizacji '.$inputArray[0].' '.$inputArray[4]),
    array('n','Kierującego Grupą (Lidera) zobowiązuję do przedstawienia harmonogramu prac'),
    array('','do dnia '.$inputArray[5]),
    array('n','Zobowiązuję do prowadzenia dokumentacji i zapisów zgodnie z procedurami ISO'),
    array('n','Kierującego Grupą (Lidera) zobowiązuję do zakończenia prac i napisania raportu'),
    array('','z realizacji zadania do dnia '.$inputArray[6]),
    array('n','Nadzór nad realizacją  powierzam - '.$inputArray[7]),
    array('n','Wykaz dokumentów związanych:'),
    array('l',''.$inputArray[8]),
    array('l',''.$inputArray[9]),
    array('l',''.$inputArray[10])
);
$pdf->SetFont('DejaVu','',11);
$counter=1;
$counterLetter=0;
$letterBig=array("a","b","c","d","e","f","g","h","i","j","k","l","m");
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
*/

// additional fields
/*
for($i=11; $i<count($inputArray); $i++)
{
    if(trim($inputArray[$i])!=='')
    {
        $pdf->Cell(10);
        $pdf->Cell(0,10,$letterBig[$counterLetter].". ".$inputArray[$i],0,1);
        $counterLetter++;   
    };
};
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(10);

$pdf->Cell(0,10,'',0,0,'L');
$pdf->Cell(0,10,'',0,0,'R');
$pdf->Cell(0,1,'',0,1,'C');
$pdf->Cell(0,10,'................................................................',0,0,'L');
$pdf->Cell(0,10,'................................................................',0,0,'R');
$pdf->Cell(0,10,'',0,1,'C');
$pdf->Cell(10);
$pdf->Cell(0,0,'/ KIEROWNIK ZESPOŁU /',0,0,'L');
$pdf->Cell(0);
$pdf->Cell(0,0,'/ GŁÓWNY TECHNOLOG /',0,0,'R');
$pdf->Cell(0,6,'',0,1,'C');
$pdf->Cell(0,10,'',0,0,'R');
$pdf->Cell(0,1,'',0,1,'C');
$pdf->Cell(0,10,'Zatwierdzam : ................................................................',0,0,'R');
$pdf->Cell(0,10,'',0,1,'C');
$pdf->Cell(0,0,'/ KIEROWNIK OŚRODKA /',0,0,'R');
$pdf->Cell(0,6,'',0,1,'C');
$pdf->Cell(0,6,'Data : ................................................................',0,0,'R');
$pdf->Output();
*/
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
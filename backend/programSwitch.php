<?php
require_once "./inputs/main.php"; 

if ($isSourceFromExcel) {

    // Program for reading from excel
    require_once "readExcelToJs.php";

} else {

    // "Program" for reading from javascript
    echo "<script src='$sourcePath'></script>";
    
}
<?php
header("Content-Type: text/html; charset=utf-8");

use Shuchkin\SimpleXLSX;

ini_set('error_reporting', E_ALL);
ini_set('display_errors', true);

require_once './backend/lib/SimpleXLSX.php';

// @$sourcePath
// @$sheetName

echo $sourcePath;

$incomes = [];
$expenses = [];
$wealths = [];
$now = "";
$to = "";

$xlsx = SimpleXLSX::parse($sourcePath);
$currentRead = "";

if ($xlsx) {

    // Get sheet index
    $sheetIndex = 0;
    for ($i = 0; $i < 30; $i++) {
        if ($xlsx->sheetName($i) == $sheetName) { // TODO temp solution until sheetNames can be iterated
            $sheetIndex = $i;
            break;
        }
    }
    
    foreach ($xlsx->rows($sheetIndex) as $row) {

        // Store current reads
        if ($row[0] == "TRANSACTIONS" || 
            $row[0] == "WEALTH" || 
            $row[0] == "PARAMS") {

            $currentRead = $row[0];
        }

        // Skip header
        if ($row[0] == "Name" || 
            empty($row[0])) {

            continue;
        }

        if ($currentRead == "TRANSACTIONS") {

            // Skip sub-transactions
            if ($row[4] != "YES") {
                continue;
            }

            // Work
            $value = intval($row[1]);
            if ($value < 0) {
                array_push($expenses, array(
                    'name' => $row[0],
                    'amount' => $value * -1,
                    'from' => empty($row[2]) ? null : $row[2],
                    'to' => empty($row[3]) ? null : $row[3]));
            } else {
                array_push($incomes, array(
                    'name' => $row[0],
                    'amount' => $value,
                    'from' => empty($row[2]) ? null : $row[2],
                    'to' => empty($row[3]) ? null : $row[3]));
            }

        } else if ($currentRead == "WEALTH") {

            // Skip sub-transactions
            if ($row[2] != "YES") {
                continue;
            }

            // Work
            array_push($wealths, array(
                'name' => $row[0],
                'amount' => intval($row[1])));

        } else if ($currentRead == "PARAMS") {

            if ($row[0] == "Now") { $now = $row[1]; }
            if ($row[0] == "To") {  $to = $row[1]; }
        }
    }
} else {
    echo SimpleXLSX::parseError();
}

$incomes = json_encode($incomes);
$expenses = json_encode($expenses);
$wealths = json_encode($wealths);

echo "
<script>
    var incomes = $incomes;
    var expenses = $expenses;
    var wealths = $wealths;
    var now = '$now';
    var to = '$to';

    console.log(incomes);
    console.log(expenses);
    console.log(wealths);
    console.log(now);
    console.log(to);
</script>";
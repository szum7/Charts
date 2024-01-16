<!DOCTYPE html>
<html>
	<head>
		<title>Charts</title>

        <link rel="stylesheet" href="src/style/main.css">

        <script src="src/script/chartsjs.min.4.4.1.js"></script> <!-- Current version for 2024-01-05 -->
	</head>
	<body>
        <!-- Canvas -->        
        <canvas id="myChart"></canvas>

        <!-- Input -->
        <!-- <script src="inputs/dev/prediction/input1.dev.js"></script> -->
        <!-- <script src="inputs/prod/prediction/input1.prod.js"></script> -->
        <?php require_once "./backend/readExcelToJs.php"; ?>
        
        <!-- Program -->
        <script src="src/charts/prediction.js"></script>
	</body>
</head>
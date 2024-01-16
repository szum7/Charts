<!DOCTYPE html>
<html>
	<head>
		<title>Charts</title>

        <link rel="stylesheet" href="src/style/main.css">

        <script src="./frontend/script/chartsjs.min.4.4.1.js"></script> <!-- Current version for 2024-01-05 -->
	</head>
	<body>
        <!-- Canvas -->
        <canvas id="myChart"></canvas>
        
        <!-- Input and program -->
        <?= require_once "./backend/programSwitch.php" ?>
        <script src="./frontend/charts/customDrawLineChart.js"></script>
	</body>
</head>
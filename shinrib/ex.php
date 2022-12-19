<!DOCTYPE html>
<html lang="ja">

<?php
session_start();
$cycleCount = $_POST["cnt"];
?>

<head>
    <meta charset="UTF-8">
    <title>エレベータのUI実験</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <span>
        <p id="cntContainer"><?php print $cycleCount; ?></p>
    </span>
    <div>
        <div class="verticalCenterParent" id="centerParent">
            <div class="verticalCenter" id="center">
            </div>
        </div>
        <table id="UI">
        </table>
    </div>
</body>

</html>
<script src="ex.js"></script>
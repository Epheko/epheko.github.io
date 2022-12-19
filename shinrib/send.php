<?php
    session_start();
    $hash = $_SESSION['hash'];
    $time = $_POST['time'];
    $placeOrder = $_POST['placeOrder'];
    $targetF = $_POST['targetF'];
    $answerF = $_POST['answerF'];
    $pdo = new PDO("sqlite:SQL/result.sqlite");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    $st = $pdo->prepare("INSERT INTO res(hash,time,placeOrder,targetF,answerF) VALUES(?,?,?,?,?)");
    $st->execute(array($hash,$time,$placeOrder,$targetF,$answerF));

    print_r("sss".$_POST['time']);
 ?>
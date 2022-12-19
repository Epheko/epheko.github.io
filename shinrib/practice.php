<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>エレベータのUI実験</title>
    <link rel="stylesheet" href="style.css">
</head>

<?php 
    session_start();
    
    $pdo = new PDO("sqlite:SQL/result.sqlite");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    $hashCheck = $pdo->prepare("select count(*) from participants where hash=?");
    $hash = rand(0,9999);
    while($hashCheck->execute(array($hash))!=1){
        $hash = rand(0,9999);
    }
    $_SESSION['hash'] = $hash;
    $pre = $pdo->prepare("INSERT INTO participants(hash,age,sex,eye) VALUES(?,?,?,?) ");
    $pre->execute(array($hash,$_POST['age'],$_POST['sex'],$_POST['eye']));
?>

<body>
    <div>
        <p>
            本実験ではエレベーターの操作盤を模したUIを、指示に従ってご自身のパソコンで操作してもらいます。<br>
            開始すると同時に画面中央に十字が約1秒間表示されます。<br>
            その後、「5階」のように階数が表示されるので、確認した上でその下の「次へ」ボタンを押します。<br>
            エレベーターのボタンが表示されるので、先ほど指定された階のボタンをなるべく早くクリックしてください。<br>
            クリックできたら十字に戻り、何度かこの作業を繰り返します。
        </p>
        <p>
        今から4回練習をしてもらいます。画面上の指示に従って、指定された階のボタンをクリックしてください。
        </p>
    </div>
    <div>
        <form action="ex.php" method="post">
            <input type="number" name="cnt" value=4 hidden="true">
            <input type="submit" value="練習開始">
        </form>
    </div>
</body>

</html>
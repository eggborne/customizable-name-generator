<?php
  include("config.php");
  
	$postData = json_decode(file_get_contents("php://input"), TRUE);
	$username = $postData['username'];
  $pass = $postData['pass'];
  $getToken = $postData['getToken'];
  $patterns = $postData['patterns'];
  
  if (strlen($username) > 2 && strlen($pass) > 5) {
    $nameSql = "SELECT username FROM `users` WHERE username='$username'";
    $nameTaken = mysqli_fetch_array(mysqli_query($link,$nameSql), MYSQLI_ASSOC);
    $nameAvailable = strlen(json_encode($nameTaken['username']));
    if ($nameAvailable) {
      if ($getToken) {
        // $p = new OAuthProvider();
        // $token = $p->generateToken(16);
        $token = password_hash($username, PASSWORD_DEFAULT);
      } else {
        $token = NULL;
      }
      $hashedPass = password_hash($pass, PASSWORD_DEFAULT);    
      $userSql="INSERT INTO `users` (`username`, `rulesets`, `pass`, `token`) VALUES ('$username', '[0]', '$hashedPass', '$token');";
      $userResult=mysqli_query($link,$userSql);
      $newUserID=mysqli_insert_id($link);
      
      $patternSql="INSERT INTO `patterns` (`creatorID`, `patternObject`) VALUES ('$newUserID', '$patterns');";
      // mysqli_query($link,"INSERT INTO `invalid-strings` (`creatorID`, `creator`, `created`) VALUES ('$newUserID', '$username', NOW());");
      // $newRulesID=mysqli_insert_id($link);
      // mysqli_query($link,"INSERT INTO `invalid-strings` (`id`) VALUES ('$newRulesID');");
      $patternResult=mysqli_query($link,$patternSql);
    } else {
      echo 'nameTaken';
    }
  } else {
    echo 'badLengths';
  }

	if($nameAvailable && $userResult && $newUserID){
    echo json_encode([$newUserID, $token]);
  }
	mysqli_close($link);
?>
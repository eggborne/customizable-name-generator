<?php include("config.php");  
  $rulesetID = $_GET['rulesetID'];
  $sql="SELECT * FROM `invalid-strings` WHERE `id`='$rulesetID';";
  $result=mysqli_query($link, $sql);
  $patternSql = "SELECT * FROM `patterns` WHERE `rulesetID`='$rulesetID';";
  $patternResult=mysqli_query($link,$patternSql);
  
  if($result && $patternResult){
    while($row=mysqli_fetch_assoc($result)){
      $rows[] = $row;
    }
    while($row=mysqli_fetch_assoc($patternResult)){
      $patternRows[] = $row;
    }
    // echo $patternResult;
    $resultObj = (object)[
      "rules" => $rows,
      "patterns" => $patternRows,
    ];
    echo json_encode($resultObj);
  }else{      
    echo 'REFRESH RULESET FAILED :(';            
  }
  mysqli_close($link);
?>
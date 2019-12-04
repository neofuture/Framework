<?php

ini_set('memory_limit', '4096M');
ini_set('max_execution_time', 60);

include("./lib/user.class.php");
include("./lib/system.class.php");

$session = '';
$headers = '';
$safeList = ["system::settings", "user::login"];
$authorised = true;

$key = "8QqJaytRg1buT?RkXo^Vy@4693BYL=I8";


system::processHeaders();

list($uri, $dataset) = system::getRegistration();
$pdo = system::connectDataset($dataset);
$jsonStr = system::cryptoJsAesDecrypt($key, file_get_contents('php://input'));

if (!class_exists($uri[0])) {
  $status['error'] = "Class does not exist";
  echo system::cryptoJsAesEncrypt($key, $status);
  exit;
}

if (!method_exists($uri[0], $uri[1])) {
  $status['error'] = "Class Method does not exist";
  echo system::cryptoJsAesEncrypt($key, $status);
  exit;
}

if (!in_array($uri[0] . "::" . $uri[1], $safeList)) {
  list($authorised, $session) = system::checkToken($pdo, $jsonStr, $session);
}

if($authorised) {
  $status = call_user_func($uri[0] . "::" . strtolower($uri[1]), $pdo, $jsonStr, $session);
} else {
  $status['error'] = "Not Authorised";
}

echo system::cryptoJsAesEncrypt($key, $status);

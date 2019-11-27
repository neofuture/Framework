<?php

ini_set('memory_limit', '4096M');
ini_set('max_execution_time', 60);

$key = "8QqJaytRg1buT?RkXo^Vy@4693BYL=I8";


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS");
  header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers, token');
  exit;
}

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, token");

$uri = explode("/", trim(explode("?", $_SERVER['REQUEST_URI'])[0], '/'));


$jsonStrIn = file_get_contents('php://input');
$jsonStr = cryptoJsAesDecrypt($key, $jsonStrIn);

if($uri[0] === "login"){
  if($jsonStr['username']=== 'admin' AND $jsonStr['password'] === 'password'){
    $jsonStr = [];
    $jsonStr['id'] = 12112;
    $jsonStr['name'] = "Carl Fearby";
    $jsonStr['active'] = "online";
    $jsonStr['status'] = "Coding Angular one line at a time...";
    $jsonStr['image'] = 'data:image/jpeg;base64, ' . base64_encode(file_get_contents("assets/images/profile.jpeg"));

  } else if($jsonStr['username']=== 'test' AND $jsonStr['password'] === 'test'){
    $jsonStr = [];
    $jsonStr['id'] = 332;
    $jsonStr['name'] = "Sandra Westwood";
    $jsonStr['active'] = "busy";
    $jsonStr['status'] = "Currently Fixing Things";
    $jsonStr['image'] = 'data:image/jpeg;base64, ' . base64_encode(file_get_contents("assets/images/profile2.jpeg"));
  } else {
    $jsonStr = [];
    $jsonStr['status'] = "Error " . $jsonStr['username'] . " " . $jsonStr['password'];
  }
}

echo cryptoJsAesEncrypt($key, $jsonStr);


function cryptoJsAesDecrypt($passphrase, $jsonString){
  $jsondata = json_decode($jsonString, true);
  try {
    $salt = hex2bin($jsondata["s"]);
    $iv  = hex2bin($jsondata["iv"]);
  } catch(Exception $e) { return null; }
  $ct = base64_decode($jsondata["ct"]);
  $concatedPassphrase = $passphrase.$salt;
  $md5 = array();
  $md5[0] = md5($concatedPassphrase, true);
  $result = $md5[0];
  for ($i = 1; $i < 3; $i++) {
    $md5[$i] = md5($md5[$i - 1].$concatedPassphrase, true);
    $result .= $md5[$i];
  }
  $key = substr($result, 0, 32);
  $data = openssl_decrypt($ct, 'aes-256-cbc', $key, true, $iv);
  return json_decode($data, true);
}
/**
 * Encrypt value to a cryptojs compatiable json encoding string
 *
 * @param mixed $passphrase
 * @param mixed $value
 * @return string
 */
function cryptoJsAesEncrypt($passphrase, $value){
  $salt = openssl_random_pseudo_bytes(8);
  $salted = '';
  $dx = '';
  while (strlen($salted) < 48) {
    $dx = md5($dx.$passphrase.$salt, true);
    $salted .= $dx;
  }
  $key = substr($salted, 0, 32);
  $iv  = substr($salted, 32,16);
  $encrypted_data = openssl_encrypt(json_encode($value), 'aes-256-cbc', $key, true, $iv);
  $data = array("ct" => base64_encode($encrypted_data), "iv" => bin2hex($iv), "s" => bin2hex($salt));
  return json_encode($data);
}

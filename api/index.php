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

$opt = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES => false,
];

$uri = explode("/", trim(explode("?", $_SERVER['REQUEST_URI'])[0], '/'));

$url = str_replace("https://", "", $_SERVER['HTTP_ORIGIN']);
$url = str_replace("http://", "", $url);
$url = explode(":", $url);
$url = explode(".", $url[0]);

$registration = $url[0];

$host = '127.0.0.1';
$user = 'owuk';
$pass = 'Yoshi355466!';
$db = "owuk_registrations";
$dsn = "mysql:host=$host;dbname=$db;";
$pdo = new PDO($dsn, $user, $pass, $opt);

$stmt = $pdo->prepare("SELECT destination FROM datasets WHERE origin = ?");
$stmt->execute([$registration]);
$dataset = $stmt->fetch();


// continue
$host = '127.0.0.1';
$user = 'owuk';
$pass = 'Yoshi355466!';
$db = "owuk_" . $dataset['destination'];
$dsn = "mysql:host=$host;dbname=$db;";
$pdo = new PDO($dsn, $user, $pass, $opt);

$jsonStrIn = file_get_contents('php://input');
$jsonStr = cryptoJsAesDecrypt($key, $jsonStrIn);
$headers = request_headers();

$fp = fopen("log.txt", "w");
fwrite($fp, $headers['TOKEN']);
fclose($fp);

if ($uri[0]==="settings"){
  $stmt = $pdo->prepare("SELECT setting, value FROM settings");
  $stmt->execute();
  $settings = $stmt->fetchAll();

  foreach($settings as $setting){
    $settingsArray[$setting['setting']] = $setting['value'];
  }

  echo cryptoJsAesEncrypt($key, $settingsArray);
  exit;
}

if(strlen($headers['TOKEN']) > 24){
  $stmt = $pdo->prepare("DELETE FROM userSessions WHERE heartbeat < ADDDATE(NOW(), INTERVAL -30 MINUTE)");
  $stmt->execute();

  $stmt = $pdo->prepare("SELECT id, userId FROM userSessions WHERE token = ?");
  $stmt->execute([$headers['TOKEN']]);
  $session = $stmt->fetch();

  if($session !== false){
    $stmt = $pdo->prepare("UPDATE userSessions SET heartbeat = ? WHERE token = ?");
    $stmt->execute([date("Y-m-d H:i:s"), $headers['TOKEN']]);
  } else {
    $error['error'] = 'Not Authorised';
    echo cryptoJsAesEncrypt($key, $error);
    exit;
  }
}


if ($uri[0] === "user") {
  if ($uri[1] === "heartbeat"){
    $status['status'] = true;

    echo cryptoJsAesEncrypt($key, $status);
    exit;
  }

  if ($uri[1] === "login") {
    $token = guidv4();

    $stmt = $pdo->prepare("SELECT id, CONCAT(forename, ' ', surname) as name, status FROM users WHERE (username = ? OR emailAddress = ?) AND password = PASSWORD(?)");
    $stmt->execute([$jsonStr['username'], $jsonStr['username'], $jsonStr['password']]);
    $user = $stmt->fetch();

    if ($user !== false) {
      // Delete any old sessions (single seat)
      $stmt = $pdo->prepare("DELETE FROM userSessions WHERE userId = ?");
      $stmt->execute([$user['id']]);

      // Create Session
      $stmt = $pdo->prepare("INSERT INTO userSessions (heartbeat, token, userId) VALUES (?, ?, ?)");
      $stmt->execute([date("Y-m-d H:i:s"), $token, $user['id']]);

      $stmt = $pdo->prepare("SELECT image FROM userProfileImages WHERE userId=?");
      $stmt->execute([$user['id']]);
      $profileImage = $stmt->fetch();

      // Update User Record
      $stmt = $pdo->prepare("UPDATE users SET active = 'online', lastLogin = ? WHERE id = ?");
      $stmt->execute([date("Y-m-d H:i:s"), $user['id']]);
      $user['active'] = "online";
      $user['token'] = $token;

      if($profileImage !== false){
        $user['image'] = $profileImage['image'];
      } else {
        $user['image'] = file_get_contents('./assets/images/profile-empty.txt');
      }

    } else {
      $user['error'] = 'userNotFound';

      if(strlen($jsonStr['username'])<3){
        $user['error'] = 'usernameTooShort';
      }

      if(strlen($jsonStr['password'])<3){
        $user['error'] = 'passwordTooShort';
      }
    }

    echo cryptoJsAesEncrypt($key, $user);
    exit;
  }

  if ($uri[1] === "status") {

    $stmt = $pdo->prepare("UPDATE users SET active = ? WHERE id = ?");
    $stmt->execute([$jsonStr['active'], $session['userId']]);
    $count['rows'] = $stmt->rowCount();

    echo cryptoJsAesEncrypt($key, $count);
    exit;
  }

  if ($uri[1] === "logout") {
    $stmt = $pdo->prepare("DELETE FROM userSessions WHERE id = ?");
    $stmt->execute([$session['id']]);

    $stmt = $pdo->prepare("UPDATE users SET active = ? WHERE id = ?");
    $stmt->execute(['offline', $session['userId']]);
    $count['rows'] = $stmt->rowCount();

    echo cryptoJsAesEncrypt($key, $count);
    exit;
  }
}

echo cryptoJsAesEncrypt($key, $jsonStr);

function cryptoJsAesDecrypt($passphrase, $jsonString)
{
  $jsondata = json_decode($jsonString, true);
  try {
    $salt = hex2bin($jsondata["s"]);
    $iv = hex2bin($jsondata["iv"]);
  } catch (Exception $e) {
    return null;
  }
  $ct = base64_decode($jsondata["ct"]);
  $concatedPassphrase = $passphrase . $salt;
  $md5 = array();
  $md5[0] = md5($concatedPassphrase, true);
  $result = $md5[0];
  for ($i = 1; $i < 3; $i++) {
    $md5[$i] = md5($md5[$i - 1] . $concatedPassphrase, true);
    $result .= $md5[$i];
  }
  $key = substr($result, 0, 32);
  $data = openssl_decrypt($ct, 'aes-256-cbc', $key, true, $iv);
  return json_decode($data, true);
}

function cryptoJsAesEncrypt($passphrase, $value)
{
  $salt = openssl_random_pseudo_bytes(8);
  $salted = '';
  $dx = '';
  while (strlen($salted) < 48) {
    $dx = md5($dx . $passphrase . $salt, true);
    $salted .= $dx;
  }
  $key = substr($salted, 0, 32);
  $iv = substr($salted, 32, 16);
  $encrypted_data = openssl_encrypt(json_encode($value), 'aes-256-cbc', $key, true, $iv);
  $data = array("ct" => base64_encode($encrypted_data), "iv" => bin2hex($iv), "s" => bin2hex($salt));
  return json_encode($data);
}

function guidv4()
{
  if (function_exists('com_create_guid') === true)
    return trim(com_create_guid(), '{}');

  $data = openssl_random_pseudo_bytes(16);
  $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
  $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}


function request_headers()
{
  $arh = array();
  $rx_http = '/\AHTTP_/';
  foreach ($_SERVER as $key => $val) {
    if (preg_match($rx_http, $key)) {
      $arh_key = preg_replace($rx_http, '', $key);
      $rx_matches = explode('_', $arh_key);
      if (count($rx_matches) > 0 and strlen($arh_key) > 2) {
        foreach ($rx_matches as $ak_key => $ak_val) $rx_matches[$ak_key] = ucfirst($ak_val);
        $arh_key = implode('-', $rx_matches);
      }
      $arh[$arh_key] = $val;
    }
  }
  return ($arh);
}


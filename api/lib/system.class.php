<?php

class system
{
  public static function settings($pdo, $jsonStr, $session)
  {
    $stmt = $pdo->prepare("SELECT setting, value FROM settings");
    $stmt->execute();
    $settings = $stmt->fetchAll();

    foreach ($settings as $setting) {
      $status[$setting['setting']] = $setting['value'];
    }

    system::logOutput($pdo, $jsonStr, $status);
    return $status;
  }

  public static function cryptoJsAesDecrypt($passphrase, $jsonString)
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

  public static function cryptoJsAesEncrypt($passphrase, $value)
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

  public static function request_headers()
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

  public static function processHeaders()
  {
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
  }

  public static function checkToken($pdo, $jsonStr, $session)
  {
    $authorised = true;
    $headers = system::request_headers();
    $stmt = $pdo->prepare("DELETE FROM userSessions WHERE heartbeat < ADDDATE(NOW(), INTERVAL -30 MINUTE)");
    $stmt->execute();

    $stmt = $pdo->prepare("SELECT id, userId FROM userSessions WHERE token = ?");
    $stmt->execute([$headers['TOKEN']]);
    $session = $stmt->fetch();

    if ($session !== false) {
      $stmt = $pdo->prepare("UPDATE userSessions SET heartbeat = ? WHERE token = ?");
      $stmt->execute([date("Y-m-d H:i:s"), $headers['TOKEN']]);
    } else {
      $authorised = false;
    }

    return [$authorised, $session];
  }

  public static function getRegistration()
  {
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

    return [$uri, $dataset];
  }

  public static function connectDataset($dataset)
  {
    $opt = [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $host = '127.0.0.1';
    $user = 'owuk';
    $pass = 'Yoshi355466!';

    $db = "owuk_" . $dataset['destination'];
    $dsn = "mysql:host=$host;dbname=$db;";
    $pdo = new PDO($dsn, $user, $pass, $opt);

    return $pdo;
  }

  public static function logOutput($pdo, $entry, $result)
  {
    $stmt = $pdo->prepare("INSERT INTO log (ipAddress, dateTime, entry, result, url) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
      $_SERVER['REMOTE_ADDR'],
      date("Y-m-d H:i:s"),
      json_encode($entry),
      json_encode($result),
      $_SERVER['REQUEST_URI']
    ]);
  }
}

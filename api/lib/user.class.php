<?php

class user
{
  public static function login($pdo, $jsonStr, $session)
  {
    $token = user::guidv4();

    $stmt = $pdo->prepare("SELECT id, CONCAT(forename, ' ', surname) as name, status FROM users WHERE (username = ? OR emailAddress = ?) AND password = PASSWORD(?)");
    $stmt->execute([$jsonStr['username'], $jsonStr['username'], $jsonStr['password']]);
    $status = $stmt->fetch();

    if ($status !== false) {
      // Delete any old sessions (single seat)
      $stmt = $pdo->prepare("DELETE FROM userSessions WHERE userId = ?");
      $stmt->execute([$status['id']]);

      // Create Session
      $stmt = $pdo->prepare("INSERT INTO userSessions (heartbeat, token, userId, hostname, ipAddress) VALUES (?, ?, ?, ?, ?)");
      $stmt->execute([date("Y-m-d H:i:s"), $token, $status['id'], gethostbyaddr($_SERVER['REMOTE_ADDR']), $_SERVER['REMOTE_ADDR']]);

      $stmt = $pdo->prepare("SELECT image FROM userProfileImages WHERE userId=?");
      $stmt->execute([$status['id']]);
      $profileImage = $stmt->fetch();

      // Update User Record
      $stmt = $pdo->prepare("UPDATE users SET active = 'online', lastLogin = ? WHERE id = ?");
      $stmt->execute([date("Y-m-d H:i:s"), $status['id']]);
      $status['active'] = "online";
      $status['token'] = $token;

      if ($profileImage !== false) {
        $status['image'] = $profileImage['image'];
      } else {
        $status['image'] = file_get_contents('./assets/images/profile-empty.txt');
      }

    } else {
      $status['error'] = 'userNotFound';

      if (strlen($jsonStr['username']) < 3) {
        $status['error'] = 'usernameTooShort';
      }

      if (strlen($jsonStr['password']) < 3) {
        $status['error'] = 'passwordTooShort';
      }
    }
    system::logOutput($pdo, $jsonStr, $status);

    return $status;
  }

  public static function statusText($pdo, $jsonStr, $session)
  {
    $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
    $stmt->execute([$jsonStr['status'], $session['userId']]);
    $status['rows'] = $stmt->rowCount();
    $status['status'] = $jsonStr['status'];
    system::logOutput($pdo, $jsonStr, $status);
    return $status;
  }

  public static function upload($pdo, $jsonStr, $session)
  {
    $image = imagecreatefromstring(base64_decode(explode(",", $jsonStr['image'], 2)[1]));
    $thumb_width = 200;
    $thumb_height = 200;

    $width = imagesx($image);
    $height = imagesy($image);

    $original_aspect = $width / $height;
    $thumb_aspect = $thumb_width / $thumb_height;

    if ($original_aspect >= $thumb_aspect) {
      // If image is wider than thumbnail (in aspect ratio sense)
      $new_height = $thumb_height;
      $new_width = $width / ($height / $thumb_height);
    } else {
      // If the thumbnail is wider than the image
      $new_width = $thumb_width;
      $new_height = $height / ($width / $thumb_width);
    }

    $thumb = imagecreatetruecolor($thumb_width, $thumb_height);

    imagecopyresampled($thumb,
      $image,
      0 - ($new_width - $thumb_width) / 2, // Center the image horizontally
      0 - ($new_height - $thumb_height) / 2, // Center the image vertically
      0, 0,
      $new_width, $new_height,
      $width, $height);
    $jpg = 'data:image/jpeg;base64,' . base64_encode(user::imagejpeg_tostring($thumb, 100));

    $stmt = $pdo->prepare("DELETE FROM userProfileImages WHERE userId = ?");
    $stmt->execute([$session['userId']]);

    $stmt = $pdo->prepare("INSERT INTO userProfileImages (userId, image) VALUES (?, ?)");
    $stmt->execute([$session['userId'], $jpg]);

    $status['image'] = $jpg;

    return $status;
  }

  public static function heartbeat($pdo, $jsonStr, $session)
  {
    return true;
  }

  public static function status($pdo, $jsonStr, $session)
  {
    $stmt = $pdo->prepare("UPDATE users SET active = ? WHERE id = ?");
    $stmt->execute([$jsonStr['active'], $session['userId']]);
    $status['rows'] = $stmt->rowCount();
    system::logOutput($pdo, $jsonStr, $status);

    return $status;
  }

  public static function logout($pdo, $jsonStr, $session)
  {
    $stmt = $pdo->prepare("DELETE FROM userSessions WHERE id = ?");
    $stmt->execute([$session['id']]);

    $stmt = $pdo->prepare("UPDATE users SET active = ? WHERE id = ?");
    $stmt->execute(['offline', $session['userId']]);
    $status['rows'] = $stmt->rowCount();
    system::logOutput($pdo, $jsonStr, $status);

    return $status;
  }

  public static function imagejpeg_tostring($im, $quality = 100)
  {
    ob_start(); //Stdout --> buffer
    imagejpeg($im, NULL, $quality); // output ...
    $imgString = ob_get_contents(); //store stdout in $imgString
    ob_end_clean(); //clear buffer
    imagedestroy($im); //destroy img
    return $imgString;
  }

  public static function guidv4()
  {
    if (function_exists('com_create_guid') === true)
      return trim(com_create_guid(), '{}');

    $data = openssl_random_pseudo_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
  }
}

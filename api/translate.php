<?php
ini_set('max_execution_time', '0');
$lang["ru"] = "ru_ru";
$lang["de"] = "de_de";
$lang["nl"] = "nl_nl";
$lang["fr"] = "fr_fr";
$lang["es"] = "es_es";
$lang["it"] = "it_it";
$lang["da"] = "da_da";
$lang["sv"] = "sv_sv";
$lang["no"] = "no_no";
$lang["pt"] = "pt_pt";
$lang["fi"] = "fi_fi";
$lang["zh"] = "zh_zh";

$english = file_get_contents("../src/app/config/languages/locales/en_gb.ts");

$object = explode("LanguageModel = {", $english, 2)[1];
$object = trim(trim($object), "};");
$object = explode("\n", $object);

foreach($lang as $key=>$val){
  $file =("import {LanguageModel} from '../../../models/language-model';\n");
  $file .=("\n");
  $file .=("// tslint:disable-next-line:variable-name\n");
  $file .=("export const ".$val.": LanguageModel = {\n");
  $file .=("  language: '".$val."',\n");
  foreach($object as $row){

    if(strpos($row, '{') !== false OR strpos($row, '}') !== false OR strpos($row, 'product: ')){
      $file .=($row."\n");
    } else {
      $items = explode(": ", $row);
      $text = translate("en", $key, trim(trim($items[1], "'"), "',"));
      if(strlen($items[0])>0 AND $items[0]!=="language"){
        $file .=($items[0]. ": '" . $text . "',\n");
      }

    }
  }
  $file .=("};\n");

  $myfile = fopen("../src/app/config/languages/locales/".$val.".ts", "w") or die("Unable to open file!");
  fwrite($myfile, $file);
  fclose($myfile);
  echo("Done " . $val ."\n");
}

$file =("import {LanguageModel} from '../../models/language-model';\n");
$file .=("\n");
$file .=("// tslint:disable-next-line:variable-name\n");
$file .=("export const blank: LanguageModel = {\n");
$file .=("  language: 'blank',\n");
foreach($object as $row){

  if(strpos($row, '{') !== false OR strpos($row, '}') !== false OR strpos($row, 'product: ')){
    $file .=($row."\n");
  } else {
    $items = explode(": ", $row);
    $text = translate("en", $key, trim(trim($items[1], "'"), "',"));
    if(strlen($items[0])>0 AND $items[0]!=="language"){
      $file .=($items[0]. ": '',\n");
    }

  }
}
$file .=("};\n");

$myfile = fopen("../src/app/config/languages/blank.ts", "w") or die("Unable to open file!");
fwrite($myfile, $file);
fclose($myfile);
echo("Done blank\n");

$file =("export interface LanguageModel {\n");
foreach($object as $row){

  if(strpos($row, '{') !== false OR strpos($row, '}') !== false){
    $row = str_replace("},", "};", $row);
    $file .=($row."\n");
  } else {
    $items = explode(": ", $row);
    $text = translate("en", $key, trim(trim($items[1], "'"), "',"));
    if(strlen($items[0])>0 ){
      $file .=($items[0]. ": string;\n");
    }

  }
}
$file .=("}\n");

$myfile = fopen("../src/app/models/language-model.ts", "w") or die("Unable to open file!");
fwrite($myfile, $file);
fclose($myfile);

echo "Done language-model\n";


function translate($sourceLang, $targetLang, $sourceText){
  $apiKey = "*****";

  $url = "https://translation.googleapis.com/language/translate/v2";
  $fields = [
    'source'    => $sourceLang,
    'target'    => $targetLang,
    'q'         => $sourceText,
    'key'       => $apiKey
  ];

  $fields_string = http_build_query($fields);

  $ch = curl_init();

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Length: ' . strlen($fields_string),)
  );
  curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

  curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);

  $result = curl_exec($ch);

  return json_decode($result)->data->translations[0]->translatedText;
}

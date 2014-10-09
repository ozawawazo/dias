<?php
  //アプリケーションIDのセット
$id = "dj0zaiZpPUJHVVVEZ0REd3k0aCZzPWNvbnN1bWVyc2VjcmV0Jng9NWU-";
//形態素解析したい文章
$word = "立ち上がりかけていくその姿は美しさを感じる";
//URLの組み立て
$url = "http://jlp.yahooapis.jp/MAService/V1/parse?appid=" . $id . "&response=pos,baseform&filter=9&results=ma&sentence=" . urlencode($word);
//戻り値をパースする
$parse = simplexml_load_file($url);
//戻り値（オブジェクト）からループでデータを取得する
foreach($parse->ma_result->word_list->word as $value){
  //品詞を「／」で区切る
  $pos = (string)$value->pos;
  $reading = (string)$value->reading;
  $surface = (string)$value->baseform;
  echo $surface . "(" . $pos . ")/";
  //  echo $value->;
  //echo "(";
  //echo $value->;
  //echo ")／";
}
?>

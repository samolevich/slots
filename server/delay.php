<?php
  header('Content-Type: text/plain');
  $delay = rand(1, 5);
  sleep($delay);
  echo $delay;
?>

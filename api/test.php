<?php

echo gethostbyaddr($_SERVER['REMOTE_ADDR']);

print("<pre>");
print_r($_SERVER);
print("</pre>");

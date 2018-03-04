<?php

$todo = file_get_contents("php://input");
file_put_contents("todo.txt", $todo);


?>

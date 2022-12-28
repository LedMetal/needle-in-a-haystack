<?php
  echo "connecting...";

  // Create connection
  $conn = connectToDB();

  // Check connection
  if ($conn -> connect_error) {
    die("Connection failed: " . $conn -> connect_error);
  } else {
    echo "connected!";
  }

  // POST variables
  $participantID = $_POST["participantID"];
  $page = $_POST["page"];
  $duration = $_POST["duration"];
  $total = $_POST["totalSelected"];
  $targets = $_POST["targetsSelected"];
  $dissimilar = $_POST["dissimilarsSelected"];
  $visuallySimilar = $_POST["visuallySimilarsSelected"];
  $semanticallySimilar = $_POST["semanticallySimilarsSelected"];

  // SQL query
  $query = "INSERT INTO block_one_pages (participant_id, page, duration_seconds, total, targets, dissimilar, visually_similar, semantically_similar) VALUES ('$participantID', $page, $duration, $total, $targets, $dissimilar, $visuallySimilar, $semanticallySimilar)";

  $result = $conn->query($query);
  if ($result == TRUE) {
    echo "New entry recorded successfully";
  } else {
    echo "Error: " . $query . "<br />" . $conn->error;
  }

  // Close connection
  mysqli_close($conn);

  /* --------------------------------------------- */

  function connectToDB() {
    // Connection Variables
    $servername = "localhost";
    $username = "needlack_admin";
    $password = "Orange123!@#";
    $dbname = "needlack_stats";

    // Create Connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);

    // Check Connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    return $conn;
  }
?>

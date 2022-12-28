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
  $evaluationDate = $_POST["evaluationDate"];
  $evaluationTime = $_POST["evaluationTime"];
  $totalPages = $_POST["totalPages"];
  $totalIconsViewed = $_POST["totalIconsViewed"];
  $timePerPage = $_POST["timePerPage"];
  $averageTimePerPage = $_POST["averageTimePerPage"];
  $totalTargetsViewed = $_POST["totalTargetsViewed"];
  $totalTargetsSelected = $_POST["totalTargetsSelected"];
  $targetsSelectedRatio = $_POST["targetsSelectedRatio"];
  $totalNonTargetsSelected = $_POST["totalNonTargetsSelected"];

  // SQL query
  $query = "INSERT INTO block_one (participant_id, evaluation_date, evaluation_time, total_pages, icons_viewed, time_per_page, avg_time_page, total_targets, identified_targets, targets_ratio, identified_non_targets) VALUES ('$participantID', '$evaluationDate', '$evaluationTime', $totalPages, $totalIconsViewed, '$timePerPage', $averageTimePerPage, $totalTargetsViewed, $totalTargetsSelected, $targetsSelectedRatio, $totalNonTargetsSelected)";

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

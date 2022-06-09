<?php
    if(isset($_POST['submit'])){
        $name=$_POST['name'];
        $email=$_POST['email'];
        $phone=$_POST['phone'];
        $message=$_POST['message'];

        $to='rabinbalayar40@gmail.com';
        $subject='Customer Enquiry';
        $message="Full Name: ".$name."\n\n"."Email-Address: ".$email."\n\n". "Phone: ".$phone."\n\n"."Feedback Content: "."\n\n".$message;
        $headers="From ".$to;

        if (mail($to, $subject, $message, $headers)) {
            echo "<h1>Thanks for your Feedback.</h1>".$name;
        }
        else{
            echo "Something went Wrong!!!!";
        }
    }
?>
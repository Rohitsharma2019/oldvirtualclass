<?php
function my_curl_request($url, $post_data, $key, $secret){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
    		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
                    array('Content-Type: application/json',
                    'x-api-key: ' . $key,
                    'x-congrea-secret: ' . $secret,
                  ));
        curl_setopt($ch, CURLOPT_TRANSFERTEXT, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_PROXY, false);
        $result = @curl_exec($ch);
        curl_close($ch);
        return $result;
}
// send auth detail to server
$authusername = substr(str_shuffle(MD5(microtime())), 0, 20);
$authpassword = substr(str_shuffle(MD5(microtime())), 0, 20);

$authusername = "7c0b8abe6c45ba87997a";
$authpassword = "b43aa0cf2f04c42399f1";

/*
$licensekey = 'Wmqyg9MPQU9D1pOLBSvUN2mthVNhUMQ55RlA2wpn';
$secret = '8ww4umRbFIcTu92cJhrExXWNNAG7FDuN91RDoJO3s1XWa09UiBzPyvDl6ksLXXz6'; */

/*$licensekey = 'noqOqApeSflBnQn9VSibPQ19CHFxRjLuEWdzojnHVMrVNlRa';
$secret = 'iS3pXEWVgclNdEd2QezeJpwJDyGYn8LF0O5Ys1UJefxrUKtKZ3YJsvs6494rhP6i'; */

/*
$licensekey = 'i8d1T08fAcvAZGTvJmj8hIFWQY5jSY851CTUn7DoyCkjJnvD';
$secret = 'VsrArG07d6oKqINC4dnYEhn6lhDm3BNY3ezvVzC9G0T7JGKNT7Myo9EKri7uTUtX';
*/

$licensekey = 'njKhbHNtWHnfpotAyShGofg2RcrjEijTVZqxiJ62AmoHXrR2';
$secret = 'GgAC0P0adDAMyih6IhpThQci5Y4W7xLOOmrPcrZp4zcDStKAK9u2ZGk5Fp2NWNBL';

/*
$licensekey = 'njKhbHNtWHnfpotAyShGofg2RcrjEijTVZqxiJ62AmoHXrR2';
$secret = 'GgAC0P0adDAMyih6IhpThQci5Y4W7xLOOmrPcrZp4zcDStKAK9u2ZGk5Fp2NWNBL'; */



$r = isset($_GET['role'] ) ? $_GET['role'] : 's';

$post_data = array('authuser'=> $authusername,'authpass' => $authpassword, 'role' => $r, 'room' => $room);

$post_data = json_encode($post_data);

//echo $post_data;
$rid = my_curl_request("https://api.congrea.net/backend/auth", $post_data, $licensekey, $secret);



if (!$rid = json_decode($rid)) {
    echo "{\"error\": \"403: Please make sure key & secret are correct. Please try again after 5 minutes. \"}";exit;
} elseif (isset($rid->message)) {
    echo "{\"error\": \"$rid->message\"}";exit;
} elseif (!isset($rid->result)) {
    echo "{\"error\": \"invalid\"}";exit;
}

$rid = "wss://$rid->result";

?>

<script type="text/javascript">
<?php echo "var wbUser = {};";?>
<?php echo " wbUser.auth_user='".$authusername."';"; ?>
<?php echo " wbUser.auth_pass='".$authpassword."';"; ?>
<?php echo " wbUser.path='".$rid."';";?>
<?php echo " wbUser.room='".$room."';";?>
<?php echo " wbUser.lkey='".$licensekey."';"; ?>
<?php //echo "imageurl='./images/quality-support.png';"; ?>

/*
var Thread = {
	sleep: function(ms) {
		var start = Date.now();

		while (true) {
			var clock = (Date.now() - start);
			if (clock >= ms) break;
		}

	}
};

setInterval(
    function (){
        console.log('sleeping start');
        Thread.sleep(1500);
        console.log('sleeping stop');
    }, 2000
)
*/
</script>

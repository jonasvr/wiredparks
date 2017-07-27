// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
// var base_url = "https://flask-app-jonasvr.c9users.io";
var base_url = "http://jsonvr-test.apigee.net/wiredparks";

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    mystats();
    getOwnParkStats();
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('login', function (page) {

    $$('#login').on('click', function(event) {
        var email = $$('#email').val();
        var password = $$('#password').val();

        var data = {
            'email':email,
            'password':password
        }
        $$.ajax({
            async: false,
            url: base_url +'/login',
            type: 'POST',
            dataType: "json",
            data:data,
            success: function(data){
                if (data.message == "success") {
                    window.localStorage.setItem("accesstoken", data.accesstoken);
                    window.localStorage.setItem("user_id", data.user_id);
                    alert(data.user_id);
                    alert("logged in");
                }else {
                    alert(data.message);
                }

            },
           error: function(e) {
             console.log('Error: ' + e.message);
             alert("something went wrong, contact developer");
           }
        });
    });
})

myApp.onPageInit('park', function (page) {

    $$('#test').on('click', function(event) {
        console.log("clicked");
        var user_id = window.localStorage.getItem("user_id");
        var park_id = $$("#down").val();

        var data = {
            'user_id':user_id,
            'park_id':park_id
        }
        updatePark(data);
        getPark();
    });
    getPark();
    getParks();

})

myApp.onPageInit('parkStats', function (page) {
    getAllParksStats();
})

function logout(){
    window.localStorage.clear();
}

function sync(){
    var token = window.localStorage.getItem("accesstoken");
    if (token){
        var user_id = window.localStorage.getItem("user_id");
        var postData = {
            'token':token,
            'user_id':user_id
        }
        $$.ajax({
            async: false,
            url: base_url +'/sync',
            type: 'POST',
            dataType: "json",
            data:postData,
            success: function(data){
                if (data.message == "success") {
                    alert("synced")
                }else {
                    alert(data.message)
                }
            },
           error: function(e) {
             console.log('Error: ' + e.message);
             alert("something went wrong, contact developer")
           }
        });
    }

    mystats();

}

function mystats(){
    var token = window.localStorage.getItem("accesstoken");
    if (token){

        var user_id = window.localStorage.getItem("user_id");
        var postData = {
            'token':token,
            'user_id':user_id
        }
        $$.ajax({
            async: false,
            url: base_url +'/mystats',
            type: 'POST',
            dataType: "json",
            data:postData,
            success: function(data){
                if (data.message == "success") {
                    $$("#run-distance").html(data.data.run.distance);
                    $$("#run-time").html(data.data.run.time);
                    $$("#swim-distance").html(data.data.swim.distance);
                    $$("#swim-time").html(data.data.swim.time);
                }else {
                    alert(data.message)
                }

            },
           error: function(e) {
             console.log('Error: ' + e.message);
             alert("something went wrong, contact developer")
           }
       });
   }else{
        $$("#run-distance").html(0);
        $$("#run-time").html(0);
        $$("#swim-distance").html(0);
        $$("#swim-time").html(0);
    }
}

function getParks(){
    $$.ajax({
        async: false,
        url: base_url +'/parks',
        type: 'GET',
        dataType: "json",
        success: function(data){
            if (data.message == "success") {
                var down = $$('#down');
                var options ='';
                $$.each(data.parks,function(key, value)
                {
                    options+='<option value=' + value[0] + '>' + value[1] + '</option>';
                });
                down.html(options);
            }else {
                alert(data.message);
            }

        },
       error: function(e) {
         console.log('Error: ' + e.message);
         alert("something went wrong, contact developer");
       }
    });
}

function getPark(){
    var user_id = window.localStorage.getItem("user_id");
    data = {
        'user_id':user_id
    };

    $$.ajax({
        async: false,
        url: base_url +'/park',
        type: 'POST',
        dataType: "json",
        data:data,
        success: function(data){
            if (data.message == "success") {
                $$('#park').html(data.park);
            }else {
                alert(data.message);
            }

        },
       error: function(e) {
         console.log('Error: ' + e.message);
         alert("something went wrong, contact developer");
       }
    });
}
function updatePark(data){
    $$.ajax({
        async: false,
        url: base_url +'/parks',
        type: 'POST',
        dataType: "json",
        data:data,
        success: function(data){
            if (data.message == "success") {
                console.log(data.data);
            }else {
                alert(data.message);
            }

        },
       error: function(e) {
         console.log('Error: ' + e.message);
         alert("something went wrong, contact developer");
       }
    });
}
function getOwnParkStats(){
    var user_id = window.localStorage.getItem("user_id");
    data = {
        'user_id':user_id
    };

    $$.ajax({
        async: false,
        url: base_url +'/park/stats',
        type: 'POST',
        dataType: "json",
        data:data,
        success: function(data){
            if (data.message == "success") {
                $$("#run-distance-park").html(data.stats[0][1]);
                $$("#run-time-park").html(data.stats[0][2]);
                $$("#swim-distance-park").html(data.stats[1][1]);
                $$("#swim-time-park").html(data.stats[1][2]);
            }else {
                alert(data.message);
            }

        },
       error: function(e) {
         console.log('Error: ' + e.message);
         alert("something went wrong, contact developer");
       }
    });
}
function getAllParksStats(){
    $$.ajax({
        async: false,
        url: base_url +'/parks/stats',
        type: 'GET',
        dataType: "json",
        success: function(data){
            if (data.message == "success") {
                $$("#vosse-1").html(data.stats[1][2]);
                $$("#vosse-2").html(data.stats[1][3]);
                $$("#vosse-3").html(data.stats[0][2]);
                $$("#vosse-4").html(data.stats[0][3]);

                $$("#ar-1").html(data.stats[3][2]);
                $$("#ar-2").html(data.stats[3][3]);
                $$("#ar-3").html(data.stats[2][2]);
                $$("#ar-4").html(data.stats[2][3]);
            }else {
                alert(data.message);
            }
        },
       error: function(e) {
         console.log('Error: ' + e.message);
         alert("something went wrong, contact developer");
       }
    });
}

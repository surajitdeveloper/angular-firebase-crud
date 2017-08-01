var dbRef = new Firebase('https://testproject-9c82c.firebaseio.com');
var recipes = dbRef.child('receipt');
var app = angular.module("test_app", ["ngRoute","ngSanitize","ngMaterial"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "template/tabs.html"
    });
});
app.controller("tabs",function($scope)
{
    $scope.get_receipt = function()
    {
        $scope.loading = true;
    	$scope.receipts = [];
    	recipes.on("child_added", function(snap)
	            {
	                $scope.loading = false;
		            var value = snap.val();
		            var key = snap.key();
		            var main_desc = value.description;
		            var desc_length = main_desc.length;
		            if(desc_length > 75)
		            	{
		            		main_desc = main_desc.substring(0,75);
		            	}
		            var output_json = {"title": value.title, "description": main_desc, "key": key};
		            $scope.receipts.push(output_json);
		            $scope.$apply();
		        });
    }
    $scope.get_val = function(firebase_key)
    {
    	var key_ref = recipes.child(firebase_key);
    	key_ref.on('child_added', function(data) {
    		  var data_val = data.val();
    		  var data_key = data.key();
    		  $scope.key = firebase_key;
    		  if(data_key == "image")
    			  $scope.img_url = data_val;
    		  else if(data_key == "title")
    			  $scope.title = data_val;
    		  else if(data_key == "description")
    			  $scope.description = data_val;
    		});
    }
    $scope.del_element = function(firebase_key)
    {
    	recipes.child(firebase_key).remove();
    	$scope.get_receipt();
    	alert("Child Remove");
    }
    $scope.form_submit = function(title, description, img_url, key)
    {
    	if(title != undefined && description != undefined && img_url != undefined)
    		{
    			var full_data = { title: title, description: description, image: img_url};
    			if(key == undefined || key == "")
    				{
    					recipes.push(full_data);
    	    			$scope.title = "";
    	    			$scope.description = "";
    	    			$scope.img_url = "";
    	    			$scope.key = "";
    	    			alert("Insert Successfully");
    	    			
    				}
    			else
    				{
    					recipes.child(key).set(full_data);
    					$scope.title = "";
    	    			$scope.description = "";
    	    			$scope.img_url = "";
    	    			$scope.key = "";
    	    			$scope.get_receipt();
    	    			alert("Updated Successfully");
    				}
    		}
    	else
    		{
    			alert("All fields are mandatory");
    		}
    	
    }
    
});
app.factory('validationServices', ['$q',function ($q) {

    var global = {};

    var validErrorMsg=null;

    global.validateFields = function(type,model){
        validErrorMsg=null;

        //User
    	if(type=="user" && model){
    		if(model.email){
    			if(!validateEmail(model.email)){
    				validErrorMsg="User email is not valid";
    			}
    		}

    	}

        //Comapany
        if(type=="company" && model){
            if(!model.name){        
                validErrorMsg="Comapany name shouldn't  be empty";                
            }else if(model.url && model.url!="http://"){
                if(!validateURL(model.url)){
                    validErrorMsg="Not a valid Company Url";
                } 
            }           

        }

        //Job
        if(type=="job" && model){
            if(!model.title){        
                validErrorMsg="Job title shouldn't  be empty";                
            }else if(!model.description){        
                validErrorMsg="Job Description shouldn't  be empty";                
            }else if(model.experience==null || (model.experience!=0 && model.experience=="")){        
                validErrorMsg="Job Experience shouldn't  be empty";                
            }else if(model.experience<0){        
                validErrorMsg="Job Experience shouldn't  be less than zero";                
            }else if(validateNumber(model.experience)){
                validErrorMsg="Job Experience is of Number";
            }else if(!model.resumeTo){ 
                validErrorMsg="Job ResumeTo shouldn't  be empty";
            }else if(!validateEmail(model.resumeTo)){
                validErrorMsg="ResumeTo email is not valid";
            }else if(!model.companyLocationGeopoint){        
                validErrorMsg="Company Location shouldn't  be empty";                
            }else if(model.applyLink && model.applyLink!="http://"){
                if(!validateURL(model.applyLink)){
                    validErrorMsg="Not a valid Apply Link";
                }
            }           

        }

    	return validErrorMsg;	
    }; 

    function validateNull(value){    	
        if(!value){
           return false;
        }else{
        	return true;
        }        
    }

    function validateNumber(value){       
        if(isNaN(value)){
           return true;
        }else{
            return false;
        }        
    }

    function validateEmail(email){      
        if(email){
            var emailExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return emailExp.test(email);            
        }        
    } 

    function validateURL(url){      
        if(url){
            var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;            
            if (!myRegExp.test(url)){
                return false;
            }else{
                return true;
            }
        }        
    }   

    return global;

}]);

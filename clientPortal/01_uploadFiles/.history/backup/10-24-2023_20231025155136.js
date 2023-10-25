var settingsCreate = {
	"url": "https://api.thomsonreuters.com/gofileroom/api/v1/documents",
	"method": "POST",
	 "timeout": 0,
	"headers": {
		 "Authorization": "Basic " + newThingTwo,
		"Content-Type": "application/json",
		 "X-TR-API-APP-ID": newThing 
	 },
	 "data": JSON.stringify({
	   "DrawerId": "0000000001",
	   "Indexes": [
		 {
		   "IndexId": "0000000001",
		   "IndexValue": URLTRName
		 },
		 {
		   "IndexId": "0000000002",
		   "IndexValue": URLTRNum
		 },
		 {
		   "IndexId": "0000000003",
		   "IndexValue": "AUDIT"
		 },
		 {
		   "IndexId": "0000000004",
		   "IndexValue": "WORKPAPERS"
		 },
		 {
		   "IndexId": "0000000005",
		   "IndexValue": "QB " + URLEngSection + ": " + newfilename
		 },
		 {
		   "IndexId": "0000000006",
		   "IndexValue": URLEngYear
		 },
		 {
		   "IndexId": "0000000007",
		   "IndexValue": URLEngDate
		 },
		 {
		   "IndexId": "0000000008",
		   "IndexValue": today
		 }

 ]
  }),
};


$.ajax(settingsCreate).done(function (response) {
 const obj = response;
 console.log(obj)
 const GFRfileID = obj.documentCreate.documentId;
 
	 //UPLOAD FILE
	 var form = new FormData();
	 form.append("",newfile, newfilename);
	 
 var settingsTwo = {"url": "https://api.thomsonreuters.com/gofileroom/api/v1/documents/"+ GFRfileID +"/file","method": "POST","timeout": 0,
		   "headers": {"X-TR-API-APP-ID": newThing,"Authorization": "Basic " + newThingTwo},
					 "processData": false,"mimeType": "multipart/form-data","contentType": false,"data": form};
 $.ajax(settingsTwo).done(function (responseTwo) {
	   
		 //UPLOAD TO QUICKBASE
					 var urlUploadFile = "https://capincrouse.quickbase.com/db/bqertwwn5?a=API_AddRecord";
					 var uploadFile 	 = "<qdbapi><apptoken>rb5m9rbe3b76rd4k2zdkbwaipxs</apptoken>";
					 uploadFile         	+= "<field fid='6' filename='" + newfilename + "'>" + encodedFile + "</field>";
					 uploadFile         	+= "<field fid='7'>" + num  + "</field>";
					 uploadFile         	+= "<field fid='8'>" + rid + "</field>";
					 uploadFile         	+= "<field fid='63'>" + GFRfileID + "</field>";
					 uploadFile         	+= "</qdbapi>";
 
 
					 document.getElementById(divName).innerHTML  = "<div id='uploadDiv'><p style='color: black'>" + newfilename + "</p> <p>uploading...</p></div>" + document.getElementById(divName).innerHTML ;

					 $.ajax({
						 type: "POST",contentType: "text/xml",async: true,url: urlUploadFile,dataType: "xml",processData: false,data: uploadFile,success: function (response) {
							 var xmlUpload = $(response);
							 
								 if (xmlUpload.find('qdbapi').find('errcode').text() == "0") {	
									 document.getElementById('uploadDiv').remove();
									 document.getElementById(divName).innerHTML  = "<div><p class='text-file-upload'>" + newfilename + "</p> <p class='textSuccess'>&#9989; Success</p></div>" + document.getElementById(divName).innerHTML ;
								 }
								 else {
									 document.getElementById('uploadDiv').remove();
									 document.getElementById(divName).innerHTML  = "<div><p class='text-file-upload'>" + newfilename + "</p> <p class='textFailure'>&#10060; Failed</p></div>" + document.getElementById(divName).innerHTML ;
									 console.log("Quickbase returned an error.");
								 } 
						 },
						 error: function (response) {
							 document.getElementById('uploadDiv').remove();
							 document.getElementById(divName).innerHTML  = "<div><p class='text-file-upload'>" + newfilename + "</p> <p class='textFailure'>&#10060; Failed</p></div>" + document.getElementById(divName).innerHTML ;
							 console.log("Quickbase returned an error.");
						 }
					 });	//end ajax call	

		 //END UPLOAD TO QUICKBASE

  });

});
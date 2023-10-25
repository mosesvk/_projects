<html>
<head>
	<link rel='stylesheet'  href="https://capincrouse.quickbase.com/db/bpdyybedp?a=dbpage&pageID=92">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	
	<script>
		//retrieve URL ID for record
		function getQueryVariable(variable) {
			var query = window.location.search.substring(1);
 			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if(pair[0] == variable){return pair[1];}
			}
			return(false);
		}


		URLEngagementRecordID= getQueryVariable("rid");
		URLAuditProcedure = getQueryVariable("num");
		URLAuditProcedure = decodeURIComponent(URLAuditProcedure);
		URLTRName= getQueryVariable("TRname");
		URLTRName = decodeURIComponent(URLTRName);
		URLTRNum= getQueryVariable("TRnum");
		URLTRNum= decodeURIComponent(URLTRNum);
		URLEngSection= getQueryVariable("EngSection");
		URLEngYear= getQueryVariable("EngYear");
		URLEngDate= getQueryVariable("EngDate");

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
			today = mm + '/' + dd + '/' + yyyy;

		
		let newThing;
		let newThingTwo;
		var settingsCode = {"url": "https://capincrouse.quickbase.com/db/bpuz4w7vq?a=API_DoQuery&apptoken=rb5m9rbe3b76rd4k2zdkbwaipxs&query=3.EX.3908", "method": "Get","timeout": 0,"headers": {},};
		$.ajax(settingsCode).done(function (response) {
  			var xmlTaxSchema = $(response);
			
			newThing = xmlTaxSchema.find('qdbapi').find('variables').find('trvar').text();
			newThingTwo = xmlTaxSchema.find('qdbapi').find('variables').find('trauth').text();
			
		});
		
		
		
	</script>

</head>
<body>

	<div id='close-div'>
		<span onclick='closeWindow()'><span>&#10006;</span> Close</span>	
	</div>
	<h4 id='formName'></h4>
	<form class="AssDoc01Main file-upload-form " ondrop='drop(event,"AssDoc01List")'   >
		<input id="file-upload" type="file" name="fileUpload" multiple onchange='drop(event,"AssDoc01List")'/>
		<label for="file-upload" id="file-drag" class="drag-zone hide_after_paste" ondragend="_ondragend(event)" ondragover="_ondragover(event)" ondragleave="_ondragleave(event)" ondragenter="_ondragenter(event)">
			Drag and Drop files here to Upload
			<br />
			<p id='textOr' >OR</p>
    			<p id="file-upload-btn" class="button">Browse Files</p>
		</label>
  
		<div class='text-inform-files'>
			<p><strong>File limit: 100MB per file<br/>File(s) will appear on your portal after you refresh the preplist by clicking 'Save & Close' or 'Save & Keep Working'</strong></p>
		</div>

		<div class="files">
			<div id='AssDoc01List' class='filesInfo'></div>
		</div>
	</form>

	
<script>

	function ob32decode(ob32) {
		var ob32Characters = "abcdefghijkmnpqrstuvwxyz23456789";
		var decode = 0;
		var place = 1;
		
		for (var counter = ob32.length -1; counter >= 0; counter--) {   
 			var oneChar = ob32.charAt(counter);
 			var oneDigit = ob32Characters.indexOf(oneChar);
 			decode += (oneDigit * place);
  			place = place*32;
 		}

 	return decode;
	}


	function ob32encode(strDecimal) {
		var ob32Characters = "abcdefghijkmnpqrstuvwxyz23456789";
		var decimal = parseInt(strDecimal);
		var ob32 = "";

		while (decimal > 0) {
			var remainder = decimal % 32;
 			remainder = ob32Characters.substr(remainder,1);
 			ob32 = remainder.concat(ob32);
 			decimal = Math.floor(decimal/32);
 		}

		return ob32;

	}

	function uploadFile(newfile, num, rid, divName,newfilename) {
		const reader = new FileReader();
    		reader.onloadend = () => {
      			const base64String = reader.result
        			.replace("data:", "")
        			.replace(/^.+,/, "");
				
			uploadFileNext (base64String, num, rid, divName, newfilename, newfile);
			
   		 };
    		reader.readAsDataURL(newfile);	
	
	}

	function uploadFileNext(encodedFile, num, rid, divName,newfilename, newfile) {
	
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

	
	
	} //end function
		

	
function theEnd() {

alert("the end");

}
	

	function allowDrop(ev) {
  		ev.preventDefault();
	}


	function drop(ev, divName) {
  		ev.preventDefault();
		

		 if (ev.dataTransfer.items) {
		 	for (var i = 0; i < ev.dataTransfer.items.length; i++) {  		
		 		if (ev.dataTransfer.items[i].kind === 'file') {	
			 		var newfile = ev.dataTransfer.items[i].getAsFile();
					var newfilename = newfile.name;
						newfilename = newfilename.replace("'"," ");
						newfilename = newfilename.replace("&","and");
					uploadFile(newfile,URLAuditProcedure, URLEngagementRecordID, divName, newfilename);
				
				} //end if
      	  		} //end for
			
 		} //end if
	
	}//end function


	function _ondragenter(e){
  		e.preventDefault(); 
  		$('.drag-zone').css("background", "#e1e1e1");
	}
	function _ondragleave(e){
  		e.preventDefault();
  		$('.drag-zone').css("background", "#e1e1e1");
	}
	function _ondragover(e){
  		e.preventDefault();
  		$('.drag-zone').css("background", "#b1b0b0");
	}



	// no react or anything
	let state = {};

	// state management
	function updateState(newState) {
  		state = { ...state, ...newState };
	}

	// event handlers
	$("input").change(function (e, ev, divName) {
  		let files = document.getElementsByTagName("input")[0].files;
  		let filesArr = Array.from(files);
  		updateState({ files: files, filesArr: filesArr });
//console.log(state)
  		renderFileList();
	});

	// render functions
	function renderFileList() {
		//console.log('hit renderFileList()')
 		let fileMap = state.filesArr.forEach((file, index) => {
			var newfilename = file.name;
				newfilename = newfilename.replace("'"," ");
						newfilename = newfilename.replace("&","and");
			uploadFile(file,URLAuditProcedure, URLEngagementRecordID,"AssDoc01List",newfilename)
		});
	}


	// Displaying name of the form on top of the edit button
	let formAudit = URLAuditProcedure.toString();
	document.getElementById("formName").innerHTML = formAudit;


	const closeWindow = () => {
		window.close()
	}
	

</script>


</body>
</html>
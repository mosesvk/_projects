// instantiate new modal


const createBenchmark = (benchmarkDesc) => {

	let variable = new tingle.modal({
 		footer: false,
		stickyFooter: false,
		closeMethods: ['overlay', 'button', 'escape'],
		closeLabel: "Close",
    		cssClass: ['custom-class-1', 'custom-class-2'],
    		onOpen: function() {
        		console.log('modal open');
    		},
    		onClose: function() {
        		console.log('modal closed');
    		},
    		beforeClose: function() {
        		// here's goes some logic
        		// e.g. save content before closing the modal
        		return true; // close the modal
        		return false; // nothing happens
    		}
	})


	if (benchmarkDesc.length > 1) {
		let message = '<div>'
		let p = ''
		for (let par of benchmarkDesc) {
			p +=`<p>${par}</p>`
		}
		message += p
		message += '</div>'
		variable.setContent(`${message}`)
	} else {
		variable.setContent(`<p>${benchmarkDesc}<p>`)
	}


	return variable
}










	  // MAIN CREATEMODAL FUNCTION  -------------------------------------------------------------->

		const createModal = (id, whatDoesThisMean, benchMark, title) => {


		   // CREATING DYNAMIC VARIABLES -------------------------------------------------------------->

			let whatDoesThisMean_body = whatDoesThisMean.map(item => {
				return '<p>' + item + '</p>'
			}).join(',').replaceAll(',','') 
			

				let benchMark_body
			if (benchMark) {
				benchMark_body = benchMark.map(item => {
					return '<p>' + item + '</p>'
				}).join(',').replaceAll(',','') 
			} else {
				benchMark_body = '<p>No benchmark has been set for this ratio.</p>'
			}

			let mainTitle = title ? title : 'NEED TITLE'



		   // CREATING THE MODAL -------------------------------------------------------------->
			
			$(`#modal-${id}`).append(`
				<div class="modal-dialog modal-lg">
    					<div class="modal-content">
      						<div class="modal-header">
					       		<h4 class="modal-title" id="exampleModalLabel">` + mainTitle + `</h4>
       						</div>
						<div class="modal-body">
							<div class="accordion-item">
								<h2 class="accordion-header" id="headingOne">
      									<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
		        							Support Data
			      						</button>
								</h2>
								<div>
			    						<div id="collapseOne" class="accordion-collapse" aria-labelledby="headingOne" >
	      									<div class="accordion-body">								
											<table id='table-` + id + `' class='table table-striped table-striped-accordion'>
												<thead>
													<th scope='col'>YEAR</th>
													<th scope='col'>Client Data</th>
													<th scope='col'>Peer Average</th>
													<th scope='col'>Peer Mid</th>
													<th scope='col'>Peer Min</th>
													<th scope='col'>Peer Max</th>
												</thead>
												<tbody id='table-body-` + id + `'></tbody>
											</table>
										</div>
				    					</div>
								</div>
							</div> <!-- accordion-item-one-->

					  		<div class="accordion-item">
    								<h2 class="accordion-header" id="headingTwo">
      									<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        									What does this mean? 
		      							</button>
				    				</h2>
	    							<div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" >
      									<div class="accordion-body">
										`+ whatDoesThisMean_body + `
									</div>
	    							</div>
		  					</div> <!-- accordion-item-two -->

		 		 			<div class="accordion-item">
    								<h2 class="accordion-header" id="headingThree">
	      								<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
	       									Benchmark
		      							</button>
				    					</h2>
    									<div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" >
      										<div class="accordion-body">
											` + benchMark_body + `
										</div>
	    								</div>
	  						</div> <!-- accordion-item-three -->
		      				</div> <!------------- modal-body -->
					      	<div class="modal-footer">
        						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					      	</div>
	    				</div> <!------ modal-content -----> 
				</div> <!------ modal-dialog ----->`)
			
		} // createModal()



	   // DYNAMIC ADDING OF ALL MODALS -------------------------------------------------->


		
		   // DEMO - Modals ------------------------------------------------------->

				let givingUnit_whatDoesThisMean = ['This measure introduces the concept of a giving unit. A giving unit is usually a group of family members who contribute jointly to the church. A giving unit is also defined as any recurring supporter of the ministry. This excludes the individual who may make a smaller one-time gift supporting an event, such as a short-term mission trip. To identify only the regular recurring giving units, the measure only includes giving units that contribute more than $250 annually to the church.']
			createModal('givingUnits', givingUnit_whatDoesThisMean, null, 'Giving Units')
		
				let attendToStaff_whatDoesThisMean = ['Another way to analyze the portion of the operating budget that a church spends on personnel costs is to look at the non-financial ratio of attendees to staff. A key point to remember is that this ratio isn’t impacted by size, so it doesn’t matter if the church has 200, 2,000, or 20,000 attendees. This ratio tells the church that one full-time staff equivalent is being paid for a specific number of attendees. This information may be especially useful alongside Ratios 15 – 17 when a church is assessing its own staffing levels and the amount spent on personnel costs compared to peers.']
				let attendToStaff_benchmark = ['We believe that a reasonable benchmark is between 65 - 90 range.']
			createModal('attendToStaff', attendToStaff_whatDoesThisMean, attendToStaff_benchmark, 'Attendees to Staff')
			let attendeeToStaffBenchmarkPopup = createBenchmark(attendToStaff_benchmark)







		   // CASH - Modals ------------------------------------------------------->



		   // DEBT - Modals ------------------------------------------------------->

				



		   // INCOME - Modals ------------------------------------------------------->

				



		   // EXPENSES - Modals ------------------------------------------------------->




		/*  ~template~

				let _whatDoesThisMean = [
					'',
					]
				let _benchmark = [
					'',
					]
			createModal('', )
		*/






























	// PRINTING FUNCTION ---------------------------------------------------------------------------------------------------->

	// $('#exampleModal')
	// 	.append( `<div class='modal-dialog modal-lg'>
	// 		<div class='modal-content'>
    //   				<div class='modal-header d-flex justify-content-center'>
    //    					<h5 class='modal-title' id='exampleModalLabel'>Choose Charts to Print</h5>
    //    				</div> 
	// 	     		<div class='modal-body'>
	// 				<div class='modal-body-top d-flex justify-content-center displayNone'>
	// 					<button class='btn btn-secondary dropdown-toggle' type='button' id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Select Charts</button>
	// 					<div id='dropdown-div' class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
	// 						<div>
	// 			  				<ul>
	// 							<p class='listItem-p'>Demo Charts</p>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='myChart' id='givingUnitsChart'>
	// 								<span></span>
	// 								<label class='form-printChart' >Giving Units</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='myChart2' id='attendToStaffChart'>
	// 								<span></span>
	// 								<label class='form-printChart' >Attendee to Staff</label>
	// 							</li>
	// 							<p class='listItem-p'>Cash Charts</p>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartDaysExpendable' id='daysExpendNetAssetChart'>
	// 								<span></span>
	// 								<label class='form-printChart' >Days of Expendable Net Asset Reserves</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartDaysOperating' id='daysOperating'>
	// 								<span></span>
	// 								<label class='form-printChart' >Days Operating Cash Availability</label>
	// 							</li>

	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartDaysAvailableCash' id='daysAvailableCash'>
	// 								<span></span>
	// 								<label class='form-printChart' >Available Days of Cash Flow Coverage</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartLiquidityRatio' id='liquidityChart'>
	// 								<span></span>
	// 								<label class='form-printChart' >Liquidity Ratio</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartCashAvailability' id='netCashAvailabiliy'>
	// 								<span></span>
	// 								<label class='form-printChart' >Net Cash Availability</label>
	// 							</li>
	// 							<!--<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartCashAvailabilityInclude' id='netCashAvailabiliyInclude'>
	// 								<span></span>
	// 								<label class='form-printChart' >Net Cash Availability Include Unused Credit</label>
	// 							</li> -->
	// 				 		</ul>
	// 						</div>
	// 						<div>
	// 			  				<ul>
	// 							<p class='listItem-p'>Debt Charts</p>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartDebtToContributionsWithout' id='debtToContributionsWithout'>
	// 								<span></span>
	// 								<label class='form-printChart' >Debt to Contributions w/o Donor</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartCurrentRatio' id='currentRatio'>
	// 								<span></span>
	// 								<label class='form-printChart' >Current Ratio</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartMandatoryDebtService' id='mandatoryDebtService'>
	// 								<span></span>
	// 								<label class='form-printChart' >Mandatory Debt Services to Contributions</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartDebtPerAvgAdultAttendGivingUnit' id='debtPerAvgAdultAttendGivingUnit'>
	// 								<span></span>
	// 								<label class='form-printChart' >Debt per Avg Adult Attendee & Giving Unit</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartDebtCoverage' id='debtCoverage'>
	// 								<span></span>
	// 								<label class='form-printChart' >Debt Coverage</label>
	// 							</li>
	// 							<p class='listItem-p'>Income Charts</p>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartNetIncome' id='netIncome'>
	// 								<span></span>
	// 								<label class='form-printChart' >Net Income</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartContrWithoutPerAvgAttAndGU' id='contrWithoutPerAvgAttAndGU'>
	// 								<span></span>
	// 								<label class='form-printChart' >Contributions w/o Donor Restrictions</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartTotalContrPerAvgAttAndGU' id='totalContrPerAvgAttAndGU'>
	// 								<span></span>
	// 								<label class='form-printChart' >Total Contributions per Avg Attendee & Giving Unit</label>
	// 							</li>
	// 							<!--<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartMedianIncomePerGU' id='medianIncomePerGU'>
	// 								<span></span>
	// 								<label class='form-printChart' >Median Household Income per Giving Unit</label>
	// 							</li>-->
	// 						</div>
	// 						<div>
	// 							<ul>
	// 							<p class='listItem-p'>Expense Charts</p>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartBenefitsToSalaries' id='benefitsToSalaries'>
	// 								<span></span>
	// 								<label class='form-printChart' >Benefits to Salaries per Employees</label>
	// 							</li>
	// 							<!--<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartAvgSBperFTE' id='avgSBperFTE'>
	// 								<span></span>
	// 								<label class='form-printChart' >Avg Salaries & Benefits per FTE</label>
	// 							</li>-->
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartBenefitsSalariesTotal' id='benefitsSalariesTotal'>
	// 								<span></span>
	// 								<label class='form-printChart' >Salaries & Benefits per Employee</label>
	// 							</li>
	// 							<!--<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartPersonnelMandatoryDebtService' id='personnelMandatoryDebtService'>
	// 								<span></span>
	// 								<label class='form-printChart' >Personel & Mandatory Debt Service payment</label>
	// 							</li>-->
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartPersonnelInclude' id='personnelInclude'>
	// 								<span></span>
	// 								<label class='form-printChart' >Personel to Cash</label>
	// 							</li>
	// 							<!--<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartMissionCategories' id='missionCategories'>
	// 								<span></span>
	// 								<label class='form-printChart' >Mission Categories to Cash Expenditure</label>
	// 							</li>-->
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='chartTotalCashExpendExcludePerAvgAtt' id='totalCashExpendExcludePerAvgAtt'>
	// 								<span></span>
	// 								<label class='form-printChart' >Total Cash Expenditure excluding Per Avg. Attendee</label>
	// 							</li>

	// 							<p class='listItem-p'>REPORT CHARTS</p>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='data-tableDemo' id='tableDemo'>
	// 								<span></span>
	// 								<label class='form-printChart' >Demo Report Chart</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='data-tableCash' id='tableCash'>
	// 								<span></span>
	// 								<label class='form-printChart' >Cash Report Chart</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='data-tableDebt' id='tableDebt'>
	// 								<span></span>
	// 								<label class='form-printChart' >Debt Report Chart</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='data-tableIncome' id='tableIncome'>
	// 								<span></span>
	// 								<label class='form-printChart' >Income Report Chart</label>
	// 							</li>
	// 							<li>
	// 								<input class='form-check-input' name='printCheckbox' onchange='selectedImages()' type='checkbox' value='data-tableExpense' id='tableExpense'>
	// 								<span></span>
	// 								<label class='form-printChart' >Expense Report Chart</label>
	// 							</li>
	// 						</div>
	// 					</div> <!-- div-dropdown ----------------> 
	// 				</div>
	// 				<div class='modal-body-bottom d-flex justify-content-center displayNone' >
	// 					<button type='button' class='btn btn-primary'  id='downloadPdf'>Print PDF</button>
	// 					<button type='button' class='btn btn-primary' id='printOptionsBtn' >Download Images</button>

	// 				</div>
	// 				<div class='modal-body'>
	// 					<div class='modal-body-bottom d-flex justify-content-center'>
	// 						<button type='button' class='btn btn-success'  id='generateReports'>Generate Trends and Benchmark Reports</button>
	// 					</div>
	// 				<div id="downloadInstructions" hidden="true">Please use the buttons below to download the reports in your preferred format.</div>
	// 					<div class='modal-body-bottom d-flex justify-content-center'>
	// 						<!-- <button type='button' class='btn btn-success' id='trendExcel'> </button> -->
	// 						<!-- <button type='button' class='btn btn-success' id='benchmarkPdf'></button>  -->
	// 						<!-- <button type='button' class='btn btn-success' id='benchmarkExcel'> </button>  -->
	// 						<a href="" class="btn btn-success" id="trendXLSFinal" target="_blank" hidden="true">Trends XLS</a>
	// 						<a href="" class="btn btn-success" id="trendPDFFinal" target="_blank" hidden="true">Trends PDF</a>
	// 						<a href="" class="btn btn-success" id="benchXLSFinal" target="_blank" hidden="true">Benchmark XLS</a>
	// 						<a href="" class="btn btn-success" id="benchPDFFinal" target="_blank" hidden="true">Benchmark PDF</a>
	// 					</div>
	// 				</div>
	//    			</div>
				
				
				
			


	// 			<div class='modal-footer'>
    //  					<button type='button' class='btn btn-secondary' data-bs-dismiss='modal' id='closePrintExcel'>Close</button>
	// 		    	</div>
	// 		</div>
	// 	</div>
	// ` )




			// $('#generateReports').click(() => {

			// 	if (!tableGivingUnitsArray.length) {
			// 		$('#errorSelectYears').text('Select Years of Data to Generate any Report')
			// 	} else {
			// 		$('#errorSelectYears').text(null)
			// 		createPrintExcel()
			// 	}

			// }) // generateReports.click


			// $('#closePrintExcel').click(() => {
			// 	uploadMainFile = ''

			// 	document.getElementById("trendXLSFinal").hidden = true;
			// 	document.getElementById("trendPDFFinal").hidden = true;
			// 	document.getElementById("benchXLSFinal").hidden = true;
			// 	document.getElementById("benchPDFFinal").hidden = true;
			// 	document.getElementById("downloadInstructions").hidden = true;
			// })

			//$('#trendPdf').click(() => {
			//	createPrintExcel('Trend', 'pdf')
			//})

			//$('#trendExcel').click(() => {
			//	createPrintExcel('Trend', 'xlsx')
			//})

			//$('#benchmarkPdf').click(() => {
			//	createPrintExcel('Benchmark', 'pdf')
			//})

			//$('#benchmarkExcel').click(() => {
			//	createPrintExcel('Benchmark', 'xlsx')
			//})	
















		// Demo Charts ---------------------------------------------------------------------------->

        let myChart = createChart('myChart', 'integer', 'Giving Units')

        let myChart2 = createChart('myChart2', 'dollar', 'Contributions Without Donor Restrictions')

        let chartTotalContributions = createChart('chartTotalContributions', 'dollar', 'Total Contributions')



    // Cash Charts ---------------------------------------------------------------------------->


        let chartDaysOperatingCash = createChart('chartDaysOperatingCash', 'integer', ['Days of Operating Cash and Investments on Hand',  'to Fund Annual Cash Expenditures'], '(Excluding Depreciation but Including Current Debt Principal)')            

        let chartNetCashAvailable = createChart('chartNetCashAvailable', 'dollar', 'Net Cash Availability')

        //let chartNetCashStd = createChart('chartNetCashStd', 'dollar', 'Net Cash Availability - Std.')


    // Debt Charts ---------------------------------------------------------------------------->

        let chartDebtToContributionsWithout = createChart('chartDebtToContributionsWithout', 'integer', 'Debt to Contributions Without Donor Restrictions')		

        let chartDebtPerGivingUnit = createChart('chartDebtPerGivingUnit', 'dollar', 'Debt per Giving Unit')




    // Income Charts ---------------------------------------------------------------------------->
        

        let chartContrWithoutPerAvgAttAndGU = createChart('chartContrWithoutPerAvgAttAndGU', 'dollar', ['Contributions without Donor Restrictions', 'per Giving Unit'])

        let chartTotalContrPerAvgAttAndGU = createChart('chartTotalContrPerAvgAttAndGU', 'dollar', 'Total Contributions per Giving Unit')

        
    // Expense Charts ---------------------------------------------------------------------------->



        let chartTotalCashExpendExcludePerGU = createChart('chartTotalCashExpendExcludePerGU', 'dollar', 'Total Cash Expenditures per Giving Unit', '(Excluding Depreciation but Including Current Debt Principal)')





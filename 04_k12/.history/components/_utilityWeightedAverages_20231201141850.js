const getWeightedAverageOfArray = (name) => {
    const parseData = parseStoredData(getStoredData());
    switch(name) {
      case 'studentsFacilityRatio':
        return  studentsFacilityRatio_weightedAverage(parseData)
      
      default: 
        return
    }
  }
  
  const studentsFacilityRatio_weightedAverage = (data) => {
    let numFullTime = getSumOfArray(data.fullTimeTeachers_Peer['total'])
    let numPartTime = getSumOfArray(data.partTimeTeachers_Peer['total'])
    let numStudents = getSumOfArray(data.studentAverageEnrollment_Main['total'])
  
    return (numFullTime + (0.5 *  numPartTime)) / numStudents
  }
  
  const expendableReservesInDays_weightedAverage = (data) => {
  
  }
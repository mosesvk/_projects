const getWeightedAverageOfArray = (data, name) => {
    // console.log(data, name);
    switch (name) {
      case 'attendeesToStaff':
        return attendeesToStaff_weightedAverage(data, name);  
      case 'percentContributionsOnline': 
        return percentContributionsOnline_weightedAverage(data, name);  
      default:
        return;
    }
  };

  
  const attendeesToStaff_weightedAverage = (data, name) => {

    const s150 = getSumOfArray(data.totalAttendees[name])
    const s151 = getSumOfArray(data.fullTimeEquivalents[name])

    return s150/s151
  }

  const percentContributionsOnline_weightedAverage = (data, name) => {

    const s163 = getSumOfArray(data.totalContributionOnline[name])
    const s40 = getSumOfArray(data.totalContributions[name])

    return (s163/s40) * 100
  }

 
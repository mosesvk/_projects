const getAdminCostsPerStudentChartOptions = (data) => {
    console.log({ data });
  
    const mostRecentYear = Math.max(...Object.keys(data["healthAdminAsst_Peer"]));
  
    const selectedYearsArray = getSelectedYearsFromLocalStorage();
    let clientArray = [];
    let peerAvgArray = [];
    let peer25Array = [];
    let peer50Array = [];
    let peer75Array = [];
    let peerArray = [];
  
    selectedYearsArray.map((year) => {
      peerArray = [];
      const array = data["salAdminAsst_Peer"][year];
      array.map((item, idx) => {
        const salAdminAsst = Number(data.salAdminAsst_Peer[year][idx]);
        const ficaAdminAsst = Number(data.ficaAdminAsst_Peer[year][idx]);
        const healthAdminAsst = Number(data.healthAdminAsst_Peer[year][idx]);
        const disabilityAdminAsst = Number(
          data.disabilityAdminAsst_Peer[year][idx]
        );
        const retirementAdminAsst = Number(
          data.retirementAdminAsst_Peer[year][idx]
        );
        const housingAdminAsst = Number(data.housingAdminAsst_Peer[year][idx]);
        const otherAdminAsst = Number(data.otherAdminAsst_Peer[year][idx]);
        const totalStudentFTE = Number(data.totalStudentFte_Peer[year][idx]);
        const totalStudentUHC = Number(data.totalStudentUhc_Peer[year][idx]);
  
        const peerNum =
          (salAdminAsst +
            ficaAdminAsst +
            healthAdminAsst +
            disabilityAdminAsst +
            retirementAdminAsst +
            housingAdminAsst +
            otherAdminAsst) /
          (totalStudentFTE + totalStudentUHC);
  
        peerArray.push(Math.round(peerNum));
      });
  
      const clientData =
        Number(data["adminCostsPerStudent_Client"][year].value) * 100;
      clientArray.push(clientData);
  
      const peerAvg = getWeightedAverageOfArray(
        data,
        "adminCostsPerStudent",
        year
      );
      peerAvgArray.push(Math.round(peerAvg * 100));
  
      const peer25 = get25thPercentileOfArray(peerArray);
      peer25Array.push(Math.round(peer25));
  
      const peer50 = getMidpointOfArray(peerArray);
      peer50Array.push(Math.round(peer50));
  
      const peer75 = get75thPercentileOfArray(peerArray);
      peer75Array.push(Math.round(peer75));
    });
  
    // console.log({
    //   clientArray,
    //   peerAvgArray,
    //   peerArray,
    //   peer25Array,
    //   peer50Array,
    //   peer75Array,
    // });
  
    const chartColors = document.documentElement.classList.contains("dark")
      ? {
          borderColor: "#374151",
          labelColor: "#ebedf0",
          opacityFrom: 0,
          opacityTo: 0.15,
        }
      : {
          borderColor: "#F3F4F6",
          labelColor: "#000000",
          opacityFrom: 0.45,
          opacityTo: 0,
        };
  
    const chartColor = document.documentElement.classList.contains("dark")
      ? "#e3f0fa"
      : "#000000";
  
    const yaxisLabelFormatter = (val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        return "Invalid input";
      }
      return `${val}%`;
    };
  
    const tooltipFormatter = (value) => {
      if (!value) return;
      const formattedValue = value.toLocaleString();
      return `${formattedValue}%`;
    };
  
    return {
      colors: [
        window.chartColors.green,
        window.chartColors.red,
        window.chartColors.yellow,
        window.chartColors.blue,
        window.chartColors.purple,
      ],
      series: [
        {
          name: clientName,
          type: "column",
          data: clientArray,
          style: {
            colors: [chartColors.labelColor],
          },
        },
        {
          name: "25th",
          type: "line",
          data: peer25Array,
        },
        {
          name: "50th",
          type: "line",
          data: peer50Array,
        },
        {
          name: "Avg",
          type: "line",
          data: peerAvgArray,
        },
        {
          name: "75th",
          type: "line",
          data: peer75Array,
        },
      ],
      chart: {
        id: "adminCostsPerStudent",
        toolbar: {
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
        height: 550,
        type: "line",
        stacked: false,
      },
      stroke: {
        width: 4,
      },
      title: {
        text: "Admin Costs Per Student",
        position: "top",
        align: "center",
        margin: 10,
        offsetY: 20,
        style: {
          color: chartColors.labelColor,
          fontSize: "1.5rem",
        },
      },
      xaxis: {
        categories: selectedYearsArray,
        labels: {
          style: {
            colors: chartColors.labelColor,
            fontSize: "1rem",
          },
        },
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: chartColors.labelColor,
          },
          labels: {
            formatter: yaxisLabelFormatter,
            style: {
              colors: chartColors.labelColor,
              fontSize: "1rem",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft",
          offsetY: 30,
          offsetX: 60,
        },
        y: {
          formatter: tooltipFormatter,
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
        },
      },
      legend: {
        horizontalAlign: "center",
        position: "top",
        offsetX: 40,
        fontSize: "20px",
      },
      grid: {
        row: {
          colors: ["transparent"],
          opacity: 0.5,
          thickness: 4,
        },
      },
      plotOptions: {
        bar: {
          barHeight: "90%",
        },
      },
    };
  };
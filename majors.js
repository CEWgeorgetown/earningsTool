/*global $, jQuery, alert, Highcharts */
function hexToRGB(hex, alpha) {
  'use strict';
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16),
    a = "";

  if (alpha) {
    a  = ", 0.5";
  }
  return "rgba(" + r + ", " + g + ", " + b + a + ")";
}

function pushData(dobj, things) {
  'use strict';
  /* last item has CR/LF */
  things[18] = String(things[18]).replace(/[\n\r]+/g, '');
  if (things[1] === '') {
    things[1] = "All U.S.";
  }
  if (things[18] === '') {
    things[18] = "All U.S.";
  }
  dobj.push({'schl': things[0],
    'dmajor': String(things[1]).replace(/['"]+/g, ''),
    'type': parseFloat(things[2]),
    'freq': parseFloat(things[3]),
    'p50': parseFloat(things[4]),
    'p25': parseFloat(things[5]),
    'p75': parseFloat(things[6]),
    'gradegftfy': parseFloat(things[7]),
    'gradegall': parseFloat(things[8]),
    'emprate': parseFloat(things[9]),
    'pct_ts': parseFloat(things[10]),
    'pct_tsg': parseFloat(things[11]),
    'dboost': parseFloat(things[12]),
    'boost': parseFloat(things[13]),
    'pct_ts_all': parseFloat(things[14]),
    'pct_tsg_all': parseFloat(things[15]),
    'pct_gths': parseFloat(things[16]),
    'pct_gthsftfy': parseFloat(things[17]),
    'gmajor': String(things[18]).replace(/['"]+/g, '')
  });
}

function pushStateData(dobj, things) {
  'use strict';
  things[19] = String(things[19]).replace(/[\n\r]+/g, '');
  if (things[1] === '' && things[19] !== '') {
    things[1] = "All major group: " + things[11];
  } else if (things[1] === '' && things[19] === '') {
    things[1] = "All State: " + things[11];
  }
  dobj.push({'schl': things[0],
    'dmajor': String(things[1]).replace(/['"]+/g, ''),
    'type': parseFloat(things[2]),
    'freq': parseFloat(things[3]),
    'p50': parseFloat(things[4]),
    'p25': parseFloat(things[5]),
    'p75': parseFloat(things[6]),
    'gradegftfy': parseFloat(things[7]),
    'gradegall': parseFloat(things[8]),
    'emprate': parseFloat(things[9]),
    'pct_ts': parseFloat(things[10]),
    'stabbr': things[11],
    'pct_tsg': parseFloat(things[12]),
    'dboost': parseFloat(things[13]),
    'boost': parseFloat(things[14]),
    'pct_ts_all': parseFloat(things[15]),
    'pct_tsg_all': parseFloat(things[16]),
    'pct_gths': parseFloat(things[17]),
    'pct_gthsftfy': parseFloat(things[18]),
    'gmajor': String(things[19]).replace(/['"]+/g, '')
  });
}

function noStateSelectedMsg() {
  'use strict';
  $('#selected-state').html("No state has been selected. Please select a state").addClass("text-danger");
}
/* Initial dummy data for map */
var stlist = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

var usinit = [];

var major_groups = ["Agriculture and natural resources",
  "Architecture and engineering",
  "Arts",
  "Biology and life sciences",
  "Business",
  "Communications and journalism",
  "Computers, statistics, and mathematics",
  "Education",
  "Health",
  "Humanities and liberal arts",
  "Industrial arts, consumer <br> services, and recreation",
  "Law and public policy",
  "Physical sciences",
  "Psychology and social work",
  "Social sciences"];
var color_list = ['#BD226B', '#D92423', '#D96637', '#F38C3B', '#FBAF31', '#A6BE43', '#53B64E', '#0D723D',
  '#169882', '#55C4D5', '#25A0D8', '#147FE0', '#0B5D92', '#7D7BA4', '#8C65A9', '#000000', '#000000'];
var color_listGrad = [],
  i;
for (i in color_list) {
  color_listGrad.push(hexToRGB(color_list[i], 1));
}

function display_all_majors(pgba, pggrad, pstate) {
  'use strict';
  // Fill arrays for charts
  var xcat_gmajor = [],
    arr_rngbagmajor = [],
    arr_p50bagmajor = [],
    arr_rnggradgmajor = [],
    arr_p50gradgmajor = [],
    dboost,
    boost,
    arr_pctbagmajor = [],
    arr_pctgradgmajor = [];

  $.each(pgba, function (items, item) {
    xcat_gmajor.push(item.gmajor);
  });
  $.each(pgba, function (items, item) {
    arr_rngbagmajor.push({low: item.p25, high: item.p75});
    arr_p50bagmajor.push({x: items - 0.2, y: item.p50});
  });
  $.each(pggrad, function (items, item) {
    dboost = Math.round(item.dboost / 1000) * 1000;
    boost = Math.round(item.boost * 100) + "%";
    arr_rnggradgmajor.push({low: item.p25, high: item.p75});
    arr_p50gradgmajor.push({x: items + 0.15, y: item.p50, boost: boost, dboost: dboost});
  });

  arr_pctbagmajor = [];
  $.each(pgba, function (items, item) {
    arr_pctbagmajor.push(item.pct_ts_all);
  });
  arr_pctgradgmajor = [];
  $.each(pggrad, function (items, item) {
    arr_pctgradgmajor.push(item.pct_ts_all);
  });

  // console.log(xcat_gmajor);
  // console.log(arr_pctbagmajor);
  $('#earn-chart').height(650);
  $('#pop-chart').height(650);

  /* Use of Bootstrap pill attribute with data-toggle to use active class renders
  href and data-target useless. Using jquery scrollTop instead */
  $(document.body).scrollTop($('#chartitle').offset().top);
  $('#earn-chart').highcharts({
    chart: {
      plotBackgroundColor: '#F7F7F7',
      inverted: true
    },
    title: {
      text: 'Median earnings (2011$)'/*,
      margin: 30 */
    },
    credits: {
      enabled: false
    },
    xAxis: {
      title: {
        text: 'Undergraduate major'
          //align: 'top',
          //rotation: 0
      },
      /* need to specify min, max, plotBackgroundColor, and alternateGridColor to get this working right
      Without max, color for adjacent rows are the same when there are an odd number of rows
      Without plotBackgroundColor, alternating colors do not show up */
      alternateGridColor: "#FFF",
      min: 0,
      max: xcat_gmajor.length - 1,
      useHTML: true,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: '500'
        }
      },
      categories: xcat_gmajor
    },

    yAxis: {
      title: {
        text: ''
      }
    },
    plotOptions: {
      scatter: {
        tooltip: {
          hideDelay: 100,
          pointFormatter: function () {
            if (this.series.name === "Bachelor's degree") {
              return "Median earnings: $" + Highcharts.numberFormat(Math.round(this.y / 1000) * 1000, 0) + '<br>';
            } else {
              return "Median earnings: $" + Highcharts.numberFormat(Math.round(this.y / 1000) * 1000, 0) + '<br>' +
                'Graduate boost: $' + Highcharts.numberFormat(this.dboost, 0) + " (" + this.boost + ")";
            }
          }
        }
      },
      columnrange : {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          hideDelay: 100,
          headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
          pointFormatter: function () {
            var diff = Math.round(this.high / 1000) * 1000 - Math.round(this.low / 1000) * 1000;
            return this.series.name + ': <br>' +
              "25th percentile: $" + Highcharts.numberFormat(Math.round(this.low / 1000) * 1000, 0) + '<br>' +
              "75th percentile: $" + Highcharts.numberFormat(Math.round(this.high / 1000) * 1000, 0) + '<br>' +
              "Earnings difference: $" + Highcharts.numberFormat(diff, 0);
          }
        }
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      useHTML: true
    },
    series: [{
      name: "Bachelor's degree",
      colors: color_list,
      colorByPoint: true,
      type: 'columnrange',
      data: arr_rngbagmajor
    },
      {
        name: 'Graduate degree',
        type: 'columnrange',
        colors: color_listGrad,
        colorByPoint: true,
        data: arr_rnggradgmajor
      },
      {
        name: "Bachelor's degree",
        type: 'scatter',
        marker: {
          radius: 6,
          symbol: 'circle',
          fillColor: '#f0ffff',
          lineWidth: 2,
          lineColor: '#000000'
        },
        data: arr_p50bagmajor
      },
      {
        name: 'Graduate degree',
        type: 'scatter',
        marker: {
          radius: 6,
          symbol: 'circle',
          fillColor: '#f0ffff',
          lineWidth: 2,
          lineColor: '#000000'
        },
        data: arr_p50gradgmajor
      }
      ]
  });

  $('#pop-chart').highcharts({
    title: {
      text: 'Percent of workers'
    },
    credits: {
      enabled: false
    },
    chart: {
      plotBackgroundColor: '#F7F7F7',
    },
    xAxis: {
      title: {
        text: 'Undergraduate major'
          //align: 'top',
          //rotation: 0
      },
      alternateGridColor: "#FFF",
      min: 0,
      max: 14,
      useHTML: true,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: '500'
        }
      },
      categories: xcat_gmajor.slice(0,15)
    },

    yAxis: {
      title: {
        text: ''
      },
      labels: {
        formatter: function () {
          return Math.round(this.value * 100);
        }
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          hideDelay: 100,
          useHTML: true,
          pointFormatter: function () {
            return Math.round(this.y * 100) + "% of workers with a " +
              this.series.name.toLowerCase() + "<br> majored in " + this.category.toLowerCase();
          }
        }
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: "Bachelor's degree",
      colors: color_list,
      colorByPoint: true,
      type: 'bar',
      data: arr_pctbagmajor.slice(0,15)
    },
      {
        name: 'Graduate degree',
        type: 'bar',
        colors: color_listGrad,
        colorByPoint: true,
        data: arr_pctgradgmajor.slice(0,15)
      }
      ]
  });
  if (pstate) {
    $('.well h5').text('All major groups' + ': ' + pstate);
  } else {
    $('.well h5').text('All major groups' + ': National');
  }
}

function change_major(pmajorname, pbadata, pgraddata, pusall, pbagmajor, pgradgmajor, pstate) {
  'use strict';
  var str_gmajor = pmajorname,
    color_to_use = major_groups.indexOf(str_gmajor),
    modal_badata,
    modal_graddata,
    xcat_dmajor = [],
    arr_rngbadmajor = [],
    arr_p50badmajor = [],
    arr_rnggraddmajor = [],
    arr_p50graddmajor = [],
    dboost,
    boost,
    arr_pctbadmajor = [],
    arr_pctgraddmajor = [],
    numXcat,
    chHeight,
    temp;

  $.each(pbadata, function (items, item) {
    if (item.type === 12) {
      item.gmajor = str_gmajor;
    }
  });
  $.each(pgraddata, function (items, item) {
    if (item.type === 12) {
      item.gmajor = str_gmajor;
    }
  });

  modal_badata = $.grep(pbadata, function (n, i) {
    // replace blank space to make comparison: Problem cropped up after replacing files with breaks in major names?
    return n.gmajor.replace(/\s/g, '') === str_gmajor.replace(/\s/g, '');
  });
  modal_graddata = $.grep(pgraddata, function (n, i) {
    return n.gmajor.replace(/\s/g, '') === str_gmajor.replace(/\s/g, '');
  });

  temp = $.grep(pbagmajor, function (n, i) {
    // replace blank space to make comparison: Problem cropped up after replacing files with breaks in major names?
    return n.gmajor.replace(/\s/g, '') === str_gmajor.replace(/\s/g, '');
  })[0];
  temp.dmajor = "All major group, U.S.";
  modal_badata.push(temp);
  temp = $.grep(pgradgmajor, function (n, i) {
    // replace blank space to make comparison: Problem cropped up after replacing files with breaks in major names?
    return n.gmajor.replace(/\s/g, '') === str_gmajor.replace(/\s/g, '');
  })[0];
  temp.dmajor = "All major group, U.S.";
  modal_graddata.push(temp);

  modal_badata.push(pusall[0]);
  modal_graddata.push(pusall[1]);

  // TODO: Trap chart display when there is no data to show

  // Fill arrays for charts
  $.each(modal_badata, function (items, item) {
    xcat_dmajor.push(item.dmajor);
  });

  $.each(modal_badata, function (items, item) {
    arr_rngbadmajor.push({low: item.p25, high: item.p75});
    arr_p50badmajor.push({x: items - 0.2, y: item.p50, smpSz: item.freq});
  });
  $.each(modal_graddata, function (items, item) {
      dboost = Math.round(item.dboost / 1000) * 1000;
      boost = Math.round(item.boost * 100) + "%";
      arr_rnggraddmajor.push({low: item.p25, high: item.p75});
      arr_p50graddmajor.push({x: items + 0.15, y: item.p50, boost: boost, dboost: dboost, smpSz: item.freq});
  });
  $.each(modal_badata, function (items, item) {
    arr_pctbadmajor.push(item.pct_tsg);
  });
  $.each(modal_graddata, function (items, item) {
    arr_pctgraddmajor.push(item.pct_tsg);
  });

  numXcat = xcat_dmajor.length;
  chHeight = 0;
  if (numXcat > 0 && numXcat < 6) {
    chHeight = 400;
  } else if (numXcat >= 5 && numXcat < 15) {
    chHeight = 600;
  } else if (numXcat >= 15) {
    chHeight = 800;
  }
  $('#earn-chart').height(chHeight);
  $('#pop-chart').height(chHeight);
  $(document.body).scrollTop($('#chartitle').offset().top);

  $('#earn-chart').highcharts({
    chart: {
      plotBackgroundColor: '#F7F7F7',
      inverted: true
    },
    title: {
      text: 'Median earnings (2011$)'
    },
    tooltip: {
      useHTML: true
    },
    subtitle: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      title: {
        text: 'Undergraduate major'
          //align: 'top',
          //rotation: 0
      },
      alternateGridColor: '#FFF',
      min: 0,
      max: numXcat-1,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: '500'
        }
      },
      categories: xcat_dmajor
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    plotOptions: {
      scatter: {
        tooltip: {
          hideDelay: 100,
          pointFormatter: function () {
            var warnmsg = '';
            if (this.series.name === "Bachelor's degree") {
              if (this.smpSz < 100) {
                warnmsg = 'Sample size (' + this.smpSz + ') may be unreliable. <br>';
              }
              return "Median earnings: $" + Highcharts.numberFormat(Math.round(this.y / 1000) * 1000, 0) + '<br>' + warnmsg;
            } else {
              if (this.smpSz < 100) {
                warnmsg = 'Sample size (' + this.smpSz + ') may be unreliable. <br>';
              }
              return "Median earnings: $" + Highcharts.numberFormat(Math.round(this.y / 1000) * 1000, 0) + '<br>' +
                'Graduate boost: $' + Highcharts.numberFormat(this.dboost, 0) + " (" + this.boost + ")" + '<br>' + warnmsg;
            }
          }
        }
      },
      columnrange: {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          hideDelay: 100,
          pointFormatter: function () {
            var diff = Math.round(this.high / 1000) * 1000 - Math.round(this.low / 1000) * 1000;
            return this.series.name + ': <br>' +
              "25th percentile: $" + Highcharts.numberFormat(Math.round(this.low / 1000) * 1000, 0) + '<br>' +
              "75th percentile: $" + Highcharts.numberFormat(Math.round(this.high / 1000) * 1000, 0) + '<br>' +
              "Earnings difference: $" + Highcharts.numberFormat(diff, 0);
          }
        }
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: "Bachelor's degree",
      color: color_list[color_to_use],
      colorByPoint: false,
      type: 'columnrange',
      data: arr_rngbadmajor
    },
      {
        name: 'Graduate degree',
        type: 'columnrange',
        color: color_listGrad[color_to_use],
        colorByPoint: false,
        data: arr_rnggraddmajor
      },
        {
        name: "Bachelor's degree",
        type: 'scatter',
        marker: {
          radius: 4,
          symbol: 'circle',
          fillColor: '#f0ffff',
          lineWidth: 2,
          lineColor: '#000000'
        },
        data: arr_p50badmajor
      },
      {
        name: 'Graduate degree',
        type: 'scatter',
        marker: {
          radius: 4,
          symbol: 'circle',
          fillColor: '#f0ffff',
          lineWidth: 2,
          lineColor: '#000000'
        },
        data: arr_p50graddmajor
      }
      ]
  });
  $('#pop-chart').highcharts({
    title: {
      text: 'Percent of major group'
    },
    subtitle: {
      text: ''
    },
    chart: {
      plotBackgroundColor: '#F7F7F7',
    },
    credits: {
      enabled: false
    },
    noData: {
      style: {
        "fontSize": "12px",
        "fontWeight": "bold",
        "color": "#666"
      },
      useHTML: true
    },
    xAxis: {
      title: {
        text: 'Undergraduate major'
          //align: 'top',
          //rotation: 0
      },
      alternateGridColor: '#FFF',
      min: 0,
      max: numXcat - 5,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: '500'
        }
      },
      categories: xcat_dmajor.slice(0, numXcat - 4)
    },
    yAxis: {
      title: {
        text: ''
      },
      max: 1,
      labels: {
        formatter: function () {
          return Math.round(this.value * 100);
        }
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          hideDelay: 100,
          headerFormat: '',
          pointFormatter: function () {
            return Math.round(this.y * 100) + "% of workers with a " +
              this.series.name.toLowerCase() + " in <br>" + str_gmajor.toLowerCase() +
              " majored in <br><em>" + this.category.toLowerCase().replace("<br>", "") + "<em>";
          }
        }
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: "Bachelor's degree",
      color: color_list[color_to_use],
      colorByPoint: false,
      type: 'bar',
      data: arr_pctbadmajor.slice(0, numXcat - 4)
    },
        {
        name: 'Graduate degree',
        type: 'bar',
        color: color_listGrad[color_to_use],
        colorByPoint: false,
        data: arr_pctgraddmajor.slice(0, numXcat - 4)
      }
      ]
  });

  if (pstate) {
    $('.well h5').text(str_gmajor.replace('<br> ', '') + ': ' + pstate);
  } else {
    $('.well h5').text(str_gmajor.replace('<br> ', '') + ': National');
  };
}

$(document).ready(function () {
  'use strict';

  var arr_majors = [],
    SelectedState = null,
    FullState = null,
    stateDataRead = false,
    viewState = false,
    arr_pggmajor,
    arr_pgdmajor,
    arr_schl,
    arr_bagmajor,
    arr_gradgmajor,
    arr_badmajor,
    arr_graddmajor,
    arr_stmajors = [],
    arr_stpggmajor = [],
    arr_stpgdmajor = [],
    arr_stschl = [],
    arr_stbagmajor = [],
    arr_stgradgmajor = [],
    arr_stbadmajor = [],
    arr_stgraddmajor = [],
    varr_pggmajor,
    varr_bagmajor,
    varr_gradgmajor,
    varr_badmajor,
    varr_graddmajor,
    arr_gmajor,
    i;

  for (i = 0; i < stlist.length; i = i+1) {
    usinit.push({stabbr: stlist[i], value: 0});
  };
  Highcharts.setOptions({
    lang: {
      noData: "No data on detailed <br> majors to display due <br> to insufficient sample size",
      thousandsSep: ","
    }
  })
  $.get('webbaplus_ftfy_25_59.txt', function (majorsdata, status) {
    var lines = majorsdata.split('\n');
    $.each(lines, function (lineNo, line) {
      var items = line.split('\t');
      if (lineNo > 0) {
        pushData(arr_majors, items);
      }
    });

    // Percent grad degree of majors is type = 2 and 3
    arr_pggmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 2;
    });
    arr_pgdmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 3;
    });
    // Bachelor's and graduate degree overall
    arr_schl = $.grep(arr_majors, function (n, i) {
      return n.type === 4;
    });
    // Terminal BA and Grad by grouped major
    arr_bagmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 6 && n.schl === 'Bachelors';
    });
    arr_gradgmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 6 && n.schl === 'Graduate degree';
    });
    // Terminal BA and Grad by detailed major
    arr_badmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 7 && n.schl === 'Bachelors';
    });
    arr_graddmajor = $.grep(arr_majors, function (n, i) {
      return n.type === 7 && n.schl === 'Graduate degree';
    });

    arr_bagmajor.push(arr_schl[0]);
    arr_gradgmajor.push(arr_schl[1]);

    $('#all-major-groups-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_bagmajor = $.grep(arr_stbagmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_gradgmajor = $.grep(arr_stgradgmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_bagmajor.push(arr_schl[0]);
          varr_gradgmajor.push(arr_schl[1]);
          display_all_majors(varr_bagmajor, varr_gradgmajor, FullState);
        }
      } else {
        display_all_majors(arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#agriculture-and-natural-resources-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Agriculture and natural resources', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Agriculture and natural resources', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#architecture-and-engineering-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Architecture and engineering', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Architecture and engineering', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#arts-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Arts', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major("Arts", arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#biology-and-life-sciences-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Biology and life sciences', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Biology and life sciences', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#business-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Business', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major("Business", arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#communications-and-journalism-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Communications and journalism', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Communications and journalism', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#computers-statistics-and-mathematics-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Computers, statistics, and mathematics', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major("Computers, statistics, and mathematics", arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#education-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Education', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Education', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#health-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Health', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major("Health", arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#humanities-and-liberal-arts-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Humanities and liberal arts', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Humanities and liberal arts', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#industrial-arts-consumer-services-and-recreation-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Industrial arts, consumer <br> services, and recreation', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Industrial arts, consumer <br> services, and recreation', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#law-and-public-policy-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Law and public policy', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major("Law and public policy", arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#physical-sciences-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Physical sciences', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Physical sciences', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#psychology-and-social-work-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Psychology and social work', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major("Psychology and social work", arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });
    $('#social-sciences-icon').click(function () {
      if (viewState) {
        if (FullState === null) {
          noStateSelectedMsg();
        } else {
          varr_badmajor = $.grep(arr_stbadmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          varr_graddmajor = $.grep(arr_stgraddmajor, function (n, i) {
            return n.stabbr.replace(/\s/g, '') === SelectedState.replace(/\s/g, '');
          });
          change_major('Social sciences', varr_badmajor, varr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor, FullState);
        }
      } else {
        change_major('Social sciences', arr_badmajor, arr_graddmajor, arr_schl, arr_bagmajor, arr_gradgmajor);
      }
    });

    $('#state').change(function () {
      SelectedState = $('#state').val();
      if (SelectedState !== 'National') {
        FullState = $('#state option:selected').text();
        $("#selState").text(FullState + " selected. Now select a major.");
        viewState = true;
        if (!stateDataRead) {
          $.get('webst_baplus_ftfy_25_59.txt', function (majorsdata, status) {
            var lines = majorsdata.split('\n');
            $.each(lines, function (lineNo, line) {
              var items = line.split('\t');
              if (lineNo > 0) {
                pushStateData(arr_stmajors, items);
              }
            });
          // console.log(arr_stmajors);
          // Percent grad degree of majors
            arr_stpggmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 10;
            });
            arr_stpgdmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 11;
            });
            // Bachelor's and graduate degree overall
            arr_stschl = $.grep(arr_stmajors, function (n, i) {
              return n.type === 12;
            });
            // Terminal BA and Grad by grouped major
            arr_stbagmajor = $.grep(arr_stmajors, function (n, i) {
              return (n.type === 14) && n.schl === 'Bachelors';
            });
            arr_stgradgmajor = $.grep(arr_stmajors, function (n, i) {
              return (n.type === 14) && n.schl === 'Graduate degree';
            });
            // Combine types 12 and 14 to get state overall
            // Need state overall to appear at the end of the array for colors to be assigned correctly
            arr_stbagmajor = arr_stbagmajor.concat($.grep(arr_stschl, function (n, i) {
              return n.schl === 'Bachelors';
              })
            );
            arr_stgradgmajor = arr_stgradgmajor.concat($.grep(arr_stschl, function (n, i) {
              return n.schl === 'Graduate degree';
              })
            );
            // Terminal BA and Grad by detailed major
            arr_stbadmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 15 && n.schl === 'Bachelors';
            });
            arr_stgraddmajor = $.grep(arr_stmajors, function (n, i) {
              return n.type === 15 && n.schl === 'Graduate degree';
            });
            // Combine types 12, 14 and 15 to get state overall
            // Need state overall to appear at the end to be consistent with other chart
            arr_stbadmajor = arr_stbadmajor.concat(arr_stbagmajor);
            arr_stgraddmajor = arr_stgraddmajor.concat(arr_stgradgmajor);

            stateDataRead = true;
          });
        }
      } else {
        $("#selState").text("National data selected. Select a major.");
        FullState = null;
        viewState = false;
      }
    });
    /* Initialize to all major groups */
    $('#all-major-groups-icon').trigger("click");
  });

  $('#usmap').highcharts('Map', {
      chart : {
          borderWidth: 0 /*,
          spacingTop: -80 */
      },
      title : {
          text : ''
      },
      legend: {
        enabled: false
      },
      mapNavigation: {
        enabled: true,
        padding: 0,
        buttonOptions:
        {
          verticalAlign: "top",
          align: "left"
        } /*,
        buttons: {
          zoomOut: {
            y: 90
          },
          zoomIn: {
            y: 90,
            x: 30
          }
        }*/
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click: function () {
                $('#state').val(this.stabbr).change();
              }
            }
          }
        }
      },
      series : [{
        mapData: Highcharts.maps['countries/us/us-all'],
        data: usinit,
        joinBy: ['postal-code', 'stabbr'],
        color: "#f7f7f7",
        states: {
          hover: {
            color: "#000"
          }
        },
        tooltip: {
          headerFormat: '',
          pointFormatter: function() {
            return this.name;
          }
        }
      }]
  });

  $(".navMajor li").click(function () {
    $(".navMajor li").removeClass("active");
    $(this).addClass("active");
  });

});

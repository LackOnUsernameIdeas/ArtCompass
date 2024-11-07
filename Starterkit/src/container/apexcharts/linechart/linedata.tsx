import { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from "apexcharts";
import face1 from "../../../../assets/images/faces/1.jpg";

// Revenue Statistics
interface spark3 {
    options?: ApexOptions,
    width?: string | number,
    height?: string | number,
    series?: ApexOptions['series'],
    [key: string]: any
    label?: XAxisAnnotations
    endingShape?: string
}

export class Basicline extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            series: [{
                name: "Desktops",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false
                    },
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                colors: ['#845adf'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Product Trends by Month',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={300} />

        );
    }
}

export class Linechartwithlabels extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            series: [
                {
                    name: "High - 2013",
                    data: [28, 29, 33, 36, 32, 32, 33]
                },
                {
                    name: "Low - 2013",
                    data: [12, 11, 14, 18, 17, 13, 13]
                }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    dropShadow: {
                        enabled: true,
                        color: '#000',
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                    },
                    toolbar: {
                        show: false
                    },
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                colors: ['#845adf', '#23b7e5'],
                dataLabels: {
                    enabled: true,
                },
                stroke: {
                    curve: 'smooth'
                },
                title: {
                    text: 'Average High & Low Temperature',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                markers: {
                    size: 1
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    title: {
                        text: 'Month',
                        style: {
                            color: "#8c9097",
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    },
                },
                yaxis: {
                    title: {
                        text: 'Temperature',
                        style: {
                            color: "#8c9097",
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    },
                    min: 5,
                    max: 40
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: true,
                    offsetY: -25,
                    offsetX: -5
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={300} />

        );
    }
}

const dataSeries = [
    [{
        "date": "2014-01-01",
        "value": 20000000
    },
    {
        "date": "2014-01-02",
        "value": 10379978
    },
    {
        "date": "2014-01-03",
        "value": 30493749
    },
    {
        "date": "2014-01-04",
        "value": 10785250
    },
    {
        "date": "2014-01-05",
        "value": 33901904
    },
    {
        "date": "2014-01-06",
        "value": 11576838
    },
    {
        "date": "2014-01-07",
        "value": 14413854
    },
    {
        "date": "2014-01-08",
        "value": 15177211
    },
    {
        "date": "2014-01-09",
        "value": 16622100
    },
    {
        "date": "2014-01-10",
        "value": 17381072
    },
    {
        "date": "2014-01-11",
        "value": 18802310
    },
    {
        "date": "2014-01-12",
        "value": 15531790
    },
    {
        "date": "2014-01-13",
        "value": 15748881
    },
    {
        "date": "2014-01-14",
        "value": 18706437
    },
    {
        "date": "2014-01-15",
        "value": 19752685
    },
    {
        "date": "2014-01-16",
        "value": 21016418
    },
    {
        "date": "2014-01-17",
        "value": 25622924
    },
    {
        "date": "2014-01-18",
        "value": 25337480
    },
    {
        "date": "2014-01-19",
        "value": 22258882
    },
    {
        "date": "2014-01-20",
        "value": 23829538
    },
    {
        "date": "2014-01-21",
        "value": 24245689
    },
    {
        "date": "2014-01-22",
        "value": 26429711
    },
    {
        "date": "2014-01-23",
        "value": 26259017
    },
    {
        "date": "2014-01-24",
        "value": 25396183
    },
    {
        "date": "2014-01-25",
        "value": 23107346
    },
    {
        "date": "2014-01-26",
        "value": 28659852
    },
    {
        "date": "2014-01-27",
        "value": 25270783
    },
    {
        "date": "2014-01-28",
        "value": 26270783
    },
    {
        "date": "2014-01-29",
        "value": 27270783
    },
    {
        "date": "2014-01-30",
        "value": 28270783
    },
    {
        "date": "2014-01-31",
        "value": 29270783
    },
    {
        "date": "2014-02-01",
        "value": 30270783
    },
    {
        "date": "2014-02-02",
        "value": 31270783
    },
    {
        "date": "2014-02-03",
        "value": 32270783
    },
    {
        "date": "2014-02-04",
        "value": 33270783
    },
    {
        "date": "2014-02-05",
        "value": 28270783
    },
    {
        "date": "2014-02-06",
        "value": 27270783
    },
    {
        "date": "2014-02-07",
        "value": 35270783
    },
    {
        "date": "2014-02-08",
        "value": 34270783
    },
    {
        "date": "2014-02-09",
        "value": 28270783
    },
    {
        "date": "2014-02-10",
        "value": 35270783
    },
    {
        "date": "2014-02-11",
        "value": 36270783
    },
    {
        "date": "2014-02-12",
        "value": 34127078
    },
    {
        "date": "2014-02-13",
        "value": 33124078
    },
    {
        "date": "2014-02-14",
        "value": 36227078
    },
    {
        "date": "2014-02-15",
        "value": 37827078
    },
    {
        "date": "2014-02-16",
        "value": 36427073
    },
    {
        "date": "2014-02-17",
        "value": 37570783
    },
    {
        "date": "2014-02-18",
        "value": 38627073
    },
    {
        "date": "2014-02-19",
        "value": 37727078
    },
    {
        "date": "2014-02-20",
        "value": 38827073
    },
    {
        "date": "2014-02-21",
        "value": 40927078
    },
    {
        "date": "2014-02-22",
        "value": 41027078
    },
    {
        "date": "2014-02-23",
        "value": 42127073
    },
    {
        "date": "2014-02-24",
        "value": 43220783
    },
    {
        "date": "2014-02-25",
        "value": 44327078
    },
    {
        "date": "2014-02-26",
        "value": 40427078
    },
    {
        "date": "2014-02-27",
        "value": 41027078
    },
    {
        "date": "2014-02-28",
        "value": 45627078
    },
    {
        "date": "2014-03-01",
        "value": 44727078
    },
    {
        "date": "2014-03-02",
        "value": 44227078
    },
    {
        "date": "2014-03-03",
        "value": 45227078
    },
    {
        "date": "2014-03-04",
        "value": 46027078
    },
    {
        "date": "2014-03-05",
        "value": 46927078
    },
    {
        "date": "2014-03-06",
        "value": 47027078
    },
    {
        "date": "2014-03-07",
        "value": 46227078
    },
    {
        "date": "2014-03-08",
        "value": 47027078
    },
    {
        "date": "2014-03-09",
        "value": 48027078
    },
    {
        "date": "2014-03-10",
        "value": 47027078
    },
    {
        "date": "2014-03-11",
        "value": 47027078
    },
    {
        "date": "2014-03-12",
        "value": 48017078
    },
    {
        "date": "2014-03-13",
        "value": 48077078
    },
    {
        "date": "2014-03-14",
        "value": 48087078
    },
    {
        "date": "2014-03-15",
        "value": 48017078
    },
    {
        "date": "2014-03-16",
        "value": 48047078
    },
    {
        "date": "2014-03-17",
        "value": 48067078
    },
    {
        "date": "2014-03-18",
        "value": 48077078
    },
    {
        "date": "2014-03-19",
        "value": 48027074
    },
    {
        "date": "2014-03-20",
        "value": 48927079
    },
    {
        "date": "2014-03-21",
        "value": 48727071
    },
    {
        "date": "2014-03-22",
        "value": 48127072
    },
    {
        "date": "2014-03-23",
        "value": 48527072
    },
    {
        "date": "2014-03-24",
        "value": 48627027
    },
    {
        "date": "2014-03-25",
        "value": 48027040
    },
    {
        "date": "2014-03-26",
        "value": 48027043
    },
    {
        "date": "2014-03-27",
        "value": 48057022
    },
    {
        "date": "2014-03-28",
        "value": 49057022
    },
    {
        "date": "2014-03-29",
        "value": 50057022
    },
    {
        "date": "2014-03-30",
        "value": 51057022
    },
    {
        "date": "2014-03-31",
        "value": 52057022
    },
    {
        "date": "2014-04-01",
        "value": 53057022
    },
    {
        "date": "2014-04-02",
        "value": 54057022
    },
    {
        "date": "2014-04-03",
        "value": 52057022
    },
    {
        "date": "2014-04-04",
        "value": 55057022
    },
    {
        "date": "2014-04-05",
        "value": 58270783
    },
    {
        "date": "2014-04-06",
        "value": 56270783
    },
    {
        "date": "2014-04-07",
        "value": 55270783
    },
    {
        "date": "2014-04-08",
        "value": 58270783
    },
    {
        "date": "2014-04-09",
        "value": 59270783
    },
    {
        "date": "2014-04-10",
        "value": 60270783
    },
    {
        "date": "2014-04-11",
        "value": 61270783
    },
    {
        "date": "2014-04-12",
        "value": 62270783
    },
    {
        "date": "2014-04-13",
        "value": 63270783
    },
    {
        "date": "2014-04-14",
        "value": 64270783
    },
    {
        "date": "2014-04-15",
        "value": 65270783
    },
    {
        "date": "2014-04-16",
        "value": 66270783
    },
    {
        "date": "2014-04-17",
        "value": 67270783
    },
    {
        "date": "2014-04-18",
        "value": 68270783
    },
    {
        "date": "2014-04-19",
        "value": 69270783
    },
    {
        "date": "2014-04-20",
        "value": 70270783
    },
    {
        "date": "2014-04-21",
        "value": 71270783
    },
    {
        "date": "2014-04-22",
        "value": 72270783
    },
    {
        "date": "2014-04-23",
        "value": 73270783
    },
    {
        "date": "2014-04-24",
        "value": 74270783
    },
    {
        "date": "2014-04-25",
        "value": 75270783
    },
    {
        "date": "2014-04-26",
        "value": 76660783
    },
    {
        "date": "2014-04-27",
        "value": 77270783
    },
    {
        "date": "2014-04-28",
        "value": 78370783
    },
    {
        "date": "2014-04-29",
        "value": 79470783
    },
    {
        "date": "2014-04-30",
        "value": 80170783
    }
    ],
    [{
        "date": "2014-01-01",
        "value": 150000000
    },
    {
        "date": "2014-01-02",
        "value": 160379978
    },
    {
        "date": "2014-01-03",
        "value": 170493749
    },
    {
        "date": "2014-01-04",
        "value": 160785250
    },
    {
        "date": "2014-01-05",
        "value": 167391904
    },
    {
        "date": "2014-01-06",
        "value": 161576838
    },
    {
        "date": "2014-01-07",
        "value": 161413854
    },
    {
        "date": "2014-01-08",
        "value": 152177211
    },
    {
        "date": "2014-01-09",
        "value": 140762210
    },
    {
        "date": "2014-01-10",
        "value": 144381072
    },
    {
        "date": "2014-01-11",
        "value": 154352310
    },
    {
        "date": "2014-01-12",
        "value": 165531790
    },
    {
        "date": "2014-01-13",
        "value": 175748881
    },
    {
        "date": "2014-01-14",
        "value": 187064037
    },
    {
        "date": "2014-01-15",
        "value": 197520685
    },
    {
        "date": "2014-01-16",
        "value": 210176418
    },
    {
        "date": "2014-01-17",
        "value": 196122924
    },
    {
        "date": "2014-01-18",
        "value": 207337480
    },
    {
        "date": "2014-01-19",
        "value": 200258882
    },
    {
        "date": "2014-01-20",
        "value": 186829538
    },
    {
        "date": "2014-01-21",
        "value": 192456897
    },
    {
        "date": "2014-01-22",
        "value": 204299711
    },
    {
        "date": "2014-01-23",
        "value": 192759017
    },
    {
        "date": "2014-01-24",
        "value": 203596183
    },
    {
        "date": "2014-01-25",
        "value": 208107346
    },
    {
        "date": "2014-01-26",
        "value": 196359852
    },
    {
        "date": "2014-01-27",
        "value": 192570783
    },
    {
        "date": "2014-01-28",
        "value": 177967768
    },
    {
        "date": "2014-01-29",
        "value": 190632803
    },
    {
        "date": "2014-01-30",
        "value": 203725316
    },
    {
        "date": "2014-01-31",
        "value": 218226177
    },
    {
        "date": "2014-02-01",
        "value": 210698669
    },
    {
        "date": "2014-02-02",
        "value": 217640656
    },
    {
        "date": "2014-02-03",
        "value": 216142362
    },
    {
        "date": "2014-02-04",
        "value": 201410971
    },
    {
        "date": "2014-02-05",
        "value": 196704289
    },
    {
        "date": "2014-02-06",
        "value": 190436945
    },
    {
        "date": "2014-02-07",
        "value": 178891686
    },
    {
        "date": "2014-02-08",
        "value": 171613962
    },
    {
        "date": "2014-02-09",
        "value": 157579773
    },
    {
        "date": "2014-02-10",
        "value": 158677098
    },
    {
        "date": "2014-02-11",
        "value": 147129977
    },
    {
        "date": "2014-02-12",
        "value": 151561876
    },
    {
        "date": "2014-02-13",
        "value": 151627421
    },
    {
        "date": "2014-02-14",
        "value": 143543872
    },
    {
        "date": "2014-02-15",
        "value": 136581057
    },
    {
        "date": "2014-02-16",
        "value": 135560715
    },
    {
        "date": "2014-02-17",
        "value": 122625263
    },
    {
        "date": "2014-02-18",
        "value": 112091484
    },
    {
        "date": "2014-02-19",
        "value": 98810329
    },
    {
        "date": "2014-02-20",
        "value": 99882912
    },
    {
        "date": "2014-02-21",
        "value": 94943095
    },
    {
        "date": "2014-02-22",
        "value": 104875743
    },
    {
        "date": "2014-02-23",
        "value": 116383678
    },
    {
        "date": "2014-02-24",
        "value": 125028841
    },
    {
        "date": "2014-02-25",
        "value": 123967310
    },
    {
        "date": "2014-02-26",
        "value": 133167029
    },
    {
        "date": "2014-02-27",
        "value": 128577263
    },
    {
        "date": "2014-02-28",
        "value": 115836969
    },
    {
        "date": "2014-03-01",
        "value": 119264529
    },
    {
        "date": "2014-03-02",
        "value": 109363374
    },
    {
        "date": "2014-03-03",
        "value": 113985628
    },
    {
        "date": "2014-03-04",
        "value": 114650999
    },
    {
        "date": "2014-03-05",
        "value": 110866108
    },
    {
        "date": "2014-03-06",
        "value": 96473454
    },
    {
        "date": "2014-03-07",
        "value": 104075886
    },
    {
        "date": "2014-03-08",
        "value": 103568384
    },
    {
        "date": "2014-03-09",
        "value": 101534883
    },
    {
        "date": "2014-03-10",
        "value": 115825447
    },
    {
        "date": "2014-03-11",
        "value": 126133916
    },
    {
        "date": "2014-03-12",
        "value": 116502109
    },
    {
        "date": "2014-03-13",
        "value": 130169411
    },
    {
        "date": "2014-03-14",
        "value": 124296886
    },
    {
        "date": "2014-03-15",
        "value": 126347399
    },
    {
        "date": "2014-03-16",
        "value": 131483669
    },
    {
        "date": "2014-03-17",
        "value": 142811333
    },
    {
        "date": "2014-03-18",
        "value": 129675396
    },
    {
        "date": "2014-03-19",
        "value": 115514483
    },
    {
        "date": "2014-03-20",
        "value": 117630630
    },
    {
        "date": "2014-03-21",
        "value": 122340239
    },
    {
        "date": "2014-03-22",
        "value": 132349091
    },
    {
        "date": "2014-03-23",
        "value": 125613305
    },
    {
        "date": "2014-03-24",
        "value": 135592466
    },
    {
        "date": "2014-03-25",
        "value": 123408762
    },
    {
        "date": "2014-03-26",
        "value": 111991454
    },
    {
        "date": "2014-03-27",
        "value": 116123955
    },
    {
        "date": "2014-03-28",
        "value": 112817214
    },
    {
        "date": "2014-03-29",
        "value": 113029590
    },
    {
        "date": "2014-03-30",
        "value": 108753398
    },
    {
        "date": "2014-03-31",
        "value": 99383763
    },
    {
        "date": "2014-04-01",
        "value": 100151737
    },
    {
        "date": "2014-04-02",
        "value": 94985209
    },
    {
        "date": "2014-04-03",
        "value": 82913669
    },
    {
        "date": "2014-04-04",
        "value": 78748268
    },
    {
        "date": "2014-04-05",
        "value": 63829135
    },
    {
        "date": "2014-04-06",
        "value": 78694727
    },
    {
        "date": "2014-04-07",
        "value": 80868994
    },
    {
        "date": "2014-04-08",
        "value": 93799013
    },
    {
        "date": "2014-04-09",
        "value": 99042416
    },
    {
        "date": "2014-04-10",
        "value": 97298692
    },
    {
        "date": "2014-04-11",
        "value": 83353499
    },
    {
        "date": "2014-04-12",
        "value": 71248129
    },
    {
        "date": "2014-04-13",
        "value": 75253744
    },
    {
        "date": "2014-04-14",
        "value": 68976648
    },
    {
        "date": "2014-04-15",
        "value": 71002284
    },
    {
        "date": "2014-04-16",
        "value": 75052401
    },
    {
        "date": "2014-04-17",
        "value": 83894030
    },
    {
        "date": "2014-04-18",
        "value": 90236528
    },
    {
        "date": "2014-04-19",
        "value": 99739114
    },
    {
        "date": "2014-04-20",
        "value": 96407136
    },
    {
        "date": "2014-04-21",
        "value": 108323177
    },
    {
        "date": "2014-04-22",
        "value": 101578914
    },
    {
        "date": "2014-04-23",
        "value": 115877608
    },
    {
        "date": "2014-04-24",
        "value": 112088857
    },
    {
        "date": "2014-04-25",
        "value": 112071353
    },
    {
        "date": "2014-04-26",
        "value": 101790062
    },
    {
        "date": "2014-04-27",
        "value": 115003761
    },
    {
        "date": "2014-04-28",
        "value": 120457727
    },
    {
        "date": "2014-04-29",
        "value": 118253926
    },
    {
        "date": "2014-04-30",
        "value": 117956992
    }
    ],
    [{
        "date": "2014-01-01",
        "value": 50000000
    },
    {
        "date": "2014-01-02",
        "value": 60379978
    },
    {
        "date": "2014-01-03",
        "value": 40493749
    },
    {
        "date": "2014-01-04",
        "value": 60785250
    },
    {
        "date": "2014-01-05",
        "value": 67391904
    },
    {
        "date": "2014-01-06",
        "value": 61576838
    },
    {
        "date": "2014-01-07",
        "value": 61413854
    },
    {
        "date": "2014-01-08",
        "value": 82177211
    },
    {
        "date": "2014-01-09",
        "value": 103762210
    },
    {
        "date": "2014-01-10",
        "value": 84381072
    },
    {
        "date": "2014-01-11",
        "value": 54352310
    },
    {
        "date": "2014-01-12",
        "value": 65531790
    },
    {
        "date": "2014-01-13",
        "value": 75748881
    },
    {
        "date": "2014-01-14",
        "value": 47064037
    },
    {
        "date": "2014-01-15",
        "value": 67520685
    },
    {
        "date": "2014-01-16",
        "value": 60176418
    },
    {
        "date": "2014-01-17",
        "value": 66122924
    },
    {
        "date": "2014-01-18",
        "value": 57337480
    },
    {
        "date": "2014-01-19",
        "value": 100258882
    },
    {
        "date": "2014-01-20",
        "value": 46829538
    },
    {
        "date": "2014-01-21",
        "value": 92456897
    },
    {
        "date": "2014-01-22",
        "value": 94299711
    },
    {
        "date": "2014-01-23",
        "value": 62759017
    },
    {
        "date": "2014-01-24",
        "value": 103596183
    },
    {
        "date": "2014-01-25",
        "value": 108107346
    },
    {
        "date": "2014-01-26",
        "value": 66359852
    },
    {
        "date": "2014-01-27",
        "value": 62570783
    },
    {
        "date": "2014-01-28",
        "value": 77967768
    },
    {
        "date": "2014-01-29",
        "value": 60632803
    },
    {
        "date": "2014-01-30",
        "value": 103725316
    },
    {
        "date": "2014-01-31",
        "value": 98226177
    },
    {
        "date": "2014-02-01",
        "value": 60698669
    },
    {
        "date": "2014-02-02",
        "value": 67640656
    },
    {
        "date": "2014-02-03",
        "value": 66142362
    },
    {
        "date": "2014-02-04",
        "value": 101410971
    },
    {
        "date": "2014-02-05",
        "value": 66704289
    },
    {
        "date": "2014-02-06",
        "value": 60436945
    },
    {
        "date": "2014-02-07",
        "value": 78891686
    },
    {
        "date": "2014-02-08",
        "value": 71613962
    },
    {
        "date": "2014-02-09",
        "value": 107579773
    },
    {
        "date": "2014-02-10",
        "value": 58677098
    },
    {
        "date": "2014-02-11",
        "value": 87129977
    },
    {
        "date": "2014-02-12",
        "value": 51561876
    },
    {
        "date": "2014-02-13",
        "value": 51627421
    },
    {
        "date": "2014-02-14",
        "value": 83543872
    },
    {
        "date": "2014-02-15",
        "value": 66581057
    },
    {
        "date": "2014-02-16",
        "value": 65560715
    },
    {
        "date": "2014-02-17",
        "value": 62625263
    },
    {
        "date": "2014-02-18",
        "value": 92091484
    },
    {
        "date": "2014-02-19",
        "value": 48810329
    },
    {
        "date": "2014-02-20",
        "value": 49882912
    },
    {
        "date": "2014-02-21",
        "value": 44943095
    },
    {
        "date": "2014-02-22",
        "value": 104875743
    },
    {
        "date": "2014-02-23",
        "value": 96383678
    },
    {
        "date": "2014-02-24",
        "value": 105028841
    },
    {
        "date": "2014-02-25",
        "value": 63967310
    },
    {
        "date": "2014-02-26",
        "value": 63167029
    },
    {
        "date": "2014-02-27",
        "value": 68577263
    },
    {
        "date": "2014-02-28",
        "value": 95836969
    },
    {
        "date": "2014-03-01",
        "value": 99264529
    },
    {
        "date": "2014-03-02",
        "value": 109363374
    },
    {
        "date": "2014-03-03",
        "value": 93985628
    },
    {
        "date": "2014-03-04",
        "value": 94650999
    },
    {
        "date": "2014-03-05",
        "value": 90866108
    },
    {
        "date": "2014-03-06",
        "value": 46473454
    },
    {
        "date": "2014-03-07",
        "value": 84075886
    },
    {
        "date": "2014-03-08",
        "value": 103568384
    },
    {
        "date": "2014-03-09",
        "value": 101534883
    },
    {
        "date": "2014-03-10",
        "value": 95825447
    },
    {
        "date": "2014-03-11",
        "value": 66133916
    },
    {
        "date": "2014-03-12",
        "value": 96502109
    },
    {
        "date": "2014-03-13",
        "value": 80169411
    },
    {
        "date": "2014-03-14",
        "value": 84296886
    },
    {
        "date": "2014-03-15",
        "value": 86347399
    },
    {
        "date": "2014-03-16",
        "value": 31483669
    },
    {
        "date": "2014-03-17",
        "value": 82811333
    },
    {
        "date": "2014-03-18",
        "value": 89675396
    },
    {
        "date": "2014-03-19",
        "value": 95514483
    },
    {
        "date": "2014-03-20",
        "value": 97630630
    },
    {
        "date": "2014-03-21",
        "value": 62340239
    },
    {
        "date": "2014-03-22",
        "value": 62349091
    },
    {
        "date": "2014-03-23",
        "value": 65613305
    },
    {
        "date": "2014-03-24",
        "value": 65592466
    },
    {
        "date": "2014-03-25",
        "value": 63408762
    },
    {
        "date": "2014-03-26",
        "value": 91991454
    },
    {
        "date": "2014-03-27",
        "value": 96123955
    },
    {
        "date": "2014-03-28",
        "value": 92817214
    },
    {
        "date": "2014-03-29",
        "value": 93029590
    },
    {
        "date": "2014-03-30",
        "value": 108753398
    },
    {
        "date": "2014-03-31",
        "value": 49383763
    },
    {
        "date": "2014-04-01",
        "value": 100151737
    },
    {
        "date": "2014-04-02",
        "value": 44985209
    },
    {
        "date": "2014-04-03",
        "value": 52913669
    },
    {
        "date": "2014-04-04",
        "value": 48748268
    },
    {
        "date": "2014-04-05",
        "value": 23829135
    },
    {
        "date": "2014-04-06",
        "value": 58694727
    },
    {
        "date": "2014-04-07",
        "value": 50868994
    },
    {
        "date": "2014-04-08",
        "value": 43799013
    },
    {
        "date": "2014-04-09",
        "value": 4042416
    },
    {
        "date": "2014-04-10",
        "value": 47298692
    },
    {
        "date": "2014-04-11",
        "value": 53353499
    },
    {
        "date": "2014-04-12",
        "value": 71248129
    },
    {
        "date": "2014-04-13",
        "value": 75253744
    },
    {
        "date": "2014-04-14",
        "value": 68976648
    },
    {
        "date": "2014-04-15",
        "value": 71002284
    },
    {
        "date": "2014-04-16",
        "value": 75052401
    },
    {
        "date": "2014-04-17",
        "value": 83894030
    },
    {
        "date": "2014-04-18",
        "value": 50236528
    },
    {
        "date": "2014-04-19",
        "value": 59739114
    },
    {
        "date": "2014-04-20",
        "value": 56407136
    },
    {
        "date": "2014-04-21",
        "value": 108323177
    },
    {
        "date": "2014-04-22",
        "value": 101578914
    },
    {
        "date": "2014-04-23",
        "value": 95877608
    },
    {
        "date": "2014-04-24",
        "value": 62088857
    },
    {
        "date": "2014-04-25",
        "value": 92071353
    },
    {
        "date": "2014-04-26",
        "value": 81790062
    },
    {
        "date": "2014-04-27",
        "value": 105003761
    },
    {
        "date": "2014-04-28",
        "value": 100457727
    },
    {
        "date": "2014-04-29",
        "value": 98253926
    },
    {
        "date": "2014-04-30",
        "value": 67956992
    }
    ]
];
let ts2 = 1484418600000;
const dates: any = [];
//   var spikes = [5, -5, 3, -3, 8, -8]
for (let i = 0; i < 120; i++) {
    ts2 = ts2 + 86400000;
    const innerArr = [ts2, dataSeries[1][i].value];
    dates.push(innerArr);
}
export class Zoomabletime extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {

            series: [{
                name: 'XYZ MOTORS',
                data: dates
            }],
            options: {
                chart: {
                    type: 'area',
                    stacked: false,
                    height: 320,
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    },
                    toolbar: {
                        autoSelected: 'zoom'
                    },
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 0,
                },
                title: {
                    text: 'Stock Price Movement',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 90, 100]
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#845adf"],
                yaxis: {
                    labels: {
                        formatter: function (val) {
                            return (val / 1000000).toFixed(0);
                        },
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    },
                    title: {
                        text: 'Price',
                        style: {
                            color: "#8c9097",
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }
                    },
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    },
                },
                tooltip: {
                    shared: false,
                    y: {
                        formatter: function (val) {
                            return (val / 1000000).toFixed(0);
                        }
                    }
                }
            },

        };

    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />

        );
    }
}

const series =
{
    "monthDataSeries1": {
        "prices": [
            8107.85,
            8128.0,
            8122.9,
            8165.5,
            8340.7,
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2,
            8668.95,
            8602.3,
            8607.55,
            8512.9,
            8496.25,
            8600.65,
            8881.1,
            9340.85
        ],
        "dates": [
            "13 Nov 2017",
            "14 Nov 2017",
            "15 Nov 2017",
            "16 Nov 2017",
            "17 Nov 2017",
            "20 Nov 2017",
            "21 Nov 2017",
            "22 Nov 2017",
            "23 Nov 2017",
            "24 Nov 2017",
            "27 Nov 2017",
            "28 Nov 2017",
            "29 Nov 2017",
            "30 Nov 2017",
            "01 Dec 2017",
            "04 Dec 2017",
            "05 Dec 2017",
            "06 Dec 2017",
            "07 Dec 2017",
            "08 Dec 2017"
        ]
    },
    "monthDataSeries2": {
        "prices": [
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2,
            8668.95,
            8602.3,
            8607.55,
            8512.9,
            8496.25,
            8600.65,
            8881.1,
            9040.85,
            8340.7,
            8165.5,
            8122.9,
            8107.85,
            8128.0
        ],
        "dates": [
            "13 Nov 2017",
            "14 Nov 2017",
            "15 Nov 2017",
            "16 Nov 2017",
            "17 Nov 2017",
            "20 Nov 2017",
            "21 Nov 2017",
            "22 Nov 2017",
            "23 Nov 2017",
            "24 Nov 2017",
            "27 Nov 2017",
            "28 Nov 2017",
            "29 Nov 2017",
            "30 Nov 2017",
            "01 Dec 2017",
            "04 Dec 2017",
            "05 Dec 2017",
            "06 Dec 2017",
            "07 Dec 2017",
            "08 Dec 2017"
        ]
    },
    "monthDataSeries3": {
        "prices": [
            7114.25,
            7126.6,
            7116.95,
            7203.7,
            7233.75,
            7451.0,
            7381.15,
            7348.95,
            7347.75,
            7311.25,
            7266.4,
            7253.25,
            7215.45,
            7266.35,
            7315.25,
            7237.2,
            7191.4,
            7238.95,
            7222.6,
            7217.9,
            7359.3,
            7371.55,
            7371.15,
            7469.2,
            7429.25,
            7434.65,
            7451.1,
            7475.25,
            7566.25,
            7556.8,
            7525.55,
            7555.45,
            7560.9,
            7490.7,
            7527.6,
            7551.9,
            7514.85,
            7577.95,
            7592.3,
            7621.95,
            7707.95,
            7859.1,
            7815.7,
            7739.0,
            7778.7,
            7839.45,
            7756.45,
            7669.2,
            7580.45,
            7452.85,
            7617.25,
            7701.6,
            7606.8,
            7620.05,
            7513.85,
            7498.45,
            7575.45,
            7601.95,
            7589.1,
            7525.85,
            7569.5,
            7702.5,
            7812.7,
            7803.75,
            7816.3,
            7851.15,
            7912.2,
            7972.8,
            8145.0,
            8161.1,
            8121.05,
            8071.25,
            8088.2,
            8154.45,
            8148.3,
            8122.05,
            8132.65,
            8074.55,
            7952.8,
            7885.55,
            7733.9,
            7897.15,
            7973.15,
            7888.5,
            7842.8,
            7838.4,
            7909.85,
            7892.75,
            7897.75,
            7820.05,
            7904.4,
            7872.2,
            7847.5,
            7849.55,
            7789.6,
            7736.35,
            7819.4,
            7875.35,
            7871.8,
            8076.5,
            8114.8,
            8193.55,
            8217.1,
            8235.05,
            8215.3,
            8216.4,
            8301.55,
            8235.25,
            8229.75,
            8201.95,
            8164.95,
            8107.85,
            8128.0,
            8122.9,
            8165.5,
            8340.7,
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2
        ],
        "dates": [
            "02 Jun 2017",
            "05 Jun 2017",
            "06 Jun 2017",
            "07 Jun 2017",
            "08 Jun 2017",
            "09 Jun 2017",
            "12 Jun 2017",
            "13 Jun 2017",
            "14 Jun 2017",
            "15 Jun 2017",
            "16 Jun 2017",
            "19 Jun 2017",
            "20 Jun 2017",
            "21 Jun 2017",
            "22 Jun 2017",
            "23 Jun 2017",
            "27 Jun 2017",
            "28 Jun 2017",
            "29 Jun 2017",
            "30 Jun 2017",
            "03 Jul 2017",
            "04 Jul 2017",
            "05 Jul 2017",
            "06 Jul 2017",
            "07 Jul 2017",
            "10 Jul 2017",
            "11 Jul 2017",
            "12 Jul 2017",
            "13 Jul 2017",
            "14 Jul 2017",
            "17 Jul 2017",
            "18 Jul 2017",
            "19 Jul 2017",
            "20 Jul 2017",
            "21 Jul 2017",
            "24 Jul 2017",
            "25 Jul 2017",
            "26 Jul 2017",
            "27 Jul 2017",
            "28 Jul 2017",
            "31 Jul 2017",
            "01 Aug 2017",
            "02 Aug 2017",
            "03 Aug 2017",
            "04 Aug 2017",
            "07 Aug 2017",
            "08 Aug 2017",
            "09 Aug 2017",
            "10 Aug 2017",
            "11 Aug 2017",
            "14 Aug 2017",
            "16 Aug 2017",
            "17 Aug 2017",
            "18 Aug 2017",
            "21 Aug 2017",
            "22 Aug 2017",
            "23 Aug 2017",
            "24 Aug 2017",
            "28 Aug 2017",
            "29 Aug 2017",
            "30 Aug 2017",
            "31 Aug 2017",
            "01 Sep 2017",
            "04 Sep 2017",
            "05 Sep 2017",
            "06 Sep 2017",
            "07 Sep 2017",
            "08 Sep 2017",
            "11 Sep 2017",
            "12 Sep 2017",
            "13 Sep 2017",
            "14 Sep 2017",
            "15 Sep 2017",
            "18 Sep 2017",
            "19 Sep 2017",
            "20 Sep 2017",
            "21 Sep 2017",
            "22 Sep 2017",
            "25 Sep 2017",
            "26 Sep 2017",
            "27 Sep 2017",
            "28 Sep 2017",
            "29 Sep 2017",
            "03 Oct 2017",
            "04 Oct 2017",
            "05 Oct 2017",
            "06 Oct 2017",
            "09 Oct 2017",
            "10 Oct 2017",
            "11 Oct 2017",
            "12 Oct 2017",
            "13 Oct 2017",
            "16 Oct 2017",
            "17 Oct 2017",
            "18 Oct 2017",
            "19 Oct 2017",
            "23 Oct 2017",
            "24 Oct 2017",
            "25 Oct 2017",
            "26 Oct 2017",
            "27 Oct 2017",
            "30 Oct 2017",
            "31 Oct 2017",
            "01 Nov 2017",
            "02 Nov 2017",
            "03 Nov 2017",
            "06 Nov 2017",
            "07 Nov 2017",
            "08 Nov 2017",
            "09 Nov 2017",
            "10 Nov 2017",
            "13 Nov 2017",
            "14 Nov 2017",
            "15 Nov 2017",
            "16 Nov 2017",
            "17 Nov 2017",
            "20 Nov 2017",
            "21 Nov 2017",
            "22 Nov 2017",
            "23 Nov 2017",
            "24 Nov 2017",
            "27 Nov 2017",
            "28 Nov 2017"
        ]
    }
};
//annotations
export class Annotations extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            series: [{
                data: series.monthDataSeries2.prices
            }],
            options: {
                colors: ["#845adf"],
                chart: {
                    height: 320,
                    type: 'line',
                    id: 'areachart-2',
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                annotations: {
                    yaxis: [{
                        y: 8200,
                        borderColor: '#00E396',
                        label: {
                            borderColor: '#00E396',
                            style: {
                                color: '#fff',
                                background: '#00E396',
                            },
                            text: 'Support',
                        }
                    }, {
                        y: 8600,
                        y2: 9000,
                        borderColor: '#000',
                        fillColor: '#FEB019',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                color: '#333',
                                background: '#FEB019',
                            },
                            text: 'Y-axis range',
                        }
                    }],
                    xaxis: [{
                        x: new Date('23 Nov 2017').getTime(),
                        strokeDashArray: 0,
                        borderColor: '#775DD0',
                        label: {
                            borderColor: '#775DD0',
                            style: {
                                color: '#fff',
                                background: '#775DD0',
                            },
                            text: 'Anno Test',
                        }
                    }, {
                        x: new Date('26 Nov 2017').getTime(),
                        x2: new Date('28 Nov 2017').getTime(),
                        fillColor: '#B3F7CA',
                        opacity: 0.4,
                        label: {
                            borderColor: '#B3F7CA',
                            style: {
                                fontSize: '10px',
                                color: '#fff',
                                background: '#00E396',
                            },
                            offsetY: -10,
                            text: 'X-axis range',
                        }
                    }],
                    points: [{
                        x: new Date('01 Dec 2017').getTime(),
                        y: 8607.55,
                        marker: {
                            size: 8,
                            fillColor: '#fff',
                            strokeColor: 'red',
                            radius: 2,
                            cssClass: 'apexcharts-custom-class'
                        },
                        label: {
                            borderColor: '#FF4560',
                            offsetY: 0,
                            style: {
                                color: '#fff',
                                background: '#FF4560',
                            },

                            text: 'Point Annotation',
                        }
                    }, {
                        x: new Date('08 Dec 2017').getTime(),
                        y: 9340.85,
                        marker: {
                            size: 0
                        },
                        image: {
                            path: face1
                        }
                    }]
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Line with Annotations',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                labels: series.monthDataSeries1.dates,
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };

    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />

        );
    }
}

function generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
    }
    return series;
}
const data = generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 185, {
    min: 30,
    max: 90
});
//Brush chart
export class Brushchart extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {

            series: [{
                data: data
            }],
            options: {
                chart: {
                    id: 'chart2',
                    type: 'line',
                    height: 230,
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    },
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                colors: ['#845adf'],
                stroke: {
                    width: 3
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    opacity: 1,
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    type: 'datetime'
                }
            },

            seriesLine: [{
                data: data
            }],
            optionsLine: {
                chart: {
                    id: 'chart1',
                    height: 130,
                    type: 'area',
                    brush: {
                        target: 'chart2',
                        enabled: true
                    },
                    selection: {
                        enabled: true,
                        xaxis: {
                            min: new Date('19 Jun 2017').getTime(),
                            max: new Date('14 Aug 2017').getTime()
                        }
                    },
                },
                colors: ['#008FFB'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.91,
                        opacityTo: 0.1,
                    }
                },
                xaxis: {
                    type: 'datetime',
                    tooltip: {
                        enabled: false
                    }
                },
                yaxis: {
                    tickAmount: 2
                }
            },

        };

    }

    render() {
        return (
            <div id="wrapper">
                <div id="brush-chart1">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={230} />
                </div>
                <div id="brush-chart">
                    <ReactApexChart options={this.state.optionsLine} series={this.state.seriesLine} type="area" height={130} />
                </div>
            </div>

        );
    }
}

//Stepline

export class Stepline extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            series: [{
                data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58]
            }],
            options: {
                chart: {
                    type: 'line',
                    height: 345,
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                stroke: {
                    curve: 'stepline',
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                dataLabels: {
                    enabled: false
                },
                colors: ["#845adf"],
                title: {
                    text: 'Stepline Chart',
                    align: 'left'
                },
                markers: {
                    hover: {
                        sizeOffset: 4
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };

    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>

        );
    }
}

//gradientline

export class Gradientline extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            series: [{
                name: 'Sales',
                data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                forecastDataPoints: {
                    count: 7
                },
                stroke: {
                    width: 3,
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
                    tickAmount: 10,
                    labels: {
                        formatter: function (_value, _timestamp, opts) {
                            return opts.dateFormatter(new Date(), 'dd MMM');
                        },
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Forecast',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        gradientToColors: ['#845adf'],
                        shadeIntensity: 1,
                        type: 'horizontal',
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100, 100, 100]
                    },
                },
                yaxis: {
                    min: -10,
                    max: 40,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                }
            },

        };

    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>

        );
    }
}

//Missingnull values

export class Missingnullvalues extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            series: [{
                name: 'Peter',
                data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9]
            }, {
                name: 'Johnny',
                data: [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null]
            }, {
                name: 'David',
                data: [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    animations: {
                        enabled: false
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                stroke: {
                    width: [3, 3, 2],
                    curve: 'straight'
                },
                colors: ["#845adf", "#23b7e5", "#f5b849"],
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
                title: {
                    text: 'Missing data (null values)',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };

    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>

        );
    }
}
//

//dashed
export class Dashed extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {

            series: [{
                name: "Session Duration",
                data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
            },
            {
                name: "Page Views",
                data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
            },
            {
                name: 'Total Visits',
                data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
            }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: [3, 4, 3],
                    curve: 'straight',
                    dashArray: [0, 8, 5]
                },
                colors: ["#845adf", "#23b7e5", "#f5b849"],
                title: {
                    text: 'Page Statistics',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                legend: {
                    tooltipHoverFormatter: function (val, opts) {
                        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '';
                    }
                },
                markers: {
                    size: 0,
                    hover: {
                        sizeOffset: 6
                    }
                },
                xaxis: {
                    categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
                        '10 Jan', '11 Jan', '12 Jan'
                    ],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                tooltip: {
                    y: [
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (mins)";
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " per session";
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val;
                                }
                            }
                        }
                    ]
                },
                grid: {
                    borderColor: '#f1f1f1',
                }
            },

        };

    }
    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={400} />
            </div>

        );
    }
}

//dashed
export class Syncing extends Component<{}, spark3> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {

            series: [{
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            }],
            options: {
                chart: {
                    id: 'fb',
                    group: 'social',
                    type: 'line',
                    height: 160,
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                colors: ['#845adf'],
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

            seriesLine2: [{
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
                    min: 10,
                    max: 30
                })
            }],
            optionsLine2: {
                chart: {
                    id: 'tw',
                    group: 'social',
                    type: 'line',
                    height: 160
                },
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                colors: ['#23b7e5'],
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

            seriesArea: [{
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            }],
            optionsArea: {
                chart: {
                    id: 'yt',
                    group: 'social',
                    type: 'area',
                    height: 160,
                    events: {
                        mounted: (chart:any) => {
                          chart.windowResizeHandler();
                        }
                      },
                },
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                colors: ['#f5b849'],
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };

    }
    render() {
        return (
            <div id="wrapper">
                <div id="chart-line">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={160} />
                </div>
                <div id="chart-line2">
                    <ReactApexChart options={this.state.optionsLine2} series={this.state.seriesLine2} type="line" height={160} />
                </div>
                <div id="chart-area">
                    <ReactApexChart options={this.state.optionsArea} series={this.state.seriesArea} type="area" height={160} />
                </div>
            </div>

        );
    }
}

import React from 'react'
import {Line} from 'react-chartjs-2'

function LineChart({labels, data1, data2, data3, tooltip1, tooltip2, tooltip3}) {
    return (
        <div className='Barchart'>
            <Line
                width= {200}
                height= '70%'
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: tooltip1,
                            data: data1,
                            backgroundColor: '#B336D6'
                        },
                        {
                            label: tooltip2,
                            data: data2,
                            backgroundColor: '#37D636'
                        },
                        {
                            label: tooltip3,
                            data: data3,
                            backgroundColor: '#598A07'
                        },
                    ]
                }}
                options={
                    {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                            display: true,
                            text: 'Profit and Loss Graph'
                            }
                        },
                        scales: {
                            xAxes: [
                                {
                                    grideLines: {
                                        display: false
                                    }
                                }
                            ],
                            yAxes: [
                                {
                                    grideLines: {
                                        display: false
                                    },
                                    ticks: {
                                    beginAtZero: true
                                }
                                }
                            ]
                        }
                    },
                    {
                        maintainAspectRatio: true
                    }
                }
            />
        </div>
    )
}

export default LineChart

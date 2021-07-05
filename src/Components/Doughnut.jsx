import React from 'react'
import {Doughnut} from 'react-chartjs-2'

function DoughnutChart({labels, data, tooltip,}) {
    return (
        <div className="Barchart Doughnut">
            <Doughnut
                width= '100%'
                height= '100%'
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: tooltip,
                            data: data,
                            backgroundColor: ['#B336D6', '#37D636', '#F332D1']
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
                            text: 'Chart.js Line Chart'
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
                        maintainAspectRatio: false
                    }
                }
            />
        </div>
    )
}

export default DoughnutChart

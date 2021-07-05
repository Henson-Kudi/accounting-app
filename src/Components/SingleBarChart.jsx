import React from 'react'
import {Bar} from 'react-chartjs-2'

function SingleBarChart({labels, tooltip, backgroundColors, data}) {
    return (
        <div className="Barchart">
                        <Bar
                            width= '100%'
                            height= '50%'
                            data={{
                                labels :labels,
                                datasets:[
                                    {
                                        label: tooltip,
                                        data: data,
                                        backgroundColor: backgroundColors
                                    }
                                ]
                            }}
                            options={
                            {
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

export default SingleBarChart

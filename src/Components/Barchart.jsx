import React from 'react'
import {Bar} from 'react-chartjs-2'

function Barchart({labels, data1, data2, data3, data4, tooltip1, tooltip2, tooltip3, tooltip4}) {
    return (
        <div className='Barchart'>
            <Bar
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

export default Barchart

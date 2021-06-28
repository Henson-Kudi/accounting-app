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
                            backgroundColor: [
                                '#B336D6',
                                '#DB59FF',
                                '#598A07',
                                '#9AD636',
                                '#D63689',
                                '#088A07',
                                '#37D636',
                                '#FF57AE',
                                '#36D6A3',
                                '#8A2207',
                                '#30FFBC',
                                '#D65736'
                            ]
                        },
                        {
                            label: tooltip2,
                            data: data2,
                            backgroundColor: [
                                '#B336D6',
                                '#DB59FF',
                                '#598A07',
                                '#9AD636',
                                '#D63689',
                                '#088A07',
                                '#37D636',
                                '#FF57AE',
                                '#36D6A3',
                                '#8A2207',
                                '#30FFBC',
                                '#D65736'
                            ]
                        },
                        {
                            label: tooltip3,
                            data: data3,
                            backgroundColor: [
                                '#B336D6',
                                '#DB59FF',
                                '#598A07',
                                '#9AD636',
                                '#D63689',
                                '#088A07',
                                '#37D636',
                                '#FF57AE',
                                '#36D6A3',
                                '#8A2207',
                                '#30FFBC',
                                '#D65736'
                            ]
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

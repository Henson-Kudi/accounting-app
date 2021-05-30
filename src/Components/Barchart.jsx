import React from 'react'
import {Bar} from 'react-chartjs-2'

function Barchart({labels, data, tooltip}) {
    return (
        <div className='Barchart'>
            <Bar
                width= {200}
                height= {200}
                data={{
                    labels: labels,
                    datasets: [{
                        label: tooltip,
                        data: data,
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
                    }]
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
                        maintainAspectRatio: false
                    }
                }
            />
        </div>
    )
}

export default Barchart

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import loader from "../images/loader.gif"
import swal from 'sweetalert';
const api = process.env.REACT_APP_API
const Home = () => {
    const [data, setdata] = useState([])
    const history = useNavigate();
    const userinfo = JSON.parse(localStorage.getItem('user'))
    const [load, setload] = useState(true)

    useEffect(() => {
        if (userinfo == null) {
            history('/Login')
        }
        else {
            loadData()
        }
    }, [])

    function approved(status, data) {
        if (status == 'pending') {
            swal({
                title: "Are you sure To Approved ?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        setload(true)
                        fetch(`${api}/Adminpanel/updatebusdetail/`, {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${userinfo?.auth}`
                            },
                            body: JSON.stringify({
                                data: data,
                                status: 'approved'
                            })
                        })
                            .then(responce => responce.json()).then((res) => {
                                if (res.statusCode === 201) {
                                    loadData()
                                    swal("Yes This Bus is Successfully Approved", {
                                        icon: "success",
                                    });
                                }
                                else if (res.statusCode === 498) {
                                    localStorage.removeItem('user')
                                    history('/login')
                                }
                                else {
                                    history('*')
                                }
                            }, (error) => {
                                history('*')
                            })

                    }
                    else {
                        swal("Ok No Problem !");
                    }
                });
        }
    }

    function loadData() {
        setload(true)
        fetch(`${api}/Adminpanel/getdata`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userinfo?.auth}`
            }
        }).then(responce => responce.json()).then((res) => {
            if (res.statusCode === 200) {
                setdata(res.data)
                setload(false)
            }
            else if (res.statusCode === 498) {
                localStorage.removeItem('user')
                history('/login')
            }
            else {
                history('*')
            }
        }, (error) => {
            history('*')
        })
    }

    function sendback(id, data) {
        swal("Write something here:", {
            content: "input",
        })
            .then((value) => {
                setload(true)
                fetch(`${api}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userinfo.auth}`
                    },
                    body: JSON.stringify({
                        bus_id: id,
                        message: value,
                    })
                })
                    .then(responce => responce.json()).then((res) => {
                        if (res != undefined && res.status == 200) {
                            fetch(`${api}/updatebusdetail/`, {
                                method: 'PUT',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${userinfo.auth}`
                                },
                                body: JSON.stringify({
                                    data: data,
                                    status: 'Rejected'
                                })
                            })
                                .then(responce => responce.json()).then((res) => {
                                    if (res != undefined) {
                                        if (res.status == 200) {
                                            loadData()
                                            swal("Yes This Bus is Successfully Rejected", {
                                                icon: "success",
                                            });
                                        }
                                        else {
                                            setload(false)
                                            history('*')
                                        }
                                    }
                                }, (error) => {
                                    setload(false)
                                    history('*')
                                })
                        }
                        else if (res != undefined && res.status == 498) {
                            setload(false)
                            history('*')
                        }
                    }, (error) => {
                        history('*')
                    })
            });
    }


    return (
        <>
            {
                load == false ?
                    <div className='container'>
                        <table className="table mt-5">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Bus Name</th>
                                    <th scope="col">Total Seat</th>
                                    <th scope="col">Src To Dist</th>
                                    <th scope="col">Action Taken</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item, ind) => (
                                        <tr key={ind}>
                                            <th scope="row">{ind + 1}</th>
                                            <td>{item?.bus_name}</td>
                                            <td>{item?.Total_seat}</td>
                                            <th>*{item?.station_data[0]?.station} - {item?.station_data[(item?.station_data.length) - 1]?.station}</th>
                                            {
                                                item?.status == 'pending' ?
                                                    <td><button className='btn btn-primary btn-sm' onClick={() => approved(item?.status, item)}>{item?.status}</button></td>
                                                    : <td><button className='btn btn-primary btn-sm' disabled> {item?.status} </button></td>
                                            }
                                            {
                                                item.status == 'pending' ?
                                                    <td><button className='btn btn-danger btn-sm' onClick={() => { sendback(item?._id, item) }}>Reject</button></td>
                                                    : <td><button className='btn btn-danger btn-sm' disabled>Reject</button></td>
                                            }
                                            <td><Link to={`/View_Bus/${item?._id}`}><button className='btn btn-outline-primary btn-sm'>View More</button></Link></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    : <div className='loader-container'><img src={loader} /></div>
            }
        </>
    )
}

export default Home
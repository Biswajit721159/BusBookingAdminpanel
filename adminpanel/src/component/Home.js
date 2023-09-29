import React, { useEffect, useState } from 'react'
import {Link, useNavigate } from "react-router-dom";
import loader from "../images/loader.gif"
import swal from 'sweetalert';

const Home=()=>{
    const [data,setdata]=useState([])
    const history=useNavigate();
    const userinfo=JSON.parse(localStorage.getItem('user'))
    const [load,setload]=useState(true)

    useEffect(()=>{
        if(userinfo==null)
        { 
            history('/Login') 
        }
        else
        { 
            loadData() 
        }
    },[])

    function approved(status,data)
    {
        if(status=='pending')
        {
            swal({
                title: "Are you sure To Approved ?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    setload(true)
                    fetch(`http://localhost:5000/updatebusdetail/`,{
                        method:'PUT',
                        headers:{
                            'Accept':'application/json',
                            'Content-Type':'application/json',
                             auth:`bearer ${userinfo.auth}`
                        },
                        body:JSON.stringify({
                          data:data
                        }) 
                      })
                      .then(responce=>responce.json()).then((res)=>{
                          if(res!=undefined)
                          {
                              if(res.status==200)
                              {
                                 loadData()
                                 swal("Yes This Bus is Successfully Approved", {
                                    icon: "success",
                                 });
                              }
                              else{
                                setload(false)
                                history('*')
                              }
                          }
                      },(error)=>{
                        setload(false)
                        history('*')
                      })

                } 
                else
                {
                  swal("Ok No Problem !");
                }
            });
        }
    }

    function loadData()
    {
        setload(true)
        fetch(`https://book-bus-api.vercel.app/adminpanel/getdata`,{
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                auth:`bearer ${userinfo.auth}`
            }
        }).then(responce=>responce.json()).then((res)=>{
              setdata(res)
              setload(false)
        },(error)=>{
            history('*')
        })
    }


    return(
        <>
        {
            load==false?
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
                    </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item,ind)=>(
                                <tr key={ind}>
                                    <th scope="row">{ind+1}</th>
                                    <td>{item.bus_name}</td>
                                    <td>{item.Total_seat}</td>
                                    <th>*{item.station_data[0].station} - {item.station_data[(item.station_data.length)-1].station}</th>
                                    {
                                        item.status=='pending'?
                                        <td><button className='btn btn-primary btn-sm' onClick={()=>approved(item.status,item)}>{item.status}</button></td>
                                        : <td><button className='btn btn-primary btn-sm' disabled>{item.status}</button></td>
                                    }
                                    <td><Link to={`/View_Bus/${item._id}`}><button className='btn btn-outline-primary btn-sm'>View More</button></Link></td>
                                    <td><button className='btn btn-dark btn-sm' >Edit</button></td>
                                    <td><button className='btn btn-danger btn-sm' >Delete</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            :<div className='loader-container'><img src={loader} /></div>
        }
        </>
    )
}

export default Home
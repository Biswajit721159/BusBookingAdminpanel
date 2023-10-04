import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import loader from "../images/loader.gif"

const UserInfo=()=>{
    const userinfo=(JSON.parse(localStorage.getItem('user')))
    const history =useNavigate()
    const [user,setuser]=useState([])
    const [load,setload]=useState(true)

    const [button,setbutton]=useState("Delete")
    const [disabled,setdisabled]=useState(false)
    const [emailID,setemailID]=useState("")

    function loaduser()
    {
        setload(true)
        fetch('https://book-bus-api.vercel.app',{
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                 auth:`bearer ${userinfo.auth}`
            },
        }).then(responce=>responce.json()).then((res)=>{
           if(res!=undefined && res.status!=498)
           {
               setuser(res)
               setload(false)
           }
        },(error)=>{
            history('*')
        })
    }

    useEffect(()=>{
        if(userinfo==null)
        {
            history('/Login')
        }
        else
        {
            loaduser()
        }
    },[])

    function Delete(email)
    {
        setemailID(email)
        setbutton("Please Wait...")
        setdisabled(true)
        fetch(`https://book-bus-api.vercel.app/user/${email}`,{
            method:"DELETE",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                 auth:`bearer ${userinfo.auth}`
            },
        }).then(responce=>responce.json()).then((res)=>{
           if(res!=undefined && res.status!=498)
           {
               setbutton("Delete")
               setdisabled(false)
               setemailID("")
               loaduser()
           }
        },(error)=>{
            history('*')
        })
    }

    return(
        <>
        {
            load==false?
            <div className="container mt-5">
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">_id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action1</th>
                        <th scope="col">Action2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user.map((item,ind)=>(
                                <tr>
                                    <th scope="row">{item._id}</th>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td><Link to={`update/${item.email}`}><button className="btn btn-primary btn-sm" >Update</button></Link></td>
                                    {
                                        emailID==item.email
                                        ?<td><button className="btn btn-danger btn-sm" disabled={disabled} onClick={()=>Delete(item.email)}>{button}</button></td>
                                        :<td><button className="btn btn-danger btn-sm" onClick={()=>Delete(item.email)} >Delete</button></td>
                                    }
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

export default UserInfo
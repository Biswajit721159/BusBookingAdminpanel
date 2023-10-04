import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import loader from "../images/loader.gif"

const UserUpdate=()=>{

    let url="https://book-bus-api.vercel.app"

    let {email}=useParams()
    const userinfo=JSON.parse(localStorage.getItem('user'))
    const history=useNavigate()
    const [load,setload]=useState(true)
    let [data,setdata]=useState([])

    const [emailId,setemailId]=useState("")
    const [name,setname]=useState("")
    const [wrongname,setwrongname]=useState(false)
    const [button,setbutton]=useState("Submit")
    const [disabled,setdisabled]=useState(false)

    function loadproduct()
    {
        setload(true)
        fetch(`${url}/usermail/${email}`).then((responce=>responce.json())).then((res)=>{
            if(res!=undefined && res.message==true)
            {
                setname(res.data[0].name)
                setemailId(res.data[0].email)
                setdata(res.data)
                setload(false)
            }
            else if(res!=undefined && res.message==false)
            {
                history('*')
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
            loadproduct()
        }
    },[])

    function submit()
    {
        setdisabled(true)
        setbutton("Please Wait...")
        setload(true)
        fetch(`${url}/usermail/${email}`,{
            method:"PUT",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                 auth:`bearer ${userinfo.auth}`
            },
            body:JSON.stringify({
                email:email,
                name:name
             })
        }).then(responce=>responce.json()).then((res)=>{
            if(res!=undefined && res.status==200)
            {
                setload(false)
                history('/UserInfo')
            }
            else if(res!=undefined && res.status==498)
            {
                history('*')
            }
        },(error)=>{
            history('*')
        })
    }

    return(
        <>
        {
            load==false?
            <div className="container">
                <div className="d-flex align-items-center justify-content-center">
                <div>
                <div className=" mt-2"><h3>Update Detail</h3></div>
                    <div className="mt-3">
                        <div className="form-group">
                            <input type="email" value={email} disabled onChange={(e)=>{setemailId(e.target.value)}} className="form-control" placeholder="Enter Email Id"  required/>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="form-group">
                            <input type="name" value={name} onChange={(e)=>{setname(e.target.value)}} className="form-control" placeholder="Enter Name"  required/>
                        </div>
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-primary" disabled={disabled} onClick={submit}>{button}</button>
                    </div>
                </div>
            </div>
        </div>
        :<div className='loader-container'><img src={loader} /></div>
        }
        </>
    )
}

export default UserUpdate
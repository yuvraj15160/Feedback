import React, { useState } from 'react'
import axios from'axios'
import { useEffect } from 'react'
import "./home.css"
import { Link, useNavigate } from 'react-router-dom'
import socket from "../socket";
import {FacebookShareButton, TwitterShareButton} from 'react-share'

// import { search } from '../../../../Backend/Routes/UserRoutes'
const Home = () => {
    const navigate = useNavigate();
    const [review , setReview]= useState([]);
    const[loading, setLoading] = useState(true);

    // let [sortvalue, setSortvalue]= useState()
    let [searchname, setSearchname]=useState("")
    let sortvalue="date";
    let filters= "6";
    let [pvstate, setPvstate] = useState({
      sortby:"date",
      filter:"6"

    })
    let [currentpage, setCurrentpage]= useState(1);
    const[pagelimit, setPagelimit]= useState(5);
const [showthis, setShowthis]=useState("");
const fetchReviews = async(pgno) =>{

  // console.log(currentpage);
  filters= pvstate.filter;
  sortvalue=pvstate.sortby;
  console.log(searchname);
const { data}= await axios.get(`https://feedbacksystem-p2.onrender.com/api/feedback?searchby=${searchname}&sortBy=${sortvalue}&filter=${filters}&page=${pgno}`,
{headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("jwtlogin")}`,
      },});

console.log(data.response.feedback);
console.log(data.response.total);


// console.log(data)
setReview(data.response.feedback)
setPagelimit(data.response.total);
// console.log(data.feedback);
};

let colorbody=()=>{
  let body = document.querySelector('body')
        body.style.background = 
       "linear-gradient(to right, " 
       + "#75E6DA"
       + ", " 
       + "#D4F1F4"
       + ", " 
       + "#75E6DA"
       + ")";
}
useEffect(()=>{
if(!localStorage.getItem("jwtlogin")){
  navigate("/register");
}

if(localStorage.getItem("Editing")){
  localStorage.removeItem("Editing");
}
    console.log(10);
    setCurrentpage(1);
fetchReviews();
colorbody();

socket.on("connect",()=>{
  // alert("conneted");
  console.log(1110);
})
// ReviewSorting();
},[])

// to get the time difference

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Just now";

    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

let createdtime=(current)=>{
  // let day= current.getDay()
  // let month=current.getMonth()+1
  // let year=current.getFullYear()
  // let today=current.getDate();
  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // console.log(current.toLocaleDateString("en-US", options));
  let ans=(current.toLocaleDateString("en-US", options));

  return  ans;
}

const ReviewSorting = async(e, pgno) =>{
     // console.log(e.target.value);
    //  console.log(e.target.name);
    setPvstate({...pvstate,[e.target.name]:[e.target.value]})
   
if(e.target.name=='sortby'){
  sortvalue = e.target.value;
  filters = pvstate.filter[0]; 
}
if(e.target.name=='filter'){
  filters = e.target.value ;
  sortvalue= pvstate.sortby[0];
}
setCurrentpage(1);
console.log(sortvalue)
console.log(filters);
  let{data} = await axios.get(`https://feedbacksystem-p2.onrender.com/api/feedback?searchby=${searchname}&sortBy=${sortvalue}&filter=${filters}&page=${pgno}`,{headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwtlogin")}`,
  }});  
  console.log(data);
  setReview(data.response.feedback)
  console.log(data.response.total);
setPagelimit(data.response.total);
  setSearchname("");
}
const resetall=()=>{
  // setSearchname("");
  fetchReviews();
  // console.log(review)
  
}


// const paginationpart


const nextpage=()=>{
  if(review.length==0){

    setShowthis("There are no more review")
    return
  }
  if(review.length<3 ){
 
    // setShowthis("There are no more review")
    return
  } 

setCurrentpage(currentpage+1);
console.log(currentpage);
// fetchReviews(currentpage+1);
fetchReviews(currentpage+1)
}
const prevpage=()=>{
if(currentpage==1) return ;
setCurrentpage(currentpage-1);
fetchReviews(currentpage-1);
}
  return (
    <>
    <div className='' id='topmargin'>

<section className='mt-4' id='' >
<div >
<div className='m-2 ' >
<h2 className='text-center '>Review and Rating</h2>
</div>
<section className='m-3'>

<div className='m-4 rounded-3'>

<div className="input-group mb-3 "
style={{
  // zIndex:"-1"
}}
>
  <input type="text" className="form-control text-center border border-3" placeholder="Search A review" aria-label="Recipient's username" aria-describedby="button-addon2"
value={searchname}

onChange={(e)=>setSearchname(e.target.value)}

style={{
  height:50
}}

  />
  <button className="btn btn-outline-secondary border border-3 "
   type="submit" id="button-addon2"
   onClick={ReviewSorting}
   >
    
  <i class="fa-solid fa-magnifying-glass  "></i>
  
  </button>
  <button className="btn btn-outline-secondary border border-3 "
   type="submit" id="button-addon2"
   onClick={resetall}
   >
    
  {/* <i class="fa-solid fa-magnifying-glass  me-2"></i> */}
  <i class="fa-solid fa-rotate-right"></i>
  </button>
</div>
</div>


</section>


<div className='
d-flex
flex-wrap
gap-3
ms-3'>
    <div className=' bg-113 ms-4 rounded-3 border' style={{
      height:50,
      display:"flex",
      alignItems: 'center',
        justifyContent: 'center',

      

    }}>
    <label htmlFor="sort-by" className='btn'>Sort By:</label>
    <select className="btn m-2" id='sort-by'  name="sortby" onChange={ReviewSorting} >
    <option value="createdAt">Date</option>
    <option value="rating">rating</option>
  
</select>
    </div>
    <div className='float'> 
        
    <div className=' bg-113 ms-4
    rounded-3 border
    'style={{
      height:50,
      display:"flex",
      alignItems: 'center',
        justifyContent: 'center',
    }}>
  <label htmlFor="text-center" className='btn'>Rating:</label>
  <select id="rating-filter" 
  
  name = "filter" className='btn m-2' onChange={ReviewSorting}>
    <option value="6">All Ratings</option>
    <option value="5">5 stars</option>
    <option value="4">4 stars </option>
    <option value="3">3 stars </option>
    <option value="2">2 stars </option>
    <option value="1">1 star </option>
  </select>
</div>
    </div>
</div> 
</div>
</section>
<hr />
<section className='m-3'>

    
    <Link to = "/createReview" className='nav-link'>
    <div className='m-3' id="adding">
        <div>
        <h5 className='gap-2'>
        <i class="fa-solid fa-circle-plus"></i>
           Add a review</h5>
        </div>
    </div>
    </Link>

</section>

     <section className=''>
      
     {review.slice(0).reverse().map((rev)=>{
    return (
        <div className="card m-4  " key = {rev._id}>
        <div className="">
          <ul className="list-group  ">
            <li className="list-group-item  bg-111">
              NAME : <span className="fw-bold">{rev.name}</span>
                 
              {/* <i class="fa-solid fa-share-nodes fa-lg "></i> */}
           
           <div className='float-end'>
              <button className='badge btn-primary m-1'><i className="fa-brands fa-facebook  "></i>    </button>
              <button className='badge btn-primary m-1'><i className="fa-brands fa-twitter  "></i>    </button>
              <button className='badge btn-primary  m-1'><i className="fa-brands fa-instagram "></i>    </button>
           </div>
           <div className='float-end'>
         {/* <FacebookShareButton 
         url=`http://localhost:3000//Review/${rev._id}`
         
         
         >
         <i className="fa-brands fa-facebook  "></i> 


         </FacebookShareButton> */}



           </div>





{/* <i className="fa-brands fa-instagram float-end  "></i>
<i className="fa-brands fa-twitter float-end"></i>

     */}

            </li>
            <li className="list-group-item ">
              Rating : 
          {/* // whole rating system */}
               {
                rev.rating==5?
                <>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                </>
                : rev.rating==4 ? 
                <>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>

                </>:
                rev.rating==3?<>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>

                </>: rev.rating==2?
                <>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>

                </>: rev.rating==1?<>
                <i class="fa-solid fa-star"></i>
                </>
                :""
               }
              
            </li>
            <li class="list-group-item ">
              Comments : <span>{rev.comments}</span>
            </li>
            {/* <li class="list-group-item">Company : {data.company}</li> */}
            
            <li class="list-group-item ">
              <small >
                   Date :
                    <span className='ms-2'>
                    {createdtime(new Date(rev.createdAt))}
                    </span>
                  
                    


                </small> 

                <small className='float-end'>
                {timeDifference(
                         new Date(),
                      new Date(rev.createdAt)
                                    )}
                </small>
            </li>
          </ul>
        </div>
      </div>
    )
   })
   }
     </section>
   
     { 
}

{/* pagination page  */}

{pagelimit>3?
<section>
   <nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center ">
    <li class="page-item bg-113 m-2 rounded-3">
      <button className='btn '
      
      onClick={prevpage}
      
      >Prev</button>
    </li>
    <li className="page-item btn bg-113 m-2">{currentpage}</li>
    <li class="page-item bg-113 m-2 rounded-3">
      <button className='btn'
      onClick={nextpage}
      >Next</button>
    </li>
  </ul>
</nav>
   </section>:" "}
   {/* {renderpagination()} */}


   </div>

    </>
  )
}

export default Home
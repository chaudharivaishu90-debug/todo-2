var cl=console.log;
const Base_url = "https://xhrcrud-default-rtdb.firebaseio.com";
const Post_URL=`${Base_url}/Product1.json`

const spinner=document.getElementById("spinner")
const form=document.getElementById("form")
const Product=document.getElementById("Product")
const Productdata=document.getElementById("Productdata")
const Information=document.getElementById("Information")
const SubmitBtn=document.getElementById("SubmitBtn")
const UpdateBtn=document.getElementById("UpdateBtn")


// / Local state
let state = {
    ProductArr: [],
    Edit_id: null
};

// Spinner
function Spinnerhandler() {
    spinner.classList.toggle("d-none");
}

// Snackbar
function snackBar(msg, icon) {
    Swal.fire({
        text: msg,
        icon: icon,
        timer: 2500,
        showConfirmButton: false
    });
}



// makApi

async function MakeApiCall(url,method,msgbody=null){
    try{
        let body=msgbody? JSON.stringify(msgbody) :null;
    let res= await fetch(url,{
        method:method,
        body:body,
        headers:{
             "Content-Type": "Application/json",
                "Security": "JWT Token"
    
        }
    });
    if(!res.ok){
        throw new Error(`HTTP Error status:${res.status}`);
        
    }
    let data=await res.json();
    return data;
}catch(err){
    throw err;

}finally{
    Spinnerhandler();
}

    }


           
// Templating
function Rendering(arr){
    let result=``;
    arr.forEach(ele=> {
        
        result+=`
         <li class="list-group-item " id="${ele.id}">
                        <strong>${ele.Product}</strong>
                        <p>${ele.Information}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button onclick="onEdit(this)" class="btn btn-sm  bg-primary">Edit</button>
                            <button onclick="onDelete(this)"  class="btn btn-sm  bg-danger">Delete</button>

                        </div>
                    </li>
`
        Productdata.innerHTML=result;
    });
}

// read

async function Showdata() {
    Spinnerhandler();
    
    try{let data= await MakeApiCall(Post_URL,"GET")
    state.ProductArr=[];
    for(const key in data){
        data[key].id=key
        state.ProductArr.push(data[key])
    }
    Rendering(state.ProductArr)
}catch(err){
    cl(err)
}
}
Showdata();

// craete

async function Oncraete(eve){
    Spinnerhandler();
    eve.preventDefault();
    try{
    let obj={
        Product:Product.value.trim(),
        Information:Information.value.trim()

    }
    let data= await MakeApiCall(Post_URL,"POST",obj)
    let li=document.createElement("li")
    li.id=data.name
    obj.id=data.name
    state.ProductArr.push(obj)
    li.className="list-group-item"
    li.innerHTML=`<strong>${obj.Product}</strong>
                        <p>${obj.Information}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button onclick="onEdit(this)"  class="btn btn-sm  bg-primary">Edit</button>
                            <button onclick="onDelete(this)"  class="btn btn-sm bg-danger">Delete</button>

                        </div>`
                        Productdata.prepend(li)
                        snackBar("data added successfully!", "success");
                        form.reset();
                        

    }catch(err){
        cl(err)
    }

}


// / edit

function onEdit(ele){

let editId = ele.closest('li').id;
state.Edit_id=editId
    let editObj = state.ProductArr.find(t=> t.id === editId);
    Product.value = editObj.Product;
     Information.value = editObj.Information;
     SubmitBtn.classList.add('d-none');
    UpdateBtn.classList.remove('d-none');
}

// update
async function UpdateData(eve){
    Spinnerhandler();
    let updateId=state.Edit_id
    try{
        let ubobj={
             Product:Product.value.trim(),
        Information:Information.value.trim(),
        id:updateId
}
        let Update_url=`${Base_url}/Product1/${updateId}.json`
        let data = await MakeApiCall(Update_url,"PATCH",ubobj)
        let Getindex= state.ProductArr.findIndex(t=>t.id===updateId)
        state.ProductArr[Getindex]=ubobj
        let li= document.getElementById(updateId)
        li.querySelector("strong").innerHTML=Product.value
        li.querySelector("p").innerHTML=Information.value

        SubmitBtn.classList.remove('d-none');
    UpdateBtn.classList.add('d-none');
    snackBar("Data Updated successfully!", "success");
    state.Edit_id = null;
    form.reset();



    }catch(err){
        cl(err)
    }

}
// delete

async function onDelete(eve){
    let Remove_id= eve.closest("li").id;
    let result =await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
});
  if (result.isConfirmed) {
    Spinnerhandler();
    try{
        let Remove_url=`${Base_url}/Product1/${Remove_id}.json`
        
        let res =await MakeApiCall(Remove_url,"DELETE")
        let index= state.ProductArr.findIndex(d=>d.id===Remove_id);
        state.ProductArr.splice(index,1)
        eve.closest("li").remove();
                        snackBar("data Remove successfully!", "success");
        
    
       
    }catch (err){
        cl(err)

    }
  }


}





form.addEventListener("submit",Oncraete)
UpdateBtn.addEventListener("click",UpdateData)
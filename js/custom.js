let vaccineApp={};
vaccineApp.feeType = 'Paid';
vaccineApp.pin = 421302;
vaccineApp.currentDate ='13-07-2021' ;
const outputr = document.getElementById("result");
const switchBtn = document.getElementById("alarmSwitch");
const selectFeeType = document.getElementById("selectFeeType");
vaccineApp.setAlarm = false;
vaccineApp.timer = null;

//alarm
const handleAlarm = () => {
   
   switchBtn.classList.toggle("off");
   if(switchBtn.classList.contains('off')){
      vaccineApp.setAlarm = false;
      localStorage.setItem('alarm', vaccineApp.setAlarm);
      clearInterval(vaccineApp.timer);
   }else{
    vaccineApp.setAlarm = true;
   	localStorage.setItem('alarm', vaccineApp.setAlarm);
    vaccineApp.setAlarmWatch();
   }
}
   
//Update Url on button click   
vaccineApp.updateUrl = () => {
 vaccineApp.pin = document.getElementById("pin").value;
 vaccineApp.currentDate = vaccineApp.getCurrentDate();
 vaccineApp.feeType = selectFeeType.value;
 console.log(vaccineApp.pin);
 console.log(vaccineApp.currentDate);
 console.log(vaccineApp.feeType);

 vaccineApp.api_url = 
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${vaccineApp.pin}&date=${vaccineApp.currentDate}`;
}


//Call get Vaccine on Button CLick
const  getVaccine = ()=>{
outputr.innerHTML = 'Processing....';
vaccineApp.updateUrl();
let result =  vaccineApp.getVaccineApi(vaccineApp.api_url);

};

//Set Fee Type on dropdown change
 vaccineApp.setFeeType = () => {
  vaccineApp.feeType = selectFeeType.value;
}


//Get Vaccines by Paid or Free
vaccineApp.getVaccinesByFeeType = (VaccineResult) =>{
	let availableList = [];
  VaccineResult.centers.forEach((center) => {
      if(center.pincode == vaccineApp.pin
      && center.sessions.length > 0  
     	&& center.fee_type == vaccineApp.feeType)
      {
      		let VaccineObject = {};
          VaccineObject.name = center.name;
          VaccineObject.address = center.address;
          VaccineObject.fee_type = center.fee_type;
          VaccineObject.block_name = center.block_name;
          VaccineObject.list = [];
          
          center.sessions.forEach((item) => {
              if(item.min_age_limit == 18 
                  && vaccineApp.getDoseStatus(item))
              { 	
              		VaccineObject.list.push(item);   
              }
            });
          
          //CHeck if vaccines available
          if(VaccineObject.list.length > 0){
          		availableList.push(VaccineObject);
          }
      }
  });
  
   if(availableList.length > 0)
   {
       //Display to UI
   	  displayOutput(availableList);
      if(vaccineApp.setAlarm){
      	vaccineApp.play();
      }
   }
   else
   {
      outputr.innerHTML = "No Vaccines available !";
   }
}

//Vaccine Dose Filter
vaccineApp.getDoseStatus = (item) => {
    if(document.getElementById('doze1').checked && 
    		document.getElementById('doze2').checked){
        if(item.available_capacity_dose1 != 0 
        	&& item.available_capacity_dose2 != 0	)
        {
        	return true;
        }else{return false;}
    }
    else if(document.getElementById('doze1').checked)
    {
      if(item.available_capacity_dose1 != 0){
        	return true;
        }else{return false;}
    }
    else{
       if(item.available_capacity_dose2 != 0){
        	return true;
        }else{return false;}
    }
}

//Display on UI
const displayOutput = (VaccineObject) => {
	
		console.log("Vaccine Object: "); 
    console.log(VaccineObject); 
     let centerDetails = '';
     VaccineObject.forEach((val) => {
        centerDetails += `<hr\>
         <span class='header'>Center Name: </span>
         <span class='value' >${val.name}</span>
         <br\>
         <span class='header'>Address: </span>
         <span class='value' >${val.address}</span>
         <br\>
         <span class='header'>Fee Type: </span>
         <span class='value' >${val.fee_type}</span>
         <br\>
         <span class='header'>Location: </span>
         <span class='value' >${val.block_name}</span>
         <br\>
        `;
        val.list.forEach((vcenter) => {
         let vCenterDetails = `<hr\>
           <span class='header'>Name: </span>
           <span class='value' >${val.name}</span>
           <br\>
           <span class='header'>Date: </span>
           <span class='value' >${vcenter.date}</span>
           <br\>
           <span class='header'>Vaccine Name: </span>
           <span class='value' >${vcenter.vaccine}</span>
           <br\>
           <span class='header'><b> Dose 1 : </b></span>
           <span class='value' >${vcenter.available_capacity_dose1}</span>
           <br\>
           <span class='header'><b> Dose 2 : </b></span>
           <span class='value' >${vcenter.available_capacity_dose2}</span>
           <br\>
           <span class='header'>Min. age required: </span>
           <span class='value' >${vcenter.min_age_limit}</span>
           <br\>
        	 `;
           centerDetails += vCenterDetails;
        })
        
     });
		 outputr.innerHTML = centerDetails;
}

// Defining async function
vaccineApp.getVaccineApi = async (url)=>{
	   // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    let data = await response.json();
    console.log(data);
    if (response) {
    vaccineApp.getVaccinesByFeeType(data);
        return data;
    }else{
    return null;
    }
}

//Play Alarm
vaccineApp.play = ()=> {
  var audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-security-facility-breach-alarm-994.mp3');
  audio.play();
}

//get Current Date
vaccineApp.getCurrentDate = () => {
    let dt = new Date();
    
    let getFormattedValue = (val) => {
        if(val.length == 1){ return ('0' + val);}else{ return (val);}
    }
    return getFormattedValue(dt.getDate().toString()) + '-' + getFormattedValue((dt.getMonth()+ 1).toString())  + '-' + dt.getFullYear().toString(); 
}

//check alarmState
const checkAlarmSwitch = () => {

		if(localStorage.getItem('alarm') == 'true'){
     alert('alarm is on !');
     switchBtn.classList.remove('off');
     vaccineApp.setAlarmWatch();
    }
}
vaccineApp.setAlarmWatch = () =>{
    vaccineApp.timer = setInterval(getVaccine, 10000);
}

checkAlarmSwitch();
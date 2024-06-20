const body = document.body;
const imageMainchar = body.querySelector('#coin');
const imageStick = body.querySelector('#stick');
const imageDogmeme = body.querySelector('#dog_meme');
const imagecontainer =  body.querySelector('#coin-container');
const userName = body.querySelector('#playername'); 
const h1 = body.querySelector('h1');
let isProfileExisted = false;
var url = new URL(location.href);
var playerid = url.searchParams.get("id");
var playerCoins = 0;
//var playerName = url.searchParams.get("name");
//let coins = localStorage.getItem('coins');
let total = localStorage.getItem('total');
let power = localStorage.getItem('power');
let count = localStorage.getItem('count');

if(playerid == null){
    if(localStorage.getItem('playerid') ==""){
        localStorage.setItem('playerid',0);
    }	
}
else{
	localStorage.setItem('playerid',playerid);
	getUserBalance(playerid); 
    userName.textContent = localStorage.getItem('playerName');
	//console.log (playerCoins);	
}

if(total == null){
    localStorage.setItem('total' , '500')
    body.querySelector('#total').textContent = '/500';
}else {
    body.querySelector('#total').textContent = `/${total}`;
}
if(power == null){
    localStorage.setItem('power' , '500');
    body.querySelector('#power').textContent = '500';
}else{
    const lastplaytime = localStorage.getItem('lastplaytime');  
    //console.log ('1 '+lastplaytime);  
    if(power == 'NaN'){
        power = 100;
    }  
    if(lastplaytime == null){
		body.querySelector('#power').textContent = power;
	}else{
        //alert('1.3 ' +power);
		var nlastplaytime = lastplaytime;
        //console.log ('2 '+nlastplaytime);  
		const currentTime = new Date().getTime();		
		var diff = parseInt((currentTime - nlastplaytime)/2000);
        //alert(diff + '-' + parseInt(power));
		if((diff+parseInt(power)) > 500){
			power = 500;
		}else{
			power = diff+parseInt(power);
		}
		//console.log('3 ' +power);
		localStorage.setItem('power' , `${Number(power)}`);
		body.querySelector('#power').textContent = power;
	}	
}
if(count == null){
    localStorage.setItem('count' , '1')
}
let coingained = 0;

const createToken = () => {
    // Create token element
    const token = document.createElement("img");
    token.src = "./assets/images/tokenbubble.png";
    token.classList.add("falling-token");

    // Random position
    token.style.left = Math.floor(Math.random() * 100) + "vw";
    imagecontainer.appendChild(token);

    // Delete after 5 seconds (animation duration)
    setTimeout(() => {
        imagecontainer.removeChild(token);
    }, 5000);
}
imagecontainer.addEventListener('click' , (e)=> {
	
    let x = e.offsetX;
    let y = e.offsetY;

    //navigator.vibrate(5);

    coins = localStorage.getItem('coins');
    power = localStorage.getItem('power');
    //alert("coins" + coins +  "power" +power);
    if(Number(power) > 0){
        localStorage.setItem('coins' , `${Number(coins) + 1}`);
        h1.textContent = `${(Number(coins) + 1).toLocaleString()}`;
    
        localStorage.setItem('power' , `${Number(power) - 1}`);
        body.querySelector('#power').textContent = `${Number(power) - 1}`;
		coingained++;
		if(coingained > 20){
			//alert(coingained);
			asyncGetCall();
			coingained = 0;
		}
    } 
   //alert("x : "+x + "; y: " +y);
    // imageStick.src="./assets/images/man_stick_hit.png";
    imageMainchar.src="./assets/images/main_char-active.png";
	imageDogmeme.src="./assets/images/dogmeme_cry.png";	
    imageDogmeme.style.zIndex  = "-100";
	
    if(x < 150 & y < 150){
		imageMainchar.style.transform = 'translate(-0.25rem, -0.25rem)';
        imageDogmeme.style.transform = 'translate(-0.25rem, -0.25rem) skewY(-10deg) skewX(5deg)';
        // imageStick.style.transform = 'translate(0px, -0.25rem) skewY(20deg)';
    }
    else if (x < 150 & y > 150){
		imageMainchar.style.transform = 'translate(-0.25rem, 0.25rem)';
        imageDogmeme.style.transform = 'translate(-0.25rem, 0.25rem) skewY(-10deg) skewX(5deg)';
        // imageStick.style.transform = 'translate(0px, 0.25rem) skewY(20deg)';
    }
    else if (x > 150 & y > 150){
		imageMainchar.style.transform = 'translate(0.25rem, 0.25rem)';
        imageDogmeme.style.transform = 'translate(0.25rem, 0.25rem) skewY(10deg) skewX(-5deg)';
        // imageStick.style.transform = 'translate(0px, 0.25rem) skewY(20deg)';
    }
    else if (x > 150 & y < 150){
		imageMainchar.style.transform = 'translate(0.25rem, -0.25rem)';
        imageDogmeme.style.transform = 'translate(0.25rem, -0.25rem) skewY(10deg) skewX(-5deg)';
        // imageStick.style.transform = 'translate(0px, -0.25rem) skewY(20deg)';
    }   
    
	createToken();
	 setTimeout(()=>{
		imageMainchar.style.transform = 'translate(0px, 0px)';
        imageDogmeme.style.transform = 'translate(0px, 0px)';
        imageMainchar.src="./assets/images/main_char.png";
        imageDogmeme.src="./assets/images/dogmeme.png";
        // imageStick.style.transform = 'translate(0px, 0px)';
        // imageStick.src="./assets/images/man_stick.png";        
    }, 120);

    body.querySelector('.progress').style.width = `${(100 * power) / total}%`;
});

setInterval(()=> {
    count = localStorage.getItem('count')
    power = localStorage.getItem('power');
    if(Number(total) > power){
        localStorage.setItem('power' , `${Number(power) + Number(count)}`);
        body.querySelector('#power').textContent = `${Number(power) + Number(count)}`;
        body.querySelector('.progress').style.width = `${(100 * power) / total}%`;
    }	
}, 1000);
//const urlupd= '';

async function getUserBalance(userid) {
  try {
    const response = await fetch('https://api.tongag.lol/userbyid/?id='+userid);
    const user = await response.json();

    // Extract balance from response
    const balance = Number(user.balance);
	const username = user.name;
	userName.textContent = username;
    localStorage.setItem('playerName',username)
	console.log('User Name:', username);
	h1.textContent = Number(balance).toLocaleString();
	localStorage.setItem('coins' , balance);
    console.log('User Balance:', balance);	
    const noRef = user.referral;
    localStorage.setItem('noRef' , noRef);
  } catch (error) {
    console.error('Error:', error);
  }
}


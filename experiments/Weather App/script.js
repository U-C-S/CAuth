let weather = {
    'apiKey': 'c79f81f5addbf7939dea24ce3d09ae6e',
    flag : false,
    changeBackground : function(name){
        
            document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?landscape,"+name+"')";
        
       
    }
};
document.querySelector(".search button").addEventListener("click",function(){
    weather.changeBackground(document.querySelector(".search-bar").value);
    console.log(document.querySelector(".search-bar").value);
})
document.querySelector(".search-bar").addEventListener("keyup",function(event){
    if( event.key == "Enter"){
    weather.changeBackground(document.querySelector(".search-bar").value);
    console.log(document.querySelector(".search-bar").value);
    }
})
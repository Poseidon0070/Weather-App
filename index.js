const express = require("express");
const https = require("https");
const app = express();
const fs = require("fs");
require('dotenv').config();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));


const replaceVal = (tempVal, orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].icon);
    return temperature;
}
const HTMLfile = fs.readFileSync(__dirname+"/response.html","UTF-8");

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.post("/",(req,res)=>{
    const cityName = req.body.cityName;
    const APIKey = process.env.API_Key;
    const domain = "api.openweathermap.org/data/2.5/weather"
    const units = "metric";
    console.log(cityName);
    const url = "https://"+domain+"?q="+cityName+"&appid="+APIKey+"&units="+units;
    console.log(url);
    https.get(url,(response)=>{
        response.on("data",(data)=>{
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon =   weatherData.weather[0].icon 
            const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            const obj = JSON.parse(data);
            const arr = [obj];
            const realTimeData = arr.map(val => replaceVal(HTMLfile, val)).join(""); 
            res.write(realTimeData);
        })
    })
})

app.listen(3000,"127.0.0.1",()=>{
    console.log("Success!");
})





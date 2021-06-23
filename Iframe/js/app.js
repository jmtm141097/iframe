// let token = getParameterByName('tk');
// console.log(token);
const API = axios.create({
    baseURL: "http://127.0.0.1:4000/v1"
});

let detector = new MobileDetect(window.navigator.userAgent)

let ip;
let city;

async function getCityAndIP() {
    await geoip2.city((data) => {
        console.log(data);
        ip = data.traits.ip_address;
        city = data.city.names.es + " - " + data.subdivisions[0].names.en + " - " + data.country.names.es;
    }, (error) => {
        alert(error);
    });
}

getCityAndIP();

let sBrowser, sUsrAg = navigator.userAgent;
if (sUsrAg.indexOf("Chrome") > -1) sBrowser = "Google Chrome";
else if (sUsrAg.indexOf("Safari") > -1) sBrowser = "Apple Safari";
else if (sUsrAg.indexOf("Opera") > -1) sBrowser = "Opera";
else if (sUsrAg.indexOf("Firefox") > -1) sBrowser = "Mozilla Firefox";
else if (sUsrAg.indexOf("MSIE") > -1) sBrowser = "Microsoft Internet Explorer";

function device() {
    if (detector.mobile() || detector.phone()) return detector.mobile() || detector.phone();
    else if (detector.tablet()) return detector.tablet();
    else return "Ordenador";
}

const startTime = new Date();
async function sendData() {
    const URL = "/activity/toRegister";
    const endTime = new Date();
    const timeSpent = (endTime - startTime);
    const activity = {
        device: device(),
        publicIp: ip,
        domainIp: document.referrer,
        origin: city,
        activeTime: timeSpent / 1000,
        browser: (detector.userAgent()) ? detector.userAgent() : sBrowser,
        platform: (detector.os()) ? detector.os() : window.navigator.platform,
        lenguage: window.navigator.language,
        token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjI3NTA1NTAsImV4cCI6MTYyNTM0MjU1MH0.LwQuJ9digxk_XLAmstOhIYUOBgXX6_XS0kbFZGIYh9-TtWB8S-Gt5aMSI_tDAXuEoq16MjcPoleEwpkhDjIPSA'
    };
    await API.post(URL, activity, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => {
            console.log(data);
            alert(data);
        })
        .catch(err => {
            alert(err);
        });
}

window.addEventListener("beforeunload", sendData, false);

// Localizacion.
// const funcionInit = () => {
//     if (!"geolocation" in navigator) {
//         return alert("Tu navegador no soporta el acceso a la ubicación. Intenta con otro");
//     }

//     const onUbicacionConcedida = ubicacion => {
//         console.log("Tengo la ubicación: ", ubicacion);
//     }

//     const onErrorDeUbicacion = err => {
//         console.log("Error obteniendo ubicación: ", err);
//     }

//     const opcionesDeSolicitud = {
//         enableHighAccuracy: false, // Alta precisión
//         maximumAge: 0, // No queremos caché
//         timeout: 5000 // Esperar solo 5 segundos
//     };
//     // Solicitar
//     navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud);

// };

// funcionInit();
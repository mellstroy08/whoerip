if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
}

// BURAYA ipinfo.io'dan ALDIĞIN ANAHTARI YAPIŞTIR
const IPINFO_TOKEN = "6f33b6ebd15b03";

function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🏳️';
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function getOS() {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return "Android";
    if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
    if (/windows phone/i.test(ua)) return "Windows Phone";
    if (/mac/i.test(ua)) return "macOS";
    if (/windows/i.test(ua)) return "Windows";
    if (/linux/i.test(ua)) return "Linux";
    return "Unknown";
}

async function getIpInfo() {
    try {
        const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();

        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.visibility = 'visible';
        document.getElementById('content').classList.add('loaded');

        const flag = getFlagEmoji(data.country);

        document.getElementById('ip').textContent = data.ip || 'N/A';
        document.getElementById('location').textContent = `${data.city || 'Unknown City'}, ${data.country || 'Unknown Country'}`;
        document.getElementById('country-flag').textContent = flag;
        
        document.getElementById('isp').textContent = data.org || 'N/A';
        const asn = data.asn ? `${data.asn.asn} ${data.asn.name}` : 'N/A';
        document.getElementById('asn').textContent = asn;
        
        // Bu bilgiler yeni API'de yok, o yüzden N/A olarak işaretliyoruz
        document.getElementById('hostname').textContent = 'N/A';
        document.getElementById('dns').textContent = 'N/A';
        
        document.getElementById('os').textContent = getOS();
        
        // Proxy/VPN bilgisi için "privacy" nesnesini kontrol ediyoruz
        const proxyStatus = document.getElementById('proxy');
        if (data.privacy && data.privacy.vpn) {
            proxyStatus.textContent = 'Yes';
            proxyStatus.classList.add('yes');
        } else {
            proxyStatus.textContent = 'No';
            proxyStatus.classList.add('no');
        }
        
        const anonStatus = document.getElementById('anonymizer');
         if (data.privacy && data.privacy.proxy) {
            anonStatus.textContent = 'Yes';
            anonStatus.classList.add('yes');
        } else {
            anonStatus.textContent = 'No';
            anonStatus.classList.add('no');
        }

        const blacklistStatus = document.getElementById('blacklist');
        blacklistStatus.textContent = 'N/A'; // Bu bilgi bu serviste yok

    } catch (error) {
        document.getElementById('loader').innerHTML = `<h2>Could not fetch IP info.</h2><p style="text-align: center; color: var(--label-color);">${error.message}</p>`;
        console.error('Error fetching IP info:', error);
    }
}

getIpInfo();

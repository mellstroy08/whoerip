if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
}

// SENİN TOKEN'INI BURAYA YERLEŞTİRDİM:
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

        // Yükleme animasyonunu gizle, içeriği göster
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.visibility = 'visible';
        document.getElementById('content').classList.add('loaded');

        const flag = getFlagEmoji(data.country);
        
        // Üst kartı doldur
        document.getElementById('ip').textContent = data.ip || 'N/A';
        document.getElementById('country-flag').textContent = flag;
        document.getElementById('country').textContent = data.country || 'N/A';
        document.getElementById('region').textContent = data.region || 'N/A';
        document.getElementById('city').textContent = data.city || 'N/A';
        
        // İkinci ve üçüncü kartları doldur
        document.getElementById('isp').textContent = data.org || 'N/A';
        document.getElementById('hostname').textContent = data.hostname || 'N/A';
        const asnData = data.asn || {};
        const asnString = `${asnData.asn || ''} ${asnData.name || ''}`.trim();
        document.getElementById('asn').textContent = asnString || 'N/A';
        document.getElementById('dns').textContent = 'N/A'; // Bu bilgi ipinfo'dan gelmiyor
        
        document.getElementById('os').textContent = getOS();
        
        const privacy = data.privacy || {};
        const proxyStatus = document.getElementById('proxy');
        if (privacy.vpn || privacy.proxy) {
            proxyStatus.textContent = 'Yes';
            proxyStatus.classList.add('yes');
        } else {
            proxyStatus.textContent = 'No';
            proxyStatus.classList.add('no');
        }
        
        const anonStatus = document.getElementById('anonymizer');
         if (privacy.tor || privacy.relay) {
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

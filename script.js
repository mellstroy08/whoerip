if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
}

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
        // Önce sadece IPv4 adresini alıyoruz
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) throw new Error('Failed to get IP address from ipify.');
        const ipData = await ipResponse.json();
        const ipv4 = ipData.ip;

        if (!ipv4) throw new Error('Could not get IPv4 address.');

        // Şimdi o IPv4 adresiyle detaylı bilgi sorguluyoruz
        const detailsResponse = await fetch(`http://ip-api.com/json/${ipv4}?fields=status,message,country,countryCode,regionName,city,isp,as,hostname,proxy,query`);
        if (!detailsResponse.ok) throw new Error('Failed to get IP details from ip-api.');
        const data = await detailsResponse.json();

        if (data.status !== 'success') throw new Error('API reported failure: ' + data.message);

        // Yükleme animasyonunu gizle, içeriği göster
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.visibility = 'visible';
        document.getElementById('content').classList.add('loaded');

        const flag = getFlagEmoji(data.countryCode);
        
        // Üst kartı doldur
        document.getElementById('ip').textContent = data.query || 'N/A';
        document.getElementById('location').textContent = `${data.city || 'Unknown City'}, ${data.country || 'Unknown Country'}`;
        document.getElementById('country-flag').textContent = flag;
        
        // İkinci ve üçüncü kartları doldur
        document.getElementById('isp').textContent = data.isp || 'N/A';
        document.getElementById('hostname').textContent = data.hostname || 'N/A';
        document.getElementById('asn').textContent = data.as || 'N/A';
        document.getElementById('dns').textContent = data.isp || 'N/A'; // En yakın tahmin
        
        document.getElementById('os').textContent = getOS();
        
        const proxyStatus = document.getElementById('proxy');
        if (data.proxy) {
            proxyStatus.textContent = 'Yes';
            proxyStatus.classList.add('yes');
        } else {
            proxyStatus.textContent = 'No';
            proxyStatus.classList.add('no');
        }
        
        // Bu bilgiler ücretsiz API'lerle alınamaz, temsili olarak eklenmiştir.
        const anonStatus = document.getElementById('anonymizer');
        anonStatus.textContent = 'N/A';

        const blacklistStatus = document.getElementById('blacklist');
        blacklistStatus.textContent = 'N/A';


    } catch (error) {
        document.getElementById('loader').innerHTML = '<h2>Could not fetch IP info.</h2><p style="text-align: center; color: var(--label-color);">Please disable your ad-blocker or try again.</p>';
        console.error('Error fetching IP info:', error);
    }
}

getIpInfo();

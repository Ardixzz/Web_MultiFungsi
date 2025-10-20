/* global Chart */

document.addEventListener('DOMContentLoaded', () => {

    // ==================================
    // PRELOADER
    // ==================================
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');

    // ==================================
    // SELEKTOR ELEMEN
    // ==================================
    const themeToggle = document.getElementById('theme-toggle');
    const cursorLight = document.querySelector('.cursor-light');
    const toastContainer = document.getElementById('toast-container');
    
    // Navigasi
    const menuToggle = document.getElementById('menu-toggle');
    const sidenav = document.getElementById('sidenav');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const btnMulai = document.getElementById('btn-mulai');
    const menuHeaders = document.querySelectorAll('.menu-header');
    const btnCoba = document.querySelectorAll('.btn-coba');
    const btnBack = document.querySelectorAll('.btn-back');

    // Halaman 1 (Info Device)
    const infoTime = document.getElementById('info-time');
    const infoDevice = document.getElementById('info-device');
    const infoBattery = document.getElementById('info-battery');
    const infoIp = document.getElementById('info-ip');
    const infoLocation = document.getElementById('info-location');
    const infoNetwork = document.getElementById('info-network');

    // Halaman 3 (TikTok)
    const tiktokUrlInput = document.getElementById('tiktok-url');
    const btnDownloadTiktok = document.getElementById('btn-download-tiktok');
    const loadingSpinnerTiktok = document.getElementById('loading-spinner-tiktok');

    // Halaman 4 (YT Play)
    const ytPlayQueryInput = document.getElementById('yt-play-query');
    const btnSearchYtPlay = document.getElementById('btn-search-yt-play');
    const loadingSpinnerYtPlay = document.getElementById('loading-spinner-yt-play');

    // Halaman 5 (YT Transcript)
    const ytTranscriptUrlInput = document.getElementById('yt-transcript-url');
    const btnGetYtTranscript = document.getElementById('btn-get-yt-transcript');
    const loadingSpinnerYtTranscript = document.getElementById('loading-spinner-yt-transcript');

    // Halaman 6 (YT Summary)
    const ytSummaryUrlInput = document.getElementById('yt-summary-url');
    const btnGetYtSummary = document.getElementById('btn-get-yt-summary');
    const loadingSpinnerYtSummary = document.getElementById('loading-spinner-yt-summary');

    // Halaman 7 (Spotify Search)
    const spotifySearchQueryInput = document.getElementById('spotify-search-query');
    const btnSearchSpotify = document.getElementById('btn-search-spotify');
    const loadingSpinnerSpotifySearch = document.getElementById('loading-spinner-spotify-search');
    
    // Halaman 8 (Spotify Download)
    const spotifyDownloadUrlInput = document.getElementById('spotify-download-url');
    const btnDownloadSpotify = document.getElementById('btn-download-spotify');
    const loadingSpinnerSpotifyDownload = document.getElementById('loading-spinner-spotify-download');

    // Halaman 9 (Image Upscale)
    const upscaleUrlInput = document.getElementById('upscale-url');
    const upscaleScaleInput = document.getElementById('upscale-scale');
    const btnUpscale = document.getElementById('btn-upscale');
    const loadingSpinnerUpscale = document.getElementById('loading-spinner-upscale');

    // (BARU) Halaman 10 (Fake Chat)
    const fakeChatTextInput = document.getElementById('fake-chat-text');
    const fakeChatChatimeInput = document.getElementById('fake-chat-chatime');
    const fakeChatStatusbarTimeInput = document.getElementById('fake-chat-statusbartime');
    const btnMakeFakeChat = document.getElementById('btn-make-fake-chat');
    const loadingSpinnerFakeChat = document.getElementById('loading-spinner-fake-chat');

    // Halaman 11 (Analitik) <-- NOMOR HALAMAN BERUBAH
    let visitorsChartInstance = null;
    let featuresChartInstance = null;

    // Selektor Petunjuk
    const btnsPetunjuk = document.querySelectorAll('.btn-petunjuk');
    const btnsTutupPetunjuk = document.querySelectorAll('.btn-tutup-petunjuk');


    // ==================================
    // FUNGSI TOAST NOTIFICATION (Tetap)
    // ==================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==================================
    // FUNGSI NAVIGASI (Tetap)
    // ==================================
    function toggleMenu() { 
        sidenav.classList.toggle('active'); overlay.classList.toggle('active');
    }
    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    navLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); const targetPageId = e.currentTarget.getAttribute('data-target'); if (targetPageId) { showPage(targetPageId); toggleMenu(); } }); });
    function showPage(pageId) { 
        pages.forEach(page => { 
            if (page.id === pageId) { 
                setTimeout(() => { 
                    page.classList.add('active'); 
                    if (pageId === 'page-analytics') loadAnalyticsCharts(); 
                }, 100); 
            } else { 
                page.classList.remove('active'); 
            } 
        });
    }
    btnMulai.addEventListener('click', () => showPage('page-menu'));
    btnCoba.forEach(btn => { btn.addEventListener('click', (e) => { const targetPageId = e.target.getAttribute('data-target'); if (targetPageId) showPage(targetPageId); }); });
    btnBack.forEach(btn => { btn.addEventListener('click', (e) => { const targetPageId = e.currentTarget.getAttribute('data-target'); if (targetPageId) showPage(targetPageId); }); });

    // ==================================
    // FUNGSI MODE GELAP / TERANG (Tetap)
    // ==================================
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    themeToggle.addEventListener('click', () => { 
        document.body.classList.toggle('dark-mode'); 
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light'); 
        if (document.getElementById('page-analytics').classList.contains('active')) { loadAnalyticsCharts(true); } 
    });

    // ==================================
    // FUNGSI EFEK VISUAL (Tetap)
    // ==================================
    document.addEventListener('mousemove', (e) => { cursorLight.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`; });
    document.addEventListener('touchmove', (e) => { const touch = e.touches[0]; cursorLight.style.transform = `translate(${touch.clientX - 250}px, ${touch.clientY - 250}px)`; });

    // ==================================
    // FUNGSI HALAMAN 1: INFO DEVICE (Tetap)
    // ==================================
    function loadDeviceInfo() { 
        function updateTime() { 
            const now = new Date(); 
            infoTime.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }); 
        } 
        updateTime(); 
        setInterval(updateTime, 1000);
        infoDevice.textContent = navigator.userAgentData?.platform || navigator.platform || 'Tidak diketahui';
        if ('getBattery' in navigator) { 
            navigator.getBattery().then(battery => { 
                function updateBatteryStatus() { 
                    const level = (battery.level * 100).toFixed(0); 
                    infoBattery.textContent = `${level}% ${battery.charging ? '(Mengisi daya)' : '(Tidak mengisi)'}`; 
                } 
                updateBatteryStatus(); 
                battery.addEventListener('levelchange', updateBatteryStatus); 
                battery.addEventListener('chargingchange', updateBatteryStatus); 
            }); 
        } else { 
            infoBattery.textContent = 'Tidak didukung'; 
        }
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection; 
        infoNetwork.textContent = connection ? (connection.effectiveType ? `${connection.effectiveType.toUpperCase()}` : 'Tidak diketahui') : 'Tidak didukung';
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => { 
                infoIp.textContent = data.ip || 'Gagal memuat'; 
                infoLocation.textContent = `${data.city}, ${data.region}, ${data.country_name}`; 
            })
            .catch(() => { 
                infoIp.textContent = 'Gagal memuat'; 
                infoLocation.textContent = 'Gagal memuat'; 
            });
    }
    loadDeviceInfo();

    // ==================================
    // FUNGSI HALAMAN 2: MENU (Tetap)
    // ==================================
    menuHeaders.forEach(header => { 
        header.addEventListener('click', () => { 
            const item = header.closest('.menu-item'); 
            item.classList.toggle('active'); 
            document.querySelectorAll('.menu-item').forEach(otherItem => { 
                if (otherItem !== item) otherItem.classList.remove('active'); 
            }); 
        }); 
    });

    // ==================================
    // FUNGSI PETUNJUK (Tetap)
    // ==================================
    btnsPetunjuk.forEach(btn => { btn.addEventListener('click', (e) => { const modalId = e.currentTarget.id.replace('btn-petunjuk-', 'modal-petunjuk-'); const modal = document.getElementById(modalId); if (modal) modal.classList.add('active'); }); });
    btnsTutupPetunjuk.forEach(btn => { btn.addEventListener('click', (e) => { const modalId = e.currentTarget.getAttribute('data-target'); const modal = document.getElementById(modalId); if (modal) modal.classList.remove('active'); }); });

    // ==================================
    // FUNGSI COPY TO CLIPBOARD (Tetap)
    // ==================================
    async function copyToClipboard(text, btn) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Teks berhasil disalin!', 'success');
            if (btn) btn.innerHTML = '<i class="bi bi-check-lg"></i> Disalin';
        } catch (err) {
            console.error('Gagal menyalin:', err);
            showToast('Gagal menyalin teks.', 'error');
        }
    }

    // Event listener untuk tombol copy (menggunakan delegasi)
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-copy');
        if (btn) {
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Ambil innerText agar formatnya bersih (bukan HTML)
                copyToClipboard(targetElement.innerText, btn);
            }
        }
    });


    // ==================================
    // FUNGSI API (UMUM) (Sudah Diperbaiki)
    // ==================================
    async function fetchApi(url, resultsContainerId, spinnerElement, displayFunction, isBinaryResponse = false) { 
        const resultsContainer = document.getElementById(resultsContainerId);
        resultsContainer.innerHTML = '';
        spinnerElement.style.display = 'flex';
    
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error Jaringan: ${response.status} ${response.statusText}`);
    
            let responseData;
            let success = false;

            // --- Logika Khusus untuk Respons Biner (Upscale/Fake Chat) ---
            if (isBinaryResponse) {
                try {
                    // Coba baca sebagai JSON
                    responseData = await response.json();
                    
                    if (responseData.success === true && responseData.data) { success = true; responseData = responseData.data; }
                    else if (responseData.status === true && responseData.data) { success = true; responseData = responseData.data; }
                    else if (responseData.result) { success = true; } // Kasus API yang mengembalikan { result: "URL" }
                    
                } catch (jsonError) {
                    // Jika gagal membaca JSON, artinya API langsung mengembalikan data biner (file gambar)
                    const contentType = response.headers.get('content-type');
                    if (contentType && (contentType.includes('image/') || response.status === 200)) {
                        // Jika respons adalah gambar, kita buat objek data palsu yang dibutuhkan oleh displayFunction
                        responseData = { result: url }; 
                        success = true;
                    } else {
                        // Jika bukan gambar dan bukan JSON, lempar error asli
                        throw jsonError;
                    }
                }
            } else {
                // --- LOGIKA ASLI UNTUK RESPON JSON STANDAR (Fitur lain) ---
                responseData = await response.json();
                
                if (responseData.success === true && responseData.data) { success = true; responseData = responseData.data; }
                else if (responseData.status === true && responseData.data) { success = true; responseData = responseData.data; }
            }

            // Setelah penentuan sukses/gagal di atas
            if (success) {
                displayFunction(responseData, resultsContainerId);
                showToast('Berhasil dimuat!', 'success');
            } else {
                // Jika isBinaryResponse=false dan success=false, error sudah di responseData
                throw new Error(responseData.message || responseData.msg || 'API mengembalikan data, tapi gagal.');
            }

        } catch (error) {
            console.error('Error fetching API:', error);
            let userMessage = 'Terjadi kesalahan.';
            if (error.message.includes('Failed to fetch')) {
                userMessage = 'Gagal terhubung ke API. (Kemungkinan error CORS atau API offline)';
            } else if (error.message.includes('Unexpected token')) {
                 userMessage = 'Gagal memproses data. (API mengembalikan format yang tidak terduga)';
            } else { 
                userMessage = `Gagal: ${error.message}`; 
            }
            
            displayError(userMessage, resultsContainerId);
            showToast(userMessage, 'error');
        } finally {
            spinnerElement.style.display = 'none';
        }
    }
    
    function displayError(message, containerId) { 
        const container = document.getElementById(containerId); 
        if (container) { 
            container.innerHTML = `<div class="error-message">${message}</div>`; 
        }
    }

    // ==================================
    // FUNGSI HALAMAN 3-8 (TETAP SAMA)
    // ==================================

    // ... (kode TikTok, YT Play, YT Transcript, YT Summary, Spotify Search, Spotify Download) ...
    
    // ==================================
    // FUNGSI HALAMAN 3: TIKTOK (Tetap)
    // ==================================
    btnDownloadTiktok.addEventListener('click', () => {
        const url = tiktokUrlInput.value.trim();
        if (!url) { showToast('Silakan masukkan URL TikTok.', 'error'); return; }
        const apiUrl = `https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`;
        fetchApi(apiUrl, 'tiktok-results', loadingSpinnerTiktok, displayTikTokResults);
    });
    function displayTikTokResults(data, containerId) { 
        const container = document.getElementById(containerId); 
        const metadata = data.metadata; 
        const downloads = data.download; 
        let title = metadata.title || metadata.description || 'Video TikTok'; 
        if (title.length > 100) title = title.substring(0, 100) + '...';
        let downloadLinksHTML = '';
        if (downloads.video && downloads.video.length > 0) { 
            downloads.video.forEach((videoUrl, index) => { 
                let qualityLabel = `Video ${index + 1}`; 
                if (videoUrl.includes('original')) qualityLabel = 'Video Original (HD)'; 
                downloadLinksHTML += `<a href="${videoUrl}" target="_blank" download>Unduh ${qualityLabel}</a>`; 
            }); 
        } else { downloadLinksHTML = '<p>Tidak ada link video yang ditemukan.</p>'; }
        container.innerHTML = `<div class="result-item"><h4>${title}</h4><p><i class="bi bi-play-circle"></i> ${metadata.stats.playCount.toLocaleString('id-ID')} | <i class="bi bi-heart"></i> ${metadata.stats.likeCount.toLocaleString('id-ID')}</p><div class="download-links">${downloadLinksHTML}</div></div>`;
    }

    // ==================================
    // FUNGSI HALAMAN 4: YT PLAY (Tetap)
    // ==================================
    btnSearchYtPlay.addEventListener('click', () => {
        const query = ytPlayQueryInput.value.trim();
        if (!query) { showToast('Silakan masukkan judul video.', 'error'); return; }
        const apiUrl = `https://api.zenzxz.my.id/api/search/play?query=${encodeURIComponent(query)}`;
        fetchApi(apiUrl, 'yt-play-results', loadingSpinnerYtPlay, displayYouTubePlayResults);
    });
    function displayYouTubePlayResults(data, containerId) { 
        const container = document.getElementById(containerId); 
        const metadata = data.metadata;
        container.innerHTML = `<div class="result-item"><h4>${metadata.title}</h4><p><i class="bi bi-person-circle"></i> ${metadata.channel || 'Tidak diketahui'} | <i class="bi bi-clock-history"></i> ${metadata.duration || 'N/A'}</p><div class="download-links"><a href="${data.dl_mp3}" target="_blank" download>Unduh MP3</a><a href="${data.dl_mp4}" target="_blank" download>Unduh MP4</a></div></div>`;
    }

    // ==================================
    // FUNGSI HALAMAN 5: YT TRANSCRIPT (Tetap)
    // ==================================
    btnGetYtTranscript.addEventListener('click', () => {
        const url = ytTranscriptUrlInput.value.trim();
        if (!url) { showToast('Silakan masukkan URL YouTube.', 'error'); return; }
        const apiUrl = `https://api.zenzxz.my.id/api/tools/ytranscript?url=${encodeURIComponent(url)}`;
        fetchApi(apiUrl, 'yt-transcript-results', loadingSpinnerYtTranscript, displayTranscriptResults);
    });
    function displayTranscriptResults(data, containerId) {
        const container = document.getElementById(containerId);
        const textId = "transcript-text-1"; 
        container.innerHTML = `
            <div class="transcript-box">
                <button class="btn-copy" data-target="${textId}"><i class="bi bi-clipboard"></i> Salin</button>
                <h4>${data.title}</h4>
                <p id="${textId}">${data.transcript}</p>
            </div>`;
    }

    // ==================================
    // FUNGSI HALAMAN 6: YT SUMMARY (Tetap)
    // ==================================
    btnGetYtSummary.addEventListener('click', () => {
        const url = ytSummaryUrlInput.value.trim();
        if (!url) { showToast('Silakan masukkan URL YouTube.', 'error'); return; }
        const apiUrl = `https://api.zenzxz.my.id/api/tools/ytsummarizer?url=${encodeURIComponent(url)}&lang=id`;
        fetchApi(apiUrl, 'yt-summary-results', loadingSpinnerYtSummary, displaySummaryResults);
    });
    function displaySummaryResults(data, containerId) {
        const container = document.getElementById(containerId);
        const textId = "summary-text-1"; 
        
        let content = data.content.replace(/<br\s*\/?>/gi, '\n');
        content = content.replace(/<\/?(h1|h2|h3|h4|h5|b|strong|p|ul|li|ol)>/gi, '');
        if (content.includes('Poin Kunci:')) {
            content = content.replace('Poin Kunci:', '<h5>Poin Kunci:</h5><ul>') + '</ul>';
            content = content.replace(/\*\* (.*?)\n/g, '<li><strong>$1</strong></li>');
        }
        
        container.innerHTML = `
            <div class="summary-box">
                <button class="btn-copy" data-target="${textId}"><i class="bi bi-clipboard"></i> Salin</button>
                <div id="${textId}">${content}</div>
            </div>`;
    }

    // ==================================
    // FUNGSI HALAMAN 7: SPOTIFY SEARCH (Tetap)
    // ==================================
    btnSearchSpotify.addEventListener('click', () => {
        const query = spotifySearchQueryInput.value.trim();
        if (!query) { showToast('Silakan masukkan judul lagu atau artis.', 'error'); return; }
        const apiUrl = `https://api.siputzx.my.id/api/s/spotify?query=${encodeURIComponent(query)}`;
        fetchApi(apiUrl, 'spotify-search-results', loadingSpinnerSpotifySearch, displaySpotifySearchResults);
    });

    function displaySpotifySearchResults(data, containerId) {
        const container = document.getElementById(containerId);
        if (!data || data.length === 0) {
            displayError("Tidak ada hasil ditemukan.", containerId);
            return;
        }

        let html = '';
        data.forEach(track => {
            html += `
                <div class="spotify-result-item">
                    <img src="${track.thumbnail}" alt="Album Art">
                    <div class="info">
                        <h4>${track.title}</h4>
                        <p>${track.artist} • ${track.album}</p>
                        <p><i class="bi bi-calendar-event"></i> ${track.release_date} | <i class="bi bi-clock"></i> ${track.duration}</p>
                    </div>
                    <div class="actions">
                        <a href="${track.track_url}" target="_blank" title="Buka di Spotify"><i class="bi bi-spotify"></i></a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // ==================================
    // FUNGSI HALAMAN 8: SPOTIFY DOWNLOAD (Tetap)
    // ==================================
    btnDownloadSpotify.addEventListener('click', () => {
        const url = spotifyDownloadUrlInput.value.trim();
        if (!url) { showToast('Silakan masukkan URL Spotify.', 'error'); return; }
        const apiUrl = `https://api.siputzx.my.id/api/d/spotifyv2?url=${encodeURIComponent(url)}`;
        fetchApi(apiUrl, 'spotify-download-results', loadingSpinnerSpotifyDownload, displaySpotifyDownloadResults);
    });

    function displaySpotifyDownloadResults(data, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="result-item">
                <img src="${data.coverImage}" alt="Album Art" style="width: 80px; height: 80px;">
                <div class="info" style="text-align: left; flex-grow: 1;">
                    <h4>${data.songTitle}</h4>
                    <p>${data.artist}</p>
                </div>
            </div>
            <div class="result-item" style="margin-top: 10px;">
                <div class="download-links" style="width: 100%; justify-content: center;">
                    <a href="${data.mp3DownloadLink}" target="_blank" download>Unduh MP3</a>
                    <a href="${data.coverDownloadLink}" target="_blank" download>Unduh Sampul</a>
                </div>
            </div>
        `;
    }

    // ==================================
    // FUNGSI HALAMAN 9: IMAGE UPSCALE (Tetap)
    // ==================================
    if (btnUpscale) {
        btnUpscale.addEventListener('click', () => {
            const url = upscaleUrlInput.value.trim();
            const scale = upscaleScaleInput.value;
            
            if (!url) { 
                showToast('Silakan masukkan URL gambar.', 'error'); 
                return; 
            }
            
            const apiUrl = `https://api.siputzx.my.id/api/tools/upscale?url=${encodeURIComponent(url)}&scale=${scale}`;
            
            // Gunakan fungsi fetchApi, tambahkan parameter 'true' karena respons bisa biner/non-JSON
            fetchApi(apiUrl, 'upscale-results', loadingSpinnerUpscale, displayUpscaleResults, true);
        });
    }

    function displayUpscaleResults(data, containerId) {
        const container = document.getElementById(containerId);
        
        if (!data || !data.result) {
            displayError(data.message || "Gagal memproses gambar. Pastikan URL gambar valid dan dapat diakses.", containerId);
            return;
        }

        const resultUrl = data.result;
        
        container.innerHTML = `
            <div class="result-item" style="text-align: center;">
                <h4>Hasil Upscale (Skala ${upscaleScaleInput.value}x)</h4>
                <a href="${resultUrl}" target="_blank" download="upscaled_image_${Date.now()}.jpg">
                    <img src="${resultUrl}" alt="Hasil Upscale" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px 0; border: 1px solid var(--border-color);">
                </a>
                <div class="download-links" style="justify-content: center;">
                    <a href="${resultUrl}" target="_blank" download="upscaled_image_${Date.now()}.jpg">
                        <i class="bi bi-cloud-download"></i> Unduh Gambar
                    </a>
                </div>
            </div>
        `;
    }
    
    // ==================================
    // FUNGSI HALAMAN 10: IQC IP (FAKE CHAT) <-- BARU DITAMBAHKAN
    // ==================================
    if (btnMakeFakeChat) {
        btnMakeFakeChat.addEventListener('click', () => {
            const text = fakeChatTextInput.value.trim();
            const chatime = fakeChatChatimeInput.value.trim();
            const statusbartime = fakeChatStatusbarTimeInput.value.trim();
            
            if (!text || !chatime || !statusbartime) { 
                showToast('Semua kolom (Teks, Waktu Chat, Waktu Status Bar) harus diisi.', 'error'); 
                return; 
            }
            
            // API URL
            const apiUrl = `https://api.zenzxz.my.id/api/maker/fakechatiphone?text=${encodeURIComponent(text)}&chatime=${encodeURIComponent(chatime)}&statusbartime=${encodeURIComponent(statusbartime)}`;
            
            // Gunakan fungsi fetchApi, tambahkan parameter 'true'
            fetchApi(apiUrl, 'fake-chat-results', loadingSpinnerFakeChat, displayFakeChatResults, true);
        });
    }

    function displayFakeChatResults(data, containerId) {
        const container = document.getElementById(containerId);
        
        // Asumsi: data.result berisi URL gambar, atau URL gambar adalah apiUrl itu sendiri.
        const resultUrl = data.result;
        
        if (!resultUrl) {
            displayError(data.message || "Gagal memproses pembuatan chat. Pastikan input valid.", containerId);
            return;
        }

        container.innerHTML = `
            <div class="result-item" style="text-align: center;">
                <h4>Gambar Chat Palsu Berhasil Dibuat</h4>
                <a href="${resultUrl}" target="_blank" download="fake_chat_iphone_${Date.now()}.jpg">
                    <img src="${resultUrl}" alt="Hasil Chat Palsu" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px 0; border: 1px solid var(--border-color);">
                </a>
                <div class="download-links" style="justify-content: center;">
                    <a href="${resultUrl}" target="_blank" download="fake_chat_iphone_${Date.now()}.jpg">
                        <i class="bi bi-cloud-download"></i> Unduh Gambar
                    </a>
                </div>
            </div>
        `;
    }

    // ==================================
    // FUNGSI HALAMAN 11: ANALITIK (Tetap) <-- NOMOR HALAMAN BERUBAH
    // ==================================
    function loadAnalyticsCharts(forceReload = false) { 
        const isDarkMode = document.body.classList.contains('dark-mode');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? '#e0e9f5' : '#1a1a1a';
        const primaryColor = isDarkMode ? '#00bfff' : '#007aff';
        if (forceReload) { if (visitorsChartInstance) visitorsChartInstance.destroy(); if (featuresChartInstance) featuresChartInstance.destroy(); visitorsChartInstance = null; featuresChartInstance = null; }
        if (!visitorsChartInstance) { 
            const ctxVisitors = document.getElementById('visitors-chart').getContext('2d'); 
            visitorsChartInstance = new Chart(ctxVisitors, { 
                type: 'line', 
                data: { 
                    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], 
                    datasets: [{ 
                        label: 'Pengunjung', 
                        data: [150, 230, 180, 210, 250, 300, 280], 
                        fill: true, 
                        backgroundColor: primaryColor + '33', 
                        borderColor: primaryColor, 
                        tension: 0.4, 
                        pointBackgroundColor: primaryColor, 
                    }] 
                }, 
                options: { 
                    responsive: true, 
                    plugins: { legend: { display: false } }, 
                    scales: { 
                        y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }, 
                        x: { ticks: { color: textColor }, grid: { color: gridColor } } 
                    } 
                } 
            }); 
        }
        if (!featuresChartInstance) { 
            const ctxFeatures = document.getElementById('features-chart').getContext('2d'); 
            featuresChartInstance = new Chart(ctxFeatures, { 
                type: 'doughnut', 
                data: { 
                    labels: ['TikTok', 'YT Play', 'Spotify', 'Lainnya'], 
                    datasets: [{ 
                        label: 'Penggunaan Fitur', 
                        data: [450, 110, 280, 50], 
                        backgroundColor: [primaryColor, '#ff3b30', '#1DB954', '#ff9500'], 
                        borderColor: 'transparent', 
                    }] 
                }, 
                options: { 
                    responsive: true, 
                    plugins: { 
                        legend: { 
                            position: 'bottom', 
                            labels: { color: textColor } 
                        } 
                    } 
                } 
            }); 
        }
    }

});
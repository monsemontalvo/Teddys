// ==========================================
// 1. FUNCIÓN DE CAMBIO DE IDIOMA
// ==========================================
window.changeLanguage = function(lng) {
    i18next.changeLanguage(lng, (err, t) => {
        if (err) return console.error('Error cambiando idioma', err);
        updateContent();
    });
}

function updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = i18next.t(key);
    });
}

// ==========================================
// 2. LÓGICA PRINCIPAL (SPA, Carga + AOS + i18next)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // A. Inicializar i18next usando el Backend para leer los JSON
    i18next
        .use(i18nextHttpBackend) 
        .init({
            lng: 'es',           
            fallbackLng: 'es',   
            debug: false,
            backend: {
                loadPath: './locales/{{lng}}.json' 
            }
        }, (err, t) => {
            if (err) return console.error("Error cargando i18next:", err);
            updateContent();
        });

    // B. UI de la Pantalla de Carga
    const dotsLoader = document.querySelector('.dots-loader');
    const loadingLogo = document.getElementById('loading-logo');
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    // Fase 1: Mostrar Logo
    setTimeout(() => {
        if (dotsLoader) dotsLoader.classList.add('hidden');
        if (loadingLogo) {
            loadingLogo.classList.remove('hidden');
            setTimeout(() => {
                loadingLogo.classList.remove('opacity-0');
                loadingLogo.classList.add('opacity-100');
            }, 50);
        }
    }, 2000);

    // Fase 2: Mostrar la página y arrancar animaciones
    setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add('opacity-0'); 
        
        if (mainContent) {
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                mainContent.classList.remove('opacity-0');
                mainContent.classList.add('opacity-100');
                
                AOS.init({
                    duration: 800, 
                    easing: 'ease-out-back', 
                    once: true, 
                    offset: 100 
                });
                
            }, 50);
        }
    }, 4000);

    // Fase 3: Destruir pantalla de carga
    setTimeout(() => {
        if (loadingScreen) loadingScreen.remove(); 
    }, 5000);

    // ==========================================
    // 4. CONTROL DE MÚSICA DE FONDO
    // ==========================================
    const bgMusic = document.getElementById('bg-music');
    const musicToggleBtn = document.getElementById('music-toggle');
    const iconMusicOn = document.getElementById('icon-music-on');
    const iconMusicOff = document.getElementById('icon-music-off');

    let isMusicPlaying = false;
    
    // Bajar un poco el volumen (30%) para que no sature
    if(bgMusic) bgMusic.volume = 0.3;

    if (musicToggleBtn && bgMusic) {
        musicToggleBtn.addEventListener('click', () => {
            if (isMusicPlaying) {
                // Pausar
                bgMusic.pause();
                iconMusicOn.classList.add('hidden');
                iconMusicOff.classList.remove('hidden');
            } else {
                // Reproducir
                bgMusic.play().catch(error => console.log("Audio play failed:", error));
                iconMusicOff.classList.add('hidden');
                iconMusicOn.classList.remove('hidden');
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }
});

// ==========================================
// 3. NAVEGACIÓN SUAVE DE CARRUSELES
// ==========================================
window.scrollCarousel = function(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const carousel = target.closest('.carousel');
        carousel.scrollTo({
            left: target.offsetLeft,
            behavior: 'smooth'
        });
    }
}

// ==========================================
// 5. CONTADOR DE LANZAMIENTO (24 MAYO 2026)
// ==========================================
const launchDate = new Date("May 24, 2026 00:00:00").getTime();

const updateCountdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = launchDate - now;

    // Si la fecha ya pasó, detenemos el contador
    if (distance < 0) {
        clearInterval(updateCountdown);
        // Opcional: Aquí podrías hacer que los números se queden en 0
        return;
    }

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualizamos el DOM (DaisyUI usa la variable CSS --value para animar los números)
    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMins = document.getElementById("cd-mins");
    const elSecs = document.getElementById("cd-secs");

    if (elDays) elDays.style.setProperty('--value', days);
    if (elHours) elHours.style.setProperty('--value', hours);
    if (elMins) elMins.style.setProperty('--value', minutes);
    if (elSecs) elSecs.style.setProperty('--value', seconds);
}, 1000);
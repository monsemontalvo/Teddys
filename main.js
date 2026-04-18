
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
        .use(i18nextHttpBackend) // Le decimos que use el plugin de fetch
        .init({
            lng: 'es',           // Idioma por defecto
            fallbackLng: 'es',   // Si falla algo, regresa a español
            debug: false,
            backend: {
                // Ruta dinámica donde buscará los archivos JSON
                loadPath: './locales/{{lng}}.json' 
            }
        }, (err, t) => {
            if (err) return console.error("Error cargando i18next:", err);
            // Traducir la página por primera vez una vez que el JSON se descargó
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

    // Fase 2: Mostrar la página (SPA logic) y arrancar animaciones
    setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add('opacity-0'); 
        
        if (mainContent) {
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                mainContent.classList.remove('opacity-0');
                mainContent.classList.add('opacity-100');
                
                // Inicializar animaciones de scroll
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
});
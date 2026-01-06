// Desplazamiento suave para los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animación simple al hacer scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .gallery-grid img').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
});

// Configuración de rutas
const images = [];
for (let i = 1; i <= 11; i++) {
    images.push(`img/galeria${i}.webp`);
}

let startIndex = 0; // Controla qué imagen aparece en el primer cuadro
let currentLightboxIndex = 0;

// Función para renderizar las 3 imágenes actuales
function renderVisibleImages() {
    const isMobile = window.innerWidth <= 768;
    const galleryView = document.getElementById('gallery-view');
    galleryView.innerHTML = ''; // Limpiamos el contenedor

    if (isMobile) {
        // En móvil, renderizamos todas las imágenes para permitir el scroll fluido
        images.forEach((imgSrc, index) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `<img src="${imgSrc}" alt="Cabaña Bosque Mevak">`;
            div.onclick = () => openLightbox(index);
            galleryView.appendChild(div);
        });
    } else {
        // En escritorio, mantenemos tu lógica original de 3 espacios
        for (let i = 0; i < 3; i++) {
            const imgIndex = (startIndex + i) % images.length;
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.id = `slot-${i}`;
            div.innerHTML = `<img src="${images[imgIndex]}" alt="Cabaña">`;
            div.onclick = () => openLightbox(imgIndex);
            galleryView.appendChild(div);
        }
    }
}
// Escuchar si cambian el tamaño de la pantalla para re-renderizar
window.addEventListener('resize', renderVisibleImages);

// Mover la galería (atrás o adelante)
function rotateGallery(step) {
    startIndex += step;
    
    // Ajustar límites para que sea infinito
    if (startIndex >= images.length) startIndex = 0;
    if (startIndex < 0) startIndex = images.length - 1;
    
    renderVisibleImages();
}

// Funciones del Lightbox
function openLightbox(index) {
    currentLightboxIndex = index;
    document.getElementById('lightbox-img').src = images[currentLightboxIndex];
    document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function changeLightboxImage(step) {
    currentLightboxIndex = (currentLightboxIndex + step + images.length) % images.length;
    document.getElementById('lightbox-img').src = images[currentLightboxIndex];
}

// Animación de revelación al hacer scroll
const revealSection = () => {
    const reveals = document.querySelectorAll('.reveal, section, .gallery-item');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealSection);

// Ejecutar una vez al cargar para las secciones visibles
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar clase reveal a secciones automáticamente
    document.querySelectorAll('section').forEach(sec => sec.classList.add('reveal'));
    revealSection();
});

// Inicializar la vista al cargar
renderVisibleImages();
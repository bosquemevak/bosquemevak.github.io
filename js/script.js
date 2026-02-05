// 1. Configuración de rutas de imágenes
const images = [];
for (let i = 1; i <= 11; i++) {
    images.push(`img/galeria${i}.webp`);
}

let startIndex = 0; 
let currentLightboxIndex = 0;
let autoScrollTimer;

// 2. Función para renderizar la galería (Móvil y Escritorio)
function renderVisibleImages() {
    const isMobile = window.innerWidth <= 768;
    const galleryView = document.getElementById('gallery-view');
    if (!galleryView) return; // Seguridad por si no encuentra el elemento
    
    galleryView.innerHTML = '';

    if (isMobile) {
        // En móvil cargamos todas para permitir el scroll con el dedo
        images.forEach((imgSrc, index) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `<img src="${imgSrc}" alt="Cabaña Bosque Mevak">`;
            div.onclick = () => openLightbox(index);
            galleryView.appendChild(div);
        });
        
        galleryView.onscroll = () => {
            const scrollIndex = Math.round(galleryView.scrollLeft / galleryView.offsetWidth);
            if(startIndex !== scrollIndex) {
                startIndex = scrollIndex;
                updateDots();
            }
        };
    } else {
        // En escritorio mostramos de 3 en 3
        for (let i = 0; i < 3; i++) {
            const imgIndex = (startIndex + i) % images.length;
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `<img src="${images[imgIndex]}" alt="Cabaña">`;
            div.onclick = () => openLightbox(imgIndex);
            galleryView.appendChild(div);
        }
    }
    updateDots();
}

// 3. Función para los puntos indicadores (Dots)
function updateDots() {
    const dotsContainer = document.getElementById('gallery-dots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (index === startIndex ? ' active' : '');
        dot.onclick = () => {
            startIndex = index;
            renderVisibleImages();
            resetAutoScroll();
        };
        dotsContainer.appendChild(dot);
    });
}

// 4. Navegación y AutoScroll
function rotateGallery(step) {
    const isMobile = window.innerWidth <= 768;
    const galleryView = document.getElementById('gallery-view');
    
    // Calcular el nuevo índice de forma infinita
    startIndex = (startIndex + step + images.length) % images.length;

    if (isMobile && galleryView) {
        // En móvil: Desplazamos el scroll lateralmente
        const scrollAmount = startIndex * galleryView.offsetWidth;
        galleryView.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        // El evento onscroll de galleryView se encargará de llamar a updateDots()
    } else {
        // En escritorio: Volvemos a renderizar las 3 imágenes
        renderVisibleImages();
    }
}

function startAutoScroll() {
    stopAutoScroll(); // Limpiar cualquier timer previo
    autoScrollTimer = setInterval(() => {
        rotateGallery(1);
    }, 4000);
}

function stopAutoScroll() {
    clearInterval(autoScrollTimer);
}

function resetAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
}

// 5. Lightbox
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

// 6. Animaciones de revelación (Scroll Reveal)
const revealSection = () => {
    const reveals = document.querySelectorAll('.reveal, section');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

// 7. INICIALIZACIÓN ÚNICA
document.addEventListener('DOMContentLoaded', () => {
    // Render inicial
    renderVisibleImages();
    startAutoScroll();

    // Configurar enlaces suaves
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Configurar animaciones
    document.querySelectorAll('section').forEach(sec => sec.classList.add('reveal'));
    revealSection();
});

const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 5000); // cambia cada 5 segundos

// Eventos globales
window.addEventListener('scroll', revealSection);
window.addEventListener('resize', renderVisibleImages);
window.addEventListener('resize', renderVisibleImages);
document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".feature-item");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        {
            threshold: 0.3
        }
    );

    items.forEach((item) => observer.observe(item));
});
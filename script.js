// Multilingual content
const translations = {
    pl: {
        'church-name': 'Parafia Prawosławna Św. Mikołaja w Toruniu',
        'nav-home': 'Strona Główna',
        'nav-about': 'O Nas',
        'nav-services': 'Nabożeństwa',
        'nav-contact': 'Kontakt',
        'hero-title': 'Parafia Prawosławna Św. Mikołaja w Toruniu',
        'hero-subtitle': 'Żywe centrum prawosławia w Toruniu, bogate w historię i duchowe piękno',
        'about-title': 'Historia Parafii',
        'early-presence': 'Wczesna obecność prawosławia w Toruniu',
        'early-presence-text': 'Najwcześniejsza udokumentowana obecność prawosławia w Toruniu sięga 1668 roku. W latach 1724-1756 w Toruniu istniała już cerkiew prawosławna, służąca wspólnocie liczącej od kilkudziesięciu do kilkuset wiernych.',
        'founding': 'Założenie parafii',
        'founding-text': 'Parafia Prawosławna w Toruniu została oficjalnie otwarta 28 kwietnia 1921 roku. Początkowo, w 1924 roku, tymczasowa drewniana kaplica została pozyskana z garnizonu wojskowego.',
        'current-building': 'Obecny budynek cerkwi',
        'current-building-text': 'Obecna drewniana cerkiew parafialna została ukończona i konsekrowana w 1929 roku. Budynek pierwotnie został zbudowany w 1839 roku i został zaadaptowany z dawnego budynku klasztornego w 1939 roku.',
        'services-title': 'Nabożeństwa stałe',
        'saturday-service': 'Soboty',
        'saturday-time': 'Wieczernia o 17:00',
        'sunday-service': 'Niedziele',
        'sunday-time': 'Święta Liturgia o 11:00',
        'contact-title': 'Kontakt',
        'address': 'Adres',
        'priest': 'Proboszcz',
        'phone': 'Telefon',
        'email': 'Email',
        'footer-parish': 'Parafia Prawosławna Św. Mikołaja',
        'footer-jurisdiction': 'Jurysdykcja',
        'footer-jurisdiction-text': 'Diecezja Łódzko-Poznańska',
        'footer-archbishop': 'Biskup Atanazy',
        'footer-services': 'Nabożeństwa',
        'footer-saturday': 'Soboty: 17:00',
        'footer-sunday': 'Niedziele: 11:00',
        'facebook-title': 'Odwiedź nas na Facebooku',
        'facebook-description': 'Dołącz do naszej grupy na Facebooku, aby być częścią naszej wspólnoty online, dzielić się zdjęciami i uczestniczyć w dyskusjach.',
        'facebook-benefit-1': 'Dołącz do wspólnoty parafialnej',
        'facebook-benefit-2': 'Zdjęcia z wydarzeń i nabożeństw',
        'facebook-benefit-3': 'Dyskusje i wymiana doświadczeń',
        'facebook-button': 'Dołącz do grupy Facebook',
        'facebook-note': 'Kliknij aby odwiedzić naszą grupę',
        'open-maps': 'Otwórz w Google Maps'
    },
    en: {
        'church-name': 'St. Nicholas Orthodox Parish in Toruń',
        'nav-home': 'Home',
        'nav-about': 'About Us',
        'nav-services': 'Services',
        'nav-contact': 'Contact',
        'hero-title': 'St. Nicholas Orthodox Parish in Toruń',
        'hero-subtitle': 'A vibrant center of Orthodoxy in Toruń, rich in history and spiritual beauty',
        'about-title': 'Parish History',
        'early-presence': 'Early Orthodox presence in Toruń',
        'early-presence-text': 'The earliest documented presence of Orthodoxy in Toruń dates back to 1668. Between 1724 and 1756, an Orthodox church already existed in Toruń, serving a community that varied in size from several dozen to several hundred believers.',
        'founding': 'Founding of the Parish',
        'founding-text': 'The Orthodox Parish of Toruń was officially opened on April 28, 1921. Initially, in 1924, a temporary wooden chapel was acquired from the military garrison.',
        'current-building': 'The Current Church Building',
        'current-building-text': 'The current wooden parish church was completed and consecrated in 1929. The building was originally constructed in 1839 and was adapted from a former monastery building in 1939.',
        'services-title': 'Regular Services',
        'saturday-service': 'Saturdays',
        'saturday-time': 'Vespers at 5:00 PM',
        'sunday-service': 'Sundays',
        'sunday-time': 'Divine Liturgy at 11:00 AM',
        'contact-title': 'Contact',
        'address': 'Address',
        'priest': 'Parish Priest',
        'phone': 'Phone',
        'email': 'Email',
        'footer-parish': 'St. Nicholas Orthodox Parish',
        'footer-jurisdiction': 'Jurisdiction',
        'footer-jurisdiction-text': 'Diocese of Łódź-Poznań',
        'footer-archbishop': 'Bishop Atanazy',
        'footer-services': 'Services',
        'footer-saturday': 'Saturdays: 5:00 PM',
        'footer-sunday': 'Sundays: 11:00 AM',
        'facebook-title': 'Visit Us on Facebook',
        'facebook-description': 'Join our Facebook group to be part of our online community, share photos, and participate in discussions.',
        'facebook-benefit-1': 'Join the parish community',
        'facebook-benefit-2': 'Photos from events and services',
        'facebook-benefit-3': 'Discussions and sharing experiences',
        'facebook-button': 'Join Facebook Group',
        'facebook-note': 'Click to visit our group',
        'open-maps': 'Open in Google Maps'
    },
    uk: {
        'church-name': 'Православна парафія Св. Миколая в Торуні',
        'nav-home': 'Головна',
        'nav-about': 'Про нас',
        'nav-services': 'Богослужіння',
        'nav-contact': 'Контакти',
        'hero-title': 'Православна парафія Св. Миколая в Торуні',
        'hero-subtitle': 'Живий центр православ\'я в Торуні, багатий на історію та духовну красу',
        'about-title': 'Історія парафії',
        'early-presence': 'Рання присутність православ\'я в Торуні',
        'early-presence-text': 'Найраніша задокументована присутність православ\'я в Торуні сягає 1668 року. Між 1724 і 1756 роками в Торуні вже існувала православна церква, що служила громаді від кількох десятків до кількох сотень віруючих.',
        'founding': 'Заснування парафії',
        'founding-text': 'Православна парафія в Торуні була офіційно відкрита 28 квітня 1921 року. Спочатку, в 1924 році, тимчасова дерев\'яна каплиця була отримана від військового гарнізону.',
        'current-building': 'Поточна будівля церкви',
        'current-building-text': 'Поточна дерев\'яна парафіяльна церква була завершена і освячена в 1929 році. Будівля спочатку була побудована в 1839 році і була адаптована з колишньої монастирської будівлі в 1939 році.',
        'services-title': 'Постійні богослужіння',
        'saturday-service': 'Суботи',
        'saturday-time': 'Вечірня о 17:00',
        'sunday-service': 'Неділі',
        'sunday-time': 'Божественна Літургія о 11:00',
        'contact-title': 'Контакти',
        'address': 'Адреса',
        'priest': 'Настоятель',
        'phone': 'Телефон',
        'email': 'Електронна пошта',
        'footer-parish': 'Православна парафія Св. Миколая',
        'footer-jurisdiction': 'Юрисдикція',
        'footer-jurisdiction-text': 'Лодзько-Познанська єпархія',
        'footer-archbishop': 'Єпископ Атанасій',
        'footer-services': 'Богослужіння',
        'footer-saturday': 'Суботи: 17:00',
        'footer-sunday': 'Неділі: 11:00',
        'facebook-title': 'Відвідайте нас у Facebook',
        'facebook-description': 'Приєднуйтесь до нашої групи у Facebook, щоб бути частиною нашої онлайн-спільноти, ділитися фотографіями та брати участь у дискусіях.',
        'facebook-benefit-1': 'Приєднуйтесь до парафіяльної спільноти',
        'facebook-benefit-2': 'Фотографії з подій та богослужінь',
        'facebook-benefit-3': 'Дискусії та обмін досвідом',
        'facebook-button': 'Приєднатися до групи Facebook',
        'facebook-note': 'Натисніть, щоб відвідати нашу групу',
        'open-maps': 'Відкрити в Google Maps'
    },
    ru: {
        'church-name': 'Православный приход Св. Николая в Торуни',
        'nav-home': 'Главная',
        'nav-about': 'О нас',
        'nav-services': 'Богослужения',
        'nav-contact': 'Контакты',
        'hero-title': 'Православный приход Св. Николая в Торуни',
        'hero-subtitle': 'Живой центр православия в Торуни, богатый историей и духовной красотой',
        'about-title': 'История прихода',
        'early-presence': 'Раннее присутствие православия в Торуни',
        'early-presence-text': 'Самое раннее документированное присутствие православия в Торуни датируется 1668 годом. Между 1724 и 1756 годами в Торуни уже существовала православная церковь, служившая общине от нескольких десятков до нескольких сотен верующих.',
        'founding': 'Основание прихода',
        'founding-text': 'Православный приход в Торуни был официально открыт 28 апреля 1921 года. Первоначально, в 1924 году, временная деревянная часовня была получена от военного гарнизона.',
        'current-building': 'Текущее здание церкви',
        'current-building-text': 'Текущая деревянная приходская церковь была завершена и освящена в 1929 году. Здание первоначально было построено в 1839 году и было адаптировано из бывшего монастырского здания в 1939 году.',
        'services-title': 'Постоянные богослужения',
        'saturday-service': 'Суббота',
        'saturday-time': 'Вечерня в 17:00',
        'sunday-service': 'Воскресенье',
        'sunday-time': 'Божественная Литургия в 11:00',
        'contact-title': 'Контакты',
        'address': 'Адрес',
        'priest': 'Настоятель',
        'phone': 'Телефон',
        'email': 'Электронная почта',
        'footer-parish': 'Православный приход Св. Николая',
        'footer-jurisdiction': 'Юрисдикция',
        'footer-jurisdiction-text': 'Лодзинско-Познанская епархия',
        'footer-archbishop': 'Епископ Афанасий',
        'footer-services': 'Богослужения',
        'footer-saturday': 'Суббота: 17:00',
        'footer-sunday': 'Воскресенье: 11:00',
        'facebook-title': 'Посетите нас в Facebook',
        'facebook-description': 'Присоединяйтесь к нашей группе в Facebook, чтобы быть частью нашего онлайн-сообщества, делиться фотографиями и участвовать в дискуссиях.',
        'facebook-benefit-1': 'Присоединяйтесь к приходской общине',
        'facebook-benefit-2': 'Фотографии с событий и богослужений',
        'facebook-benefit-3': 'Дискуссии и обмен опытом',
        'facebook-button': 'Присоединиться к группе Facebook',
        'facebook-note': 'Нажмите, чтобы посетить нашу группу',
        'open-maps': 'Открыть в Google Maps'
    },
    it: {
        'church-name': 'Parrocchia Ortodossa di San Nicola a Toruń',
        'nav-home': 'Home',
        'nav-about': 'Chi Siamo',
        'nav-services': 'Servizi',
        'nav-contact': 'Contatti',
        'hero-title': 'Parrocchia Ortodossa di San Nicola a Toruń',
        'hero-subtitle': 'Un centro vibrante dell\'ortodossia a Toruń, ricco di storia e bellezza spirituale',
        'about-title': 'Storia della Parrocchia',
        'early-presence': 'Prima presenza ortodossa a Toruń',
        'early-presence-text': 'La presenza ortodossa più antica documentata a Toruń risale al 1668. Tra il 1724 e il 1756, a Toruń esisteva già una chiesa ortodossa, che serviva una comunità che variava da alcune decine a diverse centinaia di fedeli.',
        'founding': 'Fondazione della Parrocchia',
        'founding-text': 'La Parrocchia Ortodossa di Toruń è stata ufficialmente aperta il 28 aprile 1921. Inizialmente, nel 1924, una cappella temporanea in legno fu acquisita dalla guarnigione militare.',
        'current-building': 'L\'edificio della Chiesa Attuale',
        'current-building-text': 'L\'attuale chiesa parrocchiale in legno è stata completata e consacrata nel 1929. L\'edificio è stato originariamente costruito nel 1839 ed è stato adattato da un ex edificio monastico nel 1939.',
        'services-title': 'Servizi regolari',
        'saturday-service': 'Sabato',
        'saturday-time': 'Vespri alle 17:00',
        'sunday-service': 'Domenica',
        'sunday-time': 'Divina Liturgia alle 11:00',
        'contact-title': 'Contatti',
        'address': 'Indirizzo',
        'priest': 'Parroco',
        'phone': 'Telefono',
        'email': 'Email',
        'footer-parish': 'Parrocchia Ortodossa di San Nicola',
        'footer-jurisdiction': 'Giurisdizione',
        'footer-jurisdiction-text': 'Diocesi di Łódź-Poznań',
        'footer-archbishop': 'Vescovo Atanazy',
        'footer-services': 'Servizi',
        'footer-saturday': 'Sabato: 17:00',
        'footer-sunday': 'Domenica: 11:00',
        'facebook-title': 'Visitaci su Facebook',
        'facebook-description': 'Unisciti al nostro gruppo Facebook per far parte della nostra comunità online, condividere foto e partecipare alle discussioni.',
        'facebook-benefit-1': 'Unisciti alla comunità parrocchiale',
        'facebook-benefit-2': 'Foto di eventi e servizi',
        'facebook-benefit-3': 'Discussioni e condivisione di esperienze',
        'facebook-button': 'Unisciti al Gruppo Facebook',
        'facebook-note': 'Clicca per visitare il nostro gruppo',
        'open-maps': 'Apri in Google Maps'
    }
};

// Language switching functionality
function switchLanguage(language) {
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = language;
    
    // Save language preference
    localStorage.setItem('selectedLanguage', language);
}

// Initialize language
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language-select');
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'pl';
    
    // Set the saved language
    languageSelect.value = savedLanguage;
    switchLanguage(savedLanguage);
    
    // Add event listener for language changes
    languageSelect.addEventListener('change', function() {
        switchLanguage(this.value);
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Header background change on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(59, 130, 246, 0.95))';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, var(--primary-blue), var(--light-blue))';
        header.style.backdropFilter = 'none';
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Close mobile menu when clicking on a nav link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = document.querySelector('.navigation').contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Animation on scroll (simple fade-in effect)
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .contact-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-card, .contact-item');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// Hero background gallery functionality
let currentImageIndex = 0;
let heroImages;
let indicators;

function showImage(index) {
    if (!heroImages || !indicators) return;

    // Hide all images
    heroImages.forEach(img => img.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Show selected image
    if (heroImages[index]) {
        heroImages[index].classList.add('active');
        indicators[index].classList.add('active');
        currentImageIndex = index;
    }
}

function changeImage(direction) {
    if (!heroImages) return;
    const totalImages = heroImages.length;
    let newIndex = currentImageIndex + direction;

    if (newIndex >= totalImages) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = totalImages - 1;
    }

    showImage(newIndex);
}

function currentImage(index) {
    showImage(index - 1); // Convert to 0-based index
}

// Auto-play gallery (optional)
function autoPlayGallery() {
    changeImage(1);
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero background images
    heroImages = document.querySelectorAll('.hero-bg-image');
    indicators = document.querySelectorAll('.indicator');

    // Set up auto-play (change image every 5 seconds)
    setInterval(autoPlayGallery, 5000);

    // Initialize first image
    showImage(0);
});

// Facebook button functionality
document.addEventListener('DOMContentLoaded', function() {
    const facebookButton = document.querySelector('.facebook-button');
    if (facebookButton) {
        facebookButton.addEventListener('click', function() {
            const facebookUrl = 'https://www.facebook.com/cerkiewtorun/';
            window.open(facebookUrl, '_blank');
        });
    }
});


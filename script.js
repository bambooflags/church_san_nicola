// Multilingual content
const translations = {
    pl: {
        'church-name': 'Parafia Prawosławna Św. Mikołaja w Toruniu',
        'nav-home': 'Strona Główna',
        'nav-about': 'O Nas',
        'nav-services': 'Nabożeństwa',
        'nav-contact': 'Kontakt',
        'nav-news': 'Aktualności',
        'hero-title': 'Parafia Prawosławna Św. Mikołaja w Toruniu',
        'hero-subtitle': 'Żywe centrum prawosławia w Toruniu, bogate w historię i duchowe piękno',
        'about-title': 'Historia Parafii',
        'early-presence': 'Wczesna obecność prawosławia w Toruniu',
        'early-presence-text': 'Najwcześniejsza udokumentowana obecność prawosławia w Toruniu sięga 1668 roku. W latach 1724-1756 w Toruniu istniała już cerkiew prawosławna, służąca wspólnocie liczącej od kilkudziesięciu do kilkuset wiernych.',
        'founding': 'Założenie parafii',
        'founding-text': 'Parafia Prawosławna w Toruniu została oficjalnie otwarta 28 kwietnia 1921 roku. Początkowo, w 1924 roku, tymczasowa drewniana kaplica została pozyskana z garnizonu wojskowego.',
        'current-building': 'Obecny budynek cerkwi',
        'current-building-text': 'Obecna drewniana cerkiew parafialna została ukończona i konsekrowana w 1929 roku. Budynek pierwotnie został zbudowany w 1839 roku i został zaadaptowany z dawnego budynku klasztornego w 1939 roku.',
        'services-title': 'Nabożeństwa',
        'saturday-service': 'Soboty',
        'saturday-time': 'Święta Liturgia o 17:00',
        'sunday-service': 'Niedziele',
        'sunday-time': 'Święta Liturgia o 11:00',
        'vigil-service': 'Wigilie świąt',
        'vigil-time': 'Nieszpory o 17:00',
        'contact-title': 'Kontakt',
        'address': 'Adres',
        'priest': 'Proboszcz',
        'phone': 'Telefon',
        'email': 'Email',
        'news-title': 'Aktualności',
        'news-item-1-title': 'Nadchodzące święto',
        'news-item-1-text': 'Informacja o nadchodzącym ważnym wydarzeniu w parafii...',
        'news-item-2-title': 'Renowacja cerkwi',
        'news-item-2-text': 'Aktualne informacje o pracach renowacyjnych w cerkwi...',
        'footer-parish': 'Parafia Prawosławna Św. Mikołaja',
        'footer-jurisdiction': 'Jurysdykcja',
        'footer-jurisdiction-text': 'Diecezja Łódzko-Poznańska',
        'footer-archbishop': 'Arcybiskup Szymon',
        'footer-services': 'Nabożeństwa',
        'footer-saturday': 'Soboty: 17:00',
        'footer-sunday': 'Niedziele: 11:00',
        'whatsapp-title': 'Bądź na bieżąco',
        'whatsapp-description': 'Dołącz do naszej grupy WhatsApp, aby otrzymywać najnowsze wiadomości, informacje o nadchodzących nabożeństwach i ewentualnych zmianach w harmonogramie.',
        'benefit-1': 'Powiadomienia o ważnych wydarzeniach',
        'benefit-2': 'Zmiany w harmonogramie nabożeństw',
        'benefit-3': 'Przypomnienia o świętach i uroczystościach',
        'whatsapp-button': 'Dołącz do grupy WhatsApp',
        'whatsapp-note': 'Kliknij aby wysłać wiadomość i dołączyć do grupy'
    },
    en: {
        'church-name': 'St. Nicholas Orthodox Parish in Toruń',
        'nav-home': 'Home',
        'nav-about': 'About Us',
        'nav-services': 'Services',
        'nav-contact': 'Contact',
        'nav-news': 'News',
        'hero-title': 'St. Nicholas Orthodox Parish in Toruń',
        'hero-subtitle': 'A vibrant center of Orthodoxy in Toruń, rich in history and spiritual beauty',
        'about-title': 'Parish History',
        'early-presence': 'Early Orthodox presence in Toruń',
        'early-presence-text': 'The earliest documented presence of Orthodoxy in Toruń dates back to 1668. Between 1724 and 1756, an Orthodox church already existed in Toruń, serving a community that varied in size from several dozen to several hundred believers.',
        'founding': 'Founding of the Parish',
        'founding-text': 'The Orthodox Parish of Toruń was officially opened on April 28, 1921. Initially, in 1924, a temporary wooden chapel was acquired from the military garrison.',
        'current-building': 'The Current Church Building',
        'current-building-text': 'The current wooden parish church was completed and consecrated in 1929. The building was originally constructed in 1839 and was adapted from a former monastery building in 1939.',
        'services-title': 'Services',
        'saturday-service': 'Saturdays',
        'saturday-time': 'Divine Liturgy at 5:00 PM',
        'sunday-service': 'Sundays',
        'sunday-time': 'Divine Liturgy at 11:00 AM',
        'vigil-service': 'Eve of Holidays',
        'vigil-time': 'Vigils at 5:00 PM',
        'contact-title': 'Contact',
        'address': 'Address',
        'priest': 'Parish Priest',
        'phone': 'Phone',
        'email': 'Email',
        'news-title': 'News',
        'news-item-1-title': 'Upcoming Feast',
        'news-item-1-text': 'Information about an upcoming important event in the parish...',
        'news-item-2-title': 'Church Renovation',
        'news-item-2-text': 'Current information about renovation work in the church...',
        'footer-parish': 'St. Nicholas Orthodox Parish',
        'footer-jurisdiction': 'Jurisdiction',
        'footer-jurisdiction-text': 'Diocese of Łódź-Poznań',
        'footer-archbishop': 'Archbishop Szymon',
        'footer-services': 'Services',
        'footer-saturday': 'Saturdays: 5:00 PM',
        'footer-sunday': 'Sundays: 11:00 AM',
        'whatsapp-title': 'Stay Updated',
        'whatsapp-description': 'Join our WhatsApp group to receive the latest news, information about upcoming services, and any schedule changes.',
        'benefit-1': 'Notifications about important events',
        'benefit-2': 'Service schedule changes',
        'benefit-3': 'Reminders about holidays and celebrations',
        'whatsapp-button': 'Join WhatsApp Group',
        'whatsapp-note': 'Click to send a message and join the group'
    },
    uk: {
        'church-name': 'Православна парафія Св. Миколая в Торуні',
        'nav-home': 'Головна',
        'nav-about': 'Про нас',
        'nav-services': 'Богослужіння',
        'nav-contact': 'Контакти',
        'nav-news': 'Новини',
        'hero-title': 'Православна парафія Св. Миколая в Торуні',
        'hero-subtitle': 'Живий центр православ\'я в Торуні, багатий на історію та духовну красу',
        'about-title': 'Історія парафії',
        'early-presence': 'Рання присутність православ\'я в Торуні',
        'early-presence-text': 'Найраніша задокументована присутність православ\'я в Торуні сягає 1668 року. Між 1724 і 1756 роками в Торуні вже існувала православна церква, що служила громаді від кількох десятків до кількох сотень віруючих.',
        'founding': 'Заснування парафії',
        'founding-text': 'Православна парафія в Торуні була офіційно відкрита 28 квітня 1921 року. Спочатку, в 1924 році, тимчасова дерев\'яна каплиця була отримана від військового гарнізону.',
        'current-building': 'Поточна будівля церкви',
        'current-building-text': 'Поточна дерев\'яна парафіяльна церква була завершена і освячена в 1929 році. Будівля спочатку була побудована в 1839 році і була адаптована з колишньої монастирської будівлі в 1939 році.',
        'services-title': 'Богослужіння',
        'saturday-service': 'Суботи',
        'saturday-time': 'Божественна Літургія о 17:00',
        'sunday-service': 'Неділі',
        'sunday-time': 'Божественна Літургія о 11:00',
        'vigil-service': 'Напередодні свят',
        'vigil-time': 'Вечірня о 17:00',
        'contact-title': 'Контакти',
        'address': 'Адреса',
        'priest': 'Настоятель',
        'phone': 'Телефон',
        'email': 'Електронна пошта',
        'news-title': 'Новини',
        'news-item-1-title': 'Наближається свято',
        'news-item-1-text': 'Інформація про наближаючу важливу подію в парафії...',
        'news-item-2-title': 'Реновація церкви',
        'news-item-2-text': 'Поточна інформація про реставраційні роботи в церкві...',
        'footer-parish': 'Православна парафія Св. Миколая',
        'footer-jurisdiction': 'Юрисдикція',
        'footer-jurisdiction-text': 'Лодзько-Познанська єпархія',
        'footer-archbishop': 'Архієпископ Симон',
        'footer-services': 'Богослужіння',
        'footer-saturday': 'Суботи: 17:00',
        'footer-sunday': 'Неділі: 11:00',
        'whatsapp-title': 'Будьте в курсі',
        'whatsapp-description': 'Приєднуйтесь до нашої групи WhatsApp, щоб отримувати найновіші новини, інформацію про наступні богослужіння та можливі зміни розкладу.',
        'benefit-1': 'Сповіщення про важливі події',
        'benefit-2': 'Зміни в розкладі богослужінь',
        'benefit-3': 'Нагадування про свята та урочистості',
        'whatsapp-button': 'Приєднатися до групи WhatsApp',
        'whatsapp-note': 'Натисніть, щоб надіслати повідомлення та приєднатися до групи'
    },
    ru: {
        'church-name': 'Православный приход Св. Николая в Торуни',
        'nav-home': 'Главная',
        'nav-about': 'О нас',
        'nav-services': 'Богослужения',
        'nav-contact': 'Контакты',
        'nav-news': 'Новости',
        'hero-title': 'Православный приход Св. Николая в Торуни',
        'hero-subtitle': 'Живой центр православия в Торуни, богатый историей и духовной красотой',
        'about-title': 'История прихода',
        'early-presence': 'Раннее присутствие православия в Торуни',
        'early-presence-text': 'Самое раннее документированное присутствие православия в Торуни датируется 1668 годом. Между 1724 и 1756 годами в Торуни уже существовала православная церковь, служившая общине от нескольких десятков до нескольких сотен верующих.',
        'founding': 'Основание прихода',
        'founding-text': 'Православный приход в Торуни был официально открыт 28 апреля 1921 года. Первоначально, в 1924 году, временная деревянная часовня была получена от военного гарнизона.',
        'current-building': 'Текущее здание церкви',
        'current-building-text': 'Текущая деревянная приходская церковь была завершена и освящена в 1929 году. Здание первоначально было построено в 1839 году и было адаптировано из бывшего монастырского здания в 1939 году.',
        'services-title': 'Богослужения',
        'saturday-service': 'Суббота',
        'saturday-time': 'Божественная Литургия в 17:00',
        'sunday-service': 'Воскресенье',
        'sunday-time': 'Божественная Литургия в 11:00',
        'vigil-service': 'Накануне праздников',
        'vigil-time': 'Вечерня в 17:00',
        'contact-title': 'Контакты',
        'address': 'Адрес',
        'priest': 'Настоятель',
        'phone': 'Телефон',
        'email': 'Электронная почта',
        'news-title': 'Новости',
        'news-item-1-title': 'Приближающийся праздник',
        'news-item-1-text': 'Информация о приближающемся важном событии в приходе...',
        'news-item-2-title': 'Реновация церкви',
        'news-item-2-text': 'Текущая информация о реставрационных работах в церкви...',
        'footer-parish': 'Православный приход Св. Николая',
        'footer-jurisdiction': 'Юрисдикция',
        'footer-jurisdiction-text': 'Лодзинско-Познанская епархия',
        'footer-archbishop': 'Архиепископ Симон',
        'footer-services': 'Богослужения',
        'footer-saturday': 'Суббота: 17:00',
        'footer-sunday': 'Воскресенье: 11:00',
        'whatsapp-title': 'Будьте в курсе',
        'whatsapp-description': 'Присоединяйтесь к нашей группе WhatsApp, чтобы получать последние новости, информацию о предстоящих богослужениях и возможных изменениях в расписании.',
        'benefit-1': 'Уведомления о важных событиях',
        'benefit-2': 'Изменения в расписании богослужений',
        'benefit-3': 'Напоминания о праздниках и торжествах',
        'whatsapp-button': 'Присоединиться к группе WhatsApp',
        'whatsapp-note': 'Нажмите, чтобы отправить сообщение и присоединиться к группе'
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
    const elements = document.querySelectorAll('.service-card, .news-card, .contact-item');
    
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
    const elements = document.querySelectorAll('.service-card, .news-card, .contact-item');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// Gallery functionality
let currentImageIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-image');
const indicators = document.querySelectorAll('.indicator');

function showImage(index) {
    // Hide all images
    galleryImages.forEach(img => img.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show selected image
    if (galleryImages[index]) {
        galleryImages[index].classList.add('active');
        indicators[index].classList.add('active');
        currentImageIndex = index;
    }
}

function changeImage(direction) {
    const totalImages = galleryImages.length;
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
    // Set up auto-play (change image every 5 seconds)
    setInterval(autoPlayGallery, 5000);
    
    // Initialize first image
    showImage(0);
});

// WhatsApp button functionality
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            // Replace with actual WhatsApp number or group invite link
            const whatsappNumber = '48606910655'; // Parish priest's number
            const message = 'Dzień dobry! Chciałbym dołączyć do grupy WhatsApp parafii Św. Mikołaja w Toruniu.';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});


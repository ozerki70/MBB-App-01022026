// اطلاعات تاریخ و زمان
class DateTimeManager {
    constructor() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    updateDateTime() {
        const now = new Date();
        
        // تاریخ میلادی
        const gregorianOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const gregorianDate = now.toLocaleDateString('fa-IR', gregorianOptions);
        document.getElementById('gregorianDate').textContent = gregorianDate;
        
        // تاریخ شمسی (با کتابخانه تقویم)
        const hijriDate = this.getHijriDate(now);
        document.getElementById('hijriDate').textContent = hijriDate;
        
        // ساعت دیجیتال
        const time = now.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('digitalClock').textContent = time;
        
        // تاریخ گزارش
        const reportDate = now.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        document.getElementById('reportDate').textContent = reportDate;
    }
    
    getHijriDate(date) {
        // تبدیل تاریخ میلادی به هجری شمسی (ساده شده)
        const hijriMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 
                           'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
        
        const now = new Date();
        const hijriYear = 1404 + Math.floor((now.getFullYear() - 2024) * 0.97);
        const hijriMonth = hijriMonths[now.getMonth()];
        const hijriDay = now.getDate();
        
        return `${hijriYear} ${hijriMonth} ${hijriDay}`;
    }
}

// مدیریت داده‌های بانک مرکزی روسیه
class CBRDataManager {
    constructor() {
        this.cbrData = null;
        this.lastUpdate = null;
    }
    
    async fetchCBRData() {
        try {
            // داده‌های نمونه از سایت cbr.ru (به دلیل CORS، از داده‌های نمونه استفاده می‌کنیم)
            const sampleData = {
                lastUpdate: new Date().toLocaleString('fa-IR'),
                keyRate: {
                    value: "15.85%",
                    date: "30.12.2025",
                    change: "بدون تغییر",
                    description: "نرخ کلیدی بانک مرکزی"
                },
                ruonia: {
                    value: "15.65%",
                    date: "30.12.2025",
                    change: "-0.20%",
                    description: "نرخ میانگین شبانه روبل"
                },
                exchangeRates: [
                    {
                        currency: "USD",
                        name: "دلار آمریکا",
                        today: "78.2267 ₽",
                        todayDate: "31.12.2025",
                        yesterday: "77.4466 ₽",
                        yesterdayDate: "30.12.2025",
                        change: "+0.7801 ₽"
                    },
                    {
                        currency: "EUR",
                        name: "یورو",
                        today: "92.0938 ₽",
                        todayDate: "31.12.2025",
                        yesterday: "91.4775 ₽",
                        yesterdayDate: "30.12.2025",
                        change: "+0.6163 ₽"
                    }
                ]
            };
            
            this.cbrData = sampleData;
            this.lastUpdate = sampleData.lastUpdate;
            this.renderCBRData();
            
        } catch (error) {
            console.error("خطا در دریافت داده‌های CBR:", error);
            this.showError("خطا در دریافت داده‌های اقتصادی");
        }
    }
    
    renderCBRData() {
        const container = document.getElementById('cbrRates');
        if (!container || !this.cbrData) return;
        
        container.innerHTML = `
            <div class="rate-card">
                <div class="rate-header">
                    <div class="rate-title">
                        <i class="fas fa-percentage"></i>
                        <span>${this.cbrData.keyRate.description}</span>
                    </div>
                    <div class="rate-date">${this.cbrData.keyRate.date}</div>
                </div>
                <div class="rate-value">${this.cbrData.keyRate.value}</div>
                <div class="rate-change">
                    <i class="fas fa-info-circle"></i>
                    ${this.cbrData.keyRate.change}
                </div>
            </div>
            
            <div class="rate-card">
                <div class="rate-header">
                    <div class="rate-title">
                        <i class="fas fa-moon"></i>
                        <span>${this.cbrData.ruonia.description} (RUONIA)</span>
                    </div>
                    <div class="rate-date">${this.cbrData.ruonia.date}</div>
                </div>
                <div class="rate-value">${this.cbrData.ruonia.value}</div>
                <div class="rate-change ${this.cbrData.ruonia.change.includes('-') ? 'negative' : 'positive'}">
                    <i class="fas fa-arrow-${this.cbrData.ruonia.change.includes('-') ? 'down' : 'up'}"></i>
                    ${this.cbrData.ruonia.change}
                </div>
            </div>
            
            <div class="exchange-grid">
                ${this.cbrData.exchangeRates.map(rate => `
                    <div class="exchange-card">
                        <div class="currency-header">
                            <div class="currency-name">
                                <i class="fas fa-${rate.currency === 'USD' ? 'dollar-sign' : 'euro-sign'}"></i>
                                <span>${rate.name}</span>
                            </div>
                        </div>
                        
                        <div class="currency-rate">
                            ${rate.today}
                            <div class="currency-date">امروز: ${rate.todayDate}</div>
                        </div>
                        
                        <div style="margin: 10px 0; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px;">
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                                ${rate.yesterday}
                                <div class="currency-date">دیروز: ${rate.yesterdayDate}</div>
                            </div>
                        </div>
                        
                        <div class="rate-change ${rate.change.includes('+') ? 'positive' : 'negative'}">
                            <i class="fas fa-arrow-${rate.change.includes('+') ? 'up' : 'down'}"></i>
                            تغییر: ${rate.change}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('lastUpdateTime').textContent = this.lastUpdate;
    }
    
    showError(message) {
        const container = document.getElementById('cbrRates');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>${message}</h3>
                    <p>لطفاً دوباره تلاش کنید یا اتصال اینترنت خود را بررسی کنید.</p>
                    <button class="retry-btn" onclick="cbrManager.fetchCBRData()">
                        <i class="fas fa-redo"></i>
                        تلاش مجدد
                    </button>
                </div>
            `;
        }
    }
}

// مدیریت اخبار CBR
class NewsManager {
    constructor() {
        this.news = [];
    }
    
    async fetchCBRNews() {
        try {
            // اخبار نمونه از CBR (ترجمه فارسی)
            this.news = [
                {
                    id: 1,
                    title: "بانک مرکزی نرخ کلیدی را ثابت نگه داشت",
                    content: "بانک مرکزی روسیه در آخرین جلسه خود نرخ کلیدی را در سطح ۱۵.۸۵٪ ثابت نگه داشت. این تصمیم با توجه به کاهش نرخ تورم و ثبات نسبی در بازار ارز اتخاذ شد.",
                    date: "۳۰ دسامبر ۲۰۲۵",
                    source: "https://cbr.ru/press/event/?id=12345"
                },
                {
                    id: 2,
                    title: "رشد اقتصادی روسیه در سال ۲۰۲۵ مثبت بود",
                    content: "بر اساس گزارش بانک مرکزی، اقتصاد روسیه در سال ۲۰۲۵ رشد ۲.۳٪ را تجربه کرد. این رشد عمدتاً در بخش‌های صنعت و کشاورزی مشاهده شده است.",
                    date: "۲۸ دسامبر ۲۰۲۵",
                    source: "https://cbr.ru/statistics/macro/?id=67890"
                },
                {
                    id: 3,
                    title: "ذخایر ارزی روسیه به ۶۰۰ میلیارد دلار رسید",
                    content: "بانک مرکزی روسیه اعلام کرد ذخایر ارزی این کشور به ۶۰۰ میلیارد دلار رسیده که بالاترین سطح در دو سال اخیر است.",
                    date: "۲۵ دسامبر ۲۰۲۵",
                    source: "https://cbr.ru/statistics/reserves/?id=11223"
                }
            ];
            
            this.renderNews();
            
        } catch (error) {
            console.error("خطا در دریافت اخبار:", error);
            this.showNewsError();
        }
    }
    
    renderNews() {
        const container = document.getElementById('newsContainer');
        if (!container) return;
        
        container.innerHTML = this.news.map(news => `
            <div class="news-card">
                <div class="news-header">
                    <h3 class="news-title">${news.title}</h3>
                    <div class="news-date">${news.date}</div>
                </div>
                <div class="news-content">
                    <p>${news.content}</p>
                </div>
                <a href="${news.source}" target="_blank" class="news-link">
                    <i class="fas fa-external-link-alt"></i>
                    مشاهده منبع خبر
                </a>
            </div>
        `).join('');
    }
    
    showNewsError() {
        const container = document.getElementById('newsContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>خطا در دریافت اخبار</h3>
                    <p>لطفاً اتصال اینترنت خود را بررسی کنید.</p>
                </div>
            `;
        }
    }
}

// مدیریت وضعیت هوا
class WeatherManager {
    constructor() {
        this.currentWeather = null;
        this.updateWeatherBrief();
        setInterval(() => this.updateWeatherBrief(), 300000); // هر 5 دقیقه
    }
    
    async fetchWeatherData() {
        try {
            // داده‌های نمونه وضعیت هوا (مسکو)
            this.currentWeather = {
                city: "مسکو",
                temp: "-۲°C",
                feelsLike: "-۵°C",
                description: "برفی",
                humidity: "۸۵٪",
                windSpeed: "۱۲ km/h",
                pressure: "۱۰۱۳ hPa",
                icon: "❄️"
            };
            
            this.renderWeatherData();
            
        } catch (error) {
            console.error("خطا در دریافت وضعیت هوا:", error);
            this.showWeatherError();
        }
    }
    
    updateWeatherBrief() {
        const briefElement = document.getElementById('weatherBrief');
        const tempElement = document.getElementById('currentTemp');
        
        if (briefElement && tempElement) {
            // دمای تصادفی برای نمایش (در حالت واقعی از API دریافت می‌شود)
            const temp = Math.floor(Math.random() * 5) - 5; // بین -۵ تا ۰ درجه
            tempElement.textContent = `${temp}°C`;
        }
    }
    
    renderWeatherData() {
        const container = document.getElementById('weatherContent');
        if (!container || !this.currentWeather) return;
        
        container.innerHTML = `
            <div class="current-weather">
                <div class="weather-main">
                    <h3>${this.currentWeather.city}</h3>
                    <div class="temp-large">${this.currentWeather.temp}</div>
                    <p class="weather-desc">${this.currentWeather.description}</p>
                    <p class="feels-like">احساس: ${this.currentWeather.feelsLike}</p>
                </div>
                <div class="weather-icon-large">${this.currentWeather.icon}</div>
            </div>
            
            <div class="weather-details-grid">
                <div class="weather-detail">
                    <i class="fas fa-tint"></i>
                    <p>رطوبت</p>
                    <h4>${this.currentWeather.humidity}</h4>
                </div>
                
                <div class="weather-detail">
                    <i class="fas fa-wind"></i>
                    <p>سرعت باد</p>
                    <h4>${this.currentWeather.windSpeed}</h4>
                </div>
                
                <div class="weather-detail">
                    <i class="fas fa-weight-hanging"></i>
                    <p>فشار هوا</p>
                    <h4>${this.currentWeather.pressure}</h4>
                </div>
                
                <div class="weather-detail">
                    <i class="fas fa-eye"></i>
                    <p>دید</p>
                    <h4>۱۰ کیلومتر</h4>
                </div>
            </div>
        `;
    }
    
    showWeatherError() {
        const container = document.getElementById('weatherContent');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>خطا در دریافت وضعیت هوا</h3>
                    <p>لطفاً اتصال اینترنت خود را بررسی کنید.</p>
                    <button class="retry-btn" onclick="weatherManager.fetchWeatherData()">
                        <i class="fas fa-redo"></i>
                        تلاش مجدد
                    </button>
                </div>
            `;
        }
    }
}

// مدیریت پنل‌ها و UI
class PanelManager {
    constructor() {
        this.currentPanel = null;
        this.init();
    }
    
    init() {
        // دکمه‌های اصلی
        this.setupMainButtons();
        
        // دکمه‌های بازگشت
        this.setupBackButtons();
        
        // منوی آبشاری ارتباط با ما
        this.setupContactDropdown();
        
        // رویداد کلیک خارج از پنل‌ها
        this.setupClickOutside();
    }
    
    setupMainButtons() {
        // گزارش روز اقتصادی
        document.getElementById('reportBtn')?.addEventListener('click', () => {
            this.openPanel('report');
            cbrManager.fetchCBRData();
        });
        
        // اخبار CBR
        document.getElementById('newsBtn')?.addEventListener('click', () => {
            this.openPanel('news');
            newsManager.fetchCBRNews();
        });
        
        // وضعیت جوی
        document.getElementById('weatherBtn')?.addEventListener('click', () => {
            this.openPanel('weather');
            weatherManager.fetchWeatherData();
        });
        
        // تنظیمات
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.openPanel('settings');
        });
        
        // پاک کردن حافظه موقت
        document.getElementById('clearCacheBtn')?.addEventListener('click', () => {
            if (confirm('آیا می‌خواهید حافظه موقت پاک شود؟')) {
                localStorage.clear();
                alert('حافظه موقت با موفقیت پاک شد!');
            }
        });
        
        // بروزرسانی داده‌ها
        document.getElementById('refreshDataBtn')?.addEventListener('click', () => {
            cbrManager.fetchCBRData();
            newsManager.fetchCBRNews();
            weatherManager.fetchWeatherData();
            alert('داده‌ها با موفقیت بروزرسانی شدند!');
        });
    }
    
    setupBackButtons() {
        // دکمه‌های بازگشت
        const backButtons = [
            'backFromReport',
            'backFromNews',
            'backFromWeather',
            'backFromSettings'
        ];
        
        backButtons.forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => {
                this.closeCurrentPanel();
            });
        });
    }
    
    setupContactDropdown() {
        const contactBtn = document.getElementById('contactBtn');
        const contactMenu = document.getElementById('contactMenu');
        const overlay = document.getElementById('overlay');
        
        if (contactBtn && contactMenu) {
            contactBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                contactMenu.classList.toggle('hidden');
                contactBtn.classList.toggle('active');
                overlay.classList.toggle('hidden');
            });
            
            // بستن منو با کلیک خارج
            document.addEventListener('click', (e) => {
                if (!contactMenu.contains(e.target) && !contactBtn.contains(e.target)) {
                    contactMenu.classList.add('hidden');
                    contactBtn.classList.remove('active');
                    overlay.classList.add('hidden');
                }
            });
            
            overlay.addEventListener('click', () => {
                contactMenu.classList.add('hidden');
                contactBtn.classList.remove('active');
                overlay.classList.add('hidden');
            });
        }
    }
    
    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (this.currentPanel && e.target.classList.contains('panel-container')) {
                this.closeCurrentPanel();
            }
        });
    }
    
    openPanel(panelName) {
        this.closeCurrentPanel();
        
        const panel = document.getElementById(`${panelName}Panel`);
        const overlay = document.getElementById('overlay');
        
        if (panel) {
            panel.classList.remove('hidden');
            overlay.classList.remove('hidden');
            this.currentPanel = panelName;
        }
    }
    
    closeCurrentPanel() {
        if (this.currentPanel) {
            const panel = document.getElementById(`${this.currentPanel}Panel`);
            const overlay = document.getElementById('overlay');
            
            if (panel) {
                panel.classList.add('hidden');
            }
            if (overlay) {
                overlay.classList.add('hidden');
            }
            
            this.currentPanel = null;
        }
        
        // بستن منوی ارتباط با ما
        const contactMenu = document.getElementById('contactMenu');
        const contactBtn = document.getElementById('contactBtn');
        
        if (contactMenu && contactBtn) {
            contactMenu.classList.add('hidden');
            contactBtn.classList.remove('active');
        }
    }
}

// راه‌اندازی برنامه
let dateTimeManager, cbrManager, newsManager, weatherManager, panelManager;

document.addEventListener('DOMContentLoaded', function() {
    // راه‌اندازی مدیران
    dateTimeManager = new DateTimeManager();
    cbrManager = new CBRDataManager();
    newsManager = new NewsManager();
    weatherManager = new WeatherManager();
    panelManager = new PanelManager();
    
    // بارگیری اولیه داده‌ها
    setTimeout(() => {
        cbrManager.fetchCBRData();
        weatherManager.updateWeatherBrief();
    }, 1000);
    
    // نمایش پیام خوش‌آمدگویی برای اولین بار
    const firstVisit = !localStorage.getItem('hasVisited');
    if (firstVisit) {
        setTimeout(() => {
            alert('به اپلیکیشن بانک MBBR خوش آمدید!\nنسخه: 01022026');
            localStorage.setItem('hasVisited', 'true');
        }, 2000);
    }
});

// توابع global برای دسترسی از HTML
window.cbrManager = cbrManager;
window.weatherManager = weatherManager;
window.newsManager = newsManager;

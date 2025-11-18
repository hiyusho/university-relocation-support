// ========================================
// グローバル変数とユーティリティ
// ========================================

// 大学カラー変更関数
function changeUniversityTheme(config) {
    const root = document.documentElement;
    
    if (config.primaryColor) {
        root.style.setProperty('--primary-color', config.primaryColor);
        root.style.setProperty('--primary-dark', adjustColorBrightness(config.primaryColor, -20));
        root.style.setProperty('--primary-light', adjustColorBrightness(config.primaryColor, 40));
    }
    
    if (config.logoUrl) {
        const logoElement = document.getElementById('universityLogo');
        if (logoElement) {
            logoElement.src = config.logoUrl;
        }
    }
}

// 色の明るさ調整関数
function adjustColorBrightness(color, percent) {
    let num = parseInt(color.replace("#",""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = (num >> 8 & 0x00FF) + amt;
    let B = (num & 0x0000FF) + amt;
    
    R = (R < 255) ? ((R < 1) ? 0 : R) : 255;
    G = (G < 255) ? ((G < 1) ? 0 : G) : 255;
    B = (B < 255) ? ((B < 1) ? 0 : B) : 255;
    
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// ========================================
// モーダル関数
// ========================================

// ログインモーダルを開く
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// ログインモーダルを閉じる
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
}

// ========================================
// フォーム送信処理
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // ログインフォームの送信処理
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const loginData = {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('password').value
            };
            
            console.log('ログイン情報:', loginData);
            
            // 実際の実装では、ここで認証処理
            alert('ログイン機能は準備中です。');
            
            closeLoginModal();
            loginForm.reset();
        });
    }
});

// ========================================
// スムーススクロール
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-item a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // ハッシュリンクの場合のみスムーススクロール
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// ========================================
// ナビゲーションアクティブ状態
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section, .hero-section');
    const navItems = document.querySelectorAll('.nav-item a');
    
    function setActiveNav() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + currentSection) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNav);
});

// ========================================
// フェードインアニメーション
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.section, .pillar, .target-card, .service-item, .step');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ========================================
// 動画プレースホルダークリック処理
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder, .video-placeholder-small');
    
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // 実際の実装では、ここで動画モーダルを開くか、YouTubeなどの動画を埋め込む
            alert('動画再生機能は準備中です。\n実際のサイトでは、ここで名古屋の魅力を紹介する動画が再生されます。');
        });
    });
});

// ========================================
// 大学カラーカスタマイズの使用例
// ========================================

// 以下のコードをコメント解除して、大学ごとにカラーを変更できます

/*
// 例1: 東京大学風のカラー（淡青色）
changeUniversityTheme({
    primaryColor: '#6C9BD2',
    logoUrl: 'path/to/university-logo.png'
});

// 例2: 京都大学風のカラー（紺色）
changeUniversityTheme({
    primaryColor: '#002A5C',
    logoUrl: 'path/to/university-logo.png'
});

// 例3: 名古屋大学風のカラー（緑色）
changeUniversityTheme({
    primaryColor: '#00703C',
    logoUrl: 'path/to/university-logo.png'
});
*/

// ========================================
// ESCキーでモーダルを閉じる
// ========================================

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
    }
});

// ========================================
// レスポンシブメニュー（モバイル用）
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニューボタンがある場合の処理
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
});

// ========================================
// ページトップへ戻るボタン（オプション）
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // ページトップボタンを動的に作成
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // スクロール位置に応じてボタンを表示/非表示
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
        }
    });
    
    // ボタンクリックでページトップへ
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ホバーエフェクト
    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});
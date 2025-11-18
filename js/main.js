// =====================================
// スムーススクロール
// =====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // ハッシュのみのリンク（#）は無視
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        // ページ内リンクの処理
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100; // ヘッダーの高さ分のオフセット
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

// =====================================
// ログインモーダル
// =====================================
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeButtons = document.getElementsByClassName('close');

// ログインボタンクリック
if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
}

// 閉じるボタンクリック
Array.from(closeButtons).forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// モーダル外クリック
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// ログインフォーム送信
const loginForm = loginModal?.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('ログイン機能は現在開発中です');
        loginModal.style.display = 'none';
    });
}

// =====================================
// アニメーション
// =====================================
// フェードインアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// カードにアニメーションを適用
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-item, .target-card, .feature-card, .nagoya-card, .university-card, .event-card, .resource-card, .faq-item');
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// =====================================
// ヘッダー固定時のスタイル変更
// =====================================
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});
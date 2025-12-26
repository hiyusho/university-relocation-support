// ========================================
// 新規登録ページ専用JavaScript
// ========================================

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // メールアドレスの自動入力
    autoFillEmailAddress();
    
    // 「その他」チェックボックスの制御
    setupOtherCheckboxHandlers();
    
    // フォーム送信処理
    setupFormSubmission();
    
    // 個人情報同意チェックボックスの制御
    setupPrivacyConsentHandler();
});

// ========================================
// メールアドレス自動入力
// ========================================

function autoFillEmailAddress() {
    // URLパラメータからメールアドレスを取得
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = decodeURIComponent(email);
        }
    }
    
    // ローカルストレージやセッションストレージから取得する場合
    const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (storedEmail && !email) {
        const emailInput = document.getElementById('email');
        if (emailInput && !emailInput.value) {
            emailInput.value = storedEmail;
        }
    }
}

// ========================================
// 「その他」チェックボックスの制御
// ========================================

function setupOtherCheckboxHandlers() {
    // 希望職種の「その他」
    const jobTypeOtherCheckbox = document.getElementById('jobTypeOther');
    const jobTypeOtherTextArea = document.getElementById('jobTypeOtherTextArea');
    
    if (jobTypeOtherCheckbox && jobTypeOtherTextArea) {
        jobTypeOtherCheckbox.addEventListener('change', function() {
            if (this.checked) {
                jobTypeOtherTextArea.style.display = 'block';
                document.getElementById('jobTypeOtherText').focus();
            } else {
                jobTypeOtherTextArea.style.display = 'none';
                document.getElementById('jobTypeOtherText').value = '';
            }
        });
    }
    
    // 登録の目的の「その他」
    const purposeOtherCheckbox = document.getElementById('purposeOther');
    const purposeOtherTextArea = document.getElementById('purposeOtherTextArea');
    
    if (purposeOtherCheckbox && purposeOtherTextArea) {
        purposeOtherCheckbox.addEventListener('change', function() {
            if (this.checked) {
                purposeOtherTextArea.style.display = 'block';
                document.getElementById('purposeOtherText').focus();
            } else {
                purposeOtherTextArea.style.display = 'none';
                document.getElementById('purposeOtherText').value = '';
            }
        });
    }
}

// ========================================
// 個人情報同意チェックボックスの制御
// ========================================

function setupPrivacyConsentHandler() {
    const privacyConsent = document.getElementById('privacyConsent');
    const submitButton = document.getElementById('submitButton');
    
    if (privacyConsent && submitButton) {
        // 初期状態：同意していない場合はボタンを無効化
        submitButton.disabled = !privacyConsent.checked;
        
        privacyConsent.addEventListener('change', function() {
            submitButton.disabled = !this.checked;
            
            if (this.checked) {
                submitButton.style.opacity = '1';
            } else {
                submitButton.style.opacity = '0.5';
            }
        });
    }
}

// ========================================
// フォーム送信処理
// ========================================

function setupFormSubmission() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // バリデーション
            if (!validateForm()) {
                return;
            }
            
            // フォームデータの収集
            const formData = collectFormData();
            
            // データの送信
            submitRegistrationData(formData);
        });
    }
}

// ========================================
// フォームバリデーション
// ========================================

function validateForm() {
    // 必須項目のチェック
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const university = document.getElementById('university').value.trim();
    const workStyle = document.getElementById('workStyle').value;
    const privacyConsent = document.getElementById('privacyConsent').checked;
    
    // 登録の目的（少なくとも1つチェック）
    const purposeCheckboxes = document.querySelectorAll('input[name="purpose"]:checked');
    
    if (!fullName) {
        alert('氏名を入力してください。');
        document.getElementById('fullName').focus();
        return false;
    }
    
    if (!email) {
        alert('メールアドレスを入力してください。');
        document.getElementById('email').focus();
        return false;
    }
    
    // メールアドレスの形式チェック
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('正しいメールアドレスの形式で入力してください。');
        document.getElementById('email').focus();
        return false;
    }
    
    if (!university) {
        alert('ご家族の勤務先大学名を入力してください。');
        document.getElementById('university').focus();
        return false;
    }
    
    if (!workStyle) {
        alert('ご希望の働き方を選択してください。');
        document.getElementById('workStyle').focus();
        return false;
    }
    
    if (purposeCheckboxes.length === 0) {
        alert('登録の目的を少なくとも1つ選択してください。');
        return false;
    }
    
    if (!privacyConsent) {
        alert('個人情報の取り扱いに同意いただく必要があります。');
        document.getElementById('privacyConsent').focus();
        return false;
    }
    
    return true;
}

// ========================================
// フォームデータの収集
// ========================================

function collectFormData() {
    // 基本情報
    const fullName = document.getElementById('fullName').value.trim();
    const furigana = document.getElementById('furigana').value.trim();
    const email = document.getElementById('email').value.trim();
    const ageRange = document.getElementById('ageRange').value;
    const university = document.getElementById('university').value.trim();
    
    // 希望する働き方
    const workStyle = document.getElementById('workStyle').value;
    
    // 希望職種（複数選択）
    const jobTypes = [];
    document.querySelectorAll('input[name="jobType"]:checked').forEach(checkbox => {
        jobTypes.push(checkbox.value);
    });
    const jobTypeOtherText = document.getElementById('jobTypeOtherText').value.trim();
    if (jobTypeOtherText) {
        jobTypes.push(`その他: ${jobTypeOtherText}`);
    }
    
    // 経験・スキル
    const experience = document.getElementById('experience').value.trim();
    
    // 登録の目的（複数選択）
    const purposes = [];
    document.querySelectorAll('input[name="purpose"]:checked').forEach(checkbox => {
        purposes.push(checkbox.value);
    });
    const purposeOtherText = document.getElementById('purposeOtherText').value.trim();
    if (purposeOtherText) {
        purposes.push(`その他: ${purposeOtherText}`);
    }
    
    // 自由記述
    const freeText = document.getElementById('freeText').value.trim();
    
    // 登録日時
    const registrationDate = new Date().toISOString();
    
    return {
        fullName,
        furigana,
        email,
        ageRange,
        university,
        workStyle,
        jobTypes,
        experience,
        purposes,
        freeText,
        registrationDate
    };
}

// ========================================
// 登録データの送信
// ========================================

function submitRegistrationData(formData) {
    // ローディング表示
    const submitButton = document.getElementById('submitButton');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
    submitButton.disabled = true;
    
    // Airtable API の設定
    const AIRTABLE_API_TOKEN = 'patOnPRhiWIQ8HcU5.c40ccad44380653ebe386635bf7a5ac785acec43bf43a5dabd93f005dcbb6a36';
    const AIRTABLE_BASE_ID = 'appb0XRjUEQ8gxO3V';
    const AIRTABLE_TABLE_NAME = 'registrations';
    
    // Airtable APIにデータを送信
    fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fields: {
                fullName: formData.fullName,
                furigana: formData.furigana,
                email: formData.email,
                ageRange: formData.ageRange,
                university: formData.university,
                workStyle: formData.workStyle,
                jobTypes: formData.jobTypes.join(', '),
                skills: formData.experience,
                purposes: formData.purposes.join(', '),
                notes: formData.freeText,
                status: '未対応',
                registeredAt: new Date().toISOString()
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('登録に失敗しました');
        }
        return response.json();
    })
    .then(data => {
        console.log('登録成功:', data);
        
        // ローカルストレージにメールアドレスを保存
        localStorage.setItem('userEmail', formData.email);
        
        // 成功モーダルを表示
        showSuccessModal();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('登録中にエラーが発生しました。もう一度お試しください。\n\nエラー詳細: ' + error.message);
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });
}

// ========================================
// 成功モーダルの表示
// ========================================

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // カウントダウン表示
        let countdown = 3;
        const countdownElement = document.getElementById('countdown');
        
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
        
        // 3秒後に自動的にトップページに戻る
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }
}

// ========================================
// キャンセルボタンの処理
// ========================================

function cancelRegistration() {
    if (confirm('入力内容が失われますが、よろしいですか？')) {
        window.location.href = 'index.html';
    }
}

// ========================================
// ブラウザの戻るボタン対策
// ========================================

window.addEventListener('beforeunload', function(e) {
    const form = document.getElementById('registrationForm');
    
    // フォームに何か入力されている場合のみ警告
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
    let hasValue = false;
    
    inputs.forEach(input => {
        if (input.value.trim() !== '' && input.id !== 'email') {
            hasValue = true;
        }
    });
    
    if (hasValue) {
        e.preventDefault();
        e.returnValue = '入力内容が失われますが、よろしいですか？';
    }
});

// ========================================
// フォーム自動保存機能（オプション）
// ========================================

function setupAutoSave() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            saveFormDataToLocalStorage();
        }, 1000));
    });
    
    restoreFormDataFromLocalStorage();
}

function saveFormDataToLocalStorage() {
    const formData = collectFormData();
    localStorage.setItem('registrationFormDraft', JSON.stringify(formData));
}

function restoreFormDataFromLocalStorage() {
    const savedData = localStorage.getItem('registrationFormDraft');
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        if (confirm('前回入力途中のデータがあります。復元しますか？')) {
            if (formData.fullName) document.getElementById('fullName').value = formData.fullName;
            if (formData.furigana) document.getElementById('furigana').value = formData.furigana;
            if (formData.email) document.getElementById('email').value = formData.email;
            if (formData.ageRange) document.getElementById('ageRange').value = formData.ageRange;
            if (formData.university) document.getElementById('university').value = formData.university;
            if (formData.workStyle) document.getElementById('workStyle').value = formData.workStyle;
            if (formData.experience) document.getElementById('experience').value = formData.experience;
            if (formData.freeText) document.getElementById('freeText').value = formData.freeText;
        } else {
            localStorage.removeItem('registrationFormDraft');
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// setupAutoSave();

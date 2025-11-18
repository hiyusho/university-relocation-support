// =====================================
// 登録フォーム処理
// =====================================

// 大学選択の処理
const universitySelect = document.getElementById('university');
const otherUniversityGroup = document.getElementById('otherUniversityGroup');
const otherUniversityInput = document.getElementById('otherUniversity');

universitySelect.addEventListener('change', function() {
    if (this.value === 'other') {
        otherUniversityGroup.style.display = 'block';
        otherUniversityInput.required = true;
    } else {
        otherUniversityGroup.style.display = 'none';
        otherUniversityInput.required = false;
        otherUniversityInput.value = '';
    }
});

// 利用目的の「その他」選択時の処理
const purposeCheckboxes = document.querySelectorAll('input[name="purpose"]');
const otherPurposeGroup = document.getElementById('otherPurposeGroup');
const otherPurposeTextarea = document.getElementById('otherPurpose');

purposeCheckboxes.forEach(checkbox => {
    if (checkbox.value === 'other') {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                otherPurposeGroup.style.display = 'block';
            } else {
                otherPurposeGroup.style.display = 'none';
                otherPurposeTextarea.value = '';
            }
        });
    }
});

// =====================================
// フォームバリデーション
// =====================================
const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // エラーメッセージをクリア
    clearErrors();
    
    let isValid = true;
    
    // 名前のバリデーション
    const name = document.getElementById('name');
    if (name.value.trim() === '') {
        showError('nameError', 'お名前を入力してください');
        name.classList.add('error');
        isValid = false;
    }
    
    // メールアドレスのバリデーション
    const email = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        showError('emailError', 'メールアドレスを入力してください');
        email.classList.add('error');
        isValid = false;
    } else if (!emailPattern.test(email.value)) {
        showError('emailError', '有効なメールアドレスを入力してください');
        email.classList.add('error');
        isValid = false;
    }
    
    // 電話番号のバリデーション
    const phone = document.getElementById('phone');
    const phonePattern = /^[0-9\-]+$/;
    if (phone.value.trim() === '') {
        showError('phoneError', '電話番号を入力してください');
        phone.classList.add('error');
        isValid = false;
    } else if (!phonePattern.test(phone.value)) {
        showError('phoneError', '有効な電話番号を入力してください（数字とハイフンのみ）');
        phone.classList.add('error');
        isValid = false;
    }
    
    // 所属大学のバリデーション
    const university = document.getElementById('university');
    if (university.value === '') {
        showError('universityError', '所属大学を選択してください');
        university.classList.add('error');
        isValid = false;
    }
    
    // 「その他」選択時の大学名入力チェック
    if (university.value === 'other' && otherUniversityInput.value.trim() === '') {
        showError('universityError', '大学名を入力してください');
        otherUniversityInput.classList.add('error');
        isValid = false;
    }
    
    // 利用目的のバリデーション（1つ以上選択必須）
    const checkedPurposes = document.querySelectorAll('input[name="purpose"]:checked');
    if (checkedPurposes.length === 0) {
        showError('purposeError', '利用目的を1つ以上選択してください');
        isValid = false;
    }
    
    // 「その他」選択時の詳細入力チェック
    const otherPurposeChecked = Array.from(checkedPurposes).some(cb => cb.value === 'other');
    if (otherPurposeChecked && otherPurposeTextarea.value.trim() === '') {
        showError('purposeError', '「その他」を選択した場合は、詳細を入力してください');
        otherPurposeTextarea.classList.add('error');
        isValid = false;
    }
    
    // 個人情報保護方針への同意チェック
    const privacyConsent = document.getElementById('privacyConsent');
    if (!privacyConsent.checked) {
        showError('consentError', '個人情報保護方針に同意していただく必要があります');
        isValid = false;
    }
    
    // バリデーション成功時
    if (isValid) {
        // 成功モーダルを表示
        const successModal = document.getElementById('successModal');
        successModal.style.display = 'block';
        
        // フォームをリセット
        registrationForm.reset();
        otherUniversityGroup.style.display = 'none';
        otherPurposeGroup.style.display = 'none';
    } else {
        // エラーがある場合は最初のエラー位置までスクロール
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// エラーメッセージを表示
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// エラーメッセージをクリア
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
    });
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => {
        input.classList.remove('error');
    });
}

// 入力時にエラースタイルを削除
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});

// =====================================
// メールアドレスの自動入力（デモ用）
// =====================================
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

nameInput.addEventListener('blur', function() {
    // 名前が入力されていて、メールアドレスが空の場合
    if (this.value.trim() !== '' && emailInput.value.trim() === '') {
        // デモ用のメールアドレスを提案（実際には使用しない）
        const suggestion = 'example@email.com';
        emailInput.placeholder = `例: ${suggestion}`;
    }
});
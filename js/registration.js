// 新規登録ページ専用JavaScript - Ver 1.6.0
document.addEventListener('DOMContentLoaded', function() {
    autoFillEmailAddress();
    setupOtherCheckboxHandlers();
    setupFormSubmission();
    setupPrivacyConsentHandler();
});

function autoFillEmailAddress() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    if (email) {
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.value = decodeURIComponent(email);
    }
    const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (storedEmail && !email) {
        const emailInput = document.getElementById('email');
        if (emailInput && !emailInput.value) emailInput.value = storedEmail;
    }
}

function setupOtherCheckboxHandlers() {
    const jobTypeOther = document.getElementById('jobTypeOther');
    const jobTypeOtherTextArea = document.getElementById('jobTypeOtherTextArea');
    if (jobTypeOther && jobTypeOtherTextArea) {
        jobTypeOther.addEventListener('change', function() {
            jobTypeOtherTextArea.style.display = this.checked ? 'block' : 'none';
            if (this.checked) document.getElementById('jobTypeOtherText').focus();
            else document.getElementById('jobTypeOtherText').value = '';
        });
    }
    const purposeOther = document.getElementById('purposeOther');
    const purposeOtherTextArea = document.getElementById('purposeOtherTextArea');
    if (purposeOther && purposeOtherTextArea) {
        purposeOther.addEventListener('change', function() {
            purposeOtherTextArea.style.display = this.checked ? 'block' : 'none';
            if (this.checked) document.getElementById('purposeOtherText').focus();
            else document.getElementById('purposeOtherText').value = '';
        });
    }
}

function setupPrivacyConsentHandler() {
    const privacyConsent = document.getElementById('privacyConsent');
    const submitButton = document.getElementById('submitButton');
    if (privacyConsent && submitButton) {
        submitButton.disabled = !privacyConsent.checked;
        privacyConsent.addEventListener('change', function() {
            submitButton.disabled = !this.checked;
            submitButton.style.opacity = this.checked ? '1' : '0.5';
        });
    }
}

function setupFormSubmission() {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) submitRegistrationData(collectFormData());
        });
    }
}

function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const university = document.getElementById('university').value.trim();
    const workStyle = document.getElementById('workStyle').value;
    const privacyConsent = document.getElementById('privacyConsent').checked;
    const purposes = document.querySelectorAll('input[name="purpose"]:checked');
    
    if (!fullName) { alert('氏名を入力してください。'); document.getElementById('fullName').focus(); return false; }
    if (!email) { alert('メールアドレスを入力してください。'); document.getElementById('email').focus(); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('正しいメールアドレスの形式で入力してください。'); document.getElementById('email').focus(); return false; }
    if (!university) { alert('ご家族の勤務先大学名を入力してください。'); document.getElementById('university').focus(); return false; }
    if (!workStyle) { alert('ご希望の働き方を選択してください。'); document.getElementById('workStyle').focus(); return false; }
    if (purposes.length === 0) { alert('登録の目的を少なくとも1つ選択してください。'); return false; }
    if (!privacyConsent) { alert('個人情報の取り扱いに同意いただく必要があります。'); document.getElementById('privacyConsent').focus(); return false; }
    return true;
}

function collectFormData() {
    const jobTypes = [];
    document.querySelectorAll('input[name="jobType"]:checked').forEach(cb => jobTypes.push(cb.value));
    const jobTypeOtherText = document.getElementById('jobTypeOtherText').value.trim();
    if (jobTypeOtherText) jobTypes.push('その他: ' + jobTypeOtherText);
    
    const purposes = [];
    document.querySelectorAll('input[name="purpose"]:checked').forEach(cb => purposes.push(cb.value));
    const purposeOtherText = document.getElementById('purposeOtherText').value.trim();
    if (purposeOtherText) purposes.push('その他: ' + purposeOtherText);
    
    return {
        fullName: document.getElementById('fullName').value.trim(),
        furigana: document.getElementById('furigana').value.trim(),
        email: document.getElementById('email').value.trim(),
        ageRange: document.getElementById('ageRange').value,
        university: document.getElementById('university').value.trim(),
        workStyle: document.getElementById('workStyle').value,
        jobTypes, experience: document.getElementById('experience').value.trim(),
        purposes, freeText: document.getElementById('freeText').value.trim()
    };
}

function submitRegistrationData(formData) {
    const submitButton = document.getElementById('submitButton');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
    submitButton.disabled = true;
    
    const registeredDate = new Date().toISOString().split('T')[0];
    
    fetch('https://api.airtable.com/v0/appb0XRjUEQ8gxO3V/registrations', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer pataECeibUMhylsQP.3fcc0bdf4b8788e71c1df522773af3c3cfc15ae562fbb107d6e4829eb595268c',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
                fullName: formData.fullName,
                furigana: formData.furigana || '',
                email: formData.email,
                ageRange: formData.ageRange || '',
                university: formData.university,
                workStyle: formData.workStyle,
                jobTypes: formData.jobTypes.join(', '),
                skills: formData.experience || '',
                purposes: formData.purposes.join(', '),
                notes: formData.freeText || '',
                status: '未対応',
                registeredAt: registeredDate
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                console.error('API Error:', err);
                throw new Error(err.error?.message || '登録に失敗しました');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('登録成功:', data);
        localStorage.setItem('userEmail', formData.email);
        showSuccessModal();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('登録中にエラーが発生しました。もう一度お試しください。\n\nエラー詳細: ' + error.message);
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        let countdown = 3;
        const countdownElement = document.getElementById('countdown');
        const interval = setInterval(() => {
            countdown--;
            if (countdownElement) countdownElement.textContent = countdown;
            if (countdown <= 0) clearInterval(interval);
        }, 1000);
        setTimeout(() => { window.location.href = 'index.html'; }, 3000);
    }
}

function cancelRegistration() {
    if (confirm('入力内容が失われますが、よろしいですか?')) window.location.href = 'index.html';
}

window.addEventListener('beforeunload', function(e) {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
    let hasValue = false;
    inputs.forEach(input => {
        if (input.value.trim() !== '' && input.id !== 'email') hasValue = true;
    });
    if (hasValue) {
        e.preventDefault();
        e.returnValue = '入力内容が失われますが、よろしいですか?';
    }
});

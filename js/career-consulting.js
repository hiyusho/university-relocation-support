// キャリアコンサルティング申し込みフォーム - Ver 1.6.0
// 新しいPersonal Access Token適用済み

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('careerConsultingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitConsultation();
        });
    }
});

function submitConsultation() {
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
    
    const topics = [];
    document.querySelectorAll('input[name="topic"]:checked').forEach(cb => topics.push(cb.value));
    
    const requestData = {
        fields: {
            id: 'CC-' + Date.now(),
            fullName: document.getElementById('fullName').value.trim(),
            furigana: document.getElementById('furigana').value.trim() || '',
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            university: document.getElementById('university').value,
            topics: topics,
            details: document.getElementById('details').value.trim() || '',
            preferredDate1: document.getElementById('preferredDate1').value || '',
            preferredDate2: document.getElementById('preferredDate2').value || '',
            preferredDate3: document.getElementById('preferredDate3').value || '',
            status: '申し込み受付',
            submittedAt: new Date().toISOString().split('T')[0]
        }
    };
    
    fetch('https://api.airtable.com/v0/appb0XRjUEQ8gxO3V/carrer_consultations', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer pataECeibUMhylsQP.3fcc0bdf4b8788e71c1df522773af3c3cfc15ae562fbb107d6e4829eb595268c',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                console.error('API Error:', err);
                throw new Error(err.error?.message || '申し込みに失敗しました');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('申し込み成功:', data);
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('申し込み中にエラーが発生しました。もう一度お試しください。\n\nエラー詳細: ' + error.message);
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    });
}

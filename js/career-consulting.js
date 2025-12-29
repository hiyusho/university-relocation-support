// キャリアコンサルティング申し込みフォーム - Ver 1.7.0 (完全修正版)
// エラーハンドリングと要素チェックを強化

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
    console.log('送信処理を開始します...');
    
    // 送信ボタンを探す（複数の可能性を考慮）
    const submitButton = document.querySelector('button[type="submit"]') || 
                        document.getElementById('submitButton') ||
                        document.querySelector('.submit-button');
    
    if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
    }
    
    // トピックを収集（name="topics"を使用）
    const topics = [];
    document.querySelectorAll('input[name="topics"]:checked').forEach(cb => {
        topics.push(cb.value);
    });
    
    console.log('選択されたトピック:', topics);
    
    // フィールドデータを準備
    const fields = {
        id: 'CC-' + Date.now(),
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        university: document.getElementById('university').value,
        topics: topics,
        status: '申し込み受付',
        submittedAt: new Date().toISOString().split('T')[0]
    };
    
    // オプションフィールド
    const furigana = document.getElementById('furigana')?.value.trim();
    if (furigana) fields.furigana = furigana;
    
    const phone = document.getElementById('phone')?.value.trim();
    if (phone) fields.phone = phone;
    
    const details = document.getElementById('details')?.value.trim();
    if (details) fields.details = details;
    
    const preferredDate1 = document.getElementById('preferredDate1')?.value;
    if (preferredDate1) fields.preferredDate1 = preferredDate1.replace('T', ' ');
    
    const preferredDate2 = document.getElementById('preferredDate2')?.value;
    if (preferredDate2) fields.preferredDate2 = preferredDate2.replace('T', ' ');
    
    const preferredDate3 = document.getElementById('preferredDate3')?.value;
    if (preferredDate3) fields.preferredDate3 = preferredDate3.replace('T', ' ');
    
    console.log('送信データ:', fields);
    
    const requestData = { fields: fields };
    
    fetch('https://api.airtable.com/v0/appb0XRjUEQ8gxO3V/carrer_consultations', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer pataECeibUMhylsQP.3fcc0bdf4b8788e71c1df522773af3c3cfc15ae562fbb107d6e4829eb595268c',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        console.log('API Response status:', response.status);
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
        
        // 成功メッセージを表示
        alert('✅ 申し込みできました!\n\n担当者より2営業日以内にご連絡いたします。\n3秒後にトップページへ移動します。');
        
        // 3秒後にトップページへ遷移
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ 申し込み中にエラーが発生しました。\n\nもう一度お試しください。\n\nエラー詳細: ' + error.message);
        
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

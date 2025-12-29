// キャリアコンサルティング申し込みフォーム - Ver 1.9.0 (日付フィールド修正版)
// Airtable date型に対応 (YYYY-MM-DD形式のみ)

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: ページ読み込み完了');
    
    const form = document.getElementById('careerConsultingForm');
    if (form) {
        console.log('✓ フォーム要素を検出しました');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('フォーム送信イベントをキャッチしました');
            submitConsultation();
        });
    } else {
        console.error('✗ フォーム要素が見つかりません: #careerConsultingForm');
    }
});

function submitConsultation() {
    console.log('=== 送信処理を開始します ===');
    
    // 送信ボタンを探す
    const submitButton = document.querySelector('button[type="submit"]') || 
                        document.getElementById('submitButton') ||
                        document.querySelector('.submit-button');
    
    let originalText = '';
    if (submitButton) {
        originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
        console.log('✓ 送信ボタンを無効化しました');
    } else {
        console.warn('⚠ 送信ボタンが見つかりません');
    }
    
    // トピックを収集
    const topics = [];
    document.querySelectorAll('input[name="topics"]:checked').forEach(cb => {
        topics.push(cb.value);
    });
    console.log('選択されたトピック:', topics);
    
    if (topics.length === 0) {
        alert('相談したい内容を少なくとも1つ選択してください。');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
        return;
    }
    
    // 必須フィールドの取得と検証
    const fullNameEl = document.getElementById('fullName');
    const emailEl = document.getElementById('email');
    const universityEl = document.getElementById('university');
    
    console.log('フォーム要素の検出状況:');
    console.log('- fullName:', fullNameEl ? '✓' : '✗');
    console.log('- email:', emailEl ? '✓' : '✗');
    console.log('- university:', universityEl ? '✓' : '✗');
    
    if (!fullNameEl || !emailEl || !universityEl) {
        console.error('必須フィールドが見つかりません');
        alert('フォームの読み込みに失敗しました。ページを再読み込みしてください。');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
        return;
    }
    
    const fullName = fullNameEl.value.trim();
    const email = emailEl.value.trim();
    const university = universityEl.value;
    
    if (!fullName || !email || !university) {
        alert('必須項目を入力してください。');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
        return;
    }
    
    // フィールドデータを準備
    const fields = {
        id: 'CC-' + Date.now(),
        fullName: fullName,
        email: email,
        university: university,
        topics: topics,
        status: '申し込み受付',
        submittedAt: new Date().toISOString().split('T')[0]
    };
    
    // オプションフィールド
    const furiganaEl = document.getElementById('furigana');
    if (furiganaEl && furiganaEl.value.trim()) {
        fields.furigana = furiganaEl.value.trim();
    }
    
    const phoneEl = document.getElementById('phone');
    if (phoneEl && phoneEl.value.trim()) {
        fields.phone = phoneEl.value.trim();
    }
    
    const detailsEl = document.getElementById('details');
    if (detailsEl && detailsEl.value && detailsEl.value.trim()) {
        fields.details = detailsEl.value.trim();
    }
    
    // 日付フィールド - YYYY-MM-DD形式のみ送信 (時刻は含めない)
    const preferredDate1El = document.getElementById('preferredDate1');
    if (preferredDate1El && preferredDate1El.value) {
        // datetime-local の値は "2025-12-30T14:00" 形式なので、日付部分だけを抽出
        fields.preferredDate1 = preferredDate1El.value.split('T')[0];
        console.log('preferredDate1:', fields.preferredDate1);
    }
    
    const preferredDate2El = document.getElementById('preferredDate2');
    if (preferredDate2El && preferredDate2El.value) {
        fields.preferredDate2 = preferredDate2El.value.split('T')[0];
        console.log('preferredDate2:', fields.preferredDate2);
    }
    
    const preferredDate3El = document.getElementById('preferredDate3');
    if (preferredDate3El && preferredDate3El.value) {
        fields.preferredDate3 = preferredDate3El.value.split('T')[0];
        console.log('preferredDate3:', fields.preferredDate3);
    }
    
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
        console.log('✓ 申し込み成功:', data);
        
        // 成功メッセージを表示
        alert('✅ お申し込みありがとうございます!\n\n担当者より2営業日以内にご連絡いたします。\n\n3秒後にトップページへ移動します。');
        
        // 3秒後にトップページへ遷移
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    })
    .catch(error => {
        console.error('✗ Error:', error);
        alert('❌ 申し込み中にエラーが発生しました。\n\nもう一度お試しください。\n\nエラー詳細: ' + error.message);
        
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

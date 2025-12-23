// ========================================
// 大学赴任者家族帯同支援プログラム - メインJavaScript
// ========================================

// ========================================
// グローバル関数: モーダル管理
// ========================================

// 登録モーダルを表示
function showRegistrationModal() {
    const modalHTML = `
        <div class="modal-overlay" id="registrationModal" style="display: flex;">
            <div class="modal-content modal-large">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>新規登録</h2>
                <p class="modal-description">キャリアカウンセリングや就職支援などのサポートを受けるための登録フォームです。</p>
                
                <!-- セキュリティ通知 -->
                <div style="background: #E8F5E9; padding: 12px 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #4CAF50; font-size: 14px;">
                    <p style="margin: 0; line-height: 1.6;">
                        <i class="fas fa-lock" style="color: #4CAF50; margin-right: 8px;"></i>
                        <strong>安全な通信:</strong> このフォームはSSL/TLS暗号化通信で保護されています。ご入力いただく情報は安全に送信されます。
                    </p>
                </div>
                
                <!-- データ最小化の方針 -->
                <div style="background: #FFF9E6; padding: 12px 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #FFA000; font-size: 14px;">
                    <p style="margin: 0; line-height: 1.6;">
                        <i class="fas fa-info-circle" style="color: #FF6F00; margin-right: 8px;"></i>
                        <strong>データ最小化の方針:</strong> <span style="color: #D32F2F;">*</span>印の項目のみ必須です。その他の項目は、より適切なサポートを提供するための参考情報としてご活用いたします。
                    </p>
                </div>
                
                <form class="registration-form" id="registrationForm">
                    <!-- 氏名（必須） -->
                    <div class="form-group">
                        <label>氏名 <span class="required">*</span></label>
                        <input type="text" name="name" required placeholder="山田 太郎">
                    </div>
                    
                    <!-- フリガナ（任意） -->
                    <div class="form-group">
                        <label>フリガナ</label>
                        <input type="text" name="furigana" placeholder="ヤマダ タロウ">
                    </div>
                    
                    <!-- メールアドレス（必須） -->
                    <div class="form-group">
                        <label>メールアドレス <span class="required">*</span></label>
                        <input type="email" name="email" required placeholder="example@university.ac.jp">
                    </div>
                    
                    <!-- 年代（任意） -->
                    <div class="form-group">
                        <label>年代</label>
                        <select name="age_group">
                            <option value="">選択してください</option>
                            <option value="20代">20代</option>
                            <option value="30代">30代</option>
                            <option value="40代">40代</option>
                            <option value="50代">50代</option>
                            <option value="60代以上">60代以上</option>
                        </select>
                    </div>
                    
                    <!-- ご家族の勤務先大学名（必須） -->
                    <div class="form-group">
                        <label>ご家族の勤務先大学名 <span class="required">*</span></label>
                        <input type="text" name="family_university" required placeholder="例：名古屋大学">
                    </div>
                    
                    <!-- ご希望の働き方（必須） -->
                    <div class="form-group">
                        <label>ご希望の働き方 <span class="required">*</span></label>
                        <select name="work_style" required>
                            <option value="">選択してください</option>
                            <option value="フルタイム">フルタイム</option>
                            <option value="パートタイム">パートタイム</option>
                            <option value="在宅中心">在宅中心</option>
                            <option value="フレキシブルな働き方">フレキシブルな働き方</option>
                            <option value="まだ決まっていない">まだ決まっていない</option>
                        </select>
                    </div>
                    
                    <!-- 希望職種（複数選択可） -->
                    <div class="form-group">
                        <label>希望職種（複数選択可）</label>
                        <div class="checkbox-group-multiple">
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="事務"> 事務
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="研究支援"> 研究支援
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="IT"> IT
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="教育"> 教育
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="営業"> 営業
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="販売・接客"> 販売・接客
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="医療・福祉"> 医療・福祉
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="デザイン・クリエイティブ"> デザイン・クリエイティブ
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="公的機関・NPO"> 公的機関・NPO
                            </label>
                            <label class="checkbox-label-inline">
                                <input type="checkbox" name="job_types" value="その他" id="jobTypeOther"> その他
                            </label>
                        </div>
                        <input type="text" name="job_types_other" id="jobTypeOtherText" placeholder="その他の職種をご記入ください" style="display:none; margin-top:10px;">
                    </div>
                    
                    <!-- 経験・スキル（任意） -->
                    <div class="form-group">
                        <label>経験・スキル</label>
                        <p class="field-description">これまでのご経験・得意分野・資格などをご記入ください</p>
                        <textarea name="skills_experience" rows="5" placeholder="例：事務経験5年、Excel・Word得意、簿記2級保有"></textarea>
                    </div>
                    
                    <!-- 登録の目的（必須） -->
                    <div class="form-group">
                        <label>登録の目的 <span class="required">*</span></label>
                        <select name="purpose" id="purposeSelect" required>
                            <option value="">選択してください</option>
                            <option value="仕事を見つけたい">仕事を見つけたい</option>
                            <option value="スキルアップしたい">スキルアップしたい</option>
                            <option value="キャリア相談を受けたい">キャリア相談を受けたい</option>
                            <option value="コミュニティに参加したい">コミュニティに参加したい</option>
                            <option value="起業に興味がある">起業に興味がある</option>
                            <option value="その他">その他</option>
                        </select>
                        <input type="text" name="purpose_other" id="purposeOtherText" placeholder="その他の目的をご記入ください" style="display:none; margin-top:10px;">
                    </div>
                    
                    <!-- 自由記述（任意） -->
                    <div class="form-group">
                        <label>自由記述</label>
                        <p class="field-description">名古屋での暮らしやキャリアについて、希望することがあればご記入ください。</p>
                        <textarea name="free_comment" rows="4" placeholder="ご自由にお書きください"></textarea>
                    </div>
                    
                    <!-- 個人情報の取り扱いへの同意（必須） -->
                    <div style="background: #F5F5F5; padding: 20px; border-radius: 8px; margin-top: 30px; border: 2px solid #4A90E2;">
                        <h3 style="margin-top: 0; color: #4A90E2; font-size: 16px;">
                            <i class="fas fa-shield-alt"></i> 個人情報の取り扱いについて
                        </h3>
                        <div style="max-height: 150px; overflow-y: auto; background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px; font-size: 13px; line-height: 1.7;">
                            <p><strong>【取得する情報】</strong></p>
                            <ul style="margin: 5px 0 15px 20px;">
                                <li>氏名、メールアドレス、ご家族の勤務先大学名、希望の働き方、登録の目的（必須項目）</li>
                                <li>フリガナ、年代、希望職種、経験・スキル、自由記述（任意項目）</li>
                            </ul>
                            <p><strong>【利用目的】</strong></p>
                            <ul style="margin: 5px 0 15px 20px;">
                                <li>キャリアカウンセリング、就職支援情報の提供</li>
                                <li>スキルアップ支援、交流イベントのご案内</li>
                                <li>※当プログラムは職業紹介事業者ではなく、情報提供・サポートを行います</li>
                            </ul>
                            <p><strong>【第三者提供】</strong></p>
                            <ul style="margin: 5px 0 15px 20px;">
                                <li>協力企業への情報提供は、カウンセリング後にご本人の事前同意を得た場合のみ行います</li>
                            </ul>
                            <p><strong>【保存期間】</strong></p>
                            <ul style="margin: 5px 0 15px 20px;">
                                <li>登録日から3年間（法令で定められた保存期間を考慮）</li>
                            </ul>
                            <p style="margin-top: 10px;">
                                <a href="privacy.html" target="_blank" style="color: #4A90E2; text-decoration: underline;">
                                    <i class="fas fa-external-link-alt"></i> 個人情報保護方針の詳細を確認する
                                </a>
                            </p>
                        </div>
                        <div class="form-group checkbox-group" style="margin-bottom: 0;">
                            <label class="checkbox-label" style="display: flex; align-items: flex-start;">
                                <input type="checkbox" name="agreement" required style="margin-top: 3px;">
                                <span style="margin-left: 10px; line-height: 1.6;">
                                    上記の個人情報の取り扱いについて確認し、同意します <span class="required">*</span>
                                </span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- ボタン -->
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn" onclick="closeModal()">
                            <i class="fas fa-times"></i> キャンセル
                        </button>
                        <button type="submit" class="submit-btn">
                            <i class="fas fa-paper-plane"></i> 登録
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // モーダルが既に存在する場合は削除
    const existingModal = document.getElementById('registrationModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // フォームの動的制御を初期化
    setTimeout(initializeRegistrationForm, 100);
}

// 登録フォームの動的制御を初期化
function initializeRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    // 「その他」チェックボックスの制御（希望職種）
    const jobTypeOtherCheckbox = document.getElementById('jobTypeOther');
    const jobTypeOtherText = document.getElementById('jobTypeOtherText');
    
    if (jobTypeOtherCheckbox && jobTypeOtherText) {
        jobTypeOtherCheckbox.addEventListener('change', function() {
            jobTypeOtherText.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                jobTypeOtherText.value = '';
            }
        });
    }
    
    // 「その他」選択の制御（登録の目的）
    const purposeSelect = document.getElementById('purposeSelect');
    const purposeOtherText = document.getElementById('purposeOtherText');
    
    if (purposeSelect && purposeOtherText) {
        purposeSelect.addEventListener('change', function() {
            purposeOtherText.style.display = this.value === 'その他' ? 'block' : 'none';
            if (this.value !== 'その他') {
                purposeOtherText.value = '';
            }
        });
    }
    
    // フォーム送信処理
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // ボタンを無効化して二重送信を防止
        const submitBtn = form.querySelector('.submit-btn');
        const cancelBtn = form.querySelector('.cancel-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        cancelBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
        
        try {
            // フォームデータを取得
            const formData = new FormData(form);
            
            // 希望職種の複数選択を配列に変換
            const jobTypes = [];
            document.querySelectorAll('input[name="job_types"]:checked').forEach(checkbox => {
                jobTypes.push(checkbox.value);
            });
            
            // データオブジェクトを作成
            const data = {
                name: formData.get('name'),
                furigana: formData.get('furigana') || '',
                email: formData.get('email'),
                age_group: formData.get('age_group') || '',
                family_university: formData.get('family_university'),
                work_style: formData.get('work_style'),
                job_types: jobTypes,
                job_types_other: formData.get('job_types_other') || '',
                skills_experience: formData.get('skills_experience') || '',
                purpose: formData.get('purpose'),
                purpose_other: formData.get('purpose_other') || '',
                free_comment: formData.get('free_comment') || '',
                agreement: formData.get('agreement') ? true : false,
                registration_date: Date.now(),
                status: '未対応'
            };
            
            // データベースに保存
            const response = await fetch('tables/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert('✅ 登録が完了しました！\n\nご登録ありがとうございます。\n担当者より3営業日以内にご連絡いたします。\n\n登録内容の確認メールを送信いたしました。');
                closeModal();
            } else {
                throw new Error('登録に失敗しました');
            }
        } catch (error) {
            console.error('登録エラー:', error);
            alert('⚠️ 登録中にエラーが発生しました。\n\nお手数ですが、以下をご確認ください：\n・インターネット接続\n・必須項目の入力\n\nそれでも解決しない場合は、しばらくしてから再度お試しください。');
            submitBtn.disabled = false;
            cancelBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// 登録モーダルを閉じる
function closeModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// ログインモーダルを開く
function openLoginModal() {
    const existingModal = document.getElementById('loginModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const loginModalHTML = `
        <div class="modal-overlay" id="loginModal" style="display: flex;">
            <div class="modal-content">
                <button class="modal-close" onclick="closeLoginModal()">&times;</button>
                <h2>ログイン</h2>
                <p class="modal-description">登録済みの方はこちらからログインしてください。</p>
                
                <form class="registration-form" id="loginForm">
                    <div class="form-group">
                        <label>メールアドレス <span class="required">*</span></label>
                        <input type="email" name="email" required placeholder="example@university.ac.jp">
                    </div>
                    
                    <div class="form-group">
                        <label>パスワード <span class="required">*</span></label>
                        <input type="password" name="password" required placeholder="パスワードを入力">
                    </div>
                    
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn" onclick="closeLoginModal()">
                            <i class="fas fa-times"></i> キャンセル
                        </button>
                        <button type="submit" class="submit-btn">
                            <i class="fas fa-sign-in-alt"></i> ログイン
                        </button>
                    </div>
                </form>
                
                <p class="register-link" style="text-align: center; margin-top: 20px;">アカウントをお持ちでない方は <a href="#" onclick="closeLoginModal(); showRegistrationModal(); return false;">こちら</a></p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loginModalHTML);
    document.body.style.overflow = 'hidden';
    
    // ログインフォームの送信処理
    setTimeout(() => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('ログイン機能は準備中です。\n登録済みの方は、メールでお問い合わせください。');
            });
        }
    }, 100);
}

// ログインモーダルを閉じる
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// 地域選択モーダルを表示
function showRegionModal() {
    const modalHTML = `
        <div class="region-modal-overlay" id="regionModal" style="display: flex;">
            <div class="region-modal-content">
                <button class="region-modal-close" onclick="closeRegionModal()">&times;</button>
                
                <div class="region-modal-header">
                    <h2><i class="fas fa-map-marked-alt"></i> 住む場所を選ぶ</h2>
                    <p>名古屋地域は4つのエリアに分かれています。<br>各地域の特徴をご確認の上、お好みのエリアを選択してください。</p>
                </div>
                
                <div class="region-grid">
                    <!-- 名古屋市 -->
                    <div class="region-card" data-region="nagoya" onclick="navigateToRegion('nagoya-city.html')">
                        <div class="region-icon">
                            <i class="fas fa-city"></i>
                        </div>
                        <h3>名古屋市</h3>
                        <p>都市機能と自然が調和した中核都市。大学や研究機関が集中し、交通アクセスも抜群。</p>
                        <span class="region-badge">おすすめ</span>
                    </div>
                    
                    <!-- 尾張地区 -->
                    <div class="region-card" data-region="owari" onclick="navigateToRegion('owari.html')">
                        <div class="region-icon">
                            <i class="fas fa-torii-gate"></i>
                        </div>
                        <h3>尾張地区</h3>
                        <p>歴史と文化が息づくエリア。織田信長ゆかりの地として知られ、住環境が充実。</p>
                        <span class="region-badge">準備中</span>
                    </div>
                    
                    <!-- 西三河地区 -->
                    <div class="region-card" data-region="nishi-mikawa" onclick="navigateToRegion('nishi-mikawa.html')">
                        <div class="region-icon">
                            <i class="fas fa-industry"></i>
                        </div>
                        <h3>西三河地区</h3>
                        <p>自動車産業の中心地。製造業やエンジニアリング企業が多く、雇用機会が豊富。</p>
                        <span class="region-badge">準備中</span>
                    </div>
                    
                    <!-- 東三河地区 -->
                    <div class="region-card" data-region="higashi-mikawa" onclick="navigateToRegion('higashi-mikawa.html')">
                        <div class="region-icon">
                            <i class="fas fa-water"></i>
                        </div>
                        <h3>東三河地区</h3>
                        <p>豊かな自然と温暖な気候。豊橋市を中心に、ゆとりある生活環境が整っています。</p>
                        <span class="region-badge">準備中</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // モーダルが既に存在する場合は削除
    const existingModal = document.getElementById('regionModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

// 地域選択モーダルを閉じる
function closeRegionModal() {
    const modal = document.getElementById('regionModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// 地域ページへ移動
function navigateToRegion(url) {
    window.location.href = url;
}

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeLoginModal();
        closeRegionModal();
    }
});

// モーダル外クリックで閉じる
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('region-modal-overlay')) {
        if (e.target.id === 'registrationModal') {
            closeModal();
        } else if (e.target.id === 'loginModal') {
            closeLoginModal();
        } else if (e.target.id === 'regionModal') {
            closeRegionModal();
        }
    }
});

// DOMContentLoaded後の初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('大学赴任者家族帯同支援プログラム - システム初期化完了');
    
    // サブメニューのクリック展開機能
    const parentNavItems = document.querySelectorAll('.nav-item-parent');
    
    parentNavItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                // ハッシュリンクの場合のみデフォルト動作を防止
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                }
                
                // 現在のアイテムの展開状態を切り替え
                item.classList.toggle('active');
                
                // 他のサブメニューを閉じる（オプション）
                parentNavItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
});

/**
 * 拡張版 Web Speech API 読み上げ機能
 * - 音声選択機能
 * - リアルタイムハイライト
 * - ブックマーク機能
 */

class SpeechReader {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPaused = false;
        this.isReading = false;
        this.rate = 1.0;
        this.currentVoiceIndex = 0;
        
        // コンテンツ管理
        this.paragraphs = [];
        this.currentParagraphIndex = 0;
        this.currentCharIndex = 0;
        
        // ハイライト管理
        this.highlightEnabled = true;
        this.originalStyles = new Map();
        
        // ブックマーク管理
        this.bookmarkKey = 'speech-reader-bookmark';
        
        // 音声リスト
        this.voices = [];
        this.japaneseVoices = [];
        this.loadVoices();
        
        // 音声リスト変更イベント
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }
    
    /**
     * 利用可能な音声をロード
     */
    loadVoices() {
        this.voices = this.synth.getVoices();
        
        // 日本語音声のみをフィルタリング
        this.japaneseVoices = this.voices.filter(voice => 
            voice.lang.startsWith('ja')
        );
        
        // 音声選択UIを更新
        this.updateVoiceSelector();
        
        console.log(`利用可能な日本語音声: ${this.japaneseVoices.length}個`);
    }
    
    /**
     * 音声選択UIを更新
     */
    updateVoiceSelector() {
        const selector = document.getElementById('speech-voice-selector');
        if (!selector || this.japaneseVoices.length === 0) return;
        
        selector.innerHTML = '';
        
        this.japaneseVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = voice.name;
            if (index === this.currentVoiceIndex) {
                option.selected = true;
            }
            selector.appendChild(option);
        });
    }
    
    /**
     * 音声を変更
     */
    changeVoice(index) {
        this.currentVoiceIndex = parseInt(index);
        
        // 読み上げ中の場合は再スタート
        if (this.isReading) {
            const wasPlaying = !this.isPaused;
            const currentIndex = this.currentParagraphIndex;
            this.stop();
            if (wasPlaying) {
                this.readFromParagraph(currentIndex);
            }
        }
    }
    
    /**
     * 要素からrubyタグを考慮してテキストを取得
     */
    getReadableText(element) {
        const clone = element.cloneNode(true);
        
        // rubyタグを処理：読み仮名（rt）を使用し、漢字は削除
        const rubyElements = clone.querySelectorAll('ruby');
        rubyElements.forEach(ruby => {
            const rt = ruby.querySelector('rt');
            if (rt) {
                // 読み仮名だけを残す
                ruby.replaceWith(document.createTextNode(rt.textContent));
            } else {
                // rtがない場合は元のテキストを使用
                ruby.replaceWith(document.createTextNode(ruby.textContent));
            }
        });
        
        return clone.textContent.trim();
    }
    
    /**
     * ページのメインコンテンツを段落単位で取得
     */
    getPageParagraphs() {
        const paragraphs = [];
        
        // ストーリーページの場合
        const storyMain = document.querySelector('.story-main');
        if (storyMain) {
            // タイトル
            const title = document.querySelector('.story-title');
            if (title) {
                paragraphs.push({
                    element: title,
                    text: this.getReadableText(title)
                });
            }
            
            const subtitle = document.querySelector('.story-subtitle');
            if (subtitle) {
                paragraphs.push({
                    element: subtitle,
                    text: this.getReadableText(subtitle)
                });
            }
            
            // イントロダクション
            const introText = document.querySelector('.intro-text');
            if (introText) {
                const introParagraphs = introText.querySelectorAll('p');
                introParagraphs.forEach(p => {
                    const text = this.getReadableText(p);
                    if (text.length > 10) {
                        paragraphs.push({
                            element: p,
                            text: text
                        });
                    }
                });
            }
            
            // タイムラインアイテム
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                const time = item.querySelector('.time-text');
                const heading = item.querySelector('h3');
                const contentParagraphs = item.querySelectorAll('.timeline-content > p');
                const blockquote = item.querySelector('blockquote');
                
                if (time) {
                    paragraphs.push({
                        element: time,
                        text: this.getReadableText(time)
                    });
                }
                
                if (heading) {
                    paragraphs.push({
                        element: heading,
                        text: this.getReadableText(heading)
                    });
                }
                
                contentParagraphs.forEach(p => {
                    const text = this.getReadableText(p);
                    if (text.length > 10) {
                        paragraphs.push({
                            element: p,
                            text: text
                        });
                    }
                });
                
                if (blockquote) {
                    paragraphs.push({
                        element: blockquote,
                        text: this.getReadableText(blockquote)
                    });
                }
            });
            
            // まとめ
            const conclusion = document.querySelector('.conclusion-box');
            if (conclusion) {
                const conclusionElements = conclusion.querySelectorAll('p, blockquote, h2');
                conclusionElements.forEach(el => {
                    const text = this.getReadableText(el);
                    if (text.length > 10) {
                        paragraphs.push({
                            element: el,
                            text: text
                        });
                    }
                });
            }
            
            return paragraphs;
        }
        
        // 通常ページの場合（index.html等）
        const mainContentArea = document.querySelector('.main-content');
        if (mainContentArea) {
            // ヒーローセクション
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                paragraphs.push({
                    element: heroTitle,
                    text: this.getReadableText(heroTitle)
                });
            }
            
            // セクションごとにテキストを取得
            const sections = mainContentArea.querySelectorAll('section');
            sections.forEach(section => {
                const sectionTitle = section.querySelector('.section-title, h2, h3');
                if (sectionTitle) {
                    paragraphs.push({
                        element: sectionTitle,
                        text: this.getReadableText(sectionTitle)
                    });
                }
                
                const sectionParagraphs = section.querySelectorAll('p:not(.video-placeholder p)');
                sectionParagraphs.forEach(p => {
                    const text = this.getReadableText(p);
                    if (text.length > 10) {
                        paragraphs.push({
                            element: p,
                            text: text
                        });
                    }
                });
            });
        }
        
        return paragraphs;
    }
    
    /**
     * ページ全体を読み上げ
     */
    readPage() {
        this.paragraphs = this.getPageParagraphs();
        
        if (this.paragraphs.length === 0) {
            alert('読み上げるテキストが見つかりませんでした。');
            return;
        }
        
        this.currentParagraphIndex = 0;
        this.readFromParagraph(0);
    }
    
    /**
     * 指定した段落から読み上げ開始
     */
    readFromParagraph(index) {
        if (index >= this.paragraphs.length) {
            this.onReadingComplete();
            return;
        }
        
        this.currentParagraphIndex = index;
        const paragraph = this.paragraphs[index];
        
        // ハイライト表示
        if (this.highlightEnabled) {
            this.highlightParagraph(paragraph.element);
        }
        
        // 読み上げ設定
        this.utterance = new SpeechSynthesisUtterance(paragraph.text);
        
        // 音声設定
        if (this.japaneseVoices.length > 0 && this.currentVoiceIndex < this.japaneseVoices.length) {
            this.utterance.voice = this.japaneseVoices[this.currentVoiceIndex];
        }
        this.utterance.lang = 'ja-JP';
        this.utterance.rate = this.rate;
        this.utterance.pitch = 1.0;
        this.utterance.volume = 1.0;
        
        // イベントリスナー
        this.utterance.onstart = () => {
            this.isReading = true;
            this.isPaused = false;
            this.updateUI();
        };
        
        this.utterance.onend = () => {
            // 次の段落へ
            this.readFromParagraph(this.currentParagraphIndex + 1);
        };
        
        this.utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.stop();
        };
        
        // 読み上げ開始
        this.synth.speak(this.utterance);
    }
    
    /**
     * 段落をハイライト
     */
    highlightParagraph(element) {
        // 前のハイライトを削除
        this.removeAllHighlights();
        
        if (!element) return;
        
        // 元のスタイルを保存
        this.originalStyles.set(element, {
            backgroundColor: element.style.backgroundColor,
            transition: element.style.transition,
            outline: element.style.outline
        });
        
        // ハイライトを適用
        element.style.transition = 'all 0.3s ease';
        element.style.backgroundColor = '#fff9e6';
        element.style.outline = '3px solid #FFD700';
        element.style.outlineOffset = '5px';
        
        // 要素をビューポートにスクロール
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    /**
     * すべてのハイライトを削除
     */
    removeAllHighlights() {
        this.originalStyles.forEach((styles, element) => {
            element.style.backgroundColor = styles.backgroundColor;
            element.style.transition = styles.transition;
            element.style.outline = styles.outline;
        });
        this.originalStyles.clear();
    }
    
    /**
     * ハイライトの有効/無効を切り替え
     */
    toggleHighlight() {
        this.highlightEnabled = !this.highlightEnabled;
        
        if (!this.highlightEnabled) {
            this.removeAllHighlights();
        }
        
        this.updateUI();
    }
    
    /**
     * 読み上げ完了時の処理
     */
    onReadingComplete() {
        this.isReading = false;
        this.isPaused = false;
        this.removeAllHighlights();
        this.updateUI();
        
        // 完了通知
        console.log('読み上げが完了しました。');
    }
    
    /**
     * 一時停止
     */
    pause() {
        if (this.isReading && !this.isPaused) {
            this.synth.pause();
            this.isPaused = true;
            this.updateUI();
        }
    }
    
    /**
     * 再開
     */
    resume() {
        if (this.isReading && this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
            this.updateUI();
        }
    }
    
    /**
     * 停止
     */
    stop() {
        this.synth.cancel();
        this.isReading = false;
        this.isPaused = false;
        this.removeAllHighlights();
        this.updateUI();
    }
    
    /**
     * 読み上げ速度を変更
     */
    setRate(rate) {
        this.rate = Math.max(0.5, Math.min(2.0, rate));
        
        // 読み上げ中の場合は再スタート
        if (this.isReading) {
            const wasPlaying = !this.isPaused;
            const currentIndex = this.currentParagraphIndex;
            this.stop();
            if (wasPlaying) {
                this.readFromParagraph(currentIndex);
            }
        }
        
        this.updateUI();
    }
    
    /**
     * ブックマークを保存
     */
    saveBookmark() {
        if (!this.isReading) {
            alert('読み上げ中のみブックマークを保存できます。');
            return;
        }
        
        const bookmark = {
            url: window.location.pathname,
            paragraphIndex: this.currentParagraphIndex,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(this.bookmarkKey, JSON.stringify(bookmark));
        
        // フィードバック表示
        this.showFeedback('📚 ブックマークを保存しました', 'success');
    }
    
    /**
     * ブックマークから復元
     */
    loadBookmark() {
        const bookmarkData = localStorage.getItem(this.bookmarkKey);
        
        if (!bookmarkData) {
            alert('保存されたブックマークがありません。');
            return;
        }
        
        try {
            const bookmark = JSON.parse(bookmarkData);
            
            // 同じページかチェック
            if (bookmark.url !== window.location.pathname) {
                alert('このブックマークは別のページのものです。');
                return;
            }
            
            // 段落を取得
            this.paragraphs = this.getPageParagraphs();
            
            if (bookmark.paragraphIndex >= this.paragraphs.length) {
                alert('ブックマークの位置が見つかりませんでした。');
                return;
            }
            
            // ブックマーク位置から再生
            this.readFromParagraph(bookmark.paragraphIndex);
            
            // フィードバック表示
            this.showFeedback('📖 ブックマークから再開しました', 'success');
            
        } catch (error) {
            console.error('ブックマーク読み込みエラー:', error);
            alert('ブックマークの読み込みに失敗しました。');
        }
    }
    
    /**
     * ブックマークを削除
     */
    clearBookmark() {
        localStorage.removeItem(this.bookmarkKey);
        this.showFeedback('🗑️ ブックマークを削除しました', 'info');
    }
    
    /**
     * フィードバックメッセージを表示
     */
    showFeedback(message, type = 'info') {
        // 既存のフィードバックを削除
        const existing = document.querySelector('.speech-feedback');
        if (existing) {
            existing.remove();
        }
        
        const feedback = document.createElement('div');
        feedback.className = `speech-feedback speech-feedback-${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        // アニメーション
        setTimeout(() => feedback.classList.add('show'), 10);
        
        // 3秒後に削除
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
    
    /**
     * UIを更新
     */
    updateUI() {
        const playBtn = document.getElementById('speech-play-btn');
        const pauseBtn = document.getElementById('speech-pause-btn');
        const resumeBtn = document.getElementById('speech-resume-btn');
        const stopBtn = document.getElementById('speech-stop-btn');
        const rateDisplay = document.getElementById('speech-rate-display');
        const highlightBtn = document.getElementById('speech-highlight-btn');
        
        if (playBtn) playBtn.style.display = this.isReading ? 'none' : 'inline-flex';
        if (stopBtn) stopBtn.style.display = this.isReading ? 'inline-flex' : 'none';
        
        if (pauseBtn) pauseBtn.style.display = (this.isReading && !this.isPaused) ? 'inline-flex' : 'none';
        if (resumeBtn) resumeBtn.style.display = (this.isReading && this.isPaused) ? 'inline-flex' : 'none';
        
        if (rateDisplay) rateDisplay.textContent = `${this.rate.toFixed(1)}x`;
        
        // ハイライトボタンの状態
        if (highlightBtn) {
            if (this.highlightEnabled) {
                highlightBtn.classList.add('active');
                highlightBtn.innerHTML = '<i class="fas fa-highlighter"></i>';
            } else {
                highlightBtn.classList.remove('active');
                highlightBtn.innerHTML = '<i class="far fa-lightbulb"></i>';
            }
        }
    }
}

// グローバルインスタンスを作成
let speechReader = null;

// ページ読み込み完了後に初期化
window.addEventListener('DOMContentLoaded', () => {
    // Web Speech API のサポート確認
    if (!('speechSynthesis' in window)) {
        console.warn('お使いのブラウザは音声読み上げ機能に対応していません。');
        const controls = document.getElementById('speech-controls');
        if (controls) {
            controls.style.display = 'none';
        }
        return;
    }
    
    speechReader = new SpeechReader();
    
    // ボタンのイベントリスナー設定
    const playBtn = document.getElementById('speech-play-btn');
    const pauseBtn = document.getElementById('speech-pause-btn');
    const resumeBtn = document.getElementById('speech-resume-btn');
    const stopBtn = document.getElementById('speech-stop-btn');
    const slowerBtn = document.getElementById('speech-slower-btn');
    const fasterBtn = document.getElementById('speech-faster-btn');
    const voiceSelector = document.getElementById('speech-voice-selector');
    const highlightBtn = document.getElementById('speech-highlight-btn');
    const bookmarkSaveBtn = document.getElementById('speech-bookmark-save');
    const bookmarkLoadBtn = document.getElementById('speech-bookmark-load');
    const bookmarkClearBtn = document.getElementById('speech-bookmark-clear');
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            speechReader.readPage();
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            speechReader.pause();
        });
    }
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            speechReader.resume();
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            speechReader.stop();
        });
    }
    
    if (slowerBtn) {
        slowerBtn.addEventListener('click', () => {
            speechReader.setRate(speechReader.rate - 0.1);
        });
    }
    
    if (fasterBtn) {
        fasterBtn.addEventListener('click', () => {
            speechReader.setRate(speechReader.rate + 0.1);
        });
    }
    
    if (voiceSelector) {
        voiceSelector.addEventListener('change', (e) => {
            speechReader.changeVoice(e.target.value);
        });
    }
    
    if (highlightBtn) {
        highlightBtn.addEventListener('click', () => {
            speechReader.toggleHighlight();
        });
    }
    
    if (bookmarkSaveBtn) {
        bookmarkSaveBtn.addEventListener('click', () => {
            speechReader.saveBookmark();
        });
    }
    
    if (bookmarkLoadBtn) {
        bookmarkLoadBtn.addEventListener('click', () => {
            speechReader.loadBookmark();
        });
    }
    
    if (bookmarkClearBtn) {
        bookmarkClearBtn.addEventListener('click', () => {
            if (confirm('保存されたブックマークを削除しますか？')) {
                speechReader.clearBookmark();
            }
        });
    }
    
    // 初期UI更新
    speechReader.updateUI();
});

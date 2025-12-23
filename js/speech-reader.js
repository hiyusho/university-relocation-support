// 音声読み上げ機能
class SpeechReader {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.paragraphs = [];
        this.currentIndex = 0;
        this.isPaused = false;
        this.rate = 1.0;
        
        this.initializeElements();
        this.loadParagraphs();
        this.attachEventListeners();
        this.checkBrowserSupport();
    }

    initializeElements() {
        this.playBtn = document.getElementById('play-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resumeBtn = document.getElementById('resume-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.rateInput = document.getElementById('speech-rate');
        this.rateValue = document.getElementById('rate-value');
    }

    checkBrowserSupport() {
        if (!('speechSynthesis' in window)) {
            alert('お使いのブラウザは音声読み上げ機能に対応していません。');
            this.playBtn.disabled = true;
        }
    }

    loadParagraphs() {
        // ストーリーのすべてのテキスト要素を取得
        const storyContainer = document.querySelector('.story-container') || document.querySelector('.story-content');
        if (!storyContainer) {
            console.warn('ストーリーコンテナが見つかりません');
            return;
        }

        // ストーリータイトルを読み込む
        const storyTitle = document.querySelector('.story-title');
        if (storyTitle) {
            this.paragraphs.push({
                element: storyTitle,
                text: storyTitle.textContent.trim()
            });
        }

        // イントロダクションセクション
        const introSection = storyContainer.querySelector('.story-intro');
        if (introSection) {
            const introParagraphs = introSection.querySelectorAll('p');
            introParagraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    this.paragraphs.push({
                        element: p,
                        text: text
                    });
                }
            });
        }

        // タイムラインタイトル
        const timelineTitle = storyContainer.querySelector('.timeline-title');
        if (timelineTitle) {
            this.paragraphs.push({
                element: timelineTitle,
                text: timelineTitle.textContent.trim()
            });
        }

        // タイムラインアイテム
        const timelineItems = storyContainer.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            // h3タイトル
            const h3 = item.querySelector('h3');
            if (h3) {
                this.paragraphs.push({
                    element: h3,
                    text: h3.textContent.trim()
                });
            }

            // timeline-content内の段落
            const contentParagraphs = item.querySelectorAll('.timeline-content p');
            contentParagraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    this.paragraphs.push({
                        element: p,
                        text: text
                    });
                }
            });

            // blockquote
            const blockquotes = item.querySelectorAll('blockquote');
            blockquotes.forEach(bq => {
                const text = bq.textContent.trim();
                if (text) {
                    this.paragraphs.push({
                        element: bq,
                        text: text
                    });
                }
            });
        });

        // セクションごとに段落を読み込む（他のストーリーページ用）
        const sections = storyContainer.querySelectorAll('.story-section');
        sections.forEach(section => {
            // セクションタイトル
            const sectionTitle = section.querySelector('.section-title');
            if (sectionTitle) {
                this.paragraphs.push({
                    element: sectionTitle,
                    text: sectionTitle.textContent.trim()
                });
            }

            // story-text内の段落
            const storyTexts = section.querySelectorAll('.story-text p');
            storyTexts.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    this.paragraphs.push({
                        element: p,
                        text: text
                    });
                }
            });

            // timeline-item内の段落
            const timelineItems = section.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                // タイムタイトル
                const timeTitle = item.querySelector('.timeline-title');
                if (timeTitle) {
                    this.paragraphs.push({
                        element: timeTitle,
                        text: timeTitle.textContent.trim()
                    });
                }

                // タイムライン内の段落
                const timelineParagraphs = item.querySelectorAll('.timeline-text p, .timeline-content p');
                timelineParagraphs.forEach(p => {
                    const text = p.textContent.trim();
                    if (text) {
                        this.paragraphs.push({
                            element: p,
                            text: text
                        });
                    }
                });
            });

            // highlight-box内のテキスト
            const highlightBoxes = section.querySelectorAll('.highlight-box');
            highlightBoxes.forEach(box => {
                const h4 = box.querySelector('h4');
                if (h4) {
                    this.paragraphs.push({
                        element: h4,
                        text: h4.textContent.trim()
                    });
                }
                const paragraphs = box.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const text = p.textContent.trim();
                    if (text) {
                        this.paragraphs.push({
                            element: p,
                            text: text
                        });
                    }
                });
            });

            // data-stats内のテキスト
            const dataStats = section.querySelectorAll('.data-stats');
            dataStats.forEach(stat => {
                const h4 = stat.querySelector('h4');
                if (h4) {
                    this.paragraphs.push({
                        element: h4,
                        text: h4.textContent.trim()
                    });
                }
                const paragraphs = stat.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const text = p.textContent.trim();
                    if (text) {
                        this.paragraphs.push({
                            element: p,
                            text: text
                        });
                    }
                });
            });
        });

        // コンクルージョンボックス（まとめ）
        const conclusionBox = storyContainer.querySelector('.conclusion-box');
        if (conclusionBox) {
            const conclusionH3 = conclusionBox.querySelector('h3');
            if (conclusionH3) {
                this.paragraphs.push({
                    element: conclusionH3,
                    text: conclusionH3.textContent.trim()
                });
            }
            const conclusionParagraphs = conclusionBox.querySelectorAll('p');
            conclusionParagraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    this.paragraphs.push({
                        element: p,
                        text: text
                    });
                }
            });
        }

        // エピローグセクション
        const epilogue = storyContainer.querySelector('.epilogue-section');
        if (epilogue) {
            const epilogueTitle = epilogue.querySelector('.section-title');
            if (epilogueTitle) {
                this.paragraphs.push({
                    element: epilogueTitle,
                    text: epilogueTitle.textContent.trim()
                });
            }
            const epilogueParagraphs = epilogue.querySelectorAll('p');
            epilogueParagraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    this.paragraphs.push({
                        element: p,
                        text: text
                    });
                }
            });
        }

        console.log(`読み込んだ段落数: ${this.paragraphs.length}`);
    }

    attachEventListeners() {
        this.playBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resumeBtn.addEventListener('click', () => this.resume());
        this.stopBtn.addEventListener('click', () => this.stop());
        
        this.rateInput.addEventListener('input', (e) => {
            this.rate = parseFloat(e.target.value);
            this.rateValue.textContent = this.rate.toFixed(1) + 'x';
            if (this.utterance) {
                this.utterance.rate = this.rate;
            }
        });
    }

    start() {
        if (this.paragraphs.length === 0) {
            alert('読み上げるテキストがありません。');
            return;
        }

        this.currentIndex = 0;
        this.updateButtons('playing');
        this.speak();
    }

    speak() {
        if (this.currentIndex >= this.paragraphs.length) {
            this.stop();
            return;
        }

        const current = this.paragraphs[this.currentIndex];
        
        // 前のハイライトを削除
        document.querySelectorAll('.reading-highlight').forEach(el => {
            el.classList.remove('reading-highlight');
        });

        // 現在の要素をハイライト
        current.element.classList.add('reading-highlight');
        
        // スクロール
        this.scrollToElement(current.element);

        // 音声読み上げ
        this.utterance = new SpeechSynthesisUtterance(current.text);
        this.utterance.lang = 'ja-JP';
        this.utterance.rate = this.rate;
        this.utterance.pitch = 1.0;
        this.utterance.volume = 1.0;

        this.utterance.onend = () => {
            current.element.classList.remove('reading-highlight');
            this.currentIndex++;
            
            if (this.currentIndex < this.paragraphs.length && !this.isPaused) {
                // 次の段落まで少し待つ
                setTimeout(() => {
                    if (!this.isPaused) {
                        this.speak();
                    }
                }, 500);
            } else if (this.currentIndex >= this.paragraphs.length) {
                this.stop();
            }
        };

        this.utterance.onerror = (event) => {
            console.error('音声読み上げエラー:', event);
        };

        this.synth.speak(this.utterance);
    }

    scrollToElement(element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        
        window.scrollTo({
            top: middle,
            behavior: 'smooth'
        });
    }

    pause() {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            this.isPaused = true;
            this.updateButtons('paused');
        }
    }

    resume() {
        if (this.synth.paused) {
            this.synth.resume();
            this.isPaused = false;
            this.updateButtons('playing');
        }
    }

    stop() {
        this.synth.cancel();
        this.isPaused = false;
        this.currentIndex = 0;
        
        // すべてのハイライトを削除
        document.querySelectorAll('.reading-highlight').forEach(el => {
            el.classList.remove('reading-highlight');
        });
        
        this.updateButtons('stopped');
    }

    updateButtons(state) {
        switch(state) {
            case 'playing':
                this.playBtn.style.display = 'none';
                this.pauseBtn.style.display = 'flex';
                this.resumeBtn.style.display = 'none';
                this.stopBtn.style.display = 'flex';
                break;
            case 'paused':
                this.playBtn.style.display = 'none';
                this.pauseBtn.style.display = 'none';
                this.resumeBtn.style.display = 'flex';
                this.stopBtn.style.display = 'flex';
                break;
            case 'stopped':
                this.playBtn.style.display = 'flex';
                this.pauseBtn.style.display = 'none';
                this.resumeBtn.style.display = 'none';
                this.stopBtn.style.display = 'none';
                break;
        }
    }
}

// ページ読み込み後に初期化
document.addEventListener('DOMContentLoaded', () => {
    new SpeechReader();
});


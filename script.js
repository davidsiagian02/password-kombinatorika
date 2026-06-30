const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function switchView(viewName) {
    const views = {
        'landing': document.getElementById('view-landing'),
        'calculator': document.getElementById('view-calculator'),
        'team': document.getElementById('view-team')
    };
    
    const desktopBtns = {
        'landing': document.getElementById('nav-btn-landing'),
        'calculator': document.getElementById('nav-btn-calc'),
        'team': document.getElementById('nav-btn-team')
    };

    const mobileBtns = {
        'landing': document.getElementById('mob-btn-landing'),
        'calculator': document.getElementById('mob-btn-calc'),
        'team': document.getElementById('mob-btn-team')
    };

    Object.values(views).forEach(view => view.classList.add('view-hidden'));
    
    Object.values(desktopBtns).forEach(btn => {
        btn.className = "px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent";
    });

    Object.values(mobileBtns).forEach(mBtn => {
        mBtn.className = "flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-brand-600 dark:hover:text-sky-400 transition-colors";
    });

    views[viewName].classList.remove('view-hidden');
    desktopBtns[viewName].className = "px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 bg-white dark:bg-slate-800 text-brand-600 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-slate-700";
    mobileBtns[viewName].className = "flex flex-col items-center justify-center w-full h-full text-brand-600 dark:text-sky-400 transition-colors";

    if (viewName === 'calculator') {
        setTimeout(() => document.getElementById('password').focus(), 50);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const getPrimeFactors = (n) => {
    if (n <= 1) return '-';
    let factors = [];
    let counts = {};
    let divisor = 2;
    let tempN = n;
    
    while (tempN >= 2) {
        if (tempN % divisor === 0) {
            counts[divisor] = (counts[divisor] || 0) + 1;
            tempN = tempN / divisor;
        } else {
            divisor++;
        }
    }
    
    for (let prime in counts) {
        if(counts[prime] > 1) {
            factors.push(`${prime}<sup class="text-[9px]">${counts[prime]}</sup>`);
        } else {
            factors.push(`${prime}`);
        }
    }
    return factors.join(' &times; ');
};

const gcd = (a, b) => {
    if (!b) return a;
    return gcd(b, a % b);
};

const formatFullValue = (bigIntValue) => {
    return bigIntValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatTime = (secondsBig) => {
    if (secondsBig === 0n) return "0 detik";
    if (secondsBig < 60n) return `${secondsBig.toString()} detik`;
    
    let mins = secondsBig / 60n;
    if (mins < 60n) return `${mins.toString()} menit`;
    
    let hours = mins / 60n;
    if (hours < 24n) return `${hours.toString()} jam`;
    
    let days = hours / 24n;
    if (days < 365n) return `${days.toString()} hari`;
    
    let years = days / 365n;
    return `${years.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} tahun`;
};

const DOM = {
    pwInput: document.getElementById('password'),
    strengthBar: document.getElementById('strength-bar'),
    strengthText: document.getElementById('strength-text'),
    entropyBadge: document.getElementById('entropy-badge'),
    valN: document.getElementById('val-n'),
    valL: document.getElementById('val-l'),
    valK: document.getElementById('val-k'),
    valPrime: document.getElementById('val-prime'),
    valGcd: document.getElementById('val-gcd'),
    valCoprime: document.getElementById('val-coprime'),
    valTime: document.getElementById('val-time'),
    btnToggleVis: document.getElementById('toggleVisibility'),
    iconEye: document.getElementById('icon-eye'),
    iconEyeOff: document.getElementById('icon-eye-off')
};

const analyzePassword = () => {
    const pw = DOM.pwInput.value;
    const L = pw.length;
    const isEmpty = L === 0;

    // Perhitungan Kombinatorika dan Estimasi Waktu Retas
    let N = 0;
    if (/[a-z]/.test(pw)) N += 26;
    if (/[A-Z]/.test(pw)) N += 26;
    if (/[0-9]/.test(pw)) N += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) N += 32;

    let entropy = 0;
    let K = 0n;
    let secondsBig = 0n;
    let decimalTimeLabel = "";

    if (!isEmpty) {
        K = BigInt(N) ** BigInt(L);
        entropy = L * Math.log2(N);
        
        const v = 1000000000n;
        secondsBig = K / (2n * v);

        if (secondsBig === 0n) {
            let exactSecs = Number(K) / 2000000000;
            if (exactSecs < 1) {
                decimalTimeLabel = "Instan (< 1 dtk)";
            } else {
                decimalTimeLabel = `${exactSecs.toFixed(2).replace('.', ',')} detik`;
            }
        }
    }

    if (isEmpty) {
        DOM.strengthBar.style.width = '0%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-700 ease-out bg-slate-300 dark:bg-slate-700';
        DOM.strengthText.innerText = 'Menunggu Input...';
        DOM.strengthText.className = 'text-xs sm:text-sm font-semibold text-slate-500 font-display';
        DOM.entropyBadge.className = 'font-mono text-xs sm:text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 transition-colors';
    } else if (entropy < 35) { 
        DOM.strengthBar.style.width = '25%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-rose-500 dark:shadow-[0_0_15px_rgba(244,63,94,0.6)]';
        DOM.strengthText.innerText = 'Sangat Lemah';
        DOM.strengthText.className = 'text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 font-display tracking-wide';
        DOM.entropyBadge.className = 'font-mono text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-500/20 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-500/30 transition-colors';
    } else if (entropy < 60) {
        DOM.strengthBar.style.width = '50%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-amber-500 dark:shadow-[0_0_15px_rgba(245,158,11,0.6)]';
        DOM.strengthText.innerText = 'Sedang';
        DOM.strengthText.className = 'text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 font-display tracking-wide';
        DOM.entropyBadge.className = 'font-mono text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/30 transition-colors';
    } else if (entropy < 80) {
        DOM.strengthBar.style.width = '75%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-emerald-500 dark:shadow-[0_0_15px_rgba(16,185,129,0.6)]';
        DOM.strengthText.innerText = 'Kuat';
        DOM.strengthText.className = 'text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 font-display tracking-wide';
        DOM.entropyBadge.className = 'font-mono text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 transition-colors';
    } else {
        DOM.strengthBar.style.width = '100%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-brand-500 dark:bg-sky-400 dark:shadow-[0_0_20px_rgba(56,189,248,0.8)]';
        DOM.strengthText.innerText = 'Sangat Kuat (Aman)';
        DOM.strengthText.className = 'text-xs sm:text-sm font-bold text-brand-600 dark:text-sky-400 dark:glow-text font-display tracking-wide';
        DOM.entropyBadge.className = 'font-mono text-xs sm:text-sm font-bold text-brand-700 dark:text-sky-300 bg-brand-100 dark:bg-sky-500/20 px-2 py-0.5 rounded border border-brand-200 dark:border-sky-500/30 transition-colors';
    }

    DOM.entropyBadge.innerHTML = isEmpty ? '0.00 bit' : `${entropy.toFixed(2)} bit`;

    DOM.valN.innerText = N;
    DOM.valL.innerText = L;
    DOM.valK.innerHTML = isEmpty ? "0" : formatFullValue(K);
    DOM.valTime.innerHTML = isEmpty ? "0 detik" : (secondsBig === 0n ? decimalTimeLabel : formatTime(secondsBig));

    if (!isEmpty && N > 0) {
        DOM.valPrime.innerHTML = getPrimeFactors(N);
        
        let gcdVal = gcd(N, 26);
        DOM.valGcd.innerText = gcdVal;
        
        if (gcdVal === 1) {
            DOM.valCoprime.innerHTML = `<span class="flex items-center justify-center"><svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Memenuhi Sifat Relatif Prima</span>`;
            DOM.valCoprime.className = "w-full text-center px-2 py-2.5 text-[10px] sm:text-xs font-mono font-semibold rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-300";
        } else {
            DOM.valCoprime.innerHTML = `<span class="flex items-center justify-center"><svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Tidak Relatif Prima</span>`;
            DOM.valCoprime.className = "w-full text-center px-2 py-2.5 text-[10px] sm:text-xs font-mono font-semibold rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 transition-colors duration-300";
        }
    } else {
        DOM.valPrime.innerText = "-";
        DOM.valGcd.innerText = "-";
        DOM.valCoprime.innerText = "Evaluasi Sifat Relatif Prima";
        DOM.valCoprime.className = "w-full text-center px-2 py-2.5 text-[10px] sm:text-xs font-mono rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 transition-colors duration-300";
    }
};

DOM.pwInput.addEventListener('input', analyzePassword);

DOM.btnToggleVis.addEventListener('click', () => {
    if (DOM.pwInput.type === 'password') {
        DOM.pwInput.type = 'text';
        DOM.iconEye.classList.remove('hidden');
        DOM.iconEyeOff.classList.add('hidden');
    } else {
        DOM.pwInput.type = 'password';
        DOM.iconEye.classList.add('hidden');
        DOM.iconEyeOff.classList.remove('hidden');
    }
});

analyzePassword();
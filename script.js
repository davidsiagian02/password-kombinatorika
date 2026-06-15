// ================= MOBILE NAVBAR HAMBURGER LOGIC =================
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

function toggleMobileMenu() {
    const isOpened = !mobileMenu.classList.contains('hidden');
    if (isOpened) {
        mobileMenu.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    } else {
        mobileMenu.classList.remove('hidden');
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    }
}

hamburgerBtn.addEventListener('click', toggleMobileMenu);

// ================= ROUTING LOGIC =================
function switchView(viewName) {
    const views = {
        'landing': document.getElementById('view-landing'),
        'calculator': document.getElementById('view-calculator'),
        'team': document.getElementById('view-team')
    };
    
    const btns = {
        'landing': document.getElementById('nav-btn-landing'),
        'calculator': document.getElementById('nav-btn-calc'),
        'team': document.getElementById('nav-btn-team')
    };

    const mobileBtns = {
        'landing': document.getElementById('mobile-nav-btn-landing'),
        'calculator': document.getElementById('mobile-nav-btn-calc'),
        'team': document.getElementById('mobile-nav-btn-team')
    };

    // Reset all desktop and mobile view classes
    Object.values(views).forEach(view => view.classList.add('view-hidden'));
    
    Object.values(btns).forEach(btn => {
        btn.className = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50";
    });

    Object.values(mobileBtns).forEach(mBtn => {
        mBtn.className = "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-slate-600 hover:text-indigo-600 hover:bg-slate-50";
    });

    // Set Active Desktop
    views[viewName].classList.remove('view-hidden');
    btns[viewName].className = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 bg-indigo-50 text-indigo-600 shadow-sm";
    
    // Set Active Mobile
    mobileBtns[viewName].className = "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors bg-indigo-50 text-indigo-600 shadow-sm";

    // Re-trigger animation for the active view
    const activeElement = views[viewName].querySelector('.slide-up-element');
    if(activeElement) {
        activeElement.style.animation = 'none';
        activeElement.offsetHeight;
        activeElement.style.animation = null; 
    }

    if (viewName === 'calculator') {
        document.getElementById('password').focus();
    }
    window.scrollTo(0, 0);
}

// ================= MATH UTILITIES =================
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
            factors.push(`${prime}<sup class="text-[10px]">${counts[prime]}</sup>`);
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

const formatScientific = (bigIntValue) => {
    let str = bigIntValue.toString();
    if (str.length <= 12) return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${str[0]},${str.substring(1, 3)} &times; 10<sup class="text-[10px]">${str.length - 1}</sup>`;
};

const formatTime = (seconds) => {
    if (seconds === 0) return "0 detik";
    if (seconds < 1) return "Instan (< 1 dtk)";
    if (seconds < 60) return `${Math.floor(seconds)} detik`;
    
    let mins = seconds / 60;
    if (mins < 60) return `${mins.toFixed(1)} menit`;
    
    let hours = mins / 60;
    if (hours < 24) return `${hours.toFixed(1)} jam`;
    
    let days = hours / 24;
    if (days < 365) return `${days.toFixed(1)} hari`;
    
    let years = days / 365;
    if (years < 100) return `${years.toFixed(1)} tahun`;
    if (years < 1000) return "Berabad-abad";
    return "Ribuan Tahun";
};

// ================= CACHED DOM ELEMENTS (Optimization) =================
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

// ================= CORE ANALYSIS LOGIC =================
const analyzePassword = () => {
    const pw = DOM.pwInput.value;
    const L = pw.length;
    const isEmpty = L === 0;

    // 1. Calculate N (Alphabet Size) strictly based on PDF rules
    let N = 0;
    if (/[a-z]/.test(pw)) N += 26;
    if (/[A-Z]/.test(pw)) N += 26;
    if (/[0-9]/.test(pw)) N += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) N += 32;

    // Initialize vars
    let entropy = 0;
    let K = 0n;
    let secondsApprox = 0;

    if (!isEmpty) {
        // Total Combinations (K = N^L) using BigInt
        K = BigInt(N) ** BigInt(L);
        
        // Shannon Entropy (H = L * log2(N))
        entropy = L * Math.log2(N);
        
        // Time Estimation T = K / (2 * v)
        // v = 10^9 (1 Billion guesses per second)
        const v = 1_000_000_000; 
        secondsApprox = Number(K) / (2 * v);
    }

    // 2. Entropy & Strength Logic
    if (isEmpty) {
        DOM.strengthBar.style.width = '0%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-slate-300';
        DOM.strengthText.innerText = 'Belum ada data';
        DOM.strengthText.className = 'text-lg sm:text-xl font-bold text-slate-300';
        
        DOM.entropyBadge.className = 'inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg bg-slate-100 text-slate-500 font-bold font-math text-sm sm:text-base border border-slate-200 transition-colors';
    } else if (entropy < 35) { 
        DOM.strengthBar.style.width = '25%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-rose-500';
        DOM.strengthText.innerText = 'Sangat Lemah';
        DOM.strengthText.className = 'text-lg sm:text-xl font-bold text-rose-600';
        
        DOM.entropyBadge.className = 'inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg bg-rose-50 text-rose-700 font-bold font-math text-sm sm:text-base border border-rose-200 transition-colors';
    } else if (entropy < 60) {
        DOM.strengthBar.style.width = '50%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-amber-500';
        DOM.strengthText.innerText = 'Sedang';
        DOM.strengthText.className = 'text-lg sm:text-xl font-bold text-amber-500';
        
        DOM.entropyBadge.className = 'inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg bg-amber-50 text-amber-700 font-bold font-math text-sm sm:text-base border border-amber-200 transition-colors';
    } else if (entropy < 80) {
        DOM.strengthBar.style.width = '75%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-emerald-500';
        DOM.strengthText.innerText = 'Kuat';
        DOM.strengthText.className = 'text-lg sm:text-xl font-bold text-emerald-600';
        
        DOM.entropyBadge.className = 'inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold font-math text-sm sm:text-base border border-emerald-200 transition-colors';
    } else {
        DOM.strengthBar.style.width = '100%';
        DOM.strengthBar.className = 'h-full rounded-full transition-all duration-500 ease-out bg-blue-600';
        DOM.strengthText.innerText = 'Sangat Kuat';
        DOM.strengthText.className = 'text-lg sm:text-xl font-bold text-blue-600';
        
        DOM.entropyBadge.className = 'inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold font-math text-sm sm:text-base border border-blue-200 transition-colors';
    }

    DOM.entropyBadge.innerHTML = `H = ${entropy.toFixed(2)} bit`;

    // 3. Combinatorics & Time
    DOM.valN.innerText = N;
    DOM.valL.innerText = L;
    DOM.valK.innerHTML = isEmpty ? "0" : formatScientific(K);
    DOM.valTime.innerText = formatTime(secondsApprox);

    // 4. Number Theory
    if (!isEmpty && N > 0) {
        DOM.valPrime.innerHTML = getPrimeFactors(N);
        
        let gcdVal = gcd(N, 26);
        DOM.valGcd.innerText = gcdVal;
        
        if (gcdVal === 1) {
            DOM.valCoprime.innerHTML = `<span class="flex items-center justify-center"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Relatif Prima (Coprime)</span>`;
            DOM.valCoprime.className = "w-full text-center px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200";
        } else {
            DOM.valCoprime.innerHTML = `<span class="flex items-center justify-center"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Tidak Relatif Prima</span>`;
            DOM.valCoprime.className = "w-full text-center px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200";
        }
    } else {
        DOM.valPrime.innerText = "-";
        DOM.valGcd.innerText = "-";
        DOM.valCoprime.innerText = "Status Relatif Prima";
        DOM.valCoprime.className = "w-full text-center px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 text-slate-500 border border-slate-200";
    }
};

// ================= EVENT LISTENERS =================
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

// Initialize state on load
analyzePassword();
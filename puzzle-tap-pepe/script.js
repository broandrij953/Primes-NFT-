// --- Змінні гри ---
let gameData = {
    honey: 0, // Перейменуємо це на "money" або "pepeCoins" в думках, але в коді лишимо для сумісності з попереднім
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    clickIncome: 1,
    passiveIncome: 0,
    upgradeCost: 100,
    jarHoney: 0, // Мед у баночці, тепер "монетки в баночці"
    jarCapacity: 2000000
};

// --- Елементи DOM ---
const honeyCountElement = document.getElementById('honeyCount');
const pepeImageWrapper = document.getElementById('pepeImageWrapper'); // Оновлено: тепер клікаємо на wrapper картинки
const honeyJarFill = document.getElementById('honeyJarFill');
const honeyJarValue = document.getElementById('honeyJarValue');
const playerLevelDisplay = document.getElementById('playerLevelDisplay');
const clickIncomeDisplay = document.getElementById('clickIncomeDisplay');
const passiveIncomeDisplay = document.getElementById('passiveIncomeDisplay');
const levelProgressBar = document.getElementById('levelProgressBar');
const levelProgressText = document.getElementById('levelProgressText');
const currentLevelDisplay = document.getElementById('currentLevelDisplay');
const upgradeButton = document.getElementById('upgradeButton');
const positionDisplay = document.getElementById('positionDisplay');


// --- Функції збереження/завантаження ---
function saveGame() {
    localStorage.setItem('pepeClickerGame', JSON.stringify(gameData)); // Змінив назву ключа
    console.log('Гра збережена!', gameData);
}

function loadGame() {
    const savedData = localStorage.getItem('pepeClickerGame'); // Змінив назву ключа
    if (savedData) {
        gameData = JSON.parse(savedData);
        console.log('Гра завантажена!', gameData);
    } else {
        console.log('Нова гра розпочата.');
    }
    updateUI();
}

// --- Функції оновлення інтерфейсу ---
function updateUI() {
    honeyCountElement.textContent = formatNumber(gameData.honey);
    clickIncomeDisplay.textContent = `+${formatNumber(gameData.clickIncome)}`;
    passiveIncomeDisplay.textContent = `+${formatNumber(gameData.passiveIncome)}`;
    playerLevelDisplay.textContent = `${gameData.level} рівень`;
    currentLevelDisplay.textContent = `рівень ${gameData.level}`;

    // Прогрес рівня
    const xpPercentage = (gameData.xp / gameData.xpToNextLevel) * 100;
    levelProgressBar.style.width = `${Math.min(xpPercentage, 100)}%`;
    levelProgressText.textContent = `${formatNumber(gameData.xpToNextLevel - gameData.xp)} до підвищення рівня`;

    // Заповнення баночки (для візуалізації "монеток" в баночці)
    honeyJarValue.textContent = formatNumber(gameData.jarHoney);
    const jarFillPercentage = (gameData.jarHoney / gameData.jarCapacity) * 100;
    honeyJarFill.style.height = `${Math.min(jarFillPercentage, 100)}%`;

    // Оновлення кнопки покращення
    upgradeButton.textContent = `Покращити дохід (Ціна: ${formatNumber(gameData.upgradeCost)})`;
    upgradeButton.disabled = gameData.honey < gameData.upgradeCost;
}

// Допоміжна функція для форматування великих чисел
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'млрд';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'млн';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'тис';
    return num.toLocaleString('uk-UA');
}

// --- Логіка гри ---

// Клік по картинці Pepe
pepeImageWrapper.addEventListener('click', (event) => {
    gameData.honey += gameData.clickIncome;
    gameData.xp += gameData.clickIncome;

    // Створення ефекту числа при кліку
    const rect = pepeImageWrapper.getBoundingClientRect();
    const x = event.clientX - rect.left; // Координати кліку відносно обгортки Pepe
    const y = event.clientY - rect.top;
    createClickEffect(x, y, `+${gameData.clickIncome}`, pepeImageWrapper); // Передаємо pepeImageWrapper як батьківський елемент
    
    checkLevelUp();
    updateUI();
    saveGame();
});

// Ефект числа при кліку
function createClickEffect(x, y, text, parentElement) {
    const effect = document.createElement('div');
    effect.classList.add('click-effect');
    effect.textContent = text;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    parentElement.appendChild(effect); // Додаємо до батьківського елемента (pepeImageWrapper)

    effect.addEventListener('animationend', () => {
        effect.remove();
    });
}


// Перевірка рівня
function checkLevelUp() {
    if (gameData.xp >= gameData.xpToNextLevel) {
        gameData.level++;
        gameData.xp -= gameData.xpToNextLevel;
        gameData.xpToNextLevel = Math.floor(gameData.xpToNextLevel * 1.5);
        gameData.clickIncome = Math.floor(gameData.clickIncome * 1.1) + 1;
        console.log(`Вітаємо! Рівень ${gameData.level}! Нові вимоги XP: ${gameData.xpToNextLevel}`);
    }
}

// Пасивний дохід (в час)
setInterval(() => {
    gameData.honey += gameData.passiveIncome;
    gameData.jarHoney += gameData.passiveIncome;
    if (gameData.jarHoney > gameData.jarCapacity) {
        gameData.jarHoney = gameData.jarCapacity;
    }
    updateUI();
    saveGame();
}, 5000); // Оновлюємо кожні 5 секунд

// Логіка покращень (Кнопка "Покращити дохід")
upgradeButton.addEventListener('click', () => {
    if (gameData.honey >= gameData.upgradeCost) {
        gameData.honey -= gameData.upgradeCost;
        gameData.clickIncome = Math.floor(gameData.clickIncome * 1.2) + 1;
        gameData.passiveIncome += 5;
        gameData.upgradeCost = Math.floor(gameData.upgradeCost * 1.5);
        updateUI();
        saveGame();
    } else {
        alert('Недостатньо коштів для покращення!');
    }
});

// Навігація (просто для прикладу, без реальних вкладок)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        const tab = this.getAttribute('data-tab');
        console.log(`Переключено на вкладку: ${tab}`);
    });
});

// --- Ініціалізація гри ---
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    updateUI();
});

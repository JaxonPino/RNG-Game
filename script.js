document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('randomButton');
    const resultText = document.getElementById('resultText');
    const percentageText = document.getElementById('percentageText');
    const collectedList = document.getElementById('collectedList');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar'); // Define the sidebar element
    const spinCounter = document.getElementById('spinCounter'); // Define the spin counter element

    let cooldown = false;
    const cooldownTime = 5000;
    let spinCount = 0; // Initialize the spin counter
    let autoSpin = false; // Initialize auto spin status

    const texts = [
        { text: 'Common', chance: 60, unobtainable: false },
        { text: 'Uncommon', chance: 45, unobtainable: false },
        { text: 'Good', chance: 35, unobtainable: false },
        { text: 'Rare', chance: 30, unobtainable: false },
        { text: 'Epic', chance: 20, unobtainable: false },
        { text: 'Legendary', chance: 15, unobtainable: false },
        { text: 'Mythic', chance: 10, unobtainable: false },
        { text: 'Ascended', chance: 0.1, unobtainable: false },
        { text: 'Easter Egg (EVENT)', chance: 5, unobtainable: false },
        { text: 'Transcendent', chance: 0.01, unobtainable: false },
        { text: 'Jackpot', chance: 0.777, unobtainable: false },
        { text: 'Divine', chance: 0.001, unobtainable: false },
        { text: 'Cosmic', chance: 0, unobtainable: false }, // Set unobtainable to true and chance to 0%
    ];

    // Load collected items and spin count from local storage on page load
    let collectedItems = JSON.parse(localStorage.getItem('collectedItems')) || [];
    spinCount = JSON.parse(localStorage.getItem('spinCount')) || 0;
    updateSidebar(); // Update sidebar immediately upon page load
    updateSpinCounter(); // Update spin counter immediately upon page load

    // Function to save collected items to local storage
    function saveCollectedItems() {
        localStorage.setItem('collectedItems', JSON.stringify(collectedItems));
    }

    // Function to save spin count to local storage
    function saveSpinCount() {
        localStorage.setItem('spinCount', JSON.stringify(spinCount));
    }

    // Update sidebar with saved collected items
    function updateSidebar() {
        collectedList.innerHTML = '';
        collectedItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.text} (${item.chance}%)`;
            collectedList.appendChild(li);
        });
    }

    // Update spin counter display
    function updateSpinCounter() {
        spinCounter.textContent = `Spins: ${spinCount}`;
    }

    button.addEventListener('click', rollText);

    function rollText() {
        if (cooldown || autoSpin) return;
        cooldown = true;
        button.disabled = true;
        button.classList.add('cooldown');

        spinCount++; // Increase spin count
        updateSpinCounter(); // Update spin counter display

        let totalChance = texts.reduce((acc, cur) => {
            if (!cur.unobtainable) {
                return acc + cur.chance;
            }
            return acc;
        }, 0);

        let randomNumber = Math.random() * totalChance;

        let selectedText = null;
        let selectedChance = null;

        for (let i = 0; i < texts.length; i++) {
            if (!texts[i].unobtainable) {
                if (randomNumber <= texts[i].chance) {
                    selectedText = texts[i].text;
                    selectedChance = texts[i].chance;
                    break;
                } else {
                    randomNumber -= texts[i].chance;
                }
            }
        }

        if (!selectedText) {
            selectedText = 'Common';
            selectedChance = 50;
        }

        // Start roll animation
        animateRoll(selectedText, selectedChance);
    }

    function animateRoll(selectedText, selectedChance) {
        const animationDuration = 1500;
        const animationSteps = 30;
        const stepDuration = animationDuration / animationSteps;

        let currentStep = 0;
        const intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * texts.length);
            const { text, chance } = texts[randomIndex];
            resultText.textContent = text;
            percentageText.textContent = texts[randomIndex].unobtainable ? 'UNOBTAINABLE' : `${chance}%`;

            currentStep++;
            if (currentStep >= animationSteps) {
                clearInterval(intervalId);
                finishRoll(selectedText, selectedChance);
            }
        }, stepDuration);
    }

    function finishRoll(selectedText, selectedChance) {
        resultText.textContent = selectedText;
        percentageText.textContent = selectedChance === 0 ? 'UNOBTAINABLE' : `${selectedChance}%`;

        button.disabled = false;
        cooldown = false;
        button.classList.remove('cooldown');

        addToCollectedList(selectedText, selectedChance);
        saveCollectedItems();
        updateSidebar();
        saveSpinCount(); // Save spin count after each spin
    }

    function addToCollectedList(text, chance) {
        if (!collectedItems.some(item => item.text === text)) {
            collectedItems.push({ text, chance });
        }
    }

    // Sidebar functionality
    openSidebarBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);

    function openSidebar() {
        updateSidebar();
        sidebar.style.left = '0'; // Show sidebar
        openSidebarBtn.style.display = 'none';
    }

    function closeSidebar() {
        sidebar.style.left = '-280px'; // Hide sidebar
        openSidebarBtn.style.display = 'block';
    }
});

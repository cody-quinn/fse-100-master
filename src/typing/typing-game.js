document.addEventListener('DOMContentLoaded', () => {

    const textDisplay = document.getElementById('textDisplay');
    const inputField = document.getElementById('inputFiled');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const timerElement = document.querySelector('.timer');
    const resultsContent = document.getElementById('resultsContent');
    const finalWPMElement = document.getElementById('finalWPM');
    const finalAccuracyElement = document.getElementById('finalAccuracy');
    const restartButton = document.getElementById('restartButton');
    const newTestButton = document.getElementById('newTestButton');

    const GAME_TIME_SECONDS = 60;
    let textToType = "";
    let timerInterval;
    let timeLeft = GAME_TIME_SECONDS;
    let gameStarted = false;
    let totalCharsTyped = 0;
    let correctCharsTyped = 0;
    let gameStartTime;

    const textSamples = [
        "Cloud computing has fundamentally altered the landscape of data storage and application deployment. Instead of relying on local servers, businesses can now leverage scalable, on-demand resources from providers. This shift reduces upfront hardware costs and provides greater flexibility, but it also raises new concerns about data security and vendor lock-in. Managing a hybrid-cloud environment is becoming a key skill for IT professionals worldwide.",
        "Artificial intelligence is no longer a concept confined to science fiction; it is an integral part of our daily lives. From the recommendation algorithms that suggest what to watch next, to the sophisticated language models that can write code or prose, AI is rapidly evolving. As these systems become more capable, society must grapple with complex ethical questions regarding bias, job displacement, and the very nature of consciousness. The development of responsible AI is paramount.",
        "The deep ocean remains one of the last truly unexplored frontiers on Earth. Pressures are immense and sunlight cannot penetrate, yet life thrives in bizarre and unexpected forms. Hydrothermal vents spew superheated, mineral-rich water, supporting entire ecosystems of extremophiles. Bioluminescent creatures create their own light in the perpetual darkness, using it to hunt, communicate, or evade predators. Each new submersible dive reveals species and processes previously unknown to science.",
        "Photosynthesis is the remarkable process by which green plants, algae, and some bacteria convert light energy into chemical energy. Using sunlight, water, and carbon dioxide, they produce glucose, which fuels their growth, and oxygen, which is essential for most animal life. This intricate biochemical pathway not only forms the foundation of nearly all food webs but also plays a critical role in regulating Earth's climate by consuming vast amounts of atmospheric carbon dioxide.",
        "The Renaissance, a period of intense artistic and intellectual revival, began in Italy during the 14th century and spread throughout Europe. It marked a transition from the Middle Ages to modernity, characterized by a renewed interest in the classical art and literature of ancient Greece and Rome. Thinkers like Leonardo da Vinci and Michelangelo did not just create masterpieces; they embodied the ideal of the 'Renaissance man,' proficient in multiple disciplines from painting to engineering.",
        "The invention of the printing press by Johannes Gutenberg around 1440 was a pivotal moment in human history. It allowed for the mass production of books and the rapid dissemination of ideas, breaking the monopoly on information held by the church and a small literate elite. This democratization of knowledge fueled the Reformation, advanced the Scientific Revolution, and laid the groundwork for the modern age of information. Literacy rates soared, and public discourse was forever changed.",
        "Stoicism, an ancient Greek philosophy, teaches the development of self-control and fortitude as a means of overcoming destructive emotions. The goal is to attain inner peace by focusing only on what is within our control and accepting all external events with equanimity. Philosophers like Epictetus and Marcus Aurelius emphasized that it is not events themselves that harm us, but our judgments about them. This pursuit of virtue and tranquility remains highly relevant today.",
        "Dystopian literature serves as a powerful form of social commentary, exploring the dangers of totalitarianism, rampant technology, and the loss of individuality. Novels like \"Nineteen Eighty-Four\" and \"Brave New World\" present chilling visions of the future to warn us about the present. By exaggerating contemporary trends, these stories force readers to critically examine societal norms and the potential consequences of unchecked power. They are a call to vigilance.",
        "Effective communication is arguably the most critical skill in both professional and personal life. It's not just about transmitting information, but about understanding the emotion and intention behind the words. Active listening, clarity, and empathy are the cornerstones of good communication. Misunderstandings often arise from unstated assumptions or a failure to consider the other person's perspective. Mastering this skill can improve relationships and build strong, collaborative teams.",
        "The concept of 'flow state,' popularized by psychologists, describes a mental state of being fully immersed in an activity. When in flow, you lose track of time, your focus sharpens, and the task itself becomes its own reward. This optimal experience often occurs when your skills are perfectly matched to the challenge at hand. Cultivating these states can lead to greater happiness, creativity, and productivity in all areas of life.",
        "The global supply chain is an incredibly complex network of organizations, people, activities, information, and resources involved in moving a product from supplier to customer. Its fragility was exposed during recent global events, leading to shortages and delays. Companies are now rethinking 'just-in-time' manufacturing, exploring regional sourcing, and investing in new technology for greater transparency. Building resilience in the supply chain is now a top priority.",
        "Urban planning is the intricate process of designing and managing the development of cities and towns. Good planners must balance the competing needs of housing, transportation, green space, and economic development. Sustainable urbanism aims to create cities that are not only functional but also environmentally friendly and socially inclusive. This includes promoting public transit, building walkable neighborhoods, and ensuring affordable housing is available for all residents.",
        "Cryptography is the science of securing communication against third parties. Ancient civilizations used simple substitution ciphers, but modern cryptography relies on complex mathematical algorithms. Public-key infrastructure, for example, allows two parties to communicate securely without ever having shared a secret key beforehand. This technology underpins nearly all secure internet traffic, from online banking to private messaging. New encryption methods will soon be needed.",
        "The human microbiome refers to the trillions of microorganisms, including bacteria, viruses, and fungi, that live in and on our bodies. Far from being harmful, most of these microbes are essential for our health. They help digest food, produce critical vitamins, and regulate our immune system. Research has begun to link the health of our gut microbiome to everything from mental health to autoimmune diseases. This field is revolutionizing our understanding of human biology.",
        "Meditation and mindfulness are practices that train attention and awareness. While rooted in ancient traditions, they are now widely studied for their psychological and physiological benefits. Regular practice has been shown to reduce stress, improve concentration, and enhance emotional regulation. Mindfulness is not about emptying the mind, but rather about observing one's thoughts and feelings without judgment. It is a tool for cultivating a state of calm and present-moment awareness.",
        "The architecture of a building does more than just provide shelter; it shapes our experience of the world. Great architecture considers form, function, and materials, but also its relationship with the surrounding environment and the people who will use it. Sustainable design, or 'green architecture,' focuses on minimizing environmental impact by using renewable materials, optimizing energy efficiency, and incorporating natural light. A well-designed space can elevate the human spirit.",
        "Volcanoes are a powerful and awe-inspiring force of nature, capable of both destruction and creation. When magma from within the Earth's upper mantle works its way to the surface, it erupts to form lava flows and ash deposits. While eruptions can be devastating to nearby communities, they also create incredibly fertile soil and are responsible for forming new landmasses, like the Hawaiian islands. Geologists closely monitor active volcanoes to predict eruptions and mitigate their risks.",
        "The concept of compound interest is a cornerstone of personal finance. It is the process where you earn interest on both your initial principal and the accumulated interest from previous periods. Albert Einstein supposedly called it the eighth wonder of the world. Starting to save early, even with small amounts, allows the power of compounding to work its magic over decades, leading to significant wealth accumulation. It is the most powerful tool for long-term investing.",
        "Sleep is a vital, yet often neglected, component of overall health and well-being. It is not just a passive state of rest; during sleep, the brain is highly active, consolidating memories, processing information, and clearing out toxins. Chronic sleep deprivation is linked to a host of problems, including impaired cognitive function, a weakened immune system, and an increased risk of chronic diseases. Prioritizing consistent, high-quality sleep is as important as diet and exercise.",
        "Black holes are regions of spacetime where gravity is so strong that nothing, not even light, can escape. They are formed when massive stars collapse at the end of their life cycle. At the center of a black hole is a gravitational singularity, a one-dimensional point of infinite density. The boundary from which escape is impossible is called the event horizon. Supermassive black holes are believed to reside at the center of most galaxies, including our own Milky Way.",
        "The Great Barrier Reef, located off the coast of Australia, is the world's largest coral reef system. It is composed of over 2,900 individual reefs and 900 islands, stretching for over 2,300 kilometers. This vibrant ecosystem is home to a staggering diversity of marine life, including thousands of species of fish, corals, and mollusks. Unfortunately, the reef is under severe threat from climate change, which causes coral bleaching, as well as pollution and coastal development.",
        "The Voyager 1 and 2 probes, launched in 1977, are on an interstellar journey, carrying the Golden Record, a time capsule of Earth's sights and sounds. They are the most distant human-made objects, having left the heliosphere, the protective bubble of particles and magnetic fields created by the Sun. Their journey provides invaluable data about the outer reaches of our solar system and the interstellar space beyond. They continue to communicate with Earth, a testament to their robust engineering.",
        "The human brain is a marvel of complexity, containing approximately 86 billion neurons, each connected to thousands of others. This intricate network is responsible for all our thoughts, memories, emotions, and actions. Neuroplasticity, the brain's ability to reorganize itself by forming new neural connections throughout life, is a testament to its adaptability. This capability allows us to learn new skills and recover from brain injuries. Understanding this network is one of the greatest challenges in science.",
        "The Silk Road was not a single route but a vast network of trade passages connecting the East and West for centuries. It facilitated the exchange of goods like silk, spices, and precious metals, but also, more importantly, the transmission of ideas, religions like Buddhism and Christianity, and technologies such as papermaking and gunpowder. This cultural exchange profoundly shaped civilizations across Europe, Asia, and Africa, laying the groundwork for the modern interconnected world.",
        "Blockchain technology is a decentralized, distributed ledger system that records transactions across many computers in a way that makes them resistant to modification. Originally devised for the cryptocurrency Bitcoin, its potential applications extend far beyond finance. Its key features-immutability and transparency-make it a promising tool for supply chain management, secure voting systems, and verifying digital identity, fundamentally changing how we trust and transact.",
        "George Orwell's 'Animal Farm' is a powerful allegorical novella reflecting on the 1917 Russian Revolution and the subsequent rise of Stalinism. Using a group of farm animals who overthrow their human farmer, the story explores timeless themes of power, corruption, and the manipulation of language. The famous quote 'All animals are equal, but some animals are more equal than others' poignantly encapsulates the betrayal of the revolution's original egalitarian ideals.",
        "Cognitive dissonance is the mental discomfort experienced by a person who holds two or more contradictory beliefs, ideas, or values. This discomfort is often triggered when new information conflicts with existing beliefs, forcing an individual to confront the inconsistency. To reduce the dissonance, people may change one of their beliefs, change their behavior, or rationalize their actions to justify the contradiction. It's a powerful motivator for human behavior and decision-making.",
        "Plate tectonics is the scientific theory describing the large-scale motion of the Earth's lithosphere. The planet's outer shell is divided into several rigid plates that glide over the semi-fluid asthenosphere beneath. The boundaries where these plates meet are sites of intense geological activity, such as devastating earthquakes, volcanic eruptions, and the slow, steady formation of mountain ranges like the Himalayas. This theory revolutionized our understanding of geology.",
        "Inflation is the rate at which the general level of prices for goods and services rises, consequently eroding the purchasing power of currency. Central banks attempt to manage inflation to maintain economic stability, typically aiming for a low and stable rate. While moderate inflation is often a sign of a growing economy, runaway hyperinflation can be devastating, quickly rendering a currency worthless and destabilizing entire societies. It is a delicate balancing act for policymakers.",
        "Impressionism, a 19th-century art movement, was characterized by relatively small, thin, yet visible brush strokes and an emphasis on the accurate depiction of light in its changing qualities. Artists like Claude Monet and Edgar Degas sought to capture a fleeting moment and the subjective impression it made on the artist. They often painted outdoors, or 'en plein air,' to observe light and color directly, breaking from traditional studio painting and academic rules.",
        "The Standard Model of particle physics is the theory describing three of the four known fundamental forces-the electromagnetic, weak, and strong interactions-and classifying all known elementary particles. It successfully predicted the existence of particles like the Higgs boson, which was later discovered. However, the model is known to be incomplete, as it does not yet include gravity or account for mysterious phenomena like dark matter and dark energy.",
        "Jazz music, which originated in the African-American communities of New Orleans in the late 19th and early 20th centuries, is characterized by its swing and blue notes, complex chords, and high degree of improvisation. It's a deeply expressive and dynamic art form that has evolved into numerous subgenres, from swing and bebop to fusion and free jazz. It represents a unique and powerful blend of African rhythmic traditions and European harmonic structures.",
        "Deforestation, the clearing of Earth's forests on a massive scale, has severe environmental consequences that reverberate globally. Forests are crucial carbon sinks, meaning they absorb vast amounts of carbon dioxide, and their removal contributes significantly to global warming. This destruction also leads to catastrophic habitat loss for millions of species, soil erosion, and disruption of regional water cycles, often leading to floods and droughts. Sustainable forestry and reforestation are critical.",
        "The Louisiana Purchase of 1803 was a landmark event in American history, nearly doubling the size of the United States overnight. The acquisition of this vast territory from France for a price of fifteen million dollars spurred westward expansion and exploration, most famously undertaken by the Lewis and Clark Expedition. It was one of the most significant real estate deals in history, reshaping the political and demographic map of North America.",
        "Machine learning, a subset of artificial intelligence, involves algorithms that allow computers to learn from and make predictions or decisions based on data. Instead of being explicitly programmed with a set of rules, the system 'learns' to recognize complex patterns from a large training dataset. This technology is the driving force behind spam filters, facial recognition software, and the personalized recommendation engines used by streaming services and online retailers.",
        "Existentialism is a philosophical movement that emphasizes individual freedom, responsibility, and subjectivity. Thinkers like Jean-Paul Sartre and Simone de Beauvoir argued that 'existence precedes essence,' meaning that individuals are not born with a predefined purpose. Instead, they must create their own meaning and define their own values in an often absurd and meaningless world through their choices and actions. This places the burden of identity squarely on the individual.",
        "Coral reefs are often called 'rainforests of the sea' due to their incredible biodiversity. Although they cover less than one percent of the ocean floor, they are estimated to support about twenty-five percent of all marine species. These complex ecosystems are built by tiny animals called coral polyps, which secrete a hard calcium carbonate skeleton. They are vital for protecting coastlines from storms and erosion, and they support major tourism and fishing industries.",
        "The periodic table of elements is a tabular display of the chemical elements, organized by atomic number, electron configuration, and recurring chemical properties. First developed in a recognizable form by Dmitri Mendeleev, its structure was so insightful that it allowed him to predict the properties of elements that had not yet been discovered. It remains one of the most important tools in chemistry, providing a comprehensive framework for understanding chemical behavior.",
        "Dark matter is a hypothetical form of matter believed to account for approximately 85% of the matter in the universe. Its presence is strongly implied by its gravitational effects on visible matter, radiation, and the large-scale structure of the universe. However, it does not appear to interact with the electromagnetic spectrum, meaning it does not absorb, reflect, or emit light. This makes it invisible and incredibly difficult to detect directly with current technology.",
        "Frank Herbert's 'Dune' is a seminal work of science fiction that explores complex, interwoven themes of politics, religion, ecology, and technology. Set on the harsh desert planet Arrakis, the only source of the valuable spice melange, the novel follows the journey of Paul Atreides as he navigages a dangerous feudal interstellar society. Its intricate world-building and deep philosophical underpinnings have influenced the genre for decades and continue to resonate with new readers.",
        "The placebo effect is a fascinating and well-documented phenomenon where a person experiences a perceived improvement in their condition after receiving a treatment with no actual therapeutic value, such as a sugar pill. This effect highlights the powerful connection between the mind and body. The belief in a treatment's efficacy can, in itself, trigger real physiological changes, such as the release of endorphins or a reduction in stress hormones. It is a critical factor in clinical drug trials."
    ];

    function loadNewTest() {
        const randomIndex = Math.floor(Math.random() * textSamples.length);
        textToType = textSamples[randomIndex];

        textDisplay.innerHTML = "";
        textToType.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            textDisplay.appendChild(charSpan);
        });
        
        resetGame();
    }

    function resetGame() {
        clearInterval(timerInterval);
        
        timeLeft = GAME_TIME_SECONDS;
        gameStarted = false;
        totalCharsTyped = 0;
        correctCharsTyped = 0;
        gameStartTime = null;
        
        //reset UI
        timerElement.innerText = formatTime(timeLeft);
        wpmElement.innerText = "0";
        accuracyElement.innerText = "100%";
        inputField.value = "";
        inputField.disabled = false;
        
        textDisplay.classList.remove('active');
        resultsContent.classList.add('hidden');

        textDisplay.querySelectorAll('span').forEach(span => {
            span.classList.remove('correct', 'error', 'cursor');
        });
        
        if (textDisplay.children.length > 0) {
            textDisplay.children[0].classList.add('cursor');
        }
        
        inputField.focus();
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function startGameTimer() {
        if (gameStarted) return;
        
        gameStarted = true;
        gameStartTime = Date.now();
        textDisplay.classList.add('active');

        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.innerText = formatTime(timeLeft);

            updateLiveStats();

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function handleTyping() {

        if (!gameStarted) {
            startGameTimer();
        }

        const userInput = inputField.value;
        const textChars = textDisplay.querySelectorAll('span');
        
        totalCharsTyped = userInput.length;
        correctCharsTyped = 0;

        textChars.forEach((charSpan, index) => {
            const char = charSpan.innerText;
            
            charSpan.classList.remove('cursor');

            if (index < userInput.length) {
                if (userInput[index] === char) {
                    charSpan.classList.add('correct');
                    charSpan.classList.remove('error');
                    correctCharsTyped++;
                } else {
                    charSpan.classList.add('error');
                    charSpan.classList.remove('correct');
                }
            } else {
                charSpan.classList.remove('correct', 'error');
            }
        });
        
        if (totalCharsTyped < textChars.length) {
            textChars[totalCharsTyped].classList.add('cursor');
        }

        updateLiveStats();

        if (totalCharsTyped === textToType.length) {
            endGame();
        }
    }

    function updateLiveStats() {
        const accuracy = totalCharsTyped > 0 ? (correctCharsTyped / totalCharsTyped) * 100 : 100;
        accuracyElement.innerText = `${Math.round(accuracy)}%`;

        const elapsedMinutes = (GAME_TIME_SECONDS - timeLeft) / 60;
        const wpm = elapsedMinutes > 0 ? (totalCharsTyped / 5) / elapsedMinutes : 0;
        wpmElement.innerText = Math.round(wpm);
    }

    function endGame() {
        clearInterval(timerInterval);
        const gameEndTime = Date.now();
        
        gameStarted = false;
        inputField.disabled = true;
        textDisplay.classList.remove('active');

        textDisplay.querySelector('.cursor')?.classList.remove('cursor');
        
        let elapsedSeconds;
        if (timeLeft <= 0) {
            elapsedSeconds = GAME_TIME_SECONDS;
        } else if (gameStartTime) {
            elapsedSeconds = (gameEndTime - gameStartTime) / 1000;
        } else {
            elapsedSeconds = 0;
        }

        const elapsedMinutes = elapsedSeconds / 60;
        const finalWPM = elapsedMinutes > 0 ? (correctCharsTyped / 5) / elapsedMinutes : 0;
        const finalAccuracy = totalCharsTyped > 0 ? (correctCharsTyped / totalCharsTyped) * 100 : 100;

        finalWPMElement.innerText = Math.round(finalWPM);
        finalAccuracyElement.innerText = `${Math.round(finalAccuracy)}%`;

        resultsContent.classList.remove('hidden');
    }

    inputField.addEventListener('input', handleTyping);
    newTestButton.addEventListener('click', loadNewTest);
    restartButton.addEventListener('click', resetGame);

    window.restartTest = resetGame;

    loadNewTest();
});
document.addEventListener('DOMContentLoaded', function() {
    const languageSwitcher = document.getElementById('language-switcher');

    // Função para carregar traduções de um arquivo JSON
    function loadTranslations(language) {
        return fetch(`translations/${language}.json`)
            .then(response => response.json())
            .catch(error => console.error('Erro ao carregar traduções:', error));
    }

    // Atualiza o conteúdo da página com as traduções carregadas
    function updateContent(translations) {
        document.querySelectorAll('[data-translate]').forEach(function(element) {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    }

    // Evento de clique nos botões de idioma
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            loadTranslations(language).then(translations => {
                updateContent(translations);
                localStorage.setItem('preferredLanguage', language); // Salva a preferência de idioma
            });
        });
    });

    // Configura o idioma inicial
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'pt';
    document.getElementById('language-switcher').value = savedLanguage;
    loadTranslations(savedLanguage).then(translations => {
        updateContent(translations);
    });
});

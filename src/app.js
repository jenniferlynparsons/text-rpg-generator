/**
 * Plastic 2.0 - Text-based RPG Engine
 * Main Application File
 */

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    const app = new PlasticApp();
    app.init();
});

/**
 * Main Application Class
 */
class PlasticApp {
    constructor() {
        // Core components
        this.parser = null;
        this.renderer = null;
        this.stateManager = null;
        this.configManager = null;
        
        // Mediators
        this.characterMediator = null;
        this.inventoryMediator = null;
        this.activityMediator = null;
        this.statMediator = null;
        
        // UI elements
        this.markdownEditor = document.getElementById('markdown-editor');
        this.previewContainer = document.getElementById('preview-container');
        this.configEditor = document.getElementById('config-editor');
        
        // Current state
        this.currentView = 'creator';
        this.currentGame = null;
        this.isTestMode = false;
        this.isDirty = false;
        
        // Bind methods
        this.handleNavigation = this.handleNavigation.bind(this);
        this.handleEditorInput = this.handleEditorInput.bind(this);
        this.handlePreviewModeChange = this.handlePreviewModeChange.bind(this);
        this.handleNewGame = this.handleNewGame.bind(this);
        this.handleOpenGame = this.handleOpenGame.bind(this);
        this.handleSaveGame = this.handleSaveGame.bind(this);
        this.handleExportGame = this.handleExportGame.bind(this);
        this.handleTestGame = this.handleTestGame.bind(this);
    }
    
    /**
     * Initialize the application
     */
    init() {
        console.log('Initializing Plastic 2.0...');
        
        // Initialize core components
        this.initCoreComponents();
        
        // Initialize mediators
        this.initMediators();
        
        // Initialize UI
        this.initUI();
        
        // Load settings
        this.loadSettings();
        
        // Check for autosave
        this.checkForAutosave();
        
        console.log('Plastic 2.0 initialized successfully!');
    }
    
    /**
     * Initialize core components
     */
    initCoreComponents() {
        // Initialize parser
        this.parser = new Parser();
        
        // Initialize renderer
        this.renderer = new Renderer();
        
        // Initialize state manager
        this.stateManager = new StateManager();
        
        // Initialize config manager
        this.configManager = new ConfigManager();
    }
    
    /**
     * Initialize mediators
     */
    initMediators() {
        // Initialize character mediator
        this.characterMediator = new CharacterMediator(this.stateManager);
        
        // Initialize inventory mediator
        this.inventoryMediator = new InventoryMediator(this.stateManager);
        
        // Initialize activity mediator
        this.activityMediator = new ActivityMediator(this.stateManager);
        
        // Initialize stat mediator
        this.statMediator = new StatMediator(this.stateManager);
    }
    
    /**
     * Initialize UI
     */
    initUI() {
        // Set up navigation
        const navLinks = document.querySelectorAll('#main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigation);
        });
        
        // Set up editor
        if (this.markdownEditor) {
            this.markdownEditor.addEventListener('input', this.handleEditorInput);
        }
        
        // Set up preview mode
        const previewModeSelector = document.getElementById('preview-mode');
        if (previewModeSelector) {
            previewModeSelector.addEventListener('change', this.handlePreviewModeChange);
        }
        
        // Set up buttons
        const newGameButton = document.getElementById('new-game');
        const openGameButton = document.getElementById('open-game');
        const saveGameButton = document.getElementById('save-game');
        const exportGameButton = document.getElementById('export-game');
        const testGameButton = document.getElementById('test-game');
        
        if (newGameButton) newGameButton.addEventListener('click', this.handleNewGame);
        if (openGameButton) openGameButton.addEventListener('click', this.handleOpenGame);
        if (saveGameButton) saveGameButton.addEventListener('click', this.handleSaveGame);
        if (exportGameButton) exportGameButton.addEventListener('click', this.handleExportGame);
        if (testGameButton) testGameButton.addEventListener('click', this.handleTestGame);
        
        // Initialize editor with syntax highlighting
        this.initSyntaxHighlighting();
    }
    
    /**
     * Initialize syntax highlighting for the editor
     */
    initSyntaxHighlighting() {
        // This is a placeholder for syntax highlighting implementation
        // In a real implementation, we would use a library like CodeMirror or Ace Editor
        console.log('Syntax highlighting initialized');
    }
    
    /**
     * Load application settings
     */
    loadSettings() {
        // Load settings from localStorage
        const settings = localStorage.getItem('plastic_settings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            this.applySettings(parsedSettings);
        } else {
            // Use default settings
            this.applySettings({
                theme: 'light',
                fontSize: 16,
                autoSave: true,
                autoSaveInterval: 60,
                textSpeed: 5
            });
        }
    }
    
    /**
     * Apply settings to the application
     * @param {Object} settings - The settings to apply
     */
    applySettings(settings) {
        // Apply theme
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
        document.body.classList.add(`theme-${settings.theme}`);
        
        // Apply font size
        document.documentElement.style.setProperty('--font-size-md', `${settings.fontSize}px`);
        
        // Apply other settings
        // ...
        
        console.log('Settings applied:', settings);
    }
    
    /**
     * Check for autosave
     */
    checkForAutosave() {
        const autosave = localStorage.getItem('plastic_autosave');
        if (autosave) {
            // Ask user if they want to restore from autosave
            if (confirm('We found an autosaved game. Would you like to restore it?')) {
                this.loadGameFromString(autosave);
            } else {
                // Clear autosave
                localStorage.removeItem('plastic_autosave');
            }
        }
    }
    
    /**
     * Handle navigation between views
     * @param {Event} event - The click event
     */
    handleNavigation(event) {
        event.preventDefault();
        
        // Get the target view
        const targetView = event.target.getAttribute('data-view');
        
        // Check if we need to save before navigating
        if (this.isDirty && this.currentView === 'creator' && targetView !== 'creator') {
            if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
                return;
            }
        }
        
        // Update navigation links
        const navLinks = document.querySelectorAll('#main-nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
        });
        
        // Show the target view
        const targetViewElement = document.getElementById(`${targetView}-view`);
        if (targetViewElement) {
            targetViewElement.classList.add('active');
        }
        
        // Update current view
        this.currentView = targetView;
        
        // Perform any necessary actions for the new view
        this.handleViewChange(targetView);
    }
    
    /**
     * Handle actions when changing views
     * @param {string} view - The new view
     */
    handleViewChange(view) {
        switch (view) {
            case 'creator':
                // Nothing special needed for creator view
                break;
            case 'player':
                // Initialize player view
                this.initPlayerView();
                break;
            case 'templates':
                // Load templates
                this.loadTemplates();
                break;
            case 'settings':
                // Load current settings into form
                this.loadSettingsIntoForm();
                break;
        }
    }
    
    /**
     * Initialize the player view
     */
    initPlayerView() {
        // Check if we have a current game
        if (!this.currentGame) {
            // No game loaded, show a message
            const gameContent = document.getElementById('game-content');
            if (gameContent) {
                gameContent.innerHTML = '<div class="text-center"><h3>No Game Loaded</h3><p>Create a new game in the Creator view or load an existing game.</p></div>';
            }
            return;
        }
        
        // Initialize the game in player view
        // ...
    }
    
    /**
     * Load templates into the templates view
     */
    loadTemplates() {
        // This would typically fetch templates from a server or local storage
        // For now, we'll use some dummy data
        const templates = [
            {
                id: 'fantasy-basic',
                title: 'Fantasy Adventure',
                description: 'A basic fantasy adventure template with character stats, inventory, and quests.',
                genre: 'fantasy',
                thumbnail: 'assets/samples/fantasy-thumbnail.jpg'
            },
            {
                id: 'scifi-basic',
                title: 'Sci-Fi Explorer',
                description: 'A science fiction adventure in space with technology, alien encounters, and space travel.',
                genre: 'scifi',
                thumbnail: 'assets/samples/scifi-thumbnail.jpg'
            },
            {
                id: 'mystery-basic',
                title: 'Mystery Detective',
                description: 'A detective mystery with clues, suspects, and a case to solve.',
                genre: 'mystery',
                thumbnail: 'assets/samples/mystery-thumbnail.jpg'
            }
        ];
        
        // Render templates
        const templatesList = document.getElementById('templates-list');
        if (templatesList) {
            templatesList.innerHTML = templates.map(template => `
                <div class="template-card" data-id="${template.id}" data-genre="${template.genre}">
                    <div class="template-card-title">${template.title}</div>
                    <div class="template-card-description">${template.description}</div>
                    <button class="mt-md">Use Template</button>
                </div>
            `).join('');
            
            // Add event listeners to template cards
            const templateCards = document.querySelectorAll('.template-card button');
            templateCards.forEach(card => {
                card.addEventListener('click', (event) => {
                    const templateId = event.target.closest('.template-card').getAttribute('data-id');
                    this.loadTemplate(templateId);
                });
            });
        }
    }
    
    /**
     * Load a specific template
     * @param {string} templateId - The ID of the template to load
     */
    loadTemplate(templateId) {
        console.log(`Loading template: ${templateId}`);
        
        // This would typically fetch the template content from a server or local storage
        // For now, we'll use some dummy data
        let templateContent = '';
        
        switch (templateId) {
            case 'fantasy-basic':
                templateContent = `# Scene: Village Square

You stand in the center of a small village. The sun is shining, and villagers are going about their daily business.

## Options
- [[Visit the blacksmith->Blacksmith]]
- [[Go to the tavern->Tavern]]
- [[Leave the village->RoadFork]]

## NPCs
- Village Elder {
    name: "Eldric",
    dialog: [
      "Welcome to our humble village, traveler.",
      "[[Ask about the village->VillageHistory]]",
      "[[Ask about nearby dangers->NearbyDangers]]",
      "[[Goodbye->VillageSquare]]"
    ]
  }

## Items
- Village Map {type: quest, quest: ExploreVillage, description: "A simple map showing the layout of the village"}

## Stats
- {stat: reputation, change: +1, condition: "FirstTimeHere"}`;
                break;
            case 'scifi-basic':
                templateContent = `# Scene: Space Station Dock

You've just docked your small transport ship at Nexus-7, a bustling space station at the edge of the galaxy.

## Options
- [[Enter the main concourse->Concourse]]
- [[Visit the trade center->TradeCenter]]
- [[Return to your ship->Ship]]

## NPCs
- Station Security {
    name: "Officer Zara",
    dialog: [
      "State your business, traveler.",
      "[[I'm here to trade->TradeDialog]]",
      "[[I'm looking for information->InfoDialog]]",
      "[[Just passing through->PassingDialog]]"
    ]
  }

## Items
- Station Pass {type: key, effect: access, description: "A digital pass granting access to restricted areas"}

## Stats
- {stat: authority, change: -1, condition: "NoStationPass"}`;
                break;
            case 'mystery-basic':
                templateContent = `# Scene: Detective's Office

Rain patters against the window of your dimly lit office. A case file sits open on your desk.

## Options
- [[Review the case file->CaseFile]]
- [[Visit the crime scene->CrimeScene]]
- [[Call your informant->Informant]]

## NPCs
- Secretary {
    name: "Nancy",
    dialog: [
      "There's been another call about the Henderson case.",
      "[[Tell me more->HendersonInfo]]",
      "[[Any other messages?->OtherMessages]]",
      "[[I'll handle it later->DetectivesOffice]]"
    ]
  }

## Items
- Case Notes {type: clue, case: Henderson, description: "Your preliminary notes on the Henderson murder case"}

## Stats
- {stat: insight, change: +1, condition: "FirstTimeReview"}`;
                break;
        }
        
        // Load the template content into the editor
        if (this.markdownEditor) {
            this.markdownEditor.value = templateContent;
            this.handleEditorInput();
        }
        
        // Switch to creator view
        const creatorLink = document.querySelector('#main-nav a[data-view="creator"]');
        if (creatorLink) {
            creatorLink.click();
        }
    }
    
    /**
     * Load current settings into the settings form
     */
    loadSettingsIntoForm() {
        // Get current settings
        const settings = localStorage.getItem('plastic_settings');
        if (!settings) return;
        
        const parsedSettings = JSON.parse(settings);
        
        // Update form elements
        const themeSelector = document.getElementById('theme-selector');
        const fontSizeInput = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        const autoSaveCheckbox = document.getElementById('auto-save');
        const autoSaveIntervalInput = document.getElementById('auto-save-interval');
        const textSpeedInput = document.getElementById('text-speed');
        const textSpeedValue = document.getElementById('text-speed-value');
        
        if (themeSelector) themeSelector.value = parsedSettings.theme;
        if (fontSizeInput) {
            fontSizeInput.value = parsedSettings.fontSize;
            if (fontSizeValue) fontSizeValue.textContent = `${parsedSettings.fontSize}px`;
        }
        if (autoSaveCheckbox) autoSaveCheckbox.checked = parsedSettings.autoSave;
        if (autoSaveIntervalInput) autoSaveIntervalInput.value = parsedSettings.autoSaveInterval;
        if (textSpeedInput) {
            textSpeedInput.value = parsedSettings.textSpeed;
            if (textSpeedValue) {
                const speedLabels = ['Very Slow', 'Slow', 'Medium Slow', 'Medium', 'Medium Fast', 'Fast', 'Very Fast', 'Instant'];
                textSpeedValue.textContent = speedLabels[parsedSettings.textSpeed - 1] || 'Medium';
            }
        }
    }
    
    /**
     * Handle editor input
     */
    handleEditorInput() {
        // Mark as dirty
        this.isDirty = true;
        
        // Get editor content
        const content = this.markdownEditor.value;
        
        // Parse content
        const parsedContent = this.parser.parse(content);
        
        // Update preview based on current mode
        this.updatePreview(parsedContent);
        
        // Autosave if enabled
        this.handleAutosave();
    }
    
    /**
     * Update the preview based on the current mode
     * @param {Object} parsedContent - The parsed content
     */
    updatePreview(parsedContent) {
        // Get current preview mode
        const previewMode = document.getElementById('preview-mode').value;
        
        // Update preview container
        switch (previewMode) {
            case 'rendered':
                this.previewContainer.innerHTML = this.renderer.renderPreview(parsedContent);
                break;
            case 'structure':
                this.previewContainer.innerHTML = this.renderer.renderStructure(parsedContent);
                break;
            case 'validation':
                this.previewContainer.innerHTML = this.renderer.renderValidation(parsedContent);
                break;
        }
    }
    
    /**
     * Handle preview mode change
     */
    handlePreviewModeChange() {
        // Get editor content
        const content = this.markdownEditor.value;
        
        // Parse content
        const parsedContent = this.parser.parse(content);
        
        // Update preview
        this.updatePreview(parsedContent);
    }
    
    /**
     * Handle autosave
     */
    handleAutosave() {
        // Check if autosave is enabled
        const settings = localStorage.getItem('plastic_settings');
        if (!settings) return;
        
        const parsedSettings = JSON.parse(settings);
        if (!parsedSettings.autoSave) return;
        
        // Save to localStorage
        localStorage.setItem('plastic_autosave', this.markdownEditor.value);
    }
    
    /**
     * Handle new game
     */
    handleNewGame() {
        // Check if we need to save before creating a new game
        if (this.isDirty) {
            if (!confirm('You have unsaved changes. Are you sure you want to create a new game?')) {
                return;
            }
        }
        
        // Clear editor
        this.markdownEditor.value = '# Scene: Start\n\nYour adventure begins here.\n\n## Options\n- [[Go forward->NextScene]]\n\n## Items\n- Basic Item {type: common, effect: none, description: "A simple item"}\n\n## NPCs\n- Guide {name: "Helper", dialog: ["Welcome to your adventure!"]}\n\n## Stats\n- {stat: courage, change: +1, condition: "FirstTimeHere"}';
        
        // Reset current game
        this.currentGame = null;
        
        // Update preview
        this.handleEditorInput();
        
        // Reset dirty flag
        this.isDirty = false;
    }
    
    /**
     * Handle open game
     */
    handleOpenGame() {
        // Check if we need to save before opening a game
        if (this.isDirty) {
            if (!confirm('You have unsaved changes. Are you sure you want to open another game?')) {
                return;
            }
        }
        
        // Show open game modal
        // For now, we'll use a simple file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.json,.plastic';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                this.loadGameFromString(content);
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    /**
     * Load game from string
     * @param {string} content - The game content
     */
    loadGameFromString(content) {
        // Set editor content
        this.markdownEditor.value = content;
        
        // Update preview
        this.handleEditorInput();
        
        // Reset dirty flag
        this.isDirty = false;
    }
    
    /**
     * Handle save game
     */
    handleSaveGame() {
        // Get editor content
        const content = this.markdownEditor.value;
        
        // Create a blob
        const blob = new Blob([content], { type: 'text/markdown' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game.md';
        a.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Reset dirty flag
        this.isDirty = false;
    }
    
    /**
     * Handle export game
     */
    handleExportGame() {
        // Get editor content
        const content = this.markdownEditor.value;
        
        // Parse content
        const parsedContent = this.parser.parse(content);
        
        // Create a game package
        const gamePackage = {
            content: content,
            parsed: parsedContent,
            config: this.configManager.getConfig(),
            metadata: {
                title: this.extractTitle(content),
                author: 'Unknown',
                version: '1.0.0',
                date: new Date().toISOString()
            }
        };
        
        // Create a blob
        const blob = new Blob([JSON.stringify(gamePackage, null, 2)], { type: 'application/json' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game.plastic';
        a.click();
        
        // Clean up
        URL.revokeObjectURL(url);
    }
    
    /**
     * Extract title from content
     * @param {string} content - The game content
     * @returns {string} - The extracted title
     */
    extractTitle(content) {
        // Look for the first heading
        const match = content.match(/^# (.+)$/m);
        if (match && match[1]) {
            return match[1].replace(/Scene: /, '');
        }
        return 'Untitled Game';
    }
    
    /**
     * Handle test game
     */
    handleTestGame() {
        // Get editor content
        const content = this.markdownEditor.value;
        
        // Parse content
        const parsedContent = this.parser.parse(content);
        
        // Set current game
        this.currentGame = {
            content: content,
            parsed: parsedContent
        };
        
        // Switch to player view
        const playerLink = document.querySelector('#main-nav a[data-view="player"]');
        if (playerLink) {
            playerLink.click();
        }
    }
} 
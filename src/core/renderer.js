/**
 * Plastic 2.0 - Text-based RPG Engine
 * Renderer Module
 * 
 * Responsible for rendering game content in different formats
 */

class Renderer {
    constructor() {
        // Initialize any renderer-specific properties
    }
    
    /**
     * Render the game content for preview
     * @param {Object} parsedGame - The parsed game content
     * @returns {string} - HTML representation of the game
     */
    renderPreview(parsedGame) {
        // If no game is parsed, return a message
        if (!parsedGame || !parsedGame.scenes || Object.keys(parsedGame.scenes).length === 0) {
            return '<div class="preview-message">No content to preview. Start writing your game!</div>';
        }
        
        // Get the current scene
        const currentSceneName = parsedGame.currentScene;
        const currentScene = parsedGame.scenes[currentSceneName];
        
        if (!currentScene) {
            return '<div class="preview-message">No current scene to display.</div>';
        }
        
        // Build the HTML for the scene
        let html = `
            <div class="markdown-preview">
                <h1 class="scene-title">${currentScene.name}</h1>
                <div class="scene-description">${this.formatText(currentScene.description)}</div>
        `;
        
        // Add options
        if (currentScene.options && currentScene.options.length > 0) {
            html += '<div class="scene-options"><h2>Options</h2><ul>';
            for (const option of currentScene.options) {
                let optionHtml = `<li class="scene-option">
                    <a href="#" data-target="${option.target}">${option.text}</a>`;
                
                if (option.condition) {
                    optionHtml += `<span class="option-condition">(Requires: ${option.condition})</span>`;
                }
                
                optionHtml += '</li>';
                html += optionHtml;
            }
            html += '</ul></div>';
        }
        
        // Add items
        if (currentScene.items && currentScene.items.length > 0) {
            html += '<div class="scene-items"><h2>Items</h2><ul>';
            for (const item of currentScene.items) {
                html += `<li class="scene-item">
                    <span class="item-name">${item.name}</span>`;
                
                if (item.description) {
                    html += `<span class="item-description">${item.description}</span>`;
                }
                
                html += '</li>';
            }
            html += '</ul></div>';
        }
        
        // Add NPCs
        if (currentScene.npcs && currentScene.npcs.length > 0) {
            html += '<div class="scene-npcs"><h2>NPCs</h2><ul>';
            for (const npc of currentScene.npcs) {
                html += `<li class="scene-npc">
                    <span class="npc-name">${npc.name}</span>`;
                
                if (npc.dialog && npc.dialog.length > 0) {
                    html += '<div class="npc-dialog"><h3>Dialog</h3><ul>';
                    for (const dialog of npc.dialog) {
                        if (typeof dialog === 'string') {
                            html += `<li class="dialog-line">${dialog}</li>`;
                        } else if (typeof dialog === 'object') {
                            html += `<li class="dialog-option">
                                <a href="#" data-target="${dialog.target}">${dialog.text}</a>
                            </li>`;
                        }
                    }
                    html += '</ul></div>';
                }
                
                html += '</li>';
            }
            html += '</ul></div>';
        }
        
        // Add stats
        if (currentScene.stats && currentScene.stats.length > 0) {
            html += '<div class="scene-stats"><h2>Stats</h2><ul>';
            for (const stat of currentScene.stats) {
                html += `<li class="scene-stat">
                    <span class="stat-name">${stat.stat}</span>
                    <span class="stat-change">${stat.change}</span>
                    <span class="stat-condition">(When: ${stat.condition})</span>
                </li>`;
            }
            html += '</ul></div>';
        }
        
        // Add custom mechanics
        if (currentScene.custom && currentScene.custom.length > 0) {
            html += '<div class="scene-custom"><h2>Custom Mechanics</h2><ul>';
            for (const mechanic of currentScene.custom) {
                html += `<li class="scene-mechanic">
                    <span class="mechanic-name">${mechanic.mechanic}</span>
                    <span class="mechanic-properties">${JSON.stringify(mechanic.properties)}</span>
                </li>`;
            }
            html += '</ul></div>';
        }
        
        html += '</div>';
        
        return html;
    }
    
    /**
     * Render the game structure for visualization
     * @param {Object} parsedGame - The parsed game content
     * @returns {string} - HTML representation of the game structure
     */
    renderStructure(parsedGame) {
        // If no game is parsed, return a message
        if (!parsedGame || !parsedGame.scenes || Object.keys(parsedGame.scenes).length === 0) {
            return '<div class="preview-message">No content to analyze. Start writing your game!</div>';
        }
        
        // Build the HTML for the structure
        let html = '<div class="structure-preview">';
        
        // Add scene count
        const sceneCount = Object.keys(parsedGame.scenes).length;
        html += `<div class="structure-summary">
            <h2>Game Structure</h2>
            <p>Total Scenes: ${sceneCount}</p>
        </div>`;
        
        // Add scene list
        html += '<div class="structure-scenes">';
        for (const sceneName in parsedGame.scenes) {
            const scene = parsedGame.scenes[sceneName];
            const isCurrent = sceneName === parsedGame.currentScene;
            
            html += `<div class="structure-element ${isCurrent ? 'current-scene' : ''}">
                <div class="structure-element-title">${sceneName} ${isCurrent ? '(Current)' : ''}</div>
                <div class="structure-element-content">`;
            
            // Add options
            if (scene.options && scene.options.length > 0) {
                html += `<div class="structure-options">
                    <strong>Options:</strong> ${scene.options.length}
                    <ul>`;
                for (const option of scene.options) {
                    html += `<li>${option.text} → ${option.target}</li>`;
                }
                html += '</ul></div>';
            }
            
            // Add items
            if (scene.items && scene.items.length > 0) {
                html += `<div class="structure-items">
                    <strong>Items:</strong> ${scene.items.length}
                </div>`;
            }
            
            // Add NPCs
            if (scene.npcs && scene.npcs.length > 0) {
                html += `<div class="structure-npcs">
                    <strong>NPCs:</strong> ${scene.npcs.length}
                </div>`;
            }
            
            // Add stats
            if (scene.stats && scene.stats.length > 0) {
                html += `<div class="structure-stats">
                    <strong>Stats:</strong> ${scene.stats.length}
                </div>`;
            }
            
            html += '</div></div>';
        }
        html += '</div>';
        
        // Add connection visualization
        html += '<div class="structure-connections">
            <h2>Scene Connections</h2>
            <p>This would display a visual graph of scene connections.</p>
        </div>';
        
        html += '</div>';
        
        return html;
    }
    
    /**
     * Render validation results
     * @param {Object} parsedGame - The parsed game content
     * @returns {string} - HTML representation of validation results
     */
    renderValidation(parsedGame) {
        // If no game is parsed, return a message
        if (!parsedGame || !parsedGame.scenes || Object.keys(parsedGame.scenes).length === 0) {
            return '<div class="preview-message">No content to validate. Start writing your game!</div>';
        }
        
        // Validate the game
        const validation = this.validateGame(parsedGame);
        
        // Build the HTML for the validation results
        let html = '<div class="validation-preview">';
        
        // Add validation summary
        html += `<div class="validation-summary">
            <h2>Validation Results</h2>
            <p>Errors: ${validation.errors.length}</p>
            <p>Warnings: ${validation.warnings.length}</p>
        </div>`;
        
        // Add errors
        if (validation.errors.length > 0) {
            html += '<div class="validation-errors"><h3>Errors</h3><ul>';
            for (const error of validation.errors) {
                html += `<li class="validation-error">${error}</li>`;
            }
            html += '</ul></div>';
        }
        
        // Add warnings
        if (validation.warnings.length > 0) {
            html += '<div class="validation-warnings"><h3>Warnings</h3><ul>';
            for (const warning of validation.warnings) {
                html += `<li class="validation-warning">${warning}</li>`;
            }
            html += '</ul></div>';
        }
        
        // If no errors or warnings, show success message
        if (validation.errors.length === 0 && validation.warnings.length === 0) {
            html += '<div class="validation-success">
                <p>Your game looks good! No errors or warnings found.</p>
            </div>';
        }
        
        html += '</div>';
        
        return html;
    }
    
    /**
     * Validate the game
     * @param {Object} parsedGame - The parsed game content
     * @returns {Object} - Validation results
     */
    validateGame(parsedGame) {
        const errors = [];
        const warnings = [];
        
        // Check if there are any scenes
        if (Object.keys(parsedGame.scenes).length === 0) {
            errors.push('No scenes found in the game.');
            return { errors, warnings };
        }
        
        // Check if there is a current scene
        if (!parsedGame.currentScene) {
            errors.push('No current scene specified.');
        }
        
        // Check each scene
        for (const sceneName in parsedGame.scenes) {
            const scene = parsedGame.scenes[sceneName];
            
            // Check if scene has a description
            if (!scene.description) {
                warnings.push(`Scene "${sceneName}" has no description.`);
            }
            
            // Check if scene has options
            if (scene.options.length === 0) {
                warnings.push(`Scene "${sceneName}" has no options.`);
            }
            
            // Check if options point to valid scenes
            for (const option of scene.options) {
                if (!parsedGame.scenes[option.target]) {
                    errors.push(`Option "${option.text}" in scene "${sceneName}" points to non-existent scene "${option.target}".`);
                }
            }
            
            // Check for unreachable scenes
            if (sceneName !== parsedGame.currentScene) {
                let isReachable = false;
                
                // Check if any other scene has an option pointing to this scene
                for (const otherSceneName in parsedGame.scenes) {
                    if (otherSceneName === sceneName) continue;
                    
                    const otherScene = parsedGame.scenes[otherSceneName];
                    for (const option of otherScene.options) {
                        if (option.target === sceneName) {
                            isReachable = true;
                            break;
                        }
                    }
                    
                    // Also check NPC dialog options
                    if (!isReachable) {
                        for (const npc of otherScene.npcs) {
                            if (npc.dialog) {
                                for (const dialog of npc.dialog) {
                                    if (typeof dialog === 'object' && dialog.target === sceneName) {
                                        isReachable = true;
                                        break;
                                    }
                                }
                            }
                            if (isReachable) break;
                        }
                    }
                    
                    if (isReachable) break;
                }
                
                if (!isReachable) {
                    warnings.push(`Scene "${sceneName}" is not reachable from any other scene.`);
                }
            }
        }
        
        return { errors, warnings };
    }
    
    /**
     * Format text with basic markdown
     * @param {string} text - The text to format
     * @returns {string} - Formatted HTML
     */
    formatText(text) {
        if (!text) return '';
        
        // Replace newlines with <br>
        let formatted = text.replace(/\n/g, '<br>');
        
        // Bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Links
        formatted = formatted.replace(/\[\[(.*?)->(.*?)\]\]/g, '<a href="#" data-target="$2">$1</a>');
        
        return formatted;
    }
    
    /**
     * Render the game for player view
     * @param {Object} parsedGame - The parsed game content
     * @param {string} currentScene - The current scene to display
     * @returns {Object} - HTML elements for different parts of the player view
     */
    renderPlayer(parsedGame, currentScene) {
        // If no game is parsed, return a message
        if (!parsedGame || !parsedGame.scenes || Object.keys(parsedGame.scenes).length === 0) {
            return {
                content: '<div class="player-message">No game loaded.</div>',
                options: '',
                stats: '',
                inventory: '',
                quests: ''
            };
        }
        
        // Get the scene to display
        const sceneName = currentScene || parsedGame.currentScene;
        const scene = parsedGame.scenes[sceneName];
        
        if (!scene) {
            return {
                content: '<div class="player-message">Scene not found.</div>',
                options: '',
                stats: '',
                inventory: '',
                quests: ''
            };
        }
        
        // Build the HTML for the scene content
        let contentHtml = `
            <div class="scene">
                <h1 class="scene-title">${scene.name}</h1>
                <div class="scene-description">${this.formatText(scene.description)}</div>
        `;
        
        // Add NPCs with dialog
        if (scene.npcs && scene.npcs.length > 0) {
            for (const npc of scene.npcs) {
                if (npc.dialog && npc.dialog.length > 0) {
                    contentHtml += `<div class="dialog">
                        <div class="dialog-character">
                            <div class="dialog-character-portrait"></div>
                            ${npc.name}
                        </div>
                        <div class="dialog-text">${npc.dialog[0]}</div>
                    </div>`;
                }
            }
        }
        
        contentHtml += '</div>';
        
        // Build the HTML for options
        let optionsHtml = '';
        if (scene.options && scene.options.length > 0) {
            for (const option of scene.options) {
                optionsHtml += `<button class="option-button" data-target="${option.target}">
                    <div class="option-icon"></div>
                    <div class="option-text">${option.text}</div>
                </button>`;
            }
        }
        
        // Build the HTML for stats (placeholder)
        let statsHtml = '<div id="character-stats">';
        statsHtml += `
            <div class="character-stat">
                <div class="stat-name">Strength</div>
                <div class="stat-value">8</div>
            </div>
            <div class="character-stat">
                <div class="stat-name">Intelligence</div>
                <div class="stat-value">10</div>
            </div>
            <div class="character-stat">
                <div class="stat-name">Dexterity</div>
                <div class="stat-value">7</div>
            </div>
            <div class="character-stat">
                <div class="stat-name">Charisma</div>
                <div class="stat-value">6</div>
            </div>
        `;
        statsHtml += '</div>';
        
        statsHtml += '<div id="character-meters">';
        statsHtml += `
            <div class="character-meter">
                <div class="meter-name">
                    Health <span class="meter-value">75/100</span>
                </div>
                <div class="meter-bar">
                    <div class="meter-fill health" style="width: 75%"></div>
                </div>
            </div>
            <div class="character-meter">
                <div class="meter-name">
                    Energy <span class="meter-value">50/100</span>
                </div>
                <div class="meter-bar">
                    <div class="meter-fill energy" style="width: 50%"></div>
                </div>
            </div>
        `;
        statsHtml += '</div>';
        
        // Build the HTML for inventory (placeholder)
        let inventoryHtml = '<div id="inventory-items">';
        inventoryHtml += `
            <div class="inventory-item">
                <div class="item-icon">S</div>
                <div class="item-info">
                    <div class="item-name">Sword</div>
                    <div class="item-quantity">x1</div>
                </div>
            </div>
            <div class="inventory-item">
                <div class="item-icon">P</div>
                <div class="item-info">
                    <div class="item-name">Health Potion</div>
                    <div class="item-quantity">x3</div>
                </div>
            </div>
        `;
        inventoryHtml += '</div>';
        
        // Build the HTML for quests (placeholder)
        let questsHtml = '<div id="quest-list">';
        questsHtml += `
            <div class="quest-item active">
                <div class="quest-title">
                    Find the Lost Artifact
                    <span class="quest-status active">Active</span>
                </div>
                <div class="quest-objectives">
                    <div class="quest-objective">
                        <div class="quest-objective-checkbox"></div>
                        Speak to the village elder
                    </div>
                    <div class="quest-objective">
                        <div class="quest-objective-checkbox"></div>
                        Explore the ancient ruins
                    </div>
                </div>
            </div>
            <div class="quest-item completed">
                <div class="quest-title">
                    Deliver the Message
                    <span class="quest-status completed">Completed</span>
                </div>
            </div>
        `;
        questsHtml += '</div>';
        
        return {
            content: contentHtml,
            options: optionsHtml,
            stats: statsHtml,
            inventory: inventoryHtml,
            quests: questsHtml
        };
    }
} 
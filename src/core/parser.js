/**
 * Plastic 2.0 - Text-based RPG Engine
 * Parser Module
 * 
 * Responsible for parsing markdown content into game objects
 */

class Parser {
    constructor() {
        // Regular expressions for parsing
        this.sceneRegex = /^# Scene: (.+)$/;
        this.sectionRegex = /^## (.+)$/;
        this.optionRegex = /- \[\[(.+?)->(.+?)\]\](?: {(.+?)})?/;
        this.itemRegex = /- (.+?) {(.+?)}/;
        this.npcRegex = /- (.+?) {([^}]+)}/;
        this.statRegex = /- {stat: (.+?), change: (.+?), condition: "(.+?)"}/;
        this.customRegex = /- {mechanic: (.+?), (.+?)}/;
        this.dialogRegex = /"(.+?)"/;
    }
    
    /**
     * Parse markdown content into game objects
     * @param {string} content - The markdown content to parse
     * @returns {Object} - The parsed game objects
     */
    parse(content) {
        // Split content into lines
        const lines = content.split('\n');
        
        // Initialize result object
        const result = {
            scenes: {},
            currentScene: null
        };
        
        // Current section being parsed
        let currentSection = null;
        
        // Current scene being parsed
        let currentScene = null;
        
        // Current NPC being parsed
        let currentNPC = null;
        
        // Parse each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            // Check if this is a scene heading
            const sceneMatch = line.match(this.sceneRegex);
            if (sceneMatch) {
                const sceneName = sceneMatch[1];
                currentScene = {
                    name: sceneName,
                    description: '',
                    options: [],
                    items: [],
                    npcs: [],
                    stats: [],
                    custom: []
                };
                result.scenes[sceneName] = currentScene;
                result.currentScene = sceneName;
                currentSection = 'description';
                continue;
            }
            
            // Check if this is a section heading
            const sectionMatch = line.match(this.sectionRegex);
            if (sectionMatch) {
                currentSection = sectionMatch[1].toLowerCase();
                continue;
            }
            
            // Process line based on current section
            if (currentScene) {
                switch (currentSection) {
                    case 'description':
                        // Add to scene description
                        if (currentScene.description) {
                            currentScene.description += '\n' + line;
                        } else {
                            currentScene.description = line;
                        }
                        break;
                    
                    case 'options':
                        // Parse option
                        const optionMatch = line.match(this.optionRegex);
                        if (optionMatch) {
                            const option = {
                                text: optionMatch[1],
                                target: optionMatch[2],
                                condition: optionMatch[3] || null
                            };
                            currentScene.options.push(option);
                        }
                        break;
                    
                    case 'items':
                        // Parse item
                        const itemMatch = line.match(this.itemRegex);
                        if (itemMatch) {
                            const itemName = itemMatch[1];
                            const itemProps = this.parseProperties(itemMatch[2]);
                            const item = {
                                name: itemName,
                                ...itemProps
                            };
                            currentScene.items.push(item);
                        }
                        break;
                    
                    case 'npcs':
                        // Parse NPC
                        const npcMatch = line.match(this.npcRegex);
                        if (npcMatch) {
                            const npcName = npcMatch[1];
                            const npcProps = this.parseNPCProperties(npcMatch[2], lines, i);
                            const npc = {
                                name: npcName,
                                ...npcProps
                            };
                            currentScene.npcs.push(npc);
                            
                            // Skip lines that were part of the NPC definition
                            if (npcProps.dialogLines) {
                                i += npcProps.dialogLines;
                                delete npcProps.dialogLines;
                            }
                        }
                        break;
                    
                    case 'stats':
                        // Parse stat
                        const statMatch = line.match(this.statRegex);
                        if (statMatch) {
                            const stat = {
                                stat: statMatch[1],
                                change: statMatch[2],
                                condition: statMatch[3]
                            };
                            currentScene.stats.push(stat);
                        }
                        break;
                    
                    case 'custom':
                        // Parse custom mechanic
                        const customMatch = line.match(this.customRegex);
                        if (customMatch) {
                            const mechanic = {
                                mechanic: customMatch[1],
                                properties: this.parseProperties(customMatch[2])
                            };
                            currentScene.custom.push(mechanic);
                        }
                        break;
                }
            }
        }
        
        return result;
    }
    
    /**
     * Parse properties string into object
     * @param {string} propsString - The properties string
     * @returns {Object} - The parsed properties
     */
    parseProperties(propsString) {
        const props = {};
        const pairs = propsString.split(',').map(p => p.trim());
        
        for (const pair of pairs) {
            const [key, value] = pair.split(':').map(p => p.trim());
            
            // Handle quoted strings
            if (value.startsWith('"') && value.endsWith('"')) {
                props[key] = value.slice(1, -1);
            } 
            // Handle numbers
            else if (!isNaN(value)) {
                props[key] = Number(value);
            } 
            // Handle booleans
            else if (value === 'true' || value === 'false') {
                props[key] = value === 'true';
            } 
            // Handle null
            else if (value === 'null') {
                props[key] = null;
            } 
            // Default to string
            else {
                props[key] = value;
            }
        }
        
        return props;
    }
    
    /**
     * Parse NPC properties, handling multi-line dialog arrays
     * @param {string} propsString - The properties string
     * @param {Array} lines - All lines of content
     * @param {number} currentIndex - Current line index
     * @returns {Object} - The parsed properties
     */
    parseNPCProperties(propsString, lines, currentIndex) {
        const props = {};
        let inDialog = false;
        let dialogArray = [];
        let dialogLines = 0;
        
        // Split the properties string by lines
        const propLines = propsString.split('\n');
        
        for (let i = 0; i < propLines.length; i++) {
            const line = propLines[i].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            // Check if we're starting a dialog array
            if (line.includes('dialog: [')) {
                inDialog = true;
                dialogArray = [];
                continue;
            }
            
            // Check if we're ending a dialog array
            if (inDialog && line.includes(']')) {
                inDialog = false;
                props.dialog = dialogArray;
                continue;
            }
            
            // If we're in a dialog array, parse dialog lines
            if (inDialog) {
                const dialogMatch = line.match(this.dialogRegex);
                if (dialogMatch) {
                    dialogArray.push(dialogMatch[1]);
                    dialogLines++;
                } else if (line.includes('[[')) {
                    // Handle dialog options
                    const optionMatch = line.match(this.optionRegex);
                    if (optionMatch) {
                        dialogArray.push({
                            text: optionMatch[1],
                            target: optionMatch[2],
                            condition: optionMatch[3] || null
                        });
                        dialogLines++;
                    }
                }
                continue;
            }
            
            // Parse regular property
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                
                // Handle quoted strings
                if (value.startsWith('"') && value.endsWith('"')) {
                    props[key] = value.slice(1, -1);
                } 
                // Handle numbers
                else if (!isNaN(value)) {
                    props[key] = Number(value);
                } 
                // Handle booleans
                else if (value === 'true' || value === 'false') {
                    props[key] = value === 'true';
                } 
                // Handle null
                else if (value === 'null') {
                    props[key] = null;
                } 
                // Default to string
                else {
                    props[key] = value;
                }
            }
        }
        
        // Add the number of dialog lines for the caller to skip
        props.dialogLines = dialogLines;
        
        return props;
    }
    
    /**
     * Validate the parsed game objects
     * @param {Object} parsedGame - The parsed game objects
     * @returns {Object} - Validation results
     */
    validate(parsedGame) {
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
            
            // Check NPC dialog options
            for (const npc of scene.npcs) {
                if (npc.dialog) {
                    for (const dialog of npc.dialog) {
                        if (typeof dialog === 'object' && dialog.target) {
                            if (!parsedGame.scenes[dialog.target]) {
                                errors.push(`Dialog option "${dialog.text}" for NPC "${npc.name}" in scene "${sceneName}" points to non-existent scene "${dialog.target}".`);
                            }
                        }
                    }
                }
            }
        }
        
        return { errors, warnings };
    }
} 
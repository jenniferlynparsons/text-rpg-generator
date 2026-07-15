# Plastic 2.0 - Text-Based RPG Engine

Plastic 2.0 is a modern web application that serves as an engine for building and playing text-based RPG games. It converts markdown files with special syntax into playable HTML/CSS/JavaScript RPG games.

## Features

- **Local-only web application** - No server required
- **Markdown-based game creation** - Write games using an extended markdown syntax
- **Rich RPG mechanics** - Support for characters, inventory, quests, stats, and more
- **Game state management** - Save/load functionality with localStorage
- **Plugin system** - Extend functionality with custom plugins
- **Template system** - Quick-start game development with templates
- **Export/import system** - Share games and saved states

## Core Game Mechanics

- **Character System**: Create and customize characters with stats
- **Inventory System**: Manage items with properties and effects
- **Interaction System**: Dialog trees and conditional interactions
- **Quest/Task System**: Track quests and objectives
- **Stats and Meters**: Character attributes and status indicators
- **Game State**: Save/load progress and track game history

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Start creating your game in the Creator interface or load an existing template

## Markdown Syntax

Plastic 2.0 uses an extended markdown syntax for game creation. Here's a basic example:

```markdown
# Scene: Forest Entrance

You stand at the edge of a dark forest. The path ahead splits in two.

## Options
- [[Go left->ForestLeft]] {requires: Torch}
- [[Go right->ForestRight]]
- [[Turn back->Village]]

## Items
- Mushroom {type: consumable, effect: health+5, rarity: common}

## NPCs
- Old Man {
    name: "Gideon",
    dialog: [
      "Be careful in these woods, traveler.",
      "[[Ask about the forest->ForestHistory]]",
      "[[Ask for directions->Directions]]",
      "[[Leave->ForestEntrance]]"
    ],
    quest: FindHerbsQuest,
    condition: {PlayerStat: wisdom, min: 3}
  }
```

## Project Structure

```
/plastic-rpg-engine/
├── index.html                    # Main entry point
├── css/                          # Stylesheets
├── src/                          # JavaScript source files
│   ├── core/                     # Core engine components
│   ├── mediators/                # Interaction mediators
│   ├── models/                   # Data models
│   ├── utils/                    # Utility functions
│   └── plugins/                  # Plugin system
├── assets/                       # Static assets
├── templates/                    # Game templates
└── configs/                      # Configuration files
```

## Development

This project is structured using a modular design pattern with mediators for handling interactions between components.

### Key Components

- **Parser**: Converts markdown to game objects
- **Renderer**: Displays the game in the browser
- **State Manager**: Tracks game state and progress
- **Config Manager**: Handles game configuration
- **Mediators**: Manage interactions between components

## License

MIT

## Credits

Created with ❤️ for storytellers and game designers.

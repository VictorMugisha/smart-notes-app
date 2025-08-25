# Smart Notes Management Application

A modern, feature-rich note-taking application built with Next.js and React, offering a clean and intuitive interface for organizing your thoughts and ideas.

## 🚀 Features

### Core Functionality
- **Rich Text Editor** - Full-featured editor with formatting tools (bold, italic, underline, headers, lists)
- **Smart Organization** - Create, edit, delete, and organize notes with ease
- **Label System** - Color-coded labels for categorizing and filtering notes
- **Universal Search** - Search across note titles, content, and labels with real-time results
- **Auto-save** - Automatic saving with debounced updates

### User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode** - Professional theme switching with smooth transitions
- **Collapsible Sidebar** - Focus mode for distraction-free writing
- **Keyboard Shortcuts** - Efficient navigation and formatting shortcuts
- **Bulk Operations** - Select and manage multiple notes at once

### Data Management
- **Local Storage** - Persistent data storage in your browser
- **Export/Import** - Backup your notes in JSON, Markdown, or CSV formats
- **Data Validation** - Robust error handling and data integrity checks

## 🛠 Tech Stack

- **Frontend**: Next.js with React and TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Space Grotesk, DM Sans

## 📋 Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

## 🚀 Getting Started

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/VictorMugisha/smart-notes-app.git
cd smart-notes-app
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📖 Usage Guide

### Creating Notes
- Click the **"New Note"** button in the sidebar
- Start typing in the rich text editor
- Notes are automatically saved as you type

### Organizing with Labels
- Create custom labels with colors in the sidebar
- Assign multiple labels to any note
- Filter notes by clicking on labels

### Search and Filter
- Use the search bar to find notes by title, content, or labels
- Combine search with label filters for precise results
- Search results highlight matching terms

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Create new note |
| `Ctrl/Cmd + S` | Save current note |
| `Ctrl/Cmd + F` | Focus search |
| `Ctrl/Cmd + B` | Bold text |
| `Ctrl/Cmd + I` | Italic text |
| `Ctrl/Cmd + U` | Underline text |

### Data Export
- Access export options in the sidebar settings
- Export all notes or selected notes
- Choose from JSON, Markdown, or CSV formats

## 🤝 Contributing

We welcome contributions to the Smart Notes Management Application! Here's how you can help:

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
```bash
git clone https://github.com/your-username/smart-notes-app.git
cd smart-notes-app
```

3. **Install dependencies**:
```bash
npm install --legacy-peer-deps
```

4. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

5. **Make your changes** and test thoroughly

6. **Commit your changes**:
```bash
git commit -m "Add: your feature description"
```

7. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

8. **Create a Pull Request** on GitHub

### Contribution Guidelines

- **Code Style**: Follow the existing code style and use TypeScript
- **Testing**: Test your changes across different devices and browsers
- **Documentation**: Update documentation for any new features
- **Commit Messages**: Use clear, descriptive commit messages
- **Pull Requests**: Provide a clear description of your changes

### Areas for Contribution

- 🐛 Bug fixes and performance improvements
- 📄 New export/import formats
- ⌨️ Additional keyboard shortcuts
- 🎨 UI/UX enhancements
- 📱 Mobile experience improvements
- ♿ Accessibility features

## 🐛 Troubleshooting

### Common Issues

**Dependency conflicts when installing:**
```bash
# Use legacy peer deps to resolve React version conflicts
npm install --legacy-peer-deps
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by [V0](https://vercel.com/docs/v0)

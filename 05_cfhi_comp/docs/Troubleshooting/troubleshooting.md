# Troubleshooting Guide

## Common Issues and Solutions

### 1. Cmd+C (Copy) Not Working in Code Files

**Symptoms:**
- Cmd+C doesn't copy selected text in code files
- Copy operation fails or doesn't work as expected
- Clipboard operations are inconsistent

**Solutions:**

#### A. Check VS Code Settings
The following settings have been added to `.vscode/settings.json`:
```json
{
    "editor.copyWithSyntaxHighlighting": true,
    "editor.selectionClipboard": true,
    "editor.useSystemClipboard": true,
    "workbench.action.clipboard.readText": true,
    "workbench.action.clipboard.writeText": true
}
```

#### B. Verify Keybindings
Keybindings have been configured in `.vscode/keybindings.json`:
```json
[
    {
        "key": "cmd+c",
        "command": "editor.action.clipboardCopyAction",
        "when": "editorTextFocus"
    }
]
```

#### C. Manual Troubleshooting Steps
1. **Restart VS Code/Cursor**: Close and reopen the editor
2. **Check System Clipboard**: Try copying from other applications
3. **Reset Keyboard Shortcuts**: 
   - Open Command Palette (Cmd+Shift+P)
   - Type "Preferences: Open Keyboard Shortcuts"
   - Search for "copy" and verify cmd+c is mapped
4. **Check for Conflicts**: 
   - Look for any extensions that might interfere with clipboard operations
   - Disable extensions temporarily to test

#### D. Alternative Copy Methods
- Use Edit menu: Edit → Copy
- Right-click context menu: Copy
- Use Command Palette: Cmd+Shift+P → "Copy"

### 2. Extension Conflicts

**Common Culprits:**
- Clipboard managers
- Code formatters
- Linting extensions
- Theme extensions

**Solution:**
1. Open Extensions panel (Cmd+Shift+X)
2. Temporarily disable extensions one by one
3. Test cmd+c after each disable
4. Re-enable working extensions

### 3. System-Level Issues

**Check macOS Settings:**
1. System Preferences → Security & Privacy → Privacy
2. Check "Accessibility" and "Input Monitoring" permissions
3. Ensure VS Code/Cursor has necessary permissions

**Reset Clipboard:**
```bash
# In Terminal, clear clipboard
pbcopy < /dev/null
```

### 4. File-Specific Issues

**Check File Permissions:**
```bash
ls -la filename.js
```

**Check File Encoding:**
- Ensure files are saved with UTF-8 encoding
- Check for hidden characters that might interfere

### 5. Workspace-Specific Issues

**Reset Workspace Settings:**
1. Delete `.vscode/settings.json` (backup first)
2. Restart editor
3. Re-add necessary settings

**Check for Conflicting Configurations:**
- Look for `.editorconfig` files
- Check for conflicting workspace settings
- Verify no conflicting keybindings in user settings

## Prevention

### Best Practices
1. **Regular Backups**: Keep backups of important configuration files
2. **Extension Management**: Only install necessary extensions
3. **Settings Version Control**: Keep `.vscode/` folder in version control
4. **Documentation**: Document any custom configurations

### Monitoring
- Check VS Code/Cursor logs for errors
- Monitor extension updates for breaking changes
- Test functionality after major updates

## Getting Help

If issues persist:
1. Check VS Code/Cursor documentation
2. Search GitHub issues for similar problems
3. Check extension-specific documentation
4. Consider resetting to default settings as last resort

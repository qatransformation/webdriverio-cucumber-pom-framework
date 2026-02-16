# Screenshots for Documentation

This folder contains screenshots that illustrate the report system functionality.

## Required Screenshots

Please capture and save the following screenshots in this folder:

### 1. `execution-history-main.png`
**What to capture:** Main execution history page
- Navigate to: `http://localhost:8080` (after running `npm run serve:report`)
- Show: Statistics cards at the top and the table with execution history
- Include: Multiple executions in the table showing passed/failed status

### 2. `execution-report-detail.png`
**What to capture:** Individual execution report
- Navigate to: Any execution report from the main page
- Show: Cucumber steps with pass/fail status
- Include: The feature summary and scenario details

### 3. `report-video-collapse.png`
**What to capture:** Video player in report
- Click on: "+ View Video" link in any scenario
- Show: Video player expanded with the recording

### 4. `report-logs-collapse.png`
**What to capture:** Execution logs
- Click on: "+ Show Info" link in any scenario
- Show: Logs section expanded with execution details, browser console, etc.

### 5. `delete-button-confirmation.png`
**What to capture:** Delete confirmation dialog
- Click on: "🗑️ Delete" button next to any execution
- Show: The confirmation dialog warning about permanent deletion

### 6. `report-statistics-dashboard.png`
**What to capture:** Statistics section close-up
- Focus on: The four statistics cards (Total Executions, Passed, Failed, Last Execution)
- Show: Clear view of the dashboard metrics

## Image Specifications

- **Format:** PNG
- **Resolution:** At least 1920x1080 for full page, or appropriate for focused screenshots
- **Quality:** High quality, clear text visibility
- **Annotations:** Optional - can add arrows or highlights to important features

## How to Capture Screenshots

### macOS
```bash
# Full screen
Cmd + Shift + 3

# Selected area
Cmd + Shift + 4

# Window
Cmd + Shift + 4, then press Space, then click window
```

### After Capturing
1. Rename the screenshot to match the names above
2. Move it to this `docs/screenshots/` folder
3. The README.md will automatically reference them

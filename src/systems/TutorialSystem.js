import SaveSystem from './SaveSystem.js';

class TutorialSystem {
    constructor() {
        this.isCompleted = SaveSystem.get('tutorial_completed', false);
        this.active = !this.isCompleted;

        this.steps = [
            { id: 'tap_color', text: 'Tap to Change Color' },
            { id: 'tap_shape', text: 'Match the Shape!' },
            { id: 'complete', text: 'Good Luck!' }
        ];

        this.currentStepIndex = 0;
    }

    start() {
        if (this.isCompleted) return;
        this.active = true;
        this.showStep(0);
    }

    showStep(index) {
        if (index >= this.steps.length) {
            this.complete();
            return;
        }

        this.currentStepIndex = index;
        const step = this.steps[index];
        console.log(`Tutorial Step: ${step.text}`);

        // In a real implementation, this would trigger UI overlay
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            overlay.innerText = step.text;
            overlay.style.display = 'block';
        }
    }

    nextStep() {
        if (!this.active) return;
        this.showStep(this.currentStepIndex + 1);
    }

    complete() {
        this.active = false;
        this.isCompleted = true;
        SaveSystem.set('tutorial_completed', true);

        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) overlay.style.display = 'none';

        console.log('Tutorial Completed');
    }
}

export default new TutorialSystem();

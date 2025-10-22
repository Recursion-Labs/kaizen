export class InterventionScheduler {
  constructor(onIntervention: (alarm: chrome.alarms.Alarm) => void) {
    if (!chrome?.alarms) {
      console.error(
        "chrome.alarms API is not available. Check manifest permissions."
      );
      return;
    }
    this.setupListeners(onIntervention);
    console.log("Intervention scheduler initialized.");
  }

  public scheduleIntervention(name: string, delayInMs: number): void {
    if (!chrome?.alarms) {
      console.error(
        "chrome.alarms API is not available. Cannot schedule intervention."
      );
      return;
    }
    const when = Date.now() + delayInMs;
    chrome.alarms.create(name, { when });
    console.log(
      `Alarm "${name}" scheduled to run at ${new Date(when).toLocaleTimeString()}`
    );
  }

  /**
   * Listens for any alarms that fire.
   */
  private setupListeners(
    onIntervention: (alarm: chrome.alarms.Alarm) => void
  ): void {
    if (!chrome?.alarms?.onAlarm) {
      console.error(
        "chrome.alarms.onAlarm is not available. Check manifest permissions."
      );
      return;
    }
    chrome.alarms.onAlarm.addListener((alarm) => {
      console.log(`Alarm "${alarm.name}" is firing!`);
      onIntervention(alarm);
      chrome.alarms.clear(alarm.name);
    });
  }
}

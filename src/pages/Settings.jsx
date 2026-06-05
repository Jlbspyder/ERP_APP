import { useEffect, useState } from "react";

const defaultSettings = {
  companyName: "RBAC Admin Dashboard",
  timezone: "Africa/Lagos",
  currency: "USD",
  sessionTimeout: "30 minutes",
  requireTwoFactor: false,
  logPermissionChanges: true,
  defaultBonus: "",
  defaultDeduction: "",
  paymentSchedule: "Monthly",
  annualLeaveDays: "20",
  sickLeaveDays: "10",
  requireLeaveApproval: true,
  leaveRequestEmails: true,
  payrollReminderEmails: true,
  failedLoginAlerts: false,
};

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const savedSettings = localStorage.getItem("rbacSettings");

    if (savedSettings) {
      setSettings({
        ...defaultSettings,
        ...JSON.parse(savedSettings),
      });
    }
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem("rbacSettings", JSON.stringify(settings));
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
    setSaveMessage("Settings saved successfully!");
  }

  return (
    <main className="settings-page">
      <form onSubmit={handleSubmit}>
        <div className="settings-header">
          <div>
            <h1>Settings</h1>
            <p>
              Manage system preferences, security rules, payroll defaults, and
              notifications.
            </p>
          </div>
          <div className="settings-actions">
            {saveMessage && (
              <span className="settings-save-message">{saveMessage}</span>
            )}
            <button className="settings-save-btn" type="submit">
              Save changes
            </button>
          </div>
        </div>

        <section className="settings-grid">
          <div className="settings-card">
            <h2>Company Settings</h2>
            <div className="settings-form-group">
              <label htmlFor="company-name">Company name</label>
              <input
                id="company-name"
                name="companyName"
                type="text"
                value={settings.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="settings-form-row">
              <div className="settings-form-group">
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                >
                  <option>Africa</option>
                  <option>UTC</option>
                  <option>Americas</option>
                </select>
              </div>
              <div className="settings-form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                >
                  <option>USD</option>
                  <option>NGN</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h2>Security Settings</h2>
            <div className="settings-form-group">
              <label htmlFor="session-timeout">Session timeout</label>
              <select
                id="session-timeout"
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleChange}
              >
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
              </select>
            </div>
            <label className="settings-toggle">
              <input
                name="requireTwoFactor"
                type="checkbox"
                checked={settings.requireTwoFactor}
                onChange={handleChange}
              />
              <span>Require two-factor authentication</span>
            </label>
            <label className="settings-toggle">
              <input
                name="logPermissionChanges"
                type="checkbox"
                checked={settings.logPermissionChanges}
                onChange={handleChange}
              />
              <span>Log role and permission changes</span>
            </label>
          </div>

          <div className="settings-card">
            <h2>Payroll Settings</h2>
            <div className="settings-form-row">
              <div className="settings-form-group">
                <label htmlFor="bonus-rate">Bonus</label>
                <input
                  id="bonus-rate"
                  name="defaultBonus"
                  type="number"
                  value={settings.defaultBonus}
                  onChange={handleChange}
                />
              </div>
              <div className="settings-form-group">
                <label htmlFor="deduction-rate">Deduction</label>
                <input
                  id="deduction-rate"
                  name="defaultDeduction"
                  type="number"
                  value={settings.defaultDeduction}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="settings-form-group">
              <label htmlFor="payment-schedule">Payment schedule</label>
              <select
                id="payment-schedule"
                name="paymentSchedule"
                value={settings.paymentSchedule}
                onChange={handleChange}
              >
                <option>Monthly</option>
                <option>Bi-weekly</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          <div className="settings-card">
            <h2>Leave Settings</h2>
            <div className="settings-form-row">
              <div className="settings-form-group">
                <label htmlFor="annual-leave">Annual leave days</label>
                <input
                  id="annual-leave"
                  name="annualLeaveDays"
                  type="number"
                  value={settings.annualLeaveDays}
                  onChange={handleChange}
                />
              </div>
              <div className="settings-form-group">
                <label htmlFor="sick-leave">Sick leave days</label>
                <input
                  id="sick-leave"
                  name="sickLeaveDays"
                  type="number"
                  value={settings.sickLeaveDays}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label className="settings-toggle">
              <input
                name="requireLeaveApproval"
                type="checkbox"
                checked={settings.requireLeaveApproval}
                onChange={handleChange}
              />
              <span>Require manager approval for leave requests</span>
            </label>
          </div>

          <div className="settings-card settings-card-wide">
            <h2>Notification Settings</h2>
            <div className="settings-toggle-list">
              <label className="settings-toggle">
                <input
                  name="leaveRequestEmails"
                  type="checkbox"
                  checked={settings.leaveRequestEmails}
                  onChange={handleChange}
                />
                <span>Email admins when a leave request is submitted</span>
              </label>
              <label className="settings-toggle">
                <input
                  name="payrollReminderEmails"
                  type="checkbox"
                  checked={settings.payrollReminderEmails}
                  onChange={handleChange}
                />
                <span>Email payroll managers before payroll is processed</span>
              </label>
              <label className="settings-toggle">
                <input
                  name="failedLoginAlerts"
                  type="checkbox"
                  checked={settings.failedLoginAlerts}
                  onChange={handleChange}
                />
                <span>Send security alerts for failed login attempts</span>
              </label>
            </div>
          </div>
        </section>
      </form>
      <div className="settings-actions">
        {saveMessage && (
          <span className="settings-save-message">{saveMessage}</span>
        )}
        <button className="settings-save-btn mobile" type="submit">
          Save changes
        </button>
      </div>
    </main>
  );
}

export default Settings;

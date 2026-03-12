import cron from 'node-cron';
import { Op } from 'sequelize';
import { Hearing, Case, Lawyer } from '../models/index.js';
import { sendHearingAlertEmail } from './emailService.js';
import { ROLES } from '../constants/index.js';

/**
 * Queries hearings within `daysAhead` days and sends alert emails
 * to the assigned lawyer and all senior partners.
 */
const runAlertJob = async (daysAhead) => {
  const label = `[Cron] ${daysAhead}-day alert`;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + daysAhead);

    const hearings = await Hearing.findAll({
      where: { hearing_date: { [Op.between]: [today, cutoff] } },
      include: [
        {
          model: Case,
          as: 'case',
          include: [{ model: Lawyer, as: 'lawyer', attributes: ['id', 'full_name', 'email'] }],
        },
      ],
    });

    if (hearings.length === 0) {
      console.log(`${label}: no hearings found.`);
      return;
    }

    // Fetch all senior partners once — they receive every alert
    const seniors = await Lawyer.findAll({
      where: { role: ROLES.SENIOR_PARTNER, is_active: true },
      attributes: ['id', 'full_name', 'email'],
    });

    let sent = 0;
    for (const hearing of hearings) {
      const caseItem = hearing.case;
      if (!caseItem) continue;

      const recipients = [...seniors];

      // Add the assigned lawyer if there is one (and not already in seniors)
      const assignedLawyer = caseItem.lawyer;
      if (assignedLawyer && !seniors.find((s) => s.id === assignedLawyer.id)) {
        recipients.push(assignedLawyer);
      }

      for (const recipient of recipients) {
        sendHearingAlertEmail(
          hearing,
          recipient.email,
          recipient.full_name,
          daysAhead,
          caseItem.title,
          caseItem.id
        );
        sent++;
      }
    }

    console.log(`${label}: sent ${sent} email(s) for ${hearings.length} hearing(s).`);
  } catch (err) {
    console.error(`${label} job failed:`, err.message);
  }
};

/**
 * Registers and starts all cron jobs.
 * Call this once from app.js after the server starts.
 */
export const startCronJobs = () => {
  // 08:00 WAT (UTC+1) = 07:00 UTC daily
  const schedule = '0 7 * * *';

  cron.schedule(schedule, () => runAlertJob(3), { timezone: 'UTC' });
  cron.schedule(schedule, () => runAlertJob(1), { timezone: 'UTC' });

  console.log('[Cron] Hearing alert jobs registered — runs daily at 08:00 WAT.');
};

const Policy = require('../models/Policy'); // Assuming this is your Policy model
const sendEmail = require('./sendEmail');

// Function to get the renewal link based on the company
const getRenewalLink = (company) => {
    const links = {
        'STAR HEALTH': 'https://customer.starhealth.in/customerportal/instant-renewal',
        'TATA AIG': 'https://www.tataaig.com/renewal?lob=health&renewalHeader=yes',
        'NATIONAL INSURANCE': 'https://nicportal.nic.co.in/nicportal/online/home',
        'CARE HEALTH': 'https://www.careinsurance.com/rhicl/proposalcp/renew/index-care',
        // 'Company5': 'https://company5.com/renew',
    };
    
    return links[company] || 'https://defaultcompany.com/renew'; // Fallback to a default link if the company is not recognized
};

const sendReminderEmail = (policy, daysDiff) => {
    const endDate = new Date(policy.endDate);
    const subject = `Policy Renewal Reminder: ${policy.policyNumber}`;
    const renewalLink = getRenewalLink(policy.company);

    const clientText = `Dear ${policy.clientName},

    This is a friendly reminder that your ${policy.productName} (Policy No: ${policy.policyNumber}) is set to expire on ${endDate.toLocaleDateString()}. You have ${daysDiff} days left to renew your policy.
    
    To renew, simply [click here]-(${renewalLink}) or reach out to your agent at [Agent Contact Info].
    
    Best regards,
    Khushi Finserv Team
    [Contact Info / Footer with Social Links]`;

    // Send email to the client
    sendEmail(policy.clientEmail, subject, clientText);

    const agentText = `Hi ${policy.agentName},

The policy for ${policy.clientName} (Policy No: ${policy.policyNumber}) is set to expire on ${endDate.toLocaleDateString()}. There are ${daysDiff} days left for renewal.

Please reach out to the client or ensure that the policy is renewed promptly. You can view more details or assist the client by [clicking here]- (${renewalLink})</a>.

Best regards,
Khushi Finserv Team
[Contact Info]`;

    // Send email to the agent
    sendEmail(policy.agentEmail, subject, agentText);
};

const sendMonthlyAdminEmail = async (policies) => {
    const subject = `Monthly Policy Expiration Summary`;
    let adminText = `Hi Admin,\n\nHere’s your monthly report for policies expiring in the next month:\n\n`;

    policies.forEach(({ policy, daysDiff }) => {
        const endDate = new Date(policy.endDate);
        adminText += ` - ${policy.clientName} - ${policy.productName} - ${policy.agentName} - Expiring on ${endDate.toLocaleDateString()} - Remaining Days: ${daysDiff}\n`;
    });

    adminText += `\nPlease ensure the respective agents have contacted the clients.\n\nBest regards,\nKhushi Finserv\n[Contact Info]`;

    // Send email to the admin
    sendEmail(process.env.ADMIN_EMAIL, subject, adminText);
};

const checkPoliciesForNotifications = async () => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        
        // Fetch all policies from the database
        const policies = await Policy.find();
        
        // Store policies for the admin's monthly report with daysDiff
        const upcomingPolicies = [];
        const isFirstOfMonth = today.getDate() === 1; // Check if today is the 1st of the month

        policies.forEach(policy => {
            const endDate = new Date(policy.endDate);
            endDate.setUTCHours(0, 0, 0, 0);
            
            const timeDiff = endDate - today;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

            // Check if policy needs a notification (30, 15, 5, 1 days before expiration)
            const reminderDays = [30, 15, 5, 1]; 

            if (reminderDays.includes(daysDiff)) {
                sendReminderEmail(policy, daysDiff); // Reuse function to send the email
            }

            // Collect policies for the monthly report
            if (daysDiff > 0 && daysDiff <= 30) { // Policies expiring in the next 30 days
                upcomingPolicies.push({ policy, daysDiff });
            }
        });

        // Send the admin's monthly summary only if today is the 1st of the month
        if (isFirstOfMonth && upcomingPolicies.length > 0) {
            await sendMonthlyAdminEmail(upcomingPolicies);
        }
    } catch (error) {
        console.error('Error checking policies for notifications:', error);
    }
};

module.exports = checkPoliciesForNotifications;

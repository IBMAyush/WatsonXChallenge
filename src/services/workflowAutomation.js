/**
 * Workflow Automation Service
 * Automates follow-up actions for opportunities and intelligence updates
 * 
 * @author IBM Bobathon Team
 * @version 1.0.0
 */

const logger = require('../utils/logger');

/**
 * Workflow types supported by the system
 */
const WORKFLOW_TYPES = {
  OPPORTUNITY_ALERT: 'opportunity_alert',
  MEETING_PREP: 'meeting_prep',
  CLIENT_OUTREACH: 'client_outreach',
  CRM_LOG: 'crm_log',
  TASK_ASSIGNMENT: 'task_assignment',
  REPORT_GENERATION: 'report_generation',
  SCHEDULED_UPDATE: 'scheduled_update'
};

/**
 * Workflow status
 */
const WORKFLOW_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

class WorkflowAutomation {
  constructor(slackClient = null, crmClient = null) {
    this.slackClient = slackClient;
    this.crmClient = crmClient;
    this.workflows = new Map();
    this.workflowHistory = [];
  }

  /**
   * Execute a workflow based on opportunity score and type
   * @param {Object} opportunity - Opportunity data
   * @param {Object} scoring - Scoring result
   * @param {String} workflowType - Type of workflow to execute
   * @returns {Object} Workflow execution result
   */
  async executeWorkflow(opportunity, scoring, workflowType) {
    try {
      logger.info(`Executing workflow: ${workflowType} for opportunity: ${opportunity.title}`);

      const workflowId = this.generateWorkflowId();
      const workflow = {
        id: workflowId,
        type: workflowType,
        opportunity,
        scoring,
        status: WORKFLOW_STATUS.PENDING,
        startTime: new Date().toISOString(),
        steps: []
      };

      this.workflows.set(workflowId, workflow);

      // Execute workflow based on type
      let result;
      switch (workflowType) {
        case WORKFLOW_TYPES.OPPORTUNITY_ALERT:
          result = await this.executeOpportunityAlert(workflow);
          break;
        case WORKFLOW_TYPES.MEETING_PREP:
          result = await this.executeMeetingPrep(workflow);
          break;
        case WORKFLOW_TYPES.CLIENT_OUTREACH:
          result = await this.executeClientOutreach(workflow);
          break;
        case WORKFLOW_TYPES.CRM_LOG:
          result = await this.executeCRMLog(workflow);
          break;
        case WORKFLOW_TYPES.TASK_ASSIGNMENT:
          result = await this.executeTaskAssignment(workflow);
          break;
        case WORKFLOW_TYPES.REPORT_GENERATION:
          result = await this.executeReportGeneration(workflow);
          break;
        case WORKFLOW_TYPES.SCHEDULED_UPDATE:
          result = await this.executeScheduledUpdate(workflow);
          break;
        default:
          throw new Error(`Unknown workflow type: ${workflowType}`);
      }

      workflow.status = WORKFLOW_STATUS.COMPLETED;
      workflow.endTime = new Date().toISOString();
      workflow.result = result;

      this.workflowHistory.push(workflow);
      logger.info(`Workflow completed: ${workflowId}`);

      return {
        success: true,
        workflowId,
        result
      };

    } catch (error) {
      logger.error(`Workflow execution failed: ${error.message}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Execute opportunity alert workflow
   * Notifies account team about high-priority opportunities
   */
  async executeOpportunityAlert(workflow) {
    const { opportunity, scoring } = workflow;
    const steps = [];

    try {
      // Step 1: Determine notification channel based on priority
      const channel = this.determineNotificationChannel(scoring.priority);
      steps.push({
        step: 'determine_channel',
        status: 'completed',
        data: { channel }
      });

      // Step 2: Format alert message
      const message = this.formatOpportunityAlert(opportunity, scoring);
      steps.push({
        step: 'format_message',
        status: 'completed',
        data: { messageLength: message.text.length }
      });

      // Step 3: Send Slack notification
      if (this.slackClient) {
        await this.sendSlackMessage(channel, message);
        steps.push({
          step: 'send_slack_notification',
          status: 'completed',
          data: { channel }
        });
      } else {
        steps.push({
          step: 'send_slack_notification',
          status: 'skipped',
          reason: 'Slack client not configured'
        });
      }

      // Step 4: Notify account team members
      if (opportunity.accountTeam) {
        const notifications = await this.notifyAccountTeam(opportunity.accountTeam, message);
        steps.push({
          step: 'notify_account_team',
          status: 'completed',
          data: { notified: notifications.length }
        });
      }

      // Step 5: Log alert in system
      steps.push({
        step: 'log_alert',
        status: 'completed',
        timestamp: new Date().toISOString()
      });

      workflow.steps = steps;
      return {
        type: 'opportunity_alert',
        channel,
        notificationsSent: steps.filter(s => s.status === 'completed').length,
        steps
      };

    } catch (error) {
      logger.error('Opportunity alert workflow failed:', error);
      throw error;
    }
  }

  /**
   * Execute meeting prep workflow
   * Generates comprehensive meeting brief
   */
  async executeMeetingPrep(workflow) {
    const { opportunity } = workflow;
    const steps = [];

    try {
      // Step 1: Gather company information
      const companyInfo = await this.gatherCompanyInfo(opportunity.client);
      steps.push({
        step: 'gather_company_info',
        status: 'completed'
      });

      // Step 2: Collect recent news and developments
      const recentNews = await this.collectRecentNews(opportunity.client);
      steps.push({
        step: 'collect_recent_news',
        status: 'completed',
        data: { newsCount: recentNews.length }
      });

      // Step 3: Identify relevant IBM offerings
      const ibmOfferings = this.identifyRelevantOfferings(opportunity);
      steps.push({
        step: 'identify_ibm_offerings',
        status: 'completed',
        data: { offeringsCount: ibmOfferings.length }
      });

      // Step 4: Generate talking points
      const talkingPoints = this.generateTalkingPoints(opportunity, companyInfo, ibmOfferings);
      steps.push({
        step: 'generate_talking_points',
        status: 'completed',
        data: { pointsCount: talkingPoints.length }
      });

      // Step 5: Compile meeting brief
      const meetingBrief = this.compileMeetingBrief({
        opportunity,
        companyInfo,
        recentNews,
        ibmOfferings,
        talkingPoints
      });
      steps.push({
        step: 'compile_meeting_brief',
        status: 'completed'
      });

      // Step 6: Send brief to account team
      if (this.slackClient && opportunity.accountTeam) {
        await this.sendMeetingBrief(opportunity.accountTeam, meetingBrief);
        steps.push({
          step: 'send_meeting_brief',
          status: 'completed'
        });
      }

      workflow.steps = steps;
      return {
        type: 'meeting_prep',
        brief: meetingBrief,
        steps
      };

    } catch (error) {
      logger.error('Meeting prep workflow failed:', error);
      throw error;
    }
  }

  /**
   * Execute client outreach workflow
   * Drafts and routes client communication
   */
  async executeClientOutreach(workflow) {
    const { opportunity, scoring } = workflow;
    const steps = [];

    try {
      // Step 1: Draft outreach message
      const outreachMessage = this.draftOutreachMessage(opportunity, scoring);
      steps.push({
        step: 'draft_outreach_message',
        status: 'completed'
      });

      // Step 2: Identify appropriate sender
      const sender = this.identifyAppropriateContact(opportunity);
      steps.push({
        step: 'identify_sender',
        status: 'completed',
        data: { sender }
      });

      // Step 3: Route for approval
      const approvalRequest = await this.requestApproval(outreachMessage, sender);
      steps.push({
        step: 'request_approval',
        status: 'completed',
        data: { approvalId: approvalRequest.id }
      });

      // Step 4: Log outreach intent
      steps.push({
        step: 'log_outreach_intent',
        status: 'completed',
        timestamp: new Date().toISOString()
      });

      workflow.steps = steps;
      return {
        type: 'client_outreach',
        message: outreachMessage,
        sender,
        approvalRequired: true,
        steps
      };

    } catch (error) {
      logger.error('Client outreach workflow failed:', error);
      throw error;
    }
  }

  /**
   * Execute CRM log workflow
   * Logs opportunity in CRM system
   */
  async executeCRMLog(workflow) {
    const { opportunity, scoring } = workflow;
    const steps = [];

    try {
      // Step 1: Format CRM entry
      const crmEntry = this.formatCRMEntry(opportunity, scoring);
      steps.push({
        step: 'format_crm_entry',
        status: 'completed'
      });

      // Step 2: Submit to CRM
      if (this.crmClient) {
        const crmResult = await this.submitToCRM(crmEntry);
        steps.push({
          step: 'submit_to_crm',
          status: 'completed',
          data: { crmId: crmResult.id }
        });
      } else {
        steps.push({
          step: 'submit_to_crm',
          status: 'skipped',
          reason: 'CRM client not configured'
        });
      }

      // Step 3: Link to account
      steps.push({
        step: 'link_to_account',
        status: 'completed'
      });

      workflow.steps = steps;
      return {
        type: 'crm_log',
        entry: crmEntry,
        steps
      };

    } catch (error) {
      logger.error('CRM log workflow failed:', error);
      throw error;
    }
  }

  /**
   * Execute task assignment workflow
   * Assigns follow-up tasks to team members
   */
  async executeTaskAssignment(workflow) {
    const { opportunity, scoring } = workflow;
    const steps = [];

    try {
      // Step 1: Determine required tasks
      const tasks = this.determineRequiredTasks(opportunity, scoring);
      steps.push({
        step: 'determine_tasks',
        status: 'completed',
        data: { taskCount: tasks.length }
      });

      // Step 2: Assign tasks to team members
      const assignments = await this.assignTasks(tasks, opportunity.accountTeam);
      steps.push({
        step: 'assign_tasks',
        status: 'completed',
        data: { assignmentsCount: assignments.length }
      });

      // Step 3: Send task notifications
      if (this.slackClient) {
        await this.sendTaskNotifications(assignments);
        steps.push({
          step: 'send_task_notifications',
          status: 'completed'
        });
      }

      // Step 4: Set up reminders
      const reminders = this.setupReminders(assignments);
      steps.push({
        step: 'setup_reminders',
        status: 'completed',
        data: { remindersCount: reminders.length }
      });

      workflow.steps = steps;
      return {
        type: 'task_assignment',
        tasks,
        assignments,
        steps
      };

    } catch (error) {
      logger.error('Task assignment workflow failed:', error);
      throw error;
    }
  }

  /**
   * Execute report generation workflow
   * Generates comprehensive opportunity report
   */
  async executeReportGeneration(workflow) {
    const { opportunity, scoring } = workflow;
    const steps = [];

    try {
      // Step 1: Compile data
      const reportData = await this.compileReportData(opportunity, scoring);
      steps.push({
        step: 'compile_data',
        status: 'completed'
      });

      // Step 2: Generate report
      const report = this.generateReport(reportData);
      steps.push({
        step: 'generate_report',
        status: 'completed'
      });

      // Step 3: Format for distribution
      const formattedReport = this.formatReport(report);
      steps.push({
        step: 'format_report',
        status: 'completed'
      });

      // Step 4: Distribute report
      if (this.slackClient) {
        await this.distributeReport(formattedReport, opportunity.accountTeam);
        steps.push({
          step: 'distribute_report',
          status: 'completed'
        });
      }

      workflow.steps = steps;
      return {
        type: 'report_generation',
        report: formattedReport,
        steps
      };

    } catch (error) {
      logger.error('Report generation workflow failed:', error);
      throw error;
    }
  }

  /**
   * Execute scheduled update workflow
   * Sends regular intelligence updates
   */
  async executeScheduledUpdate(workflow) {
    const steps = [];

    try {
      // Step 1: Gather updates from last period
      const updates = await this.gatherScheduledUpdates();
      steps.push({
        step: 'gather_updates',
        status: 'completed',
        data: { updateCount: updates.length }
      });

      // Step 2: Prioritize and filter
      const prioritizedUpdates = this.prioritizeUpdates(updates);
      steps.push({
        step: 'prioritize_updates',
        status: 'completed'
      });

      // Step 3: Format digest
      const digest = this.formatDigest(prioritizedUpdates);
      steps.push({
        step: 'format_digest',
        status: 'completed'
      });

      // Step 4: Send to subscribed channels
      if (this.slackClient) {
        await this.sendScheduledDigest(digest);
        steps.push({
          step: 'send_digest',
          status: 'completed'
        });
      }

      workflow.steps = steps;
      return {
        type: 'scheduled_update',
        digest,
        updateCount: updates.length,
        steps
      };

    } catch (error) {
      logger.error('Scheduled update workflow failed:', error);
      throw error;
    }
  }

  // ==================== Helper Methods ====================

  generateWorkflowId() {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  determineNotificationChannel(priority) {
    const channels = {
      CRITICAL: process.env.URGENT_ALERT_CHANNEL || '#oil-gas-urgent-alerts',
      URGENT: process.env.URGENT_ALERT_CHANNEL || '#oil-gas-urgent-alerts',
      HIGH: process.env.DEFAULT_SLACK_CHANNEL || '#oil-gas-intelligence',
      MEDIUM: process.env.DEFAULT_SLACK_CHANNEL || '#oil-gas-intelligence',
      LOW: process.env.DEFAULT_SLACK_CHANNEL || '#oil-gas-intelligence'
    };
    return channels[priority] || channels.MEDIUM;
  }

  formatOpportunityAlert(opportunity, scoring) {
    const priorityEmoji = {
      CRITICAL: '🚨',
      URGENT: '⚠️',
      HIGH: '🔴',
      MEDIUM: '🟡',
      LOW: '🟢'
    };

    return {
      text: `${priorityEmoji[scoring.priority]} New ${scoring.priority} Priority Opportunity`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${priorityEmoji[scoring.priority]} ${opportunity.title || 'New Opportunity'}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Client:*\n${opportunity.client || 'N/A'}`
            },
            {
              type: 'mrkdwn',
              text: `*Score:*\n${scoring.totalScore}/100`
            },
            {
              type: 'mrkdwn',
              text: `*Priority:*\n${scoring.priority}`
            },
            {
              type: 'mrkdwn',
              text: `*Estimated Value:*\n$${(opportunity.estimatedValue || 0).toLocaleString()}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Description:*\n${opportunity.description || 'No description available'}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Recommendations:*\n${scoring.recommendation.map(r => `• ${r}`).join('\n')}`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Detected: ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };
  }

  async sendSlackMessage(channel, message) {
    // Placeholder for Slack integration
    logger.info(`Would send message to ${channel}`);
    return { success: true, channel };
  }

  async notifyAccountTeam(accountTeam, message) {
    // Placeholder for team notification
    logger.info(`Would notify account team: ${JSON.stringify(accountTeam)}`);
    return accountTeam ? [accountTeam] : [];
  }

  async gatherCompanyInfo(client) {
    // Placeholder - would integrate with data sources
    return {
      name: client,
      industry: 'Oil & Gas',
      recentDevelopments: []
    };
  }

  async collectRecentNews(client) {
    // Placeholder - would integrate with news APIs
    return [];
  }

  identifyRelevantOfferings(opportunity) {
    // Placeholder - would use AI to match offerings
    return opportunity.ibmProducts || ['watsonx', 'Maximo', 'Consulting'];
  }

  generateTalkingPoints(opportunity, companyInfo, ibmOfferings) {
    return [
      `Discuss ${opportunity.title}`,
      `Highlight IBM's capabilities in ${ibmOfferings.join(', ')}`,
      'Address client strategic priorities',
      'Propose next steps'
    ];
  }

  compileMeetingBrief(data) {
    return {
      title: `Meeting Brief: ${data.opportunity.client}`,
      date: new Date().toISOString(),
      ...data
    };
  }

  async sendMeetingBrief(accountTeam, brief) {
    logger.info(`Would send meeting brief to account team`);
    return { success: true };
  }

  draftOutreachMessage(opportunity, scoring) {
    return {
      subject: `Opportunity: ${opportunity.title}`,
      body: `We've identified a ${scoring.priority} priority opportunity...`,
      priority: scoring.priority
    };
  }

  identifyAppropriateContact(opportunity) {
    return opportunity.accountTeam?.account_executive || 'Account Executive';
  }

  async requestApproval(message, sender) {
    return { id: `approval_${Date.now()}`, status: 'pending' };
  }

  formatCRMEntry(opportunity, scoring) {
    return {
      title: opportunity.title,
      client: opportunity.client,
      score: scoring.totalScore,
      priority: scoring.priority,
      estimatedValue: opportunity.estimatedValue,
      timestamp: new Date().toISOString()
    };
  }

  async submitToCRM(entry) {
    logger.info(`Would submit to CRM: ${entry.title}`);
    return { id: `crm_${Date.now()}`, success: true };
  }

  determineRequiredTasks(opportunity, scoring) {
    const tasks = [];
    
    if (scoring.priority === 'CRITICAL' || scoring.priority === 'URGENT') {
      tasks.push({ title: 'Schedule executive briefing', priority: 'high', dueDate: this.addDays(1) });
    }
    
    tasks.push({ title: 'Research client requirements', priority: 'medium', dueDate: this.addDays(3) });
    tasks.push({ title: 'Prepare solution proposal', priority: 'medium', dueDate: this.addDays(7) });
    
    return tasks;
  }

  async assignTasks(tasks, accountTeam) {
    return tasks.map(task => ({
      ...task,
      assignedTo: accountTeam?.account_executive || 'Unassigned'
    }));
  }

  async sendTaskNotifications(assignments) {
    logger.info(`Would send ${assignments.length} task notifications`);
    return { success: true };
  }

  setupReminders(assignments) {
    return assignments.map(a => ({
      taskId: a.title,
      reminderDate: this.addDays(-1, a.dueDate)
    }));
  }

  async compileReportData(opportunity, scoring) {
    return { opportunity, scoring, timestamp: new Date().toISOString() };
  }

  generateReport(data) {
    return {
      title: 'Opportunity Report',
      data,
      generatedAt: new Date().toISOString()
    };
  }

  formatReport(report) {
    return JSON.stringify(report, null, 2);
  }

  async distributeReport(report, accountTeam) {
    logger.info(`Would distribute report to account team`);
    return { success: true };
  }

  async gatherScheduledUpdates() {
    // Placeholder - would gather from various sources
    return [];
  }

  prioritizeUpdates(updates) {
    return updates.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  formatDigest(updates) {
    return {
      title: 'Oil & Gas Intelligence Digest',
      date: new Date().toISOString(),
      updates
    };
  }

  async sendScheduledDigest(digest) {
    logger.info(`Would send scheduled digest`);
    return { success: true };
  }

  addDays(days, fromDate = new Date()) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(workflowId) {
    return this.workflows.get(workflowId);
  }

  /**
   * Get workflow history
   */
  getWorkflowHistory(limit = 10) {
    return this.workflowHistory.slice(-limit);
  }
}

module.exports = { WorkflowAutomation, WORKFLOW_TYPES, WORKFLOW_STATUS };

// Made with Bob

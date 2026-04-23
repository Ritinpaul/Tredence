// ─────────────────────────────────────────────────────────────
// automationActions.ts — Static mock for Phase 2
//
// PHASE 3 NOTE: This will be replaced by real GET /automations
// API call via MSW. The shape is defined in types/api.ts so
// the swap is a one-line change in ConfigPanel.
// ─────────────────────────────────────────────────────────────

import type { AutomationAction } from '../../types/api'

export const STATIC_AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Dispatch an email via the HR email system',
    icon: 'Mail',
    params: [
      { name: 'to', label: 'To (email)', type: 'text', required: true, placeholder: 'hr@company.com' },
      { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'Email subject' },
      { name: 'body', label: 'Body', type: 'text', required: false, placeholder: 'Email body...' },
    ],
  },
  {
    id: 'generate_document',
    label: 'Generate Document',
    description: 'Create a PDF from a template',
    icon: 'FileText',
    params: [
      {
        name: 'template',
        label: 'Template',
        type: 'select',
        required: true,
        options: ['offer_letter', 'nda', 'onboarding_checklist', 'termination_letter'],
      },
      { name: 'recipient', label: 'Recipient Name', type: 'text', required: true, placeholder: 'John Doe' },
      {
        name: 'format',
        label: 'Output Format',
        type: 'select',
        required: true,
        options: ['pdf', 'docx'],
      },
    ],
  },
  {
    id: 'send_notification',
    label: 'Send Notification',
    description: 'Push a notification to Slack or Teams',
    icon: 'Bell',
    params: [
      {
        name: 'channel',
        label: 'Channel',
        type: 'select',
        required: true,
        options: ['slack', 'teams', 'email', 'sms'],
      },
      { name: 'message', label: 'Message', type: 'text', required: true, placeholder: 'Notification text' },
      {
        name: 'priority',
        label: 'Priority',
        type: 'select',
        required: false,
        options: ['low', 'medium', 'high'],
      },
    ],
  },
  {
    id: 'update_database',
    label: 'Update Database',
    description: 'Write a record to the HRMS database',
    icon: 'Database',
    params: [
      { name: 'table', label: 'Table Name', type: 'text', required: true, placeholder: 'employees' },
      { name: 'record_id', label: 'Record ID', type: 'text', required: true, placeholder: 'UUID or integer' },
      { name: 'fields', label: 'Fields (JSON)', type: 'text', required: false, placeholder: '{"status":"active"}' },
    ],
  },
  {
    id: 'create_ticket',
    label: 'Create Ticket',
    description: 'Open a support or task ticket',
    icon: 'Ticket',
    params: [
      {
        name: 'system',
        label: 'Ticketing System',
        type: 'select',
        required: true,
        options: ['jira', 'linear', 'zendesk', 'servicenow'],
      },
      { name: 'title', label: 'Ticket Title', type: 'text', required: true, placeholder: 'Issue title' },
      { name: 'description', label: 'Description', type: 'text', required: false, placeholder: 'Details...' },
    ],
  },
]

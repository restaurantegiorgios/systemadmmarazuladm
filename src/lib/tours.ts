const getButton = (text: string, type: 'next' | 'cancel' | 'back', primary = false) => ({
  text,
  type,
  classes: primary ? 'shepherd-button shepherd-button-primary' : 'shepherd-button shepherd-button-secondary',
});

export const getDashboardTourSteps = (t: (key: string) => string) => [
  {
    id: 'welcome',
    text: t('tour.dashboard.welcome'),
    buttons: [getButton(t('tour.buttons.exit'), 'cancel'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'add-employee',
    text: t('tour.dashboard.add'),
    attachTo: { element: '[data-tour-id="add-employee-btn"]', on: 'bottom' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'filters',
    text: t('tour.dashboard.filters'),
    attachTo: { element: '[data-tour-id="filters-panel"]', on: 'bottom' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'view-mode',
    text: t('tour.dashboard.viewMode'),
    attachTo: { element: '[data-tour-id="view-mode-toggle"]', on: 'bottom' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'actions',
    text: t('tour.dashboard.actions'),
    attachTo: { element: '[data-tour-id="actions-cell"]', on: 'left' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.finish'), 'next', true)],
  },
];

export const getProfileTourSteps = (t: (key: string) => string) => [
  {
    id: 'welcome',
    text: t('tour.profile.welcome'),
    buttons: [getButton(t('tour.buttons.exit'), 'cancel'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'edit',
    text: t('tour.profile.edit'),
    attachTo: { element: '[data-tour-id="edit-btn"]', on: 'bottom' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'tabs',
    text: t('tour.profile.tabs'),
    attachTo: { element: '[data-tour-id="profile-tabs"]', on: 'bottom' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'print',
    text: t('tour.profile.print'),
    attachTo: { element: '[data-tour-id="print-btn"]', on: 'left' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.finish'), 'next', true)],
  },
];

export const getReceiptsTourSteps = (t: (key: string) => string) => [
  {
    id: 'welcome',
    text: t('tour.receipts.welcome'),
    buttons: [getButton(t('tour.buttons.exit'), 'cancel'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'form',
    text: t('tour.receipts.form'),
    attachTo: { element: '[data-tour-id="receipt-form"]', on: 'right' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'generate',
    text: t('tour.receipts.generate'),
    attachTo: { element: '[data-tour-id="generate-btn"]', on: 'top' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'preview',
    text: t('tour.receipts.preview'),
    attachTo: { element: '[data-tour-id="receipt-preview"]', on: 'left' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.next'), 'next', true)],
  },
  {
    id: 'print',
    text: t('tour.receipts.print'),
    attachTo: { element: '[data-tour-id="print-btn"]', on: 'top' },
    buttons: [getButton(t('tour.buttons.back'), 'back'), getButton(t('tour.buttons.finish'), 'next', true)],
  },
];
/**
 * Анкеты на заказ. Куклы и портреты — разные формы: вопросы почти
 * не пересекаются, и ответы уходят на разные почты.
 *
 * Формулировки и варианты правятся здесь, без залезания в компоненты.
 *
 * Типы полей: text · email · textarea · select · chips · files
 */

export const MAX_FILES = 5;
export const MAX_FILE_MB = 8;
export const MAX_TOTAL_MB = 20;
export const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,application/pdf';

const contactStep = (extra = []) => ({
  id: 'you',
  title: 'Dates and you',
  hint: 'So I know whether I can make it in time, and where it goes afterwards.',
  fields: [
    { name: 'name',  label: 'What should I call you', type: 'text',  required: true, placeholder: 'Your name' },
    { name: 'email', label: 'Email for my reply',     type: 'email', required: true, placeholder: 'you@example.com' },
    { name: 'deadline', label: 'Needed by', type: 'text',
      placeholder: 'e.g. before 12 March, it’s a gift. Or "no rush"' },
    { name: 'place', label: 'Where it ships', type: 'text', placeholder: 'City and country' },
    ...extra,
  ],
});

const refsStep = {
  id: 'refs',
  title: 'References',
  hint: 'Pictures say more than words. Pinterest screenshots, photos, scribbles — anything works.',
  fields: [
    { name: 'files', label: 'Attach files', type: 'files' },
    { name: 'links', label: 'Or links', type: 'textarea', rows: 3,
      placeholder: 'Pinterest, Instagram — one link per line' },
  ],
};

/* ---------------- КУКЛЫ ---------------- */
export const dollForm = {
  kind: 'doll',
  title: 'Order a doll',
  steps: [
    {
      id: 'who',
      title: 'Who she will be',
      hint: 'Start with the important part — who you want to see.',
      fields: [
        { name: 'height', label: 'Rough height', type: 'select',
          options: [
            { value: 'small',  label: 'Up to 25 cm' },
            { value: 'medium', label: '25–35 cm' },
            { value: 'large',  label: 'Over 35 cm' },
            { value: 'unsure', label: 'Your call' },
          ] },
        { name: 'idea', label: 'Tell me about her', type: 'textarea', required: true, rows: 5,
          placeholder: 'Who she is, where she came from, what she is like. One sentence or a whole story — mood matters more to me than precision.' },
      ],
    },
    {
      id: 'look',
      title: 'How she looks',
      hint: 'Leave anything blank if you do not know — we can work it out later.',
      fields: [
        { name: 'eyes', label: 'Button eyes', type: 'select',
          options: [
            { value: 'pearl',    label: 'Pearl' },
            { value: 'jet',      label: 'Jet black' },
            { value: 'rose',     label: 'Pink' },
            { value: 'mismatch', label: 'Mismatched' },
            { value: 'trust',    label: 'You choose' },
          ] },
        { name: 'hair', label: 'Hair', type: 'select',
          options: [
            { value: 'bob',   label: 'Bob' },
            { value: 'long',  label: 'Long strands' },
            { value: 'wax',   label: 'Wax drips' },
            { value: 'none',  label: 'No hair' },
            { value: 'trust', label: 'You choose' },
          ] },
        { name: 'palette', label: 'Colours you like', type: 'chips', hint: 'Pick as many as you want',
          options: [
            { value: 'black', label: 'Black' }, { value: 'rose', label: 'Soft pink' },
            { value: 'plum',  label: 'Plum' },  { value: 'bone', label: 'Bone' },
            { value: 'gold',  label: 'Muted gold' }, { value: 'teal', label: 'Dark teal' },
            { value: 'lilac', label: 'Lilac' }, { value: 'rust', label: 'Rust' },
          ] },
        { name: 'avoid', label: 'What you definitely do not want', type: 'textarea', rows: 3,
          placeholder: 'Sometimes this matters more. No glitter, no red, not too scary.' },
      ],
    },
    contactStep([
      { name: 'budget', label: 'Budget', type: 'select', hint: 'A guide, not a promise',
        options: [
          { value: 'to200',  label: 'Up to $200' },
          { value: '200350', label: '$200–350' },
          { value: '350500', label: '$350–500' },
          { value: 'over500',label: 'Over $500' },
          { value: 'ask',    label: 'You tell me' },
        ] },
    ]),
    refsStep,
  ],
};

/* ---------------- ПОРТРЕТЫ ---------------- */
export const portraitForm = {
  kind: 'portrait',
  title: 'Order a portrait',
  steps: [
    {
      id: 'who',
      title: 'Who is in it',
      hint: 'Numbers first — they decide how long it takes.',
      fields: [
        { name: 'people', label: 'How many people', type: 'select', required: true,
          options: [
            { value: '1', label: 'One' }, { value: '2', label: 'Two' },
            { value: '3', label: 'Three' }, { value: '4+', label: 'Four or more' },
          ] },
        { name: 'pets', label: 'Any animals', type: 'select',
          options: [
            { value: '0', label: 'None' }, { value: '1', label: 'One' },
            { value: '2', label: 'Two' }, { value: '3+', label: 'Three or more' },
          ] },
        { name: 'idea', label: 'Anything I should know', type: 'textarea', rows: 4,
          placeholder: 'A mood, a setting, a joke only they would get.' },
      ],
    },
    contactStep(),
    {
      ...refsStep,
      hint: 'Reference photos, please — bad lighting is fine, I am after the face, not the shot.',
    },
  ],
};

export const FORMS = { doll: dollForm, portrait: portraitForm };

export function emptyValues(form) {
  const v = {};
  for (const step of form.steps) {
    for (const f of step.fields) {
      v[f.name] = f.type === 'chips' ? [] : f.type === 'files' ? [] : '';
    }
  }
  return v;
}

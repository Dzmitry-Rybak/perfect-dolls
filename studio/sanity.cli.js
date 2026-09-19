import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: { projectId: 'jfxrdzrs', dataset: 'production' },
  /* Адрес админки: https://cutesmokey.sanity.studio */
  studioHost: 'cutesmokey',
  /* Чтобы npx sanity deploy не спрашивал приложение каждый раз. */
  deployment: { appId: 'r7gmv0537rzaxmkaeqc762a0' },
});

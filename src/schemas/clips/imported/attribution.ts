const sources = {
  magicui: {
    name: 'Magic UI',
    repo: 'magicuidesign/magicui',
    // biome-ignore lint/security/noSecrets: public upstream Git commit, not a credential
    revision: 'efe76fc5755eca1142dd4f74c1d6f0ace2887e3c',
    root: 'apps/www/registry/magicui',
  },
  'motion-primitives': {
    name: 'Motion Primitives',
    repo: 'ibelick/motion-primitives',
    // biome-ignore lint/security/noSecrets: public upstream Git commit, not a credential
    revision: '120f64f6ca60348e251f929e9c81f11ccbe45eda',
    root: 'components/core',
  },
  '21st': {
    name: '21st.dev',
    repo: 'serafimcloud/21st',
    // biome-ignore lint/security/noSecrets: public upstream Git commit, not a credential
    revision: 'b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf',
    root: 'apps/web/components/ui',
  },
};
export const sourceAttribution = (source: keyof typeof sources | 'original', component: string) => {
  if (source === 'original') {
    return {
      name: 'Original cueframe',
      url: '',
      revision: 'original',
      license: 'MIT',
      component: '',
    };
  }
  const info = sources[source];
  const path = `${info.root}/${component}.tsx`;
  return {
    name: info.name,
    url: `https://github.com/${info.repo}/blob/${info.revision}/${path}`,
    revision: info.revision,
    license: 'MIT',
    component: path,
  };
};

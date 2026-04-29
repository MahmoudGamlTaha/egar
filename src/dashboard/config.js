export const SIDENAV = {
  tenant:  [{ sec:null, items:[{k:"home",ic:"home"},{k:"contracts",ic:"contracts",b:1},{k:"payments",ic:"payments"},{k:"maintenance",ic:"maintenance"}] }, { sec:"account", items:[{k:"settings",ic:"settings"}] }],
  landlord:[{ sec:null, items:[{k:"home",ic:"home"},{k:"contracts",ic:"contracts"},{k:"payments",ic:"payments",b:1},{k:"properties",ic:"properties"},{k:"reports",ic:"reports"}] }, { sec:"account", items:[{k:"settings",ic:"settings"}] }],
  company: [{ sec:null, items:[{k:"home",ic:"home"},{k:"contracts",ic:"contracts"},{k:"payments",ic:"payments"},{k:"properties",ic:"properties"},{k:"users",ic:"users"},{k:"reports",ic:"reports"}] }, { sec:"account", items:[{k:"settings",ic:"settings"}] }],
  admin:   [{ sec:null, items:[{k:"home",ic:"home"},{k:"users",ic:"users",b:3},{k:"contracts",ic:"contracts"},{k:"payments",ic:"payments"},{k:"properties",ic:"properties"},{k:"reports",ic:"reports"}] }, { sec:"account", items:[{k:"settings",ic:"settings"}] }],
};

export const AV_COLOR = { tenant:"#0891B2", landlord:"#1A4A6E", company:"#D97706", admin:"#DC2626" };

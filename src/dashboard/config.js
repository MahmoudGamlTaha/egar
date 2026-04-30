export const SIDENAV = {
  tenant: [
    { sec:"Menu", items:[
      { k:"home", ic:"home", path:"/dashboard/home" },
      { k:"contracts", ic:"contracts", b:2, path:"/dashboard/contracts" },
      { k:"payments", ic:"payments", path:"/dashboard/payments" },
      { k:"maintenance", ic:"maintenance", b:1, path:"/dashboard/maintenance" },
    ]},
    { sec:"Account", items:[
      { k:"profile", ic:"users", path:"/dashboard/profile" },
      { k:"settings", ic:"settings", path:"/dashboard/settings" },
    ]},
  ],
  landlord: [
    { sec:"Manage", items:[
      { k:"home", ic:"home", path:"/dashboard/home" },
      { k:"properties", ic:"building", path:"/dashboard/properties" },
      { k:"contracts", ic:"contracts", path:"/dashboard/contracts" },
      { k:"payments", ic:"payments", path:"/dashboard/payments" },
      { k:"tenants", ic:"users", path:"/dashboard/users" },
    ]},
    { sec:"Account", items:[
      { k:"profile", ic:"users", path:"/dashboard/profile" },
      { k:"reports", ic:"reports", path:"/dashboard/reports" },
      { k:"settings", ic:"settings", path:"/dashboard/settings" },
    ]},
  ],
  company: [
    { sec:"Manage", items:[
      { k:"home", ic:"home", path:"/dashboard/home" },
      { k:"properties", ic:"building", b:3, path:"/dashboard/properties" },
      { k:"contracts", ic:"contracts", path:"/dashboard/contracts" },
      { k:"payments", ic:"payments", path:"/dashboard/payments" },
      { k:"users", ic:"users", path:"/dashboard/users" },
    ]},
    { sec:"Account", items:[
      { k:"profile", ic:"users", path:"/dashboard/profile" },
      { k:"reports", ic:"reports", path:"/dashboard/reports" },
      { k:"settings", ic:"settings", path:"/dashboard/settings" },
    ]},
  ],
  admin: [
    { sec:"Admin", items:[
      { k:"home", ic:"home", path:"/dashboard/home" },
      { k:"users", ic:"users", path:"/dashboard/users" },
      { k:"contracts", ic:"contracts", path:"/dashboard/contracts" },
      { k:"payments", ic:"payments", path:"/dashboard/payments" },
      { k:"properties", ic:"building", path:"/dashboard/properties" },
      { k:"reports", ic:"reports", path:"/dashboard/reports" },
    ]},
    { sec:"Account", items:[
      { k:"profile", ic:"users", path:"/dashboard/profile" },
      { k:"settings", ic:"settings", path:"/dashboard/settings" },
    ]},
  ],
};

export const AV_COLOR = { tenant:"#0891B2", landlord:"#1A4A6E", company:"#D97706", admin:"#DC2626" };

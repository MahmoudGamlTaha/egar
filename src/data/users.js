export const USERS_DB = {
  "1234": { role:"tenant",   name:"مستأجر تجريبي",       phone:"01011111111", av:"مت" },
  "5678": { role:"landlord", name:"مؤجر تجريبي",          phone:"01022222222", av:"مؤ" },
  "9999": { role:"company",  name:"شركة النور للعقارات",  phone:"01033333333", av:"شن" },
  "0000": { role:"admin",    name:"مدير النظام",          phone:"01000000000", av:"أد" },
  "2901234567890":{ role:"tenant",   name:"أحمد محمد علي",      phone:"01012345678", av:"أح" },
  "2801234567890":{ role:"landlord", name:"سامي عبد الله",       phone:"01098765432", av:"سا" },
};

export const USERS = [
  {id:"USR-001",name:"أحمد محمد علي",phone:"01012345678",email:"ahmed@mail.com",role:"tenant",joined:"2024-08-15",contracts:2,status:"verified"},
  {id:"USR-002",name:"سامي عبد الله",phone:"01098765432",email:"sami@mail.com",role:"landlord",joined:"2024-01-10",contracts:3,status:"verified"},
  {id:"USR-003",name:"شركة النور للعقارات",phone:"0221234567",email:"info@alnoor.com",role:"company",joined:"2024-06-01",contracts:1,status:"verified"},
  {id:"USR-004",name:"محمد السيد",phone:"01056789012",email:"msayed@mail.com",role:"tenant",joined:"2025-01-15",contracts:1,status:"pending"},
];

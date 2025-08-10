// Pakistani Legal Knowledge Base for LexiBot

export const pakistaniLegalKnowledge = {
  constitutionalLaw: {
    fundamentalRights: [
      "Article 8: Laws inconsistent with fundamental rights void",
      "Article 9: Security of person", 
      "Article 10: Safeguards as to arrest and detention",
      "Article 14: Dignity of man",
      "Article 15: Freedom of movement",
      "Article 16: Freedom of assembly", 
      "Article 17: Freedom of association",
      "Article 18: Freedom of trade",
      "Article 19: Freedom of speech",
      "Article 20: Freedom to profess religion",
      "Article 23: Protection of property",
      "Article 24: Protection of property rights",
      "Article 25: Equality of citizens"
    ],
    principlesOfPolicy: [
      "Article 29: Promotion of local Government institutions",
      "Article 30: Participation of people in Armed Forces",
      "Article 31: Islamic way of life",
      "Article 35: Protection of family",
      "Article 37: Promotion of social justice",
      "Article 38: Promotion of social and economic well-being"
    ]
  },

  criminalLaw: {
    pakistanPenalCode: {
      offencesAgainstState: "Chapter VI: Sections 121-130",
      offencesAgainstPublicTransquility: "Chapter VIII: Sections 141-160", 
      offencesAgainstHumanBody: "Chapter XVI: Sections 299-377",
      offencesAgainstProperty: "Chapter XVII: Sections 378-462",
      murderAndCulpableHomicide: {
        murder: "Section 302: Punishment for murder - Death or life imprisonment",
        culpableHomicide: "Section 304: Punishment for culpable homicide - Life imprisonment or 10 years",
        qisas: "Section 306: Qisas for qatl-i-amd",
        diyat: "Section 323: Diyat for qatl-i-amd"
      },
      theft: {
        definition: "Section 378: Definition of theft",
        punishment: "Section 379: Punishment for theft - 3 years or fine or both"
      }
    },
    codeOfCriminalProcedure: {
      arrest: {
        withoutWarrant: "Section 54: Arrest without warrant",
        withWarrant: "Section 72: Arrest on warrant",
        rights: "Section 50A: Right to legal aid"
      },
      fir: {
        registration: "Section 154: Information relating to cognizable case",
        refusal: "Section 154: When police can refuse FIR",
        copy: "Section 154: Right to get FIR copy"
      },
      bail: {
        bailable: "Section 496: Bail in bailable cases", 
        nonBailable: "Section 497: Bail in non-bailable cases",
        anticipatory: "Section 498: Anticipatory bail"
      }
    }
  },

  civilLaw: {
    codeOfCivilProcedure: {
      jurisdiction: {
        territorial: "Section 16-20: Where suits to be instituted",
        pecuniary: "Different for different courts",
        subject: "Section 9: Courts to try all civil suits"
      },
      limitation: {
        suits: "Article 113: 3 years for other suits",
        contracts: "Article 65: 3 years from breach",
        torts: "Article 72: 3 years from when cause of action arose",
        property: "Article 65: 12 years for possession of immovable property"
      },
      decree: {
        execution: "Section 36: Execution of decree",
        timeLimit: "Article 136: 12 years from date of decree"
      }
    },
    contractAct: {
      formation: "Section 10: Agreements that are contracts",
      consideration: "Section 25: Agreement without consideration void",
      capacity: "Section 11: Who are competent to contract",
      voidContracts: "Section 19-24: Voidability of agreements",
      breach: "Section 73: Compensation for loss from breach",
      specificPerformance: "Specific Relief Act 1877: Sections 12-25"
    }
  },

  familyLaw: {
    muslimFamilyLaw: {
      marriage: {
        nikah: "Muslim Family Laws Ordinance 1961",
        registration: "Section 5: Registration compulsory",
        polygamy: "Section 6: Restrictions on polygamy"
      },
      divorce: {
        talaq: "Section 7: Talaq procedure",
        khula: "Dissolution of Muslim Marriages Act 1939",
        mubarat: "Mutual consent divorce"
      },
      inheritance: {
        shariat: "Muslim Personal Law (Shariat) Application Act 1962",
        succession: "Based on Quranic principles",
        will: "Maximum 1/3rd of property"
      },
      maintenance: {
        wife: "Section 125 CrPC: Maintenance of wife",
        children: "Section 125 CrPC: Maintenance of children",
        parents: "Section 125 CrPC: Maintenance of parents"
      }
    },
    childCustody: {
      guardianship: "Guardians and Wards Act 1890",
      hizanat: "Islamic law of child custody",
      welfare: "Best interest of child principle"
    }
  },

  propertyLaw: {
    registration: {
      compulsory: "Registration Act 1908: Section 17",
      stampDuty: "Stamp Act 1899: Various rates",
      transfer: "Transfer of Property Act 1882"
    },
    ownership: {
      title: "Chain of title documents",
      mutations: "Revenue records (Patwari)",
      survey: "Survey settlement"
    },
    rentLaws: {
      urban: "Provincial Rent Laws",
      tenancy: "Rights and obligations",
      eviction: "Grounds for eviction"
    }
  },

  businessLaw: {
    companiesAct2017: {
      incorporation: "Section 13: Incorporation of company",
      types: "Private, Public, Single Member Company",
      compliance: "Annual returns, financial statements"
    },
    taxation: {
      income: "Income Tax Ordinance 2001",
      sales: "Sales Tax Act 1990", 
      federal: "Federal Board of Revenue (FBR)",
      provincial: "Provincial revenue authorities"
    },
    laborLaw: {
      industrialRelations: "Industrial Relations Act 2012",
      factories: "Factories Act 1934",
      minimumWage: "Provincial minimum wage laws",
      workmenCompensation: "Workmen's Compensation Act 1923"
    }
  },

  courts: {
    hierarchy: [
      "Supreme Court of Pakistan (Islamabad)",
      "Federal Shariat Court",
      "High Courts (5 Provincial High Courts)",
      "District & Sessions Courts", 
      "Additional District Courts",
      "Civil Courts",
      "Magistrate Courts"
    ],
    jurisdiction: {
      supremeCourt: "Constitutional, appeals, original jurisdiction",
      highCourt: "Constitutional, criminal appeals, civil appeals",
      districtCourt: "Sessions division criminal cases",
      civilCourt: "Civil suits up to pecuniary jurisdiction"
    }
  },

  governmentDepartments: {
    federal: [
      "Ministry of Law and Justice",
      "Federal Board of Revenue (FBR)",
      "Securities and Exchange Commission (SECP)",
      "Competition Commission of Pakistan"
    ],
    provincial: [
      "Registrar Office (Documents)",
      "Tehsildar (Land Revenue)",
      "Deputy Commissioner",
      "Provincial Police"
    ],
    helplines: {
      legal: "Legal Aid: 051-111-112-113",
      police: "Police: 15",
      emergency: "Emergency: 1122"
    }
  },

  commonProcedures: {
    fir: {
      where: "Nearest Police Station",
      documents: "CNIC, witness details",
      time: "Immediately after incident",
      copy: "Free copy is your right"
    },
    civilSuit: {
      where: "Civil Court having jurisdiction",
      documents: "Plaint, court fee, supporting documents",
      limitation: "Usually 3 years from cause of action",
      process: "Summons → Written Statement → Issues → Evidence → Arguments → Judgment"
    },
    propertyTransfer: {
      documents: ["Sale deed", "Mutation", "Registry", "NOC", "Tax clearance"],
      departments: ["Registrar Office", "Tehsildar", "Town Planning"],
      taxes: ["Stamp duty", "Registration fee", "Capital gains tax"]
    }
  }
};

export const urduTranslations = {
  // Common legal terms in Urdu
  court: "عدالت",
  judge: "جج", 
  lawyer: "وکیل",
  case: "مقدمہ",
  law: "قانون",
  contract: "معاہدہ", 
  property: "جائیداد",
  marriage: "نکاح",
  divorce: "طلاق",
  inheritance: "وراثت",
  bail: "ضمانت",
  fir: "ایف آئی آر",
  police: "پولیس",
  arrest: "گرفتاری",
  rights: "حقوق",
  documents: "دستاویزات",
  procedure: "طریقہ کار",
  fee: "فیس",
  time: "وقت",
  deadline: "آخری تاریخ"
};

export function getRelevantLaw(category: string, query: string) {
  // This function can be enhanced with AI to match user queries 
  // with relevant Pakistani laws and return specific guidance
  
  const categoryMappings = {
    family: pakistaniLegalKnowledge.familyLaw,
    criminal: pakistaniLegalKnowledge.criminalLaw,
    civil: pakistaniLegalKnowledge.civilLaw,
    property: pakistaniLegalKnowledge.propertyLaw,
    business: pakistaniLegalKnowledge.businessLaw
  };
  
  return categoryMappings[category] || null;
}

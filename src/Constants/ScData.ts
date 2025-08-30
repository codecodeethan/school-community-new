export interface Student {
  name: string;
  grade?: string;
  role: string;
  image: string;
  contact: string;
  instagram: string;
}

export interface Department {
  id: string;
  name: string;
  members: Student[];
}

export const getLeadership = (departmentId: string): Student[] => {
  switch (departmentId) {
    case "public_relations":
      return [
        {
          name: "Aiko",
          role: "President",
          image: "/students/Aiko.webp",
          contact: "aiko.m@school.com",
          instagram: "@aiko_pr_2024",
        },
        {
          name: "Wawa",
          role: "Vice President",
          image: "/students/Wawa.webp",
          contact: "gem.wp@school.com",
          instagram: "@gem_creative",
        },
      ];
    case "hall_functions":
      return [
        {
          name: "Chanon",
          role: "President",
          image: "/students/Human1.webp",
          contact: "chanon.a@school.com",
          instagram: "@ace_events",
        },
        {
          name: "Canoe",
          role: "Vice President",
          image: "/students/Canoe.webp",
          contact: "grace.cn@school.com",
          instagram: "@grace_creates",
        },
      ];
    case "spirit":
      return [
        {
          name: "Gunn",
          role: "President",
          image: "/students/Human1.webp",
          contact: "gunn.l@school.com",
          instagram: "@gunn_spirit",
        },
        {
          name: "Mijung",
          role: "Vice President",
          image: "/students/Mijung.webp",
          contact: "mijung.et@school.com",
          instagram: "@mijung_spirit",
        },
      ];
    case "facility":
      return [
        {
          name: "Kaka",
          role: "President",
          image: "/students/Kaka.webp",
          contact: "kaka.fn@school.com",
          instagram: "@kaka_facilities",
        },
        {
          name: "Neui",
          role: "President",
          image: "/students/Human1.webp",
          contact: "kaka.fn@school.com",
          instagram: "@kaka_facilities",
        },
        {
          name: "Phoom",
          role: "Vice President",
          image: "/students/Phoom.webp",
          contact: "phoom.f@school.com",
          instagram: "@phoom_maintain",
        },
      ];
    default:
      return [];
  }
};

export const departments: Department[] = [
  {
    id: "public_relations",
    name: "Public Relations",
    members: [
      {
        name: "Maijene",
        grade: "Gr. 11",
        role: "Member",
        image: "/students/Maijene.webp",
        contact: "aiko.m@school.com",
        instagram: "@aiko_pr_2024",
      },
      {
        name: "Gem",
        grade: "Gr. 10",
        role: "Member",
        image: "/students/Gem.webp",
        contact: "gem.wp@school.com",
        instagram: "@gem_creative",
      },
      {
        name: "Priya",
        grade: "Gr. 10",
        role: "Member",
        image: "/students/Priya.webp",
        contact: "gem.wp@school.com",
        instagram: "@gem_creative",
      },
      {
        name: "US",
        grade: "Gr. 9",
        role: "Member",
        image: "/students/Us.webp",
        contact: "kira.pr@school.com",
        instagram: "@kira_designs",
      },
      {
        name: "Kira",
        grade: "Gr. 9",
        role: "Member",
        image: "/students/Kira.webp",
        contact: "kira.pr@school.com",
        instagram: "@kira_designs",
      },
    ],
  },
  {
    id: "hall_functions",
    name: "Hall Functions",
    members: [
      {
        name: "Ace",
        grade: "Gr. 12",
        role: "Member",
        image: "/students/Human1.webp",
        contact: "chanon.a@school.com",
        instagram: "@ace_events",
      },
      {
        name: "Ing",
        grade: "Gr. 11",
        role: "Member",
        image: "/students/Ing.webp",
        contact: "grace.cn@school.com",
        instagram: "@grace_creates",
      },
      {
        name: "Prin",
        grade: "Gr. 11",
        role: "Member",
        image: "/students/Prin.webp",
        contact: "ing.p@school.com",
        instagram: "@ing_events",
      },
      {
        name: "Grace",
        grade: "Gr. 10",
        role: "Member",
        image: "/students/Grace.webp",
        contact: "ing.p@school.com",
        instagram: "@ing_events",
      },
      {
        name: "Natacha",
        grade: "Gr. 10",
        role: "Member",
        image: "/students/Natacha.webp",
        contact: "ing.p@school.com",
        instagram: "@ing_events",
      },
      {
        name: "Minnie",
        grade: "Gr. 9",
        role: "Member",
        image: "/students/Human1.webp",
        contact: "minnie.ng@school.com",
        instagram: "@minnie_events",
      },
      {
        name: "Nippon",
        grade: "Gr. 9",
        role: "Member",
        image: "/students/Nippon.webp",
        contact: "minnie.ng@school.com",
        instagram: "@minnie_events",
      },
      {
        name: "Gago",
        grade: "Gr. 9",
        role: "Member",
        image: "/students/Gago.webp",
        contact: "minnie.ng@school.com",
        instagram: "@minnie_events",
      },
    ],
  },
  {
    id: "spirit",
    name: "Spirit",
    members: [
      {
        name: "Lisa",
        grade: "Gr. 12",
        role: "Member",
        image: "/students/Human1.webp",
        contact: "gunn.l@school.com",
        instagram: "@gunn_spirit",
      },
      {
        name: "Earth",
        grade: "Gr. 11",
        role: "Member",
        image: "/students/Earth.webp",
        contact: "mijung.et@school.com",
        instagram: "@mijung_spirit",
      },
      {
        name: "Titan",
        grade: "Gr. 11",
        role: "Member",
        image: "/students/Titan.webp",
        contact: "mijung.et@school.com",
        instagram: "@mijung_spirit",
      },
      {
        name: "Ethan",
        grade: "Gr. 10",
        role: "Member",
        image: "/students/Ethan.webp",
        contact: "ethan.pm@school.com",
        instagram: "@ethan_community",
      },
      {
        name: "Paproud",
        grade: "Gr. 10",
        role: "Member",
        image: "/students/Paproud.webp",
        contact: "ethan.pm@school.com",
        instagram: "@ethan_community",
      },
      {
        name: "Maprang",
        grade: "Gr. 10",
        role: "Member",
        image: "/students/Maprang.webp",
        contact: "ethan.pm@school.com",
        instagram: "@ethan_community",
      },
      {
        name: "Saan",
        grade: "Gr. 9",
        role: "Member",
        image: "/students/Saan.webp",
        contact: "saan.s@school.com",
        instagram: "@saan_positive",
      },
    ],
  },
  {
    id: "facility",
    name: "Facility",
    members: [
      {
        name: "Fang",
        grade: "Gr. 12",
        role: "Member",
        image: "/students/Human1.webp",
        contact: "kaka.fn@school.com",
        instagram: "@kaka_facilities",
      },
      {
        name: "Messi",
        grade: "Gr. 9",
        role: "Member",
        image: "/students/Messi.webp",
        contact: "messi.f@school.com",
        instagram: "@messi_facility",
      },
    ],
  },
];

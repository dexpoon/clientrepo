// ========================================== CATEGORY =======================================================//
export class Category {
    id: number;
    name:string;
};

export var TaskCategories : Category[] = [
  { id: 1, name: 'Task'},
  { id: 2, name: 'Aptm'},
  { id: 4, name: 'Bill'}
];

export var InfoCategories : Category[] = [
  { id: 3, name: 'Info'},
  { id: 4, name: 'HowTo'},
  { id: 5, name: 'Asset'}
];

// ============================================ PRIORITY =======================================================//
export class Priority {
    id: number;
    name:string;
};


export var TaskPriorities : Priority[] = [
    { id: 10, name: 'Low'     },
    { id: 30, name: 'High'    },
    { id: 40, name: 'Critical'},
    { id:540, name: 'NA'      }
];

export var InfoPriorities : Priority[] = [
  { id:540, name: 'NA'      }
];

// ============================================ STATUS =======================================================//
export class Status {
    id:number;
    name:string;
};

export var TaskStati: Status[] = [
    { id: 100, name: 'New'},
    { id: 200, name: 'Pending'},
    { id: 300, name: 'Completed'},
    { id: 400, name: 'OnHold'},
    { id: 500, name: 'NA'},

];

// ============================================ ROLES ============================================================//
export class Role {
    id:number;
    name:string;
};

export var UserRoles: Role[] = [
    { id: 2222, name: 'Administrateur'  },
    { id: 3333, name: 'Medecin'         },
    { id: 4444, name: 'Infirmière'      },
    { id: 5555, name: 'Réceptionniste'  },
    { id: 6666, name: 'Directeur'       },
    { id: 7777, name: 'Professeur'      },
];

// ============================================ ACTIVATION STATUS FOR USER ============================================================//
export class Activation {
    id: number;
    name:string;
};

export var UserActivations: Activation[] = [
    { id:11111, name: 'Activé' },
    { id:22222, name: 'Marqué' },
    { id:33333, name: 'Suspendu' },
    { id:44444, name: 'Désactivé' },
    { id:55555, name: 'Déficient' }
];

// ============================================ ROLES ============================================================//


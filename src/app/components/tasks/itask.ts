// Adding just a comment to test Git
export class ITask {
    id:             number;
    description:    string;
    address:        string;
    notes:          string;
    descSorter:     string;
    status:         string;
    statusSorter:   number;
    priority:       string;
    prioritySorter: number;
    ddate:          Date;       // due date
    category:       string;
    expanded:       boolean;
    credos:         string;
    docuName:       string;
    alerted:        boolean = false
}

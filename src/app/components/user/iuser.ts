import { Role } from '../common/containers';
import { IBusiness } from './ibusiness';

export class IUser {
    _id:                number; // populated by DB
    name:               string;  
    username:           string;
    password:           string;
    email:              string;
    role:               string;     // IRole.name 
    business:           string;     // IBusiness.name
    activationDate:     Date;
    deactivationDate:   Date;
    status:             string;
};
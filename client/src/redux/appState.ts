import { Vacation } from "../models/vacation";
import { User } from "../models/user";
import { FollowedVacation } from "../models/followedVacation";
import { Admin } from "../models/admin";

// class that containes all the data - app wise.
export class AppState {
    public vacations: Vacation[] = [];
    // public users: User[] = [];
    // !!!!!!!!!!!!!!!!111!!! public user: User = null;
    public user: User = null;
    public followedVacations: FollowedVacation[] = [];
    public admin: Admin[] = [];
}
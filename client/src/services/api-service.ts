import axios from "axios";

// Api service - communicating with the server
class ApiService{
    // Fetch - Get method
    private async preformeGet(url:string){
        const response = await fetch(url);
        return response.json();
    }

    // Fetch - Post method
    private async preformFetchPost(url:string, bodyData:any){
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: bodyData
        })
        return response.json();
    }

    // Axios - Post method
    private async preformAxiosPost(url:string, fd:FormData){
        return await axios.post(url, fd);
    }

    // Axios - Put method
    private async preformAxiosPut(url:string, fd:FormData){
        return await axios.put(url, fd);
    }

    // Is the admin logged in
    async isTheAdminLoggedIn(){
        return this.preformeGet("http://localhost:3001/api/admin/loggedIn");
    }

    // Is the user logged in
    async isTheUserLoggedIn(id:number){
        return this.preformeGet(`http://localhost:3001/api/users/loggedIn/${id}`);
    }

    // Get admin
    async getTheAdmin(){
        return this.preformeGet("http://localhost:3001/api/admin");
    }

    // Get user by id
    async getTheUser(id:number){
        return this.preformeGet(`http://localhost:3001/api/users/userDetails/${id}`);
    }

    // Get all vacations
    async getVacations(){
        return this.preformeGet("http://localhost:3001/api/vacations");
    }

    // Get vacation by id
    async getVacation(id:number){
        return this.preformeGet(`http://localhost:3001/api/vacations/${id}`);
    }

    // Get all Followed vacation by user id
    async getFollowedVacation(id:number){
        return this.preformeGet(`http://localhost:3001/api/followed/myVacations/${id}`);
    }

    // Login the user
    async loginUser(body:any){
        return this.preformFetchPost("http://localhost:3001/api/users/login", body);
    }

    // Log in the admin
    async loginAdmin(body:any){
        return this.preformFetchPost("http://localhost:3001/api/admin", body);
    }

    // Add a new user when registering 
    async addUser(body:any){
        return this.preformFetchPost("http://localhost:3001/api/users/register", body);
    }

    // Add a new vacation
    async addVacation(fd:FormData){
        return this.preformAxiosPost("http://localhost:3001/api/images/upload-image", fd)
    }

    // Update Vacation
    async updateVacation(fd:FormData){
        return this.preformAxiosPut("http://localhost:3001/api/images/update-image", fd)
    }
}

export default new ApiService();
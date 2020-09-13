import axios from "axios";

class ApiService{
    private async preformeGet(url:string){
        const response = await fetch(url);
        return response.json();
    }

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

    // private async preformFetchPatch(url:string, bodyData:any){
    //     const response = await fetch(url, {
    //         method: "PATCH",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json",
    //         },
    //         body: bodyData
    //     })
    //     return response.json();
    // }

    private async preformAxiosPost(url:string, fd:FormData){
        return await axios.post(url, fd);
    }

    private async preformAxiosPut(url:string, fd:FormData){
        return await axios.put(url, fd);
    }

    async isTheAdminLoggedIn(){
        return this.preformeGet("http://localhost:3001/api/admin/loggedIn");
    }

    async isTheUserLoggedIn(id:number){
        return this.preformeGet(`http://localhost:3001/api/users/loggedIn/${id}`);
    }

    async getTheAdmin(){
        return this.preformeGet("http://localhost:3001/api/admin");
    }

    async getTheUser(id:number){
        return this.preformeGet(`http://localhost:3001/api/users/userDetails/${id}`);
    }

    async getVacations(){
        return this.preformeGet("http://localhost:3001/api/vacations");
    }

    async getVacation(id:number){
        return this.preformeGet(`http://localhost:3001/api/vacations/${id}`);
    }

    async getFollowedVacation(id:number){
        return this.preformeGet(`http://localhost:3001/api/followed/myVacations/${id}`);
    }

    async loginUser(body:any){
        return this.preformFetchPost("http://localhost:3001/api/users/login", body);
    }

    // async logoutUser(body:any){
    //     console.log("logout user body: ", body);
    //     return this.preformFetchPatch(`http://localhost:3001/api/users/logout`, body);
    // }

    async loginAdmin(body:any){
        return this.preformFetchPost("http://localhost:3001/api/admin", body);
    }

    // async logoutAdmin(body:any){
    //     return this.preformFetchPatch("http://localhost:3001/api/admin/logout", body);
    // }

    async addUser(body:any){
        return this.preformFetchPost("http://localhost:3001/api/users/register", body);
    }

    async addVacation(fd:FormData){
        return this.preformAxiosPost("http://localhost:3001/upload-image", fd)
    }

    async updateVacation(fd:FormData){
        return this.preformAxiosPut("http://localhost:3001/update-image", fd)
    }
}

export default new ApiService();
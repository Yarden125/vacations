class DateService{
    // Customized a given date's format
    public formatDate(date:string):string{
        let today = new Date(date);
        let day = ("0" + today.getDate()).slice(-2);
        let month =  ("0" + (today.getMonth() + 1)).slice(-2);
        let year = today.getFullYear();
        return day + "/" + month + "/" + year;
    }

    // Get the current date 
    public getTheDate():string{
        let today = new Date();
        let day = ("0" + today.getDate()).slice(-2);
        let month =  ("0" + (today.getMonth() + 1)).slice(-2);
        let year = today.getFullYear();
        return year + "-" + month + "-" + day;
    }
}

export default new DateService();
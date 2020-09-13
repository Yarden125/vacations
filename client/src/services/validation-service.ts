class ValidationService{

    // validate the input
    public validateInput(input: any, text:string):string{
        let errorMessage = "";
        if (input === "") {
            errorMessage = `Missing ${text}`;
        }
        return errorMessage;
    }

    // validate the price
    public validatePrice(price: number):string{
        let errorMessage = "";
        if (price === null) {
            errorMessage = "Missing price";
        }
        if (price <= 0) {
            errorMessage = "Price must be more than zero";
        }
        return errorMessage;
    }

    public validateText(name:string, text: string):string{
        let errorMessage = "";
        if (name === "") {
            errorMessage = `Missing ${text}`;
        }
        if (name.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        return errorMessage;
    }
}

export default new ValidationService()
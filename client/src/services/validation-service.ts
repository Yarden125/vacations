// Validation Service
class ValidationService{

    // Validate an input
    public validateInput(input: any, text:string):string{
        let errorMessage = "";
        if (input === "") {
            errorMessage = `Missing ${text}`;
        }
        return errorMessage;
    }

    // Validate the price
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

    // Validate text and apostrophe
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

    // Validate input for registration
    public validateRegistration(input:string, text: string, lengthNum: number):string{
        let errorMessage = "";
        if (input === "") {
            errorMessage = `Missing ${text}`;
        }
        else if(input.length < lengthNum) {
            let upperCase = text.charAt(0).toUpperCase()+text.slice(1);
            console.log("upperCase: ",upperCase);
            errorMessage = `${upperCase} must be at least ${lengthNum} digits`
        }
        if (input.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        return errorMessage;
    }
}

export default new ValidationService()
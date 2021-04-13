import { EMAIL_REGEXP } from "../constants/common";

export class Credentials {
    static parseEmail(email: string): string {
        if (!email.trim()) {
            throw new Error('Please enter an email');
        }

        if (!EMAIL_REGEXP.test(email)) {
            throw new Error('Invalid email');
        }

        return email;
    }

    static parsePassword(password: string): string {
        if (!password) {
            throw new Error('Please enter a password');
        }

        if (password.length < 4) {
            throw new Error('Password must be at least 4 characters long');
        }

        return password;
    }

    static from(email: string, password: string): Credentials {
        const validEmail = Credentials.parseEmail(email);
        const validPassword = Credentials.parsePassword(password);

        return new Credentials(validEmail, validPassword);
    }

    private readonly _type = Symbol("Credentials");

    protected constructor(
        public readonly email: string,
        public readonly password: string
    ) {
    }
}

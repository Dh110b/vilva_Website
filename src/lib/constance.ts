function assertEnvVariable(varname: string): string {
    if (!process.env[varname]) {
        throw new Error(`Missing environment variable: ${varname}`);
    }

    return process.env[varname];
}
export const NEXT_PUBLIC_ADMIN_EXAMPLE = assertEnvVariable("NEXT_PUBLIC_ADMIN_EXAMPLE");

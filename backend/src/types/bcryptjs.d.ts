declare module 'bcryptjs' {
  function hash(data: string, saltOrRounds: number | string): Promise<string>;
  function hashSync(data: string, saltOrRounds: number | string): string;
  function compare(data: string, encrypted: string): Promise<boolean>;
  function compareSync(data: string, encrypted: string): boolean;
  function genSalt(rounds?: number): Promise<string>;
  function genSaltSync(rounds?: number): string;

  namespace bcrypt {
    export function hash(data: string, saltOrRounds: number | string): Promise<string>;
    export function hashSync(data: string, saltOrRounds: number | string): string;
    export function compare(data: string, encrypted: string): Promise<boolean>;
    export function compareSync(data: string, encrypted: string): boolean;
    export function genSalt(rounds?: number): Promise<string>;
    export function genSaltSync(rounds?: number): string;
  }

  export = bcrypt;
}

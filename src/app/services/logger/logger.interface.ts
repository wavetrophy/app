export interface LoggerInterface {
  clear(): void;

  debug(message?: any, ...optionalParams: any[]): void;

  error(message?: any, ...optionalParams: any[]): void;

  exception(message?: string, ...optionalParams: any[]): void;

  info(message?: any, ...optionalParams: any[]): void;

  log(message?: any, ...optionalParams: any[]): void;

  table(...tabularData: any[]): void;

  warn(message?: any, ...optionalParams: any[]): void;
}
